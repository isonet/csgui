var express = require('express');
var config = require('./config/config');
var http = require('http');
var app = express();

require('./config/express')(app, config);

PORT = process.env['PORT'] || 8080;
http.createServer(app).listen(PORT);
