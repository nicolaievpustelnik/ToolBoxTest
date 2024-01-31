const { Router } = require('express');
const router = Router();

const {
    processFiles,
    getFilesList
} = require('../controllers/file.controller');

/**
 * @swagger
 * components:
 *   schemas:
 *     File:
 *       type: object
 *       required:
 *         - file
 *         - lines
 *       properties:
 *         file:
 *           type: string
 *           description: Name of the file.
 *         lines:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Line'
 *     Line:
 *       type: object
 *       required:
 *         - text
 *         - number
 *         - hexa
 *       properties:
 *         text:
 *           type: string
 *           description: Textual content of the line.
 *         number:
 *           type: number
 *           description: Numerical value extracted from the line.
 *         hexa:
 *           type: string
 *           description: Hexadecimal representation of data in the line.
 *       example:
 *         file: "test3.csv"
 *         lines:
 *           - text: "This is some sample text."
 *             number: 42
 *             hexa: "0xDEADBEEF"
 */

/**
 * @openapi
 * /files/data:
 *   get:
 *     tags:
 *       - Files
 *     description: Retrieves data from multiple files or a specific file by name.
 *     parameters:
 *       - in: query
 *         name: fileName
 *         schema:
 *           type: string
 *         description: Name of the file to retrieve data for (optional)
 *     responses:
 *       200:
 *         description: File data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/File'
 */
router.get('/files/data', processFiles);

/**
 * @openapi
 * /files/list:
 *   get:
 *     tags:
 *       - Files
 *     description: Lists available files.
 *     responses:
 *       200:
 *         description: List of file names
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 files:
 *                   type: array
 *                   items:
 *                     type: string
 */
router.get('/files/list', getFilesList);

module.exports = router;
