/*jshint es5:true node:true*/

"use strict";


// Import http and WebSocket module

var http            = require('http'),
    WebSocketServer = require('ws').Server;



// Set up a simple WebSocket server on port 8080.
// This is the server the stream api will connect to.

var wss = new WebSocketServer({port: 8080});

wss.on('connection', function(ws) {
    console.log('web socket connection established');

    // Messages from the stream api will occur here

    ws.on('message', function(message) {
        console.log(message);
    });
});



// Ping the stream api with apikey and where the WebSocket
// server it should connect to is.

http.get({
        host: 'realtime.nobil.no',
        port: '80',
        path: '/api/v1/stream/pingback?apikey={private_apikey}&url={url_to_this_websocket_server}'
    }, function(res) {

    console.log("got http response: " + res.statusCode);

}).on('error', function(e) {
    console.log("got http error: " + e.message);
});



// Prevent exceptions to bubble up to the top and eventually kill the server

process.on("uncaughtException", function (err) {
    console.warn(err.stack);
});