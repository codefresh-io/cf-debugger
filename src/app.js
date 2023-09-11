const pty = require('node-pty');
const Resizer = require('./Resizer.js');

let exit = false;

const shell = pty.spawn('/bin/bash', [], {
    name: 'xterm-color',
    cwd: process.env.PWD,
    env: process.env
});

process.on('uncaughtException', (err) => {
    if (exit) {
        process.exit(0)
    }
    console.error(err.message);
    console.error(err.stack);
});

const resizerStream = new Resizer(shell.resize.bind(shell));

shell.on('close', () => {
    exit = true
})

process.stdin
    .pipe(resizerStream)
    .pipe(shell)
    .pipe(process.stdout);
