var express = require('express');
var router = express.Router();
var Api = require('../models/api');
var passport = require('passport');
var path = require('path');

var events = require('events');
var eventEmitter = new events.EventEmitter();

// TODO Use authentication token?

// TODO Create live controller

module.exports = function (app) {
    app.use('/', router);
};

function loggedIn(req, res, next) {
    //if (req.user) {
    //    next();
    //} else {
    //    res.redirect('/login');
    //}
    next();
}

var gameCollection = {};
var connections = {};
var apiVersion = 'v1';

router.get('/api/' + apiVersion + '/live/:steamId', function(req, res) {
    var steamId = req.params['steamId'];

    var messageCount = 0;

    // let request last as long as possible
    //req.socket.setTimeout(Number.MAX_VALUE); //Infinity

    //send headers for event-stream connection
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    eventEmitter.on('update', function(id, data) {
        //if(steamId === id) {
            console.log('update', id);
            messageCount++; // Increment our message count
            res.write("id: " + messageCount + "\n");
            res.write("event: liveUpdate\n");
            res.write("data: " + JSON.stringify(data).replace('\n', '\\\n') + "\n\n");
        //}
    });
    res.on('close', function() {
        console.log('close');
    });
    if(gameCollection[steamId] !== undefined) {
        eventEmitter.emit('update', steamId, gameCollection[steamId]);
    }
});

router.get('/u/:steamId', loggedIn, function (req, res) {
    // TODO Check if the game has already connected and if not display a loading icon and offer a config file
    //res.sendFile(path.join(__dirname, '../../public/', 'u.html'));
    res.render('pages/live.ejs');
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
        connections[steamId] = res;
    } else {
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
        console.log('emit');
        eventEmitter.emit('update', apiObject.meta.steamId, apiObject);

        gameCollection[apiObject.meta.steamId] = apiObject;
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
