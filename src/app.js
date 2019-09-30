const pty = require('cf-pty');
const Resizer = require('./Resizer.js');

const shell = pty.spawn('/bin/bash', [], {
    name: 'xterm',
    cwd: process.env.PWD,
    env: process.env
});

shell.on('exit', (code) => {
    process.exit(code);
});

const resizerStream = new Resizer(shell.resize.bind(shell));
process.stdin
    .pipe(resizerStream)
    .pipe(shell)
    .pipe(process.stdout);
