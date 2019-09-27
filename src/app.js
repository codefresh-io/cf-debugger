const pty = require('cf-pty');
const http = require('http');
const Resizer = require('./Resizer.js');

const shell = pty.spawn('/bin/bash', [], {
    name: 'xterm',
    cwd: process.env.PWD,
    env: process.env
});

shell.on('exit', (code) => {
    process.exit(code);
});

const resizerStream = new Resizer(shell);
process.stdin.pipe(resizerStream).pipe(shell);
shell.pipe(process.stdout);

http.createServer(function (req, res) {
    const request = req.url.match(/^\/resize\/(\d*)\/(\d*)$/);
    if (request) {
        shell.resize(+request[1], +request[2]);
        res.end(`OK - ${request[1]}:${request[2]}`);
    }
}).listen(80);
