var express = require('express'),
  router = express.Router(),
  Api = require('../models/api');
var passport = require('passport');
var SteamStrategy = require('passport-steam').Strategy;

module.exports = function (app) {
  app.use('/', router);
};

passport.use(new SteamStrategy({
    returnURL: 'http://localhost:8080/login/return',
    realm: 'http://localhost:8080/',
    apiKey: process.env.API_KEY
    //profile: false
  },
  function(identifier, profile, done) {
      return done(null, { identifier: profile.id })
  }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

var gameCollection = {};
var connections = {};

router.get('/u/:steamId', function (req, res, next) {
    // var steamId = req.params['steamId'];
    // if(gameCollection.hasOwnProperty(steamId)) {
    //     // Render the page for the specific steam user
    //     var map = gameCollection[steamId].map || {
    //         mode: "deathmatch",
    //         name: "de_dust2",
    //         phase: "gameover",
    //         round: 0,
    //         team_ct: {
    //             score: 0
    //         },
    //         team_t: {
    //             score: 0
    //         }
    //     };
    //     var round = gameCollection[steamId].round || {
    //         phase: "freezetime",
    //         win_team: "CT"
    //     };
    //     var tData = {
    //         steamId: steamId,
    //         map: map,
    //         round: round,
    //         raw: JSON.stringify(gameCollection[steamId], null, 4)
    //     };
    //     res.render('user', tData);
    // } else {
    //     // Render the main page with the error user not found
    //     res.render('index', {title:'error', all: JSON.stringify(gameCollection, null, 4)});
    //
    // }
    res.sendfile('./public/u.html');
});

router.get('/u', function (req, res, next) {
    if(req.user !== undefined && req.user.identifier !== undefined) {
        res.redirect('/u/' + req.user.identifier);
    } else {
        res.redirect('/');
    }
});

router.get('/u/:steamId/json', function (req, res, next) {
    var steamId = req.params['steamId'];

    // TODO We need to diferentiate between different clients
    if(connections.hasOwnProperty(steamId)) {
        console.log('---Keeping open');
        connections[steamId] = res;
    } else {
        console.log('---Normal send open');
        connections[steamId] = res;
        if(!gameCollection.hasOwnProperty(steamId)) {
            gameCollection[steamId] = new Api();
        }
        res.send(gameCollection[steamId]);
    }

});


router.get('/', function (req, res, next) {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        var html = 'yes';
        res.end(html);
});


router.get('/login', passport.authenticate('steam'), function(req, res) {
    console.log(req.user);
    // The request will be redirected to Steam for authentication, so
    // this function will not be called.
});

router.get('/login/return', passport.authenticate('steam'), function(req, res) {
    // Successful authentication
    res.redirect('/u/' + req.user.identifier);
});

var update = function(dataBody) {
    var data = JSON.parse(dataBody);
    var apiObject = new Api(data);
    console.log(data);
    if(apiObject.meta.steamId !== undefined) {
        gameCollection[apiObject.meta.steamId] = apiObject;
        // var steamId = data.provider.steamid;
        // var tData = {
        //     steamId: steamId,
        //     map: gameCollection[steamId].map || {},
        //     round: gameCollection[steamId].round || {},
        //     raw: JSON.stringify(gameCollection[steamId], null, 4)
        // };
        if(connections.hasOwnProperty(apiObject.meta.steamId)) {
            connections[apiObject.meta.steamId].send(apiObject);
            //connections[steamId].send(data);
        }
    }
};

router.post('/', function (req, res, next) {
    console.log("Handling POST request...");
    res.writeHead(200, {'Content-Type': 'text/html'});

    var body = '';
    req.on('data', function (data) {
        body += data;
    });
    req.on('end', function () {
        console.log("POST payload: " + body);
        update(body);
    	res.end( '' );
    });




    //var cDataParsed = JSON.parse(cData);




    //    console.log(data);
        // if(data.hasOwnProperty('provider') && data.provider.hasOwnProperty('steamid')) {
        //     gameCollection[data.provider.steamid] = data;
        //     var steamId = data.provider.steamid;
        //     var tData = {
        //         steamId: steamId,
        //         map: gameCollection[steamId].map || {},
        //         round: gameCollection[steamId].round || {},
        //         raw: JSON.stringify(gameCollection[steamId], null, 4)
        //     };
        //     if(connections.hasOwnProperty(steamId)) {
        //         //connections[steamId].send(data);
        //         //connections[steamId].send(data);
        //     }
        // }








        // res.writeHead(200, {
        //     'Content-Type': 'text/html'
        // });
        //
        // var body = '';
        // req.on('data', function(data) {
        //      body += data;
        // });
        // req.on('end', function() {
        //     res.end('');
        //     var data = JSON.parse(body);
        //     console.log(data);
        //     if(data.hasOwnProperty('provider') && data.provider.hasOwnProperty('steamid')) {
        //         gameCollection[data.provider.steamid] = data;
        //         var steamId = data.provider.steamid;
        //         var tData = {
        //             steamId: steamId,
        //             map: gameCollection[steamId].map || {},
        //             round: gameCollection[steamId].round || {},
        //             raw: JSON.stringify(gameCollection[steamId], null, 4)
        //         };
        //         if(connections.hasOwnProperty(steamId)) {
        //             connections[steamId].send(data);
        //             //connections[steamId].send(data);
        //         }
        //     }
        //
        // });
        // req.on("error", function(err) {
        //     console.log(err);
        //     return next(err);
        // });
});
