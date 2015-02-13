var util = require('util');
var stream = require('stream');
var crypto = require('crypto');
var Transform = stream.Transform || require('readable-stream').Transform;
var buffertools = require('buffertools');

util.inherits(In, Transform);


// main constructor

function In(stream, opts) {

    Transform.call(this);

    stream = stream || {};
    if (opts === undefined && typeof stream === 'object') {
        opts = stream;
        stream = undefined;
    }

    var hash = crypto.createHash('sha1', opts.delimiter || 'jambalaya');
    hash.setEncoding('hex');
    hash.end();

    this.delimiter = new Buffer(hash.read());
    this.first = true;
}


// transform stream methods

In.prototype._transform = function(chunk, enc, cb) {

    if (buffertools.indexOf(chunk, this.delimiter) !== -1) {
        var parsed;
        var idx = buffertools.indexOf(chunk, this.delimiter);

        if (this.first === true) {

            try {
                this.header = JSON.parse(chunk.slice(0, idx).toString());
            } catch (e) {}

            if (this.header) {
                this.emit('header', this.header);
            }

            this.first = false;
            chunk = chunk.slice(idx + this.delimiter.length);

        } else {
            try {
                this.footer = JSON.parse(chunk.slice(idx + this.delimiter.length).toString());
            } catch (e) {}
            
            chunk = chunk.slice(0, idx);
        }
    }

    this.push(chunk);
    cb();
};

In.prototype._flush = function(cb) {
    if (this.footer) {
        this.emit('footer', this.footer);
    }
    cb();
};


module.exports = exports = In;
