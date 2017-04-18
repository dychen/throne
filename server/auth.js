const authy = require('authy')(process.env.AUTHY_API_KEY);

const sendAuthyToken = (user, callback) => {
  // Existing user: Resend token
  if (user && user.authyId) {
    authy.request_sms(user.authyId, true, (err, response) => {
      if (err) {
        console.error(err);
        return callback(err);
      }
      return callback(null, user);
    });
  }
  // New user: Step 1: Retrieve Authy id
  else {
    authy.register_user(user.email, user.phone, user.countryCode,
                        (err, res) => {
      if (err || !res.user) {
        console.error(err);
        return callback(err);
      }
      else {
        const authyId = res.user.id;
        user.update({ authyId: authyId }, {}, (err, results) => {
          if (err) {
            console.error(err);
            return callback(err);
          }
          else {
            // Step 2: Send SMS token
            authy.request_sms(authyId, true, (err, response) => {
              if (err) {
                console.error(err);
                return callback(err);
              }
              // WARNING: This returns the original user document, not the
              //          updated document.
              return callback(null, user);
            });
          }
        });
      }
    });
  }
};

const verifyAuthyToken = (user, code, callback) => {
  authy.verify(user.authyId, code, (err, res) => {
    if (err) {
      console.error(err);
      return callback(err);
    }
    else {
      user.update({ verified: true }, {}, (err, results) => {
        // WARNING: This returns the original user document, not the updated
        //          document.
        callback(null, user);
      });
    }
  });
};

module.exports = {
  sendAuthyToken: sendAuthyToken,
  verifyAuthyToken: verifyAuthyToken
};
