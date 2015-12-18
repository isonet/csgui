var express = require('express');
var router = express.Router();
var Api = require('../models/api');
var passport = require('passport');
var SteamStrategy = require('passport-steam').Strategy;

module.exports = function (app) {
  app.use('/', router);
};

// TODO Fix for deployment url
passport.use(new SteamStrategy({
    returnURL: process.env.DOMAIN_URL + 'login/return',
    realm: process.env.DOMAIN_URL,
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

router.get('/u/:steamId', function (req, res) {
    res.sendfile('./public/u.html');
});

router.get('/u', function (req, res) {
    if(req.user !== undefined && req.user.identifier !== undefined) {
        res.redirect('/u/' + req.user.identifier);
    } else {
        res.redirect('/');
    }
});

router.get('/u/:steamId/json', function (req, res) {
    var steamId = req.params['steamId'];

    // TODO We need to diferentiate between different clients
    if(connections.hasOwnProperty(steamId)) {
        connections[steamId] = res;
    } else {
        connections[steamId] = res;
        if(!gameCollection.hasOwnProperty(steamId)) {
            gameCollection[steamId] = new Api();
        }
        res.send(gameCollection[steamId]);
    }

});


router.get('/', function (req, res) {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        var html = 'yes';
        res.end(html);
});


router.get('/login', passport.authenticate('steam'), function(req) {
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
        if(connections.hasOwnProperty(apiObject.meta.steamId)) {
            connections[apiObject.meta.steamId].send(apiObject);
        }
    }
};

router.post('/', function (req, res, next) {
    res.writeHead(200, {'Content-Type': 'text/html'});

    var body = '';
    req.on('data', function (data) {
        body += data;
    });
    req.on('end', function () {
        update(body);
    	res.end( '' );
    });
});
