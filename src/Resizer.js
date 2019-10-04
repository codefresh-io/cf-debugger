const { Transform } = require('stream');
const fs = require('fs');

class Resizer extends Transform {
    constructor (onResize) {
        super();
        this.onResize = onResize || function () {};
    }

    _transform(data, encoding, callback) {
        // cut off pings
        let str = data.toString().replace(/\u0007*/g, '');
        // convert char code to character
        str = str.replace(/\\u([0-9A-F]{4})/igm, (...match) => {
            return String.fromCharCode(+`0x${match[1]}`);
        });

        // All entries of Esc[8;{cols};{rows}t should be cut. Resize pty basing on the last entry
        let matches = str.match(/\u001b\[8;(\d*);(\d*)t/igm);
        if (matches && matches.length) {
            let lastMatch = matches[matches.length-1];
            const sizes = lastMatch.match(/\u001b\[8;(\d*);(\d*)t/i);
            this.onResize(+sizes[1], +sizes[2]);
            const clean = str.replace(/\u001b\[8;(\d*);(\d*)t/igm, '');
            this.push(clean);
        } else {
            this.push(str);
        }

        callback();
    }
}

module.exports = Resizer;
