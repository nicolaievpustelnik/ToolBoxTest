const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const axios = require('axios');
const fileControllers = require('../src/controllers/file.controller');

chai.use(chaiHttp);
const expect = chai.expect;

describe('File Controllers', () => {
    describe('getFilesList', () => {
        it('should return files list when called without req and res', async () => {

            const axiosStub = sinon.stub(axios, 'get').resolves({ data: [{ file: 'test.txt' }] });
            const result = await fileControllers.getFilesList();

            expect(result).to.deep.equal([{ file: 'test.txt' }]);
            expect(axiosStub.calledOnce).to.be.true;

            axiosStub.restore();
        });

        it('should return response when called with req and res', async () => {

            const req = {};
            const res = { status: sinon.stub(), json: sinon.stub() };
            const axiosStub = sinon.stub(axios, 'get').resolves({ data: [{ file: 'test.txt' }] });
            res.status.returns(res);

            await fileControllers.getFilesList(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({ status: 200, data: [{ file: 'test.txt' }] })).to.be.true;
            expect(axiosStub.calledOnce).to.be.true;

            axiosStub.restore();
        });

        it('should return error when Axios fails', async () => {

            const req = {};
            const res = { status: sinon.stub(), json: sinon.stub() };
            const axiosStub = sinon.stub(axios, 'get').rejects(new Error('Axios error'));
            res.status.returns(res);

            await fileControllers.getFilesList(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ status: 500, error: 'Error getting list of files' })).to.be.true;
            expect(axiosStub.calledOnce).to.be.true;

            axiosStub.restore();
        });
    });

    describe('downloadByFileName', () => {

        it('should handle API-500 error', async () => {

            const axiosStub = sinon.stub(axios, 'get').rejects({
                isAxiosError: true,
                response: { status: 500, data: { code: 'API-500' } },
            });
            const result = await fileControllers.downloadByFileName('test.txt');

            expect(result).to.deep.equal({
                code: 'API-500',
                message: 'File error',
                details: 'FILE_ERROR',
                status: 500,
            });
            expect(axiosStub.calledOnce).to.be.true;

            axiosStub.restore();
        });

        it('should handle SYS-ERR error', async () => {

            const axiosStub = sinon.stub(axios, 'get').rejects({
                isAxiosError: true,
                response: { status: 404, data: { code: 'SYS-ERR' } },
            });
            const result = await fileControllers.downloadByFileName('test.txt');

            expect(result).to.deep.equal({
                code: 'SYS-ERR',
                message: 'Not Found',
                details: null,
                status: 404,
            });
            expect(axiosStub.calledOnce).to.be.true;

            axiosStub.restore();
        });
    });

    describe('processFiles', () => {
        it('should process files without fileName', async () => {

            const req = { query: {} };
            const res = { status: sinon.stub(), json: sinon.stub() };
            const getFilesListStub = sinon.stub(fileControllers, 'getFilesList').resolves({ files: ['test.txt'] });
            const downloadByFileNameStub = sinon.stub(fileControllers, 'downloadByFileName').resolves({ file: 'test.txt', lines: [] });
            res.status.returns(res);

            await fileControllers.processFiles(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({ status: 200, results: [{ file: 'test.txt', lines: [] }] })).to.be.true;
            expect(getFilesListStub.calledOnce).to.be.true;
            expect(downloadByFileNameStub.calledOnce).to.be.true;

            getFilesListStub.restore();
            downloadByFileNameStub.restore();
        });

        it('should process files with fileName', async () => {

            const req = { query: { fileName: 'test.txt' } };
            const res = { status: sinon.stub(), json: sinon.stub() };
            const downloadByFileNameStub = sinon.stub(fileControllers, 'downloadByFileName').resolves({ file: 'test.txt', lines: [] });
            res.status.returns(res);

            await fileControllers.processFiles(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({ status: 200, results: [{ file: 'test.txt', lines: [] }] })).to.be.true;
            expect(downloadByFileNameStub.calledOnce).to.be.true;

            downloadByFileNameStub.restore();
        });

        it('should handle error while processing files', async () => {

            const req = { query: {} };
            const res = { status: sinon.stub(), json: sinon.stub() };
            const handleError = sinon.stub();
            const getFilesListStub = sinon.stub(fileControllers, 'getFilesList').rejects(new Error('Error getting list of files'));
            res.status.returns(res);

            try {
                await fileControllers.processFiles(req, res, handleError);

                expect(res.status.calledWith(500)).to.be.true;
                expect(res.json.calledWith({ status: 500, error: 'Internal Server Error' })).to.be.true;
                expect(getFilesListStub.calledOnce).to.be.true;
            } finally {
                getFilesListStub.restore();
            }
        });
    });
});