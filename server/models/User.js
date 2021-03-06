const mongoose = require('mongoose');
const auth = require(__ROOT_DIR + '/server/auth.js');
const UserSession = require(__ROOT_DIR + '/server/models/UserSession.js');
const UserPayment = require(__ROOT_DIR + '/server/models/UserPayment.js');

const DEFAULT_PHOTO_URL = ('https://s3-us-west-1.amazonaws.com/throne-s3/'
                           + 'images/default-profile.png');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  phone: {
    type: String
  },
  photoUrl: {
    type: String,
    default: DEFAULT_PHOTO_URL
  },
  // Unused (added for Twilio/Authy integration)
  countryCode: {
    type: String,
    default: '1'
  },
  // For OAuth via Authy
  authyId: {
    type: String,
  },
  verified: {
    type: Boolean,
    required: true,
    default: false
  },
  // This value is dependent on the active value in the UserSession model.
  // It's true if there's one UserSession that's active and false otherwise.
  // Be sure to update this in tandem with the UserSession model.
  active: {
    type: Boolean,
    required: true,
    default: false
  },
  referrer: {
    type: String
  },
  createdAt: {
    type: Date,
    required: true,
    default: new Date()
  },
  deleted: {
    type: Boolean,
    required: true,
    default: false
  },
  sessions : [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserSession' }],
  payments : [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserPayment' }]
}, {
  collection: 'users'
});

/* Registration methods */

/* OLD/UNUSED: Registration process via Twilio/Authy */
/*
userSchema.statics.registerUser = (data, callback) => {
  if (data.firstName && data.lastName && data.email && data.phone) {
    User.findOneAndUpdate({
      email: data.email
    }, {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      countryCode: '1', // Default to US
      verified: false,
      active: false,
      referrer: data.referrer
    }, {
      upsert: true,
      new: true
    }, (err, user) => {
      if (err) {
        console.error(err);
        return callback(err);
      }
      else {
        auth.sendAuthyToken(user, callback);
      }
    });
  }
  else {
    callback('Mising required fields');
  }
};

userSchema.statics.verifyUser = function(userId, code, callback) {
  User.findOne({ _id: userId }, (err, user) => {
    if (err) {
      console.error(err);
      return callback(err);
    }
    return auth.verifyAuthyToken(user, code, callback);
  });
};
*/

userSchema.statics.registerUser = (data, callback) => {
  if (data.firstName && data.lastName && data.email && data.phone) {
    User.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      countryCode: '1', // Default to US
      referrer: data.referrer,
      verified: false,
      active: false,
      deleted: false,
      createdAt: new Date()
    }, (err, user) => {
      if (err) {
        console.error(err);
        return callback(err);
      }
      else {
        return callback(null, user);
      }
    });
  }
  else {
    const missingFields = [];
    if (!data.firstName)
      missingFields.push('First Name');
    if (!data.lastName)
      missingFields.push('Last Name');
    if (!data.email)
      missingFields.push('Email');
    if (!data.phone)
      missingFields.push('Phone Number');
    callback('Missing required fields: ' + missingFields.join(', '));
  }
};

/* Admin methods */

// For projections (SELECT field1, field2 FROM ...), see this:
// http://mongoosejs.com/docs/queries.html
userSchema.statics.getUserList = (callback) => {
  User.find(
    { deleted: false },
    'photoUrl firstName lastName email phone referrer createdAt verified active',
    (err, users) => {
      if (err) {
        console.error(err);
        return callback(err);
      }
      return callback(null, users);
    });
};

// For autocomplete
userSchema.statics.getUserAutocompleteList = (callback) => {
  User.find(
    { verified: true, deleted: false },
    'photoUrl firstName lastName email phone',
    (err, users) => {
    if (err) {
      console.error(err);
      return callback(err);
    }
    return callback(null, users);
  });
};

userSchema.statics.createUser = (data, callback) => {
  User.create({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    photoUrl: data.photoUrl,
    countryCode: '1', // Default to US
    verified: true,
    active: false,
    referrer: data.referrer,
    createdAt: new Date()
  }, (err, user) => {
    if (err) {
      console.error(err);
      return callback(err);
    }
    else {
      return User.getUserList(callback);
    }
  });
};

userSchema.statics.updateUser = (data, userId, callback) => {
  User.findOneAndUpdate({
    _id: userId
  }, {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    photoUrl: data.photoUrl,
    referrer: data.referrer
  }, {
    upsert: true,
    new: true
  }, (err, user) => {
    if (err) {
      console.error(err);
      return callback(err);
    }
    else {
      return User.getUserList(callback);
    }
  });
};

userSchema.statics.deleteUser = (userId, callback) => {
  User.findOneAndUpdate({
    _id: userId
  }, {
    deleted: true
  }, {
    upsert: false,
    new: true
  }, (err, user) => {
    if (err) {
      console.error(err);
      return callback(err);
    }
    else {
      return User.getUserList(callback);
    }
  });
};

userSchema.statics.verifyUser = (userId, callback) => {
  User.findOneAndUpdate({
    _id: userId
  }, {
    verified: true
  }, {
    upsert: false,
    new: true
  }, (err, user) => {
    if (err) {
      console.error(err);
      return callback(err);
    }
    else {
      return User.getUserList(callback);
    }
  });
};

/* Session methods */

userSchema.statics.startSession = (userId, callback) => {
  // 1. Make sure the user doesn't have active sessions
  UserSession.find({
    _user: userId,
    active: true
  }, (err, userSessions) => {
    if (err) {
      console.error(err);
      return callback(err);
    }
    else if (userSessions && userSessions.length > 0) {
      const errorMessage = `User ${userId} already has an active session`;
      console.error(errorMessage);
      return callback(errorMessage);
    }
    else {
      // 2. Create a new UserSession
      UserSession.create({
        _user: userId,
        startTime: new Date(),
        table: 'None',
        active: true
      }, (err, userSession) => {
        if (err) {
          console.error(err);
          return callback(err);
        }
        else {
          // 3. Find and update the User object
          User.findOneAndUpdate({
            _id: userId
          }, {
            active: true
          }, {
            upsert: false,
            new: true
          }, (err, user) => {
            if (err) {
              console.error(err);
              return callback(err);
            }
            else {
              // 4. Return with a new list of Users (this is called from the
              //    frontend user view).
              return User.getUserList(callback);
            }
          });
        }
      });
    }
  });
};

userSchema.statics.endSession = (sessionId, callback) => {
  // 1. End the session
  UserSession.findOneAndUpdate({
    _id: sessionId
  }, {
    endTime: new Date(),
    table: 'None',
    active: false
  }, {
    upsert: false,
    new: true
  }, (err, userSession) => {
    if (err) {
      console.error(err);
      return callback(err);
    }
    else {
      // 2. Find and update the User object
      User.findOneAndUpdate({
        _id: userSession._user
      }, {
        active: false
      }, {
        upsert: false,
        new: true
      }, (err, user) => {
        if (err) {
          console.error(err);
          return callback(err);
        }
        else {
          // 3. Create a new UserPayment
          UserPayment.create({
            _user: user._id,
            _session: userSession._id,
            date: new Date(),
            type: 'Hourly',
            amount: UserPayment.calculateAmount(userSession.startTime,
                                                userSession.endTime),
            paid: 0,
            notes: ''
          }, (err, userSession) => {
            if (err) {
              console.error(err);
              return callback(err);
            }
            else {
              // 4. Return with a new list of UserSessions (this is called from
              //    the frontend sessions view).
              return UserSession.getUserSessionList(callback);
            }
          });
        }
      });
    }
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
