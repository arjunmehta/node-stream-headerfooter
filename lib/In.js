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

    this.buffer = new Buffer('');
    this.delimiter = new Buffer(hash.read());
    this.tag_open = false;
}


// transform stream method

In.prototype._transform = function(chunk, enc, cb) {

    this.buffer = Buffer.concat([this.buffer, chunk]);
    parseStreamTags(this, cb);
};

function parseStreamTags(stream, cb) {

    var delimiter = stream.delimiter,
        idx = buffertools.indexOf(stream.buffer, delimiter);

    if (idx !== -1) {
        handleTag(stream, delimiter, idx, cb);
    } else {
        testPartial(stream, delimiter, cb);
    }
}

function handleTag(stream, delimiter, idx, cb) {

    if (stream.tag_open === false) {

        stream.tag_open = true;
        stream.push(stream.buffer.slice(0, idx));
        stream.buffer = stream.buffer.slice(idx + delimiter.length);

        parseStreamTags(stream, cb);

    } else {

        var tag;

        try {
            tag = JSON.parse(stream.buffer.slice(0, idx).toString());
        } catch (e) {
            stream.emit('error', new Error(e));
        }

        stream.emit(tag[0], tag[1]);
        stream.tag_open = false;
        stream.buffer = stream.buffer.slice(idx + delimiter.length);

        parseStreamTags(stream, cb);
    }
}

function testPartial(stream, delimiter, cb) {

    var i, j, possible = false;

    for (i = stream.buffer.length - delimiter.length; i < stream.buffer.length; i++) {
        for (j = 0; j < delimiter.length; j++) {
            if (stream.buffer[i + j] !== delimiter[j]) break;
            else if (i + j >= stream.buffer.length - 1) {
                possible = true;
                break;
            }
        }
        if (possible === true) {
            break;
        }
    }

    if (possible === true) {
        if (stream.tag_open === false) {
            stream.push(stream.buffer.slice(0, i));
            stream.buffer = stream.buffer.slice(i);
        }
    } else {
        if (stream.tag_open === false) {
            stream.push(stream.buffer);
            stream.buffer = new Buffer('');
        }
    }

    cb();
}


In.prototype._flush = function(cb) {
    this.push(this.buffer);
    cb();
};


module.exports = exports = In;
