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
  creditCard: {
    type: String,
    required: true
  },
  referrer: {
    type: String,
    required: true
  }
}, {
  collection: 'users'
});

userSchema.statics.createUser = (data, callback) => {
  if (data.firstName && data.lastName && data.email && data.phone
      && data.creditCard && data.referrer) {
    User.findOneAndUpdate({
      email: data.email
    }, {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      countryCode: '1', // Default to US
      verified: false,
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

const User = mongoose.model('User', userSchema);

module.exports = User;
