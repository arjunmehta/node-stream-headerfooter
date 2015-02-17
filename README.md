# stream-headerfooter

[![Build Status](https://travis-ci.org/arjunmehta/node-stream-headerfooter.svg?branch=master)](https://travis-ci.org/arjunmehta/node-stream-headerfooter)

This module provides the ability to attach JSON headers and footers into any standard node/io.js stream pipeline to be consumed downstream. More specifically, this module provides:

- **The ability to pass JSON objects along streams when they first start (headers) and when they end (footers).**
- **Header and Footer receivers are evented with 'header' and 'footer' events.**
- **A simple, easy to use interface using stream piping.**
- **Automatic stream sanitation after events are captured (headers and footers are removed from the pipeline after being consumed).**
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

### Attach Headers and Footers to an Outgoing Stream
You can attach JSON headers/footers to a special stream (`headerfooter.Out`) that encodes your headers and footers and sends them to be recieved later down your pipeline. 

Make sure to add your `header` before your stream begins, and add your `footer` before your stream ends. This outgoing stream is a duplex transform stream, so it can be piped to AND from.

```javascript
var outgoing = new headerfooter.Out()
outgoing.header = { name: "streamA", metadata:[23, 33, 221, 222] }
outgoing.footer = { exit_code: 2 }
```

### Receive and Handle Incoming Headers and Footers
You'll need to create a special stream `headerfooter.In` to listen for headers and footers. This stream will emit `header` and `footer` events as they are received.

Just create event handlers to handle headers and footers from your stream. The incoming stream is also a duplex transform stream, so it can be piped to AND from.

```javascript
var receiver = new headerfooter.In()

receiver.on('header', function(header) {
    console.log('Stream Header:', header)
})

receiver.on('footer', function(footer) {
    console.log('Stream Footer:', footer)
})

receiver.on('data', function(data) {
    console.log('Stream Data:', data) // sanitized stream data without header and footer data in buffer
})
```

### Write and Receive!

Plug both these streams into your stream pipeline. The outgoing stream that has the headers on one end, and the receiver on the other end. `header` and `footer` events, as well as all other native node/io.js stream events can be captured (if they have handlers) on the receiving end.

```javascript
var passthroughA = new PassThrough() // dummy
var passthroughB = new PassThrough() // dummy

passthroughA.pipe(outgoing).pipe(passthroughB)
passthroughB.pipe(receiver)

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