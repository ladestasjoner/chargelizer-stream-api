/*jshint es5:true node:true*/

"use strict";


var http            = require('http'),
    WebSocketServer = require('ws').Server,
    options = {
        host: 'realtime.chargelizer.com',
        port: '80',
        path: '/api/v1/stream/pingback?apikey={private_apikey}&url={url_to_websocket_server}'
    };



// Simple Web Socket server
var wss = new WebSocketServer({port: 8080});

wss.on('connection', function(ws) {
    console.log('web socket connection established');

    ws.on('message', function(message) {
        console.log(message);
    });
});



// Ping real time server

http.get(options, function(res) {
    console.log("got http response: " + res.statusCode);
}).on('error', function(e) {
    console.log("got http error: " + e.message);
});



// Prevent exceptions to bubble up to the top and eventually kill the server

process.on("uncaughtException", function (err) {
    console.warn(err.stack);
});