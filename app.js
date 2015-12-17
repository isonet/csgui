

var express = require('express'),
  config = require('./config/config');
  var https = require('https');
  var http = require('http');
var app = express();
var fs = require('fs');

require('./config/express')(app, config);

//var privateKey  = fs.readFileSync('/etc/letsencrypt/tlse.isonet.fr/privkey.pem', 'utf8');
//var certificate = fs.readFileSync('/etc/letsencrypt/tlse.isonet.fr/cert.pem', 'utf8');
//var credentials = {key: privateKey, cert: certificate};
PORT = process.env.PORT || 8080;
http.createServer(app).listen(PORT);
//https.createServer(credentials, app).listen(443);

// The app.listen() method is a convenience method for the following (for HTTP only):
//
// app.listen = function() {
//   var server = http.createServer(this);
//   return server.listen.apply(server, arguments);
// };
//app.listen(config.port, function () {
//  console.log('Express server listening on port ' + config.port);
//});
