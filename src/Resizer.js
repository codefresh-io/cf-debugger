const { Transform } = require('stream');

class Resizer extends Transform {
    constructor (shell) {
        super();
        this.shell = shell;
    }

    _transform(data, encoding, callback) {
        const match = data.toString().match(/^\u001b\[8;(\d*);(\d*)t(.*)/);
        if (match) {
            this.shell.resize(+match[1], +match[2]);
            match[3] && this.push(match[3]);
        } else {
            this.push(data);
        }
        callback();
    }
}

module.exports = Resizer;
