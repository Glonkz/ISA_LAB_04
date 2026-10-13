// Creating constant for modules.
const fs = require('fs');
const path = require('path');

class FileManager {
    constructor(baseDir) {
        this.baseDir = baseDir;
    }

    appendToFile(filename, text, callback) {
        const filePath = path.join(this.baseDir, filename);
        // Appends text on a new line; creates the file if it does not exist
        fs.appendFile(filePath, `${text}\n`, 'utf8', (err) => {
            callback(err);
        });
    }

    readFile(filename, callback) {
        const filePath = path.join(this.baseDir, filename);
        fs.readFile(filePath, 'utf8', (err, data) => {
            callback(err, data);
        });
    }
}

module.exports = FileManager;