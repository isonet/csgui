//
//
// var express = require('express'),
//   config = require('./config/config');
//
// var app = express();
//
// require('./config/express')(app, config);
//
// app.listen(config.port, function () {
//   console.log('Express server listening on port ' + config.port);
// });

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.io = io;

io.on('connection', function(socket) {
        console.log('a user connected');
    });

var config = require('./config/config');
require('./config/express')(app, config);

server.listen(config.port, function () {
   console.log('Express server listening on port ' + config.port);
});
