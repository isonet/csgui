var express = require('express'),
  router = express.Router(),
  Article = require('../models/article');

module.exports = function (app) {
  app.use('/', router);
};

var gameCollection = {};
var connections = {};

router.get('/u/:steamId', function (req, res, next) {
    var steamId = req.params['steamId'];
    if(gameCollection.hasOwnProperty(steamId)) {
        // Render the page for the specific steam user
        var map = gameCollection[steamId].map || {
            mode: "deathmatch",
            name: "de_dust2",
            phase: "gameover",
            round: 0,
            team_ct: {
                score: 0
            },
            team_t: {
                score: 0
            }
        };
        var round = gameCollection[steamId].round || {
            phase: "freezetime",
            win_team: "CT"
        };
        var tData = {
            steamId: steamId,
            map: map,
            round: round,
            raw: JSON.stringify(gameCollection[steamId], null, 4)
        };
        res.render('user', tData);
    } else {
        // Render the main page with the error user not found
        res.render('index', {title:'error', all: JSON.stringify(gameCollection, null, 4)});

    }
});

router.get('/u/:steamId/json', function (req, res, next) {
    var steamId = req.params['steamId'];
    // res.write("lol");
    // res.write("lol2");
    // res.end();
    //res.contentType( 'application/json' );
    //res.write(gameCollection[steamId]);
    connections[steamId] = res;
});


router.get('/p', function (req, res, next) {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        var html = 'yes';
        res.end(html);
});

router.post('/p', function (req, res, next) {
    //console.log(req);

        res.writeHead(200, {
            'Content-Type': 'text/html'
        });

        var body = '';
        req.on('data', function(data) {
            body += data;
        });
        req.on('end', function() {
            console.log(body);
            var data = JSON.parse(body);
            console.log(data);
            if(data.hasOwnProperty('provider') && data.provider.hasOwnProperty('steamid')) {
                gameCollection[data.provider.steamid] = data;
                var steamId = data.provider.steamid;
                var tData = {
                    steamId: steamId,
                    map: gameCollection[steamId].map || {},
                    round: gameCollection[steamId].round || {},
                    raw: JSON.stringify(gameCollection[steamId], null, 4)
                };
                if(connections.hasOwnProperty(steamId)) {
                    connections[steamId].send(data);
                    //connections[steamId].send(data);
                }
            }
            res.end('');
        });
});
