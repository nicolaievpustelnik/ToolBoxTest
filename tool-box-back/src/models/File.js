class File {
    constructor(file, text, number, hex) {

        if (!file || !text || !number || !hex) {
            throw new Error('File must have all attributes (file, text, number, hex)');
        }

        if (typeof file !== 'string' || typeof text !== 'string' || typeof number !== 'string' || typeof hex !== 'string') {
            throw new Error('Invalid attribute types for creating a File instance.');
        }

        if (isNaN(number)) {
            throw new Error('Invalid number attribute for creating a File instance.');
        }

        if (hex.length !== 32 || !/^[0-9a-fA-F]+$/.test(hex)) {
            throw new Error('Invalid hex attribute for creating a File instance.');
        }

        this.file = file;
        this.text = text;
        this.number = number;
        this.hex = hex;
    }

    getFileName() {
        return `${this.file}`;
    }
}

module.exports = File;