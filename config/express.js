var express = require('express');
var expressSession = require('express-session');
var glob = require('glob');
var passport = require('passport');
var logger = require('morgan');
var compress = require('compression');
var methodOverride = require('method-override');

module.exports = function(app, config) {
  var env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';


  app.set('views', config.root + '/app/views');

  // app.use(favicon(config.root + '/public/img/favicon.ico'));
  app.use(logger('dev'));
  //app.use(bodyParser.json());
  //app.use(bodyParser.urlencoded({
//    extended: true
  //}));

  app.use(compress());
  app.use(express.static(config.root + '/public'));
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

  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  if(app.get('env') === 'development'){
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
    });
  }

  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
  });

};
