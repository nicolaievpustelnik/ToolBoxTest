const File = require('../models/File');
const axios = require('axios');
const csvParser = require('csv-parser');

const fileControllers = {};

// Get and Process files list
fileControllers.getFilesList = async (req, res) => {
    try {
        const response = await axios.get(`${process.env.EXTERNAL_PATH}/files`, {
            headers: {
                'Authorization': `Bearer ${process.env.AUTH}`,
            },
        });

        if (req && res) {
            res.status(200).json({ status: 200, data: response.data });
        } else {
            return response.data;
        }

    } catch (error) {

        if (req && res) {
            res.status(500).json({ status: 500, error: 'Error getting list of files' });
        } else {
            return {
                code: 'GET_FILES_ERROR',
                message: 'Error getting list of files',
                details: error.message,
                status: 500
            };
        }
    }
};


// Download Files
fileControllers.downloadByFileName = async (fileName) => {
    try {
        const result = {
            file: fileName,
            lines: []
        };

        const response = await axios.get(`${process.env.EXTERNAL_PATH}/file/${fileName}`, {
            responseType: 'stream',
            headers: {
                'Authorization': `Bearer ${process.env.AUTH}`,
            },
        });

        await new Promise((resolve) => {
            response.data.pipe(csvParser())
                .on('data', (row) => {
                    try {
                        const fileInstance = new File(row.file, row.text, row.number, row.hex);

                        result.lines.push({
                            text: fileInstance.text,
                            number: fileInstance.number,
                            hex: fileInstance.hex
                        });
                    } catch (error) {
                        console.log('Invalid row:', row);
                    }
                })
                .on('end', () => {
                    console.log('CSV file processing completed.');
                    resolve();
                });
        });

        return result;

    } catch (error) {

        if (axios.isAxiosError(error) && error.response) {

            const errorResponse = error.response.data;

            if (error.response.status === 500 && errorResponse.code === 'API-500') {

                return {
                    code: 'API-500',
                    message: 'File error',
                    details: 'FILE_ERROR',
                    status: 500
                };

            } else if (error.response.status === 404 && errorResponse.code === 'SYS-ERR') {

                return {
                    code: 'SYS-ERR',
                    message: 'Not Found',
                    details: null,
                    status: 404
                };

            } else {
                console.error(`Unhandled error: ${error.message}`);
                return null;
            }

        } else {
            console.error(`Error downloading ${fileName} file:`, error);
            return null;
        }
    }
};

fileControllers.processFiles = async (req, res, handleError) => {
    try {
        const { fileName } = req.query;
        let results;

        if (fileName) {

            const result = await fileControllers.downloadByFileName(fileName);
            results = result ? [result] : [];

        } else {
            const response = await fileControllers.getFilesList();
            const filesList = response.files;

            const downloadPromises = filesList.map(async (file) => {
                return await fileControllers.downloadByFileName(file);
            });

            results = await Promise.all(downloadPromises);
            results = results.filter(result => result !== null);
        }

        res.status(200).json({ status: 200, results });

    } catch (error) {
        handleError('Error processing files:', error);
        res.status(500).json({ status: 500, error: 'Internal Server Error' });
    }
};


module.exports = fileControllers;