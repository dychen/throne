const mongoose = require('mongoose');

// Logic duplicated in the frontend
const PRICE_PER_HOUR = 10;

// One-to-Many reference: http://mongoosejs.com/docs/populate.html
const userPaymentSchema = new mongoose.Schema({
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  _session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserSession'
  },
  date: {
    type: Date,
    required: true,
    default: new Date()
  },
  // Types: 'daily', 'monthly', 'annually', 'session'
  type: {
    type: String
  },
  amount: {
    type: Number,
    default: 0
  },
  paid: {
    type: Number,
    default: 0
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    required: true,
    default: new Date()
  }
}, {
  collection: 'user_payments'
});

/*
 * Price calculation: floor(Elapsed minutes * Price per hour / 60)
 */
userPaymentSchema.statics.calculateAmount = (startTime, endTime) => {
  return Math.floor((endTime.getTime() - startTime.getTime())
                    / (60 * 1000) * (PRICE_PER_HOUR / 60));
};

userPaymentSchema.statics.getUserPaymentList = (callback) => {
  UserPayment.find({}, '_user _session date type amount paid notes')
    .populate('_user', 'photoUrl firstName lastName')
    .populate('_session', 'startTime endTime')
    .exec((err, userPayments) => {
      if (err) {
        console.error(err);
        return callback(err);
      }
      // Flatten
      const flattenedUserPayments = userPayments.map((userPayment) => {
        return {
          _id: userPayment._id,
          _user: userPayment._user ? userPayment._user._id : undefined,
          photoUrl: userPayment._user ? userPayment._user.photoUrl : undefined,
          firstName: userPayment._user ? userPayment._user.firstName : undefined,
          lastName: userPayment._user ? userPayment._user.lastName : undefined,
          _session: userPayment._session ? userPayment._session._id : undefined,
          startTime: userPayment._session ? userPayment._session.startTime : undefined,
          endTime: userPayment._session ? userPayment._session.endTime : undefined,
          date: userPayment.date,
          type: userPayment.type,
          amount: userPayment.amount,
          paid: userPayment.paid,
          notes: userPayment.notes
        }
      });
      return callback(null, flattenedUserPayments);
  });
};

userPaymentSchema.statics.createUserPayment = (data, callback) => {
  UserPayment.create({
    _user: data._user,
    date: data.date,
    type: data.type,
    amount: data.amount,
    paid: data.paid,
    notes: data.notes,
    createdAt: new Date()
  }, (err, user) => {
    if (err) {
      console.error(err);
      return callback(err);
    }
    else {
      return UserPayment.getUserPaymentList(callback);
    }
  });
};

userPaymentSchema.statics.updateUserPayment = (data, paymentId, callback) => {
  UserPayment.findOneAndUpdate({
    _id: paymentId
  }, {
    _user: data._user,
    date: data.date,
    type: data.type,
    amount: data.amount,
    paid: data.paid,
    notes: data.notes
  }, {
    upsert: true,
    new: true
  }, (err, userPayment) => {
    if (err) {
      console.error(err);
      return callback(err);
    }
    else {
      return UserPayment.getUserPaymentList(callback);
    }
  });
};

userPaymentSchema.statics.deleteUserPayment = (paymentId, callback) => {
  UserPayment.findOneAndRemove({
    _id: paymentId
  }, (err, userPayment) => {
    if (err) {
      console.error(err);
      return callback(err);
    }
    else {
      return UserPayment.getUserPaymentList(callback);
    }
  });
};

const UserPayment = mongoose.model('UserPayment', userPaymentSchema);

module.exports = UserPayment;


