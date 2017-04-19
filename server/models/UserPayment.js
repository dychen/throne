const mongoose = require('mongoose');

// One-to-Many reference: http://mongoosejs.com/docs/populate.html
const userPaymentSchema = new mongoose.Schema({
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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
    type: Number
  },
  paid: {
    type: Number
  },
  createdAt: {
    type: Date,
    required: true,
    default: new Date()
  }
}, {
  collection: 'user_payments'
});

userPaymentSchema.statics.getUserPaymentList = (callback) => {
  UserPayment.find({}, '_user date type amount paid')
    .populate('_user', 'firstName lastName')
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
          firstName: userPayment._user ? userPayment._user.firstName : undefined,
          lastName: userPayment._user ? userPayment._user.lastName : undefined,
          date: userPayment.date,
          type: userPayment.type,
          amount: userPayment.amount,
          paid: userPayment.paid
        }
      });
      return callback(null, flattenedUserPayments);
  });
}

userPaymentSchema.statics.createUserPayment = (data, callback) => {
  UserPayment.create({
    _user: data._user,
    date: data.date,
    type: data.type,
    amount: data.amount,
    paid: data.paid,
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
}

userPaymentSchema.statics.updateUserPayment = (data, paymentId, callback) => {
  UserPayment.findOneAndUpdate({
    _id: paymentId
  }, {
    _user: data._user,
    date: data.date,
    type: data.type,
    amount: data.amount,
    paid: data.paid
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
}

const UserPayment = mongoose.model('UserPayment', userPaymentSchema);

module.exports = UserPayment;


