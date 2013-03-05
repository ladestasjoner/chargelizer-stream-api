/*jshint es5:true node:true*/

"use strict";


// Import web socket module

var WebSocket = require('ws');



// Define a connection function we can call again if connection dies.

var connection = function() {

    // Set up a WebSocket connection to the real time server
    var client = new WebSocket('ws://realtime.chargelizer.com/api/v1/stream/realtime');


    // Message emitted on connection to the stream api

    client.on('open', function(msg) {
        console.log('Connected to the stream api');
    });


    // Messages emitted on update in the stream api

    client.on('message', function(msg) {
        console.log('Message from the stream api', msg);
    });


    // Message emitted is the connection to the stream api is closed for some reason

    client.on('close', function(){
        var retry = setTimeout(connection, 6000);
        console.log('Connection to the stream api closed. Trying to reconnect in 10 seconds');
    });
}


// Connect on start of application

connection();



// Prevent exceptions to bubble up to the top and eventually kill the server

process.on("uncaughtException", function (err) {
    console.error(err.stack);
});