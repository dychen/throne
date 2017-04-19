const mongoose = require('mongoose');

const userPaymentSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  date: {
    type: Date,
    required: true
  },
  // Types: 'daily', 'monthly', 'annually', 'session'
  type: {
    type: String
  },
  amount: {
    type: Number,
    required: true
  },
  paid: {
    type: Number,
    required: true
  }
}, {
  collection: 'users'
});

const UserPayment = mongoose.model('UserSession', userPaymentSchema);

module.exports = UserPayment;


