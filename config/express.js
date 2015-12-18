var express = require('express');
var expressSession = require('express-session');
var glob = require('glob');
var passport = require('passport');
var compression = require('compression');
var methodOverride = require('method-override');

module.exports = function (app, config) {
    app.use(compression({}));
    app.use(express.static(config.root + '/public'));
    app.use('/lib',  express.static(config.root + '/lib'));
    app.use(methodOverride());

    app.use(expressSession({
        secret: 'You will never guess this secret',
        resave: true,
        saveUninitialized: true
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    var controllers = glob.sync(config.root + '/app/controllers/*.js');
    controllers.forEach(function (controller) {
        require(controller)(app);
    });

    app.use(function (err, req, res, next) {
        console.error(err.stack);
        res.status(500).send('Something broke!');
        res.status(404).send('Not found!');
    });

};
