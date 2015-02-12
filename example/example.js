var stream = require('stream');
var PassThrough = stream.PassThrough || require('readable-stream').PassThrough;
var inter = new PassThrough();

var headerfooter = require('../main');
var out_stream = new headerfooter.Out();
var in_stream = new headerfooter.In();

out_stream.header = ['A Generic JSON header', 1, 2, 4, 'This header is in the form of an array'];
out_stream.footer = {
    example_footer: ['This footer is in the form of an object with two properties', 3, 3, 1],
    status: "success"
};

// process.stdin.setRawMode(true);
// process.stdin.resume();
// process.stdin.setEncoding('utf8');
in_stream.setEncoding('utf8');


process.stdin.pipe(inter).pipe(out_stream).pipe(in_stream);

in_stream.on('header', function(header) {
    console.log('Stream Header:', header);
});

in_stream.on('footer', function(footer) {
    console.log('Stream Footer:', footer);
});

in_stream.on('end', function() {
    console.log('Stream End');
});

in_stream.on('finish', function(err) {
    console.log('Stream Finish');
});

in_stream.on('error', function(err) {
    console.log('Stream Error:', err);
});

in_stream.on('data', function(data) {
    console.log('Stream Data:', data);
});

console.log('Type Something... (enter q to quit):');

process.stdin.on('data', function(data) {

    if (data.toString() === 'q\n' || data.toString() === 'q') {
        inter.end("JAMBALALAYAYAYAYA");
        setTimeout(function() {
            process.exit();
        }, 200);
    }
});
