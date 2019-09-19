const pty = require('cf-pty');

const shell = pty.spawn('/bin/bash', [], {
    name: 'xterm',
    cwd: process.env.PWD,
    env: process.env
});

shell.on('close', () => process.exit());
shell.pipe(process.stdout);
process.stdin.pipe(shell);
