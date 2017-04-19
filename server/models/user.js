const mongoose = require('mongoose');
const auth = require(__ROOT_DIR + '/server/auth.js');

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
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
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
  active: {
    type: Boolean,
    required: true,
    default: true
  },
  creditCard: {
    type: String
  },
  referrer: {
    type: String
  },
  createdAt: {
    type: Date,
    required: true,
    default: new Date()
  }
}, {
  collection: 'users'
});

/* Registration methods */

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
      active: true,
      creditCard: data.creditCard,
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

/* Admin methods */

// For projections (SELECT field1, field2 FROM ...), see this:
// http://mongoosejs.com/docs/queries.html
userSchema.statics.getUserList = (callback) => {
  User.find(
    {},
    'firstName lastName email phone referrer createdAt verified active',
    (err, users) => {
    if (err) {
      console.error(err);
      return callback(err);
    }
    return callback(null, users);
  });
}

userSchema.statics.createUser = (data, callback) => {
  User.create({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    countryCode: '1', // Default to US
    verified: true,
    active: true,
    referrer: data.referrer,
    createdDate: new Date()
  }, (err, user) => {
    if (err) {
      console.error(err);
      return callback(err);
    }
    else {
      return User.getUserList(callback);
    }
  });
}

userSchema.statics.updateUser = (data, userId, callback) => {
  User.findOneAndUpdate({
    _id: userId
  }, {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    creditCard: data.creditCard,
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
}


const User = mongoose.model('User', userSchema);

module.exports = User;
