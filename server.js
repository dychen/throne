'use strict';

// Set globals
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
global.__ROOT_DIR = __dirname;

const loadServer = () => {

  const express    = require('express');
  const bodyParser = require('body-parser');
  const forceSSL   = require('express-force-ssl');
  const mongoose   = require('mongoose');
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
  /*
  require('./server/auth/google')(passport);
  app.use(express.bodyParser());
  app.use(express.cookieParser(process.env.SESSION_SECRET));
  app.use(express.session(sessionParams));
  app.use(flash());

  app.use(passport.initialize());
  app.use(passport.session());
  require('./server/routes')(app, passport);
  */

  // Routes
  app.use(bodyParser.json());
  require(__ROOT_DIR + '/server/routes.js')(app, express);
  app.set('port', process.env.PORT || 3334);

  app.listen(app.get('port'), function() {
    console.log('Starting ' + app.get('env') + ' server');
    console.log('Express server listening on port ' + app.get('port'));
  });
}

loadServer();
