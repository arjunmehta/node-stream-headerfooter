# stream-headerfooter

[![Build Status](https://travis-ci.org/arjunmehta/node-stream-headerfooter.svg?branch=master)](https://travis-ci.org/arjunmehta/node-stream-headerfooter)

This module provides the ability to attach headers and footers into any standard node/io.js stream pipeline to be read further downstream. JMore specifically, this module provides:

- **The ability to pass JSON objects along streams when they first start (headers) and when they end (footers).**
- **A simple, easy to use interface using stream piping.**
- **Evented streams to give access to 'header' and 'footer' events.**
- **Automatic stream sanitation after events are captured, perfect for fitting in your pipeline.**
- **Flexible header/footer typing (string, number, object or array).**

## Installation
```bash
npm install --save stream-headerfooter
```

## Basic usage

### Include

```javascript
var headerfooter = require('stream-headerfooter')
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
    console.log('Stream Header:', header)
})

read_headerfooter.on('footer', function(footer) {
    console.log('Stream Footer:', footer)
})

read_headerfooter.on('data', function(data) {
    console.log('Stream Data:', data) // sanitized stream data without header and footer data in buffer
})
```

### Pipe To and From Any Stream!
You can now pipe your headers and footers from one place to another through any number of streams. `header` and `footer` events, as well as all other native node/io.js stream events can be captured (if they have handlers).

```javascript
var passthroughA = new PassThrough() // dummy
var passthroughB = new PassThrough() // dummy

passthroughA.pipe(add_headerfooter).pipe(passthroughB)
passthroughB.pipe(read_headerfooter)

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