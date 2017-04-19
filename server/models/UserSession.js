const mongoose = require('mongoose');

// One-to-Many reference: http://mongoosejs.com/docs/populate.html
const userSessionSchema = new mongoose.Schema({
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  active: {
    type: Boolean,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: new Date()
  }
}, {
  collection: 'user_sessions'
});

const UserSession = mongoose.model('UserSession', userSessionSchema);

module.exports = UserSession;

