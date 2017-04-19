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
  paused: {
    type: Boolean,
    required: true,
    default: false
  },
  elapsedTime: {
    type: Number,
    required: true,
    default: 0
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

