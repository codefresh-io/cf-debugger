const { Transform } = require('stream');

class Resizer extends Transform {
    constructor (onResize) {
        super();
        this.onResize = onResize || function () {};
    }

    _transform(data, encoding, callback) {
        const match = data.toString().match(/^(\u0007*)(\\u001b|\u001b)\[8;(\d*);(\d*)t(.*)/i);
        if (match) {
            this.onResize(+match[3], +match[4]);
            match[5] && this.push(match[5]);
        } else {
            this.push(data);
        }
        callback();
    }
}

module.exports = Resizer;
