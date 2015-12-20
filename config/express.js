var express = require('express');
var expressSession = require('express-session');
var glob = require('glob');
var passport = require('passport');
var compression = require('compression');
var methodOverride = require('method-override');
var SteamStrategy = require('passport-steam').Strategy;

module.exports = function (app, config) {
    app.use(compression({}));
    app.use(express.static(config.root + '/public'));
    app.use('/lib',  express.static(config.root + '/lib'));
    app.use(methodOverride());

    app.set('views', process.cwd() + '/app/views');
    app.engine('ejs', require('ejs').__express);

    app.use(expressSession({
        secret: 'You will never guess this secret',
        resave: true,
        saveUninitialized: true
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new SteamStrategy({
            returnURL: process.env['DOMAIN_URL'] + 'login/return',
            realm: process.env['DOMAIN_URL'],
            apiKey: process.env['API_KEY']
        },
        function (identifier, profile, done) {
            return done(null, {identifier: profile.id})
        }
    ));

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });


    var controllers = glob.sync(config.root + '/app/controllers/*.js');
    controllers.forEach(function (controller) {
        require(controller)(app);
    });

    app.use(function (err, req, res, next) {
        console.error(err.stack);
        res.status(500).send('Something broke!');
        //res.status(404).send('Not found!');
    });

};
