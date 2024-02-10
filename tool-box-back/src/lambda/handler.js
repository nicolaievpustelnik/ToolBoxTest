'use strict';

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

module.exports.saveData = async (event) => {

  const body = JSON.parse(event["body"]);
  const extractedData = [];

  for (const file of body.results) {
    const fileName = file.file;
    let csvData = '';

    for (const line of file.lines) {
      csvData += `${line.text},${line.number},${line.hex}\n`;
    }

    if (file.lines.length > 0) {

      csvData = 'text,number,hex\n' + csvData;

      try {

        await s3.putObject({
          Bucket: 'tool-box-test',
          Key: fileName,
          Body: csvData
        }).promise();

        extractedData.push({
          file: file.file
        });

      } catch (error) {
        console.error(error.stack);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: `Error uploading file ${fileName}` })
        };
      }
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "The files were saved successfully",
      input: extractedData
    },
      null,
      2)
  };
};
