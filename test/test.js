var stream = require('stream');
var PassThrough = stream.PassThrough || require('readable-stream').PassThrough;

var headerfooter = require('../main');

exports['Exported Properly'] = function(test) {
    test.expect(3);

    test.equal(typeof headerfooter, 'object');
    test.equal(typeof headerfooter.In, 'function');
    test.equal(typeof headerfooter.Out, 'function');

    test.done();
};

exports['New Out'] = function(test) {
    test.expect(2);

    var add_headerfooter = new headerfooter.Out();
    add_headerfooter.header = {
        name: "streamA",
        metadata: [23, 33, 221, 222]
    };
    add_headerfooter.footer = {
        exit_code: 2
    };

    test.equal(typeof add_headerfooter.header, 'object');
    test.equal(typeof add_headerfooter.footer, 'object');

    test.done();
};

exports['New In'] = function(test) {

    test.expect(1);

    var read_headerfooter = new headerfooter.In();

    test.equal(typeof read_headerfooter, 'object');

    test.done();
};

exports['Test Parse'] = function(test) {
    test.expect(6);

    var passthroughA = new PassThrough(); // dummy
    var passthroughB = new PassThrough(); // dummy

    var add_headerfooter = new headerfooter.Out();

    add_headerfooter.header = {
        name: "streamA",
        metadata: [23, 33, 221, 222]
    };
    add_headerfooter.footer = {
        exit_code: 2
    };

    var read_headerfooter = new headerfooter.In();

    read_headerfooter.on('header', function(header) {
        test.equal(typeof header, 'object');
        test.equal(header.name, 'streamA');
        test.equal(header.metadata[0], 23);
        test.equal(header.metadata[3], 222);
    });

    read_headerfooter.on('footer', function(footer) {
        test.equal(typeof footer, 'object');
        test.equal(footer.exit_code, 2);
        test.done();
    });

    read_headerfooter.on('data', function(data) {
        console.log('Stream Data:', data.toString()); // sanitized stream data without header and footer data in buffer
    });

    passthroughA.pipe(add_headerfooter).pipe(passthroughB);
    passthroughB.pipe(read_headerfooter);

    passthroughA.write('Testing... 123');
    passthroughA.end("...Ending");
};


exports['No Header or Footer'] = function(test) {
    test.expect(1);

    var passthroughA = new PassThrough(); // dummy
    var passthroughB = new PassThrough(); // dummy

    var add_headerfooter = new headerfooter.Out();
    var read_headerfooter = new headerfooter.In();

    read_headerfooter.on('header', function(header) {
        console.log("HEADER", header);
        test.equal(false, true);
    });

    read_headerfooter.on('footer', function(footer) {
        console.log("Footer", footer);
        test.equal(false, true);
    });

    read_headerfooter.on('data', function(data) {
        console.log('Stream Data:', data.toString()); // sanitized stream data without header and footer data in buffer
    });

    read_headerfooter.on('end', function() {
        test.equal(true, true);
        test.done();
    });

    passthroughA.pipe(add_headerfooter).pipe(passthroughB);
    passthroughB.pipe(read_headerfooter);

    passthroughA.write('Testing... 123');
    passthroughA.end("...Ending");
};

exports['No Footer'] = function(test) {
    test.expect(5);

    var passthroughA = new PassThrough(); // dummy
    var passthroughB = new PassThrough(); // dummy

    var add_headerfooter = new headerfooter.Out();
    var read_headerfooter = new headerfooter.In();

    add_headerfooter.header = {
        name: "streamA",
        metadata: [23, 33, 221, 222]
    };

    read_headerfooter.on('header', function(header) {
        test.equal(typeof header, 'object');
        test.equal(header.name, 'streamA');
        test.equal(header.metadata[0], 23);
        test.equal(header.metadata[3], 222);
    });

    read_headerfooter.on('footer', function(footer) {
        console.log("Footer", footer);
        test.equal(false, true);
    });

    read_headerfooter.on('data', function(data) {
        console.log('Stream Data:', data.toString()); // sanitized stream data without header and footer data in buffer
    });

    read_headerfooter.on('end', function() {
        test.equal(true, true);
        test.done();
    });

    passthroughA.pipe(add_headerfooter).pipe(passthroughB);
    passthroughB.pipe(read_headerfooter);

    passthroughA.write('Testing... 123');
    passthroughA.end("...Ending");
};

exports['No Header'] = function(test) {
    test.expect(3);

    var passthroughA = new PassThrough(); // dummy
    var passthroughB = new PassThrough(); // dummy

    var add_headerfooter = new headerfooter.Out();

    add_headerfooter.footer = {
        exit_code: 2
    };

    var read_headerfooter = new headerfooter.In();

    read_headerfooter.on('header', function(header) {        
        test.equal(false, true);
    });

    read_headerfooter.on('footer', function(footer) {
        test.equal(typeof footer, 'object');
        test.equal(footer.exit_code, 2);        
    });

    read_headerfooter.on('end', function() {
        test.equal(true, true);
        test.done();
    });

    read_headerfooter.on('data', function(data) {
        console.log('Stream Data:', data.toString()); // sanitized stream data without header and footer data in buffer
    });

    passthroughA.pipe(add_headerfooter).pipe(passthroughB);
    passthroughB.pipe(read_headerfooter);

    passthroughA.write('Testing... 123');
    passthroughA.end("...Ending");
};

exports['tearDown'] = function(done) {
    done();
};
