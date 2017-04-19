const mongoose = require('mongoose');

// One-to-Many reference: http://mongoosejs.com/docs/populate.html
const userTableSchema = new mongoose.Schema({
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  table: {
    type: String
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
  collection: 'user_tables'
});

const UserTable = mongoose.model('UserTable', userTableSchema);

module.exports = UserTable;


