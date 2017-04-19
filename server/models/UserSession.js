const mongoose = require('mongoose');

const userSessionSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  startTime: {
    type: Date
  },
  paused: {
    type: Boolean
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
  }
}, {
  collection: 'users'
});

const UserSession = mongoose.model('UserSession', userSessionSchema);

module.exports = UserSession;

