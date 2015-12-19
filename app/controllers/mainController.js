var express = require('express');
var router = express.Router();
var Api = require('../models/api');
var passport = require('passport');
var path = require('path');

// TODO Use authentication token?

module.exports = function (app) {
    app.use('/', router);
};

function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

var gameCollection = {};
var connections = {};

router.get('/u/:steamId', loggedIn, function (req, res) {
    // TODO Check if the game has already connected and if not display a loading icon and offer a config file
    res.sendFile(path.join(__dirname, '../../public/', 'u.html'));
});

router.get('/u', function (req, res) {
    if (req.user !== undefined && req.user.identifier !== undefined) {
        res.redirect('/u/' + req.user.identifier);
    } else {
        res.redirect('/');
    }
});

router.get('/u/:steamId/json', loggedIn, function (req, res, next) {
    // TODO Check that steamID belongs to loggedIn user
    var steamId = req.params['steamId'];

    // TODO We need to diferentiate between different clients
    if (connections.hasOwnProperty(steamId)) {
        console.log('Old connection');
        connections[steamId] = res;
        console.log(connections);
    } else {
        console.log('Ney connection' + steamId);
        connections[steamId] = res;
        if (!gameCollection.hasOwnProperty(steamId)) {
            gameCollection[steamId] = new Api();
        }
        res.send(gameCollection[steamId]);
    }

});


router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../../public/', 'index.html'));
});


router.get('/login', passport.authenticate('steam'), function (req) {
    // The request will be redirected to Steam for authentication, so
    // this function will not be called.
});

router.get('/login/return', passport.authenticate('steam'), function (req, res) {
    // Successful authentication
    res.redirect('/u/' + req.user.identifier);
});

var update = function (dataBody) {
    var data = JSON.parse(dataBody);
    var apiObject = new Api(data);
    if (apiObject.meta.steamId !== undefined) {
        gameCollection[apiObject.meta.steamId] = apiObject;
        console.log(connections);
        console.log(apiObject.meta.steamId);
        console.log(connections.hasOwnProperty(apiObject.meta.steamId));
        if (connections.hasOwnProperty(apiObject.meta.steamId)) {
            try {
                connections[apiObject.meta.steamId].send(apiObject);
            } catch (ex) {
                delete connections[apiObject.meta.steamId];
            }

        }
    }
};

router.post('/', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});

    var body = '';
    req.on('data', function (data) {
        body += data;
    });
    req.on('end', function () {
        update(body);
        res.end('');
    });
});
