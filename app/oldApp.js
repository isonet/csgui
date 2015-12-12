http = require('http');
fs = require('fs');

var gameCollection = {};

port = process.env.PORT;
host = '0.0.0.0';

server = http.createServer(function(req, res) {
    if(req.url=='/index.html'){
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.end(JSON.stringify(gameCollection, null, 2));
    } else {
        if (req.method == 'POST') {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });

            var body = '';
            req.on('data', function(data) {
                body += data;
            });
            req.on('end', function() {
                //console.log(body);
                update(JSON.parse(body));
                res.end('');
            });

        } else {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            var html = 'yes';
            res.end(html);
        }
    }



});

var update = function(data) {
    if(!gameCollection.hasOwnProperty(data.provider.steamid)) {
        gameCollection[data.provider.steamid] = {};
    }
    var game = gameCollection[data.provider.steamid];
    game.raw = data;
    //console.log(game.map.phase);

}

server.listen(port);
console.log('Listening at ttp://' + host + ':' + port);
