const authy = require('authy')(process.env.AUTHY_API_KEY);
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const Admin = require(__ROOT_DIR + '/server/models/Admin.js');

const googleOAuth = (passport) => {
  passport.serializeUser(function(admin, done) {
    done(null, admin.id);
  });

  passport.deserializeUser(function(adminId, done) {
    Admin.findById(adminId, function(err, admin) {
      done(err, admin);
    });
  });


  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_OAUTH_CALLBACK_URL
  }, (token, refreshToken, profile, done) => {
    // Wrap callback to ensure async
    process.nextTick(() => {
      Admin.findOne({ 'google.id': profile.id }, (err, admin) => {
        const email = profile.emails[0].value;
        if (err) return done(err);
        // If the admin has already logged in before
        else if (admin) {
          console.log('Logging in:', email);
          return done(null, admin);
        }
        else {
          Admin.findOne({ 'google.email': email }, (err, admin) => {
            if (err) {
              return done(err);
            }
            // If the admin has access but hasn't logged in yet
            else if (admin) {
              console.log('Logging in with new session:', email);
              admin.google.id = profile.id;
              admin.google.token = token;
              admin.google.name = profile.displayName;
              admin.save((err) => {
                if (err) throw err;
                return done(null, admin);
              });
            }
            // If the admin doesn't have access (hasn't been created)
            else {
              console.log('User does not exist in database ', email);
              /* Don't create a new user */
              return done(null, false, { message: 'Could not log in' });
            }
          });
        }
      });
    });
  }));
};

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
  googleOAuth: googleOAuth,
  sendAuthyToken: sendAuthyToken,
  verifyAuthyToken: verifyAuthyToken
};
