'use strict';

// Set globals
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
global.__ROOT_DIR = __dirname;

const loadServer = () => {

  const express      = require('express');
  const session      = require('express-session');
  const passport     = require('passport');
  const cookieParser = require('cookie-parser')
  const bodyParser   = require('body-parser');
  const forceSSL     = require('express-force-ssl');
  const mongoose     = require('mongoose');
  const mongoStore   = require('connect-mongo')(session);
  const auth         = require(__ROOT_DIR + '/server/auth.js');

  mongoose.connect(process.env.MONGO_URL);
  console.log('Connected to Mongo database at', process.env.MONGO_URL);

  // Initialize the application
  const app = express();

  if ('development' === app.get('env')) {
    // Dev stuff
  }
  if ('staging' === app.get('env')) {
    // Staging stuff
    app.use(forceSSL);
  }
  if ('production' === app.get('env')) {
    // Prod stuff
    app.use(forceSSL);
  }

  // Initialize passport auth and sessions
  const SESSION_PARAMS = {
    cookie: {
      path: '/',
      maxAge: 3600000 * 24 * 60 // 60 day expiration
    },
    secret: process.env.SESSION_SECRET,
    // Initialize a separate DB connection
    store: new mongoStore({ url: process.env.MONGO_URL })
  };
  auth.googleOAuth(passport);
  app.use(cookieParser(process.env.SESSION_SECRET));
  app.use(session(SESSION_PARAMS));
  app.use(passport.initialize());
  app.use(passport.session());

  // Routes
  app.use(bodyParser.json());
  require(__ROOT_DIR + '/server/routes.js')(app, passport, express);
  app.set('port', process.env.PORT || 3334);

  app.listen(app.get('port'), function() {
    console.log('Starting ' + app.get('env') + ' server');
    console.log('Express server listening on port ' + app.get('port'));
  });
}

loadServer();
