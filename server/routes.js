const User = require(__ROOT_DIR + '/server/models/user.js');

module.exports = (app, express) => {
  app.post('/auth/v1/register', (req, res) => {
    User.createUser(req.body, (err, user) => {
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

  // Serve static assets
  app.use(express.static(__ROOT_DIR + '/client/dist'));
  // Otherwise, serve index.html
  app.get('*', (req, res) => {
    res.sendFile(__ROOT_DIR + '/client/dist/index.html');
  });
}
