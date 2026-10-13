const http = require('http');
const url = require('url');
const path = require('path');
const DateUtils = require('./modules/utils');
const FileManager = require('./modules/fileManager');
const messages = require('./lang/en/en.json');

class ApiServer {
    constructor(port) {
        this.port = port || process.env.PORT || 8080;
        this.dateUtils = new DateUtils();
        this.fileManager = new FileManager(__dirname);
    }

    handleRequest(req, res) {
        const parsedUrl = url.parse(req.url, true);
        const pathname = parsedUrl.pathname;

        // Allow CORS if accessed from remote clients
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Route: Part B - /COMP4537/labs/3/getDate/
        if (pathname.startsWith('/COMP4537/labs/3/getDate')) {
            this.handleGetDate(parsedUrl.query, res);
        }
        // Route: Part C.1 - /COMP4537/labs/3/writeFile/
        else if (pathname.startsWith('/COMP4537/labs/3/writeFile')) {
            this.handleWriteFile(parsedUrl.query, res);
        }
        // Route: Part C.2 - /COMP4537/labs/3/readFile/<filename>
        else if (pathname.startsWith('/COMP4537/labs/3/readFile/')) {
            this.handleReadFile(pathname, res);
        }
        else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Route Not Found');
        }
    }

    handleGetDate(query, res) {
        const name = query.name || 'Student';
        const currentDate = this.dateUtils.getDate();

        const message = messages.greetingTemplate
            .replace('%1', name)
            .replace('%2', currentDate);

        // Server-side blue inline style
        const responseHtml = `<p style="color: blue;">${message}</p>`;

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(responseHtml);
    }

    handleWriteFile(query, res) {
        const text = query.text;

        if (!text) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end(messages.writeMissingText);
            return;
        }

        this.fileManager.appendToFile('file.txt', text, (err) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 Internal Server Error: Failed to write to file.');
                return;
            }

            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(`${messages.writeSuccess} Line appended: "${text}"`);
        });
    }

    handleReadFile(pathname, res) {
        // Extract the filename from the path segment after /readFile/
        const filename = pathname.replace('/COMP4537/labs/3/readFile/', '').trim();

        if (!filename) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('400 Bad Request: Missing filename.');
            return;
        }

        this.fileManager.readFile(filename, (err, data) => {
            if (err) {
                // Must return 404 with the exact requested filename in the message
                const notFoundMessage = messages.fileNotFound.replace('%1', filename);
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(`<p style="color: red;">${notFoundMessage}</p>`);
                return;
            }

            // Displays text directly in the browser page
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(data);
        });
    }

    start() {
        const server = http.createServer((req, res) => this.handleRequest(req, res));
        server.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
}

// Starter instantiation
const server = new ApiServer();
server.start();