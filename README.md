# headerfooter

This module lets you send headers and footers along with ANY standard node/io stream. Use this module to pass JSON objects from readable to writable streams when they first start (headers) and when they end (footers). This module provides:

- A simple, easy to use and unobtrusive interface using stream piping.
- Evented streams give access to 'header' and 'footer' events.
- Automatic stream sanitation after events are captured, perfect for fitting in your pipeline.
- Flexible header/footer typing (string, number, object or array).

## Installation
```bash
npm install --save headerfooter
```

## Basic usage

### Include

```javascript
var headerfooter = require('headerfooter')
```

### Setup Your Outgoing Stream
Your outgoing stream is the stream you want to attach JSON headers/footers to. Just add your `header` before your stream begins, and add your `footer` before your stream ends. The outgoing stream is a duplex transform stream, so it can be piped to AND from.

```javascript
var add_headerfooter = new headerfooter.Out()
add_headerfooter.header = { name: "streamA", metadata:[23, 33, 221, 222] }
add_headerfooter.footer = { exit_code: 2 }
```

### Setup Your Incoming Stream
The output of your outgoing streams will need to be channeled to a receiving stream that will emit `header` and `footer` events as they are received. Create an incoming stream and create event handlers to read in headers and footers from your stream. The incoming stream is also a duplex transform stream, so it can be piped to AND from.

```javascript
var read_headerfooter = new headerfooter.In()

read_headerfooter.on('header', function(header) {
    console.log('Stream Header:', header);
});

read_headerfooter.on('footer', function(footer) {
    console.log('Stream Footer:', footer);
});

read_headerfooter.on('data', function(data) {
    console.log('Stream Data:', data); // sanitized stream data without header and footer data in buffer
});
```

### Pipe To and From Any Stream!
You can now pipe to and from your streams. `header` and `footer` events, as well as all other native node/io.js stream events that have handlers can be captured.

```javascript
var passthroughA = new PassThrough(); // dummy
var passthroughB = new PassThrough(); // dummy

passthroughA.pipe(add_headerfooter).pipe(passthroughB)
passthroughB.pipe(read_headerfooter);

passthroughA.write('Testing... 123')
passthroughA.end("...Ending")

//=> Stream Header: { name: "streamA", metadata:[23, 33, 221, 222] }
//=> Stream Data: Testing... 123
//=> Stream Data: ...Ending
//=> Stream Footer: { exit_code: 2 }
```

## License

```
The MIT License (MIT)
Copyright (c) 2015 Arjun Mehta
```