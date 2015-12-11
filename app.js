http = require('http');
fs = require('fs');



port = 80;
host = '0.0.0.0';

server = http.createServer(function(req, res) {

    if (req.method == 'POST') {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });

        var body = '';
        req.on('data', function(data) {
            body += data;
        });
        req.on('end', function() {
            console.log(body);
            res.end('');
        });

    } else {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        var html = 'yes';
        res.end(html);
    }

});


server.listen(port);
console.log('Listening at ttp://' + host + ':' + port);
