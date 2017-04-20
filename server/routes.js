const path = require('path');
const User = require(__ROOT_DIR + '/server/models/User.js');
const UserSession = require(__ROOT_DIR + '/server/models/UserSession.js');
const UserPayment = require(__ROOT_DIR + '/server/models/UserPayment.js');

module.exports = (app, express) => {
  app.post('/auth/v1/register', (req, res) => {
    User.registerUser(req.body, (err, user) => {
      if (err)
        return res.status(400).send({ error: err });
      else
        return res.send({ data: user });
    });
  });

  app.post('/auth/v1/verify', (req, res) => {
    if (req.body.userId && req.body.code) {
      User.verifyUser(req.body.userId, req.body.code, (err, user) => {
        if (err)
          return res.status(400).send({ error: err });
        else
          return res.send({ data: user });
      });
    }
    else {
      return res.status(400).send({
        error: 'Missing data: User id or verification code'
      });
    }
  });

  app.get('/auth/v1/login', (req, res) => {
    res.send(data);
  });

  app.get('/auth/v1/logout', (req, res) => {
    res.send(data);
  });

  /* API routes */

  /* Users */

  app.get('/api/v1/users', (req, res) => {
    User.getUserList((err, users) => {
      if (err)
        return res.status(400).send({ error: err });
      else
        return res.send({ data: users });
    });
  });

  app.get('/api/v1/users/autocomplete', (req, res) => {
    User.getUserAutocompleteList((err, users) => {
      if (err)
        return res.status(400).send({ error: err });
      else
        return res.send({ data: users });
    });
  });

  app.post('/api/v1/users', (req, res) => {
    User.createUser(req.body, (err, users) => {
      if (err)
        return res.status(400).send({ error: err });
      else
        return res.send({ data: users });
    });
  });

  app.post('/api/v1/users/:userId', (req, res) => {
    User.updateUser(req.body, req.params.userId, (err, users) => {
      if (err)
        return res.status(400).send({ error: err });
      else
        return res.send({ data: users });
    });
  });

  /* Sessions */

  app.get('/api/v1/sessions', (req, res) => {
    UserSession.getUserSessionList((err, userSessions) => {
      if (err)
        return res.status(400).send({ error: err });
      else
        return res.send({ data: userSessions });
    });
  });

  app.post('/api/v1/sessions/start/:userId', (req, res) => {
    User.startSession(req.params.userId, (err, userSessions) => {
      if (err)
        return res.status(400).send({ error: err });
      else
        return res.send({ data: userSessions });
    });
  });

  app.post('/api/v1/sessions/end/:sessionId', (req, res) => {
    User.endSession(req.params.sessionId, (err, userSessions) => {
      if (err)
        return res.status(400).send({ error: err });
      else
        return res.send({ data: userSessions });
    });
  });

  app.post('/api/v1/sessions/tables/:sessionId', (req, res) => {
    UserSession.updateUserSessionTable(req.body, req.params.sessionId,
                                       (err, userSessions) => {
      if (err)
        return res.status(400).send({ error: err });
      else
        return res.send({ data: userSessions });
    });
  });

  /* Payments */

  app.get('/api/v1/payments', (req, res) => {
    UserPayment.getUserPaymentList((err, userPayments) => {
      if (err)
        return res.status(400).send({ error: err });
      else
        return res.send({ data: userPayments });
    });
  });

  app.post('/api/v1/payments', (req, res) => {
    UserPayment.createUserPayment(req.body, (err, userPayments) => {
      if (err)
        return res.status(400).send({ error: err });
      else
        return res.send({ data: userPayments });
    });
  });

  app.post('/api/v1/payments/:paymentId', (req, res) => {
    UserPayment.updateUserPayment(req.body, req.params.paymentId,
                                  (err, userPayments) => {
      if (err)
        return res.status(400).send({ error: err });
      else
        return res.send({ data: userPayments });
    });
  });


  // Serve static assets
  app.use(express.static(path.join(__ROOT_DIR, '/client/dist')));
  // Otherwise, serve index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(__ROOT_DIR, '/client/dist/index.html'));
  });
}
