var util = require('util');
var stream = require('stream');
var crypto = require('crypto');

var Transform = stream.Transform || require('readable-stream').Transform;

util.inherits(Out, Transform);


// main constructor

function Out(opts) {

    Transform.call(this);

    opts = opts || {};

    this.header = opts.header || null;
    this.footer = opts.footer || null;

    var hash = crypto.createHash('sha1', opts.delimeter || 'jambalaya');
    hash.setEncoding('hex');
    hash.end();

    this.delimiter = hash.read();
    this.first = true;
}


// prototype methods

Out.prototype.setHeader = function(header) {
    this.header = header;
};

Out.prototype.setFooter = function(footer) {
    this.footer = footer;
};


// transform stream methods

Out.prototype._transform = function(chunk, enc, cb) {
    if (this.first === true) {
        if (this.header !== null && this.header !== undefined) {
            this.push(this.delimiter + JSON.stringify(['header', this.header]) + this.delimiter);
        }
        this.first = false;
    }
    this.push(chunk);
    cb();
};

Out.prototype._flush = function(cb) {
    if (this.footer !== null && this.footer !== undefined) {
        this.push(this.delimiter + JSON.stringify(['footer', this.footer]) + this.delimiter);
    }
    cb();
};


module.exports = exports = Out;
