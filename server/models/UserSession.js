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
  table: {
    type: String,
    default: 'None'
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

userSessionSchema.statics.getUserSessionList = (callback) => {
  UserSession.find({}, '_user startTime endTime table active')
    .populate('_user', 'photoUrl firstName lastName')
    .exec((err, userSessions) => {
      if (err) {
        console.error(err);
        return callback(err);
      }
      // Flatten
      const flattenedUserSessions = userSessions.map((userSession) => {
        return {
          _id: userSession._id,
          _user: userSession._user ? userSession._user._id : undefined,
          photoUrl: userSession._user ? userSession._user.photoUrl : undefined,
          firstName: userSession._user ? userSession._user.firstName : undefined,
          lastName: userSession._user ? userSession._user.lastName : undefined,
          startTime: userSession.startTime,
          endTime: userSession.endTime,
          table: userSession.table,
          active: userSession.active
        }
      });
      return callback(null, flattenedUserSessions);
  });
};

// Limited version of sessions (just users and their tables) for table display
userSessionSchema.statics.getUserSessionTableList = (callback) => {
  UserSession.find({ active: true }, '_user table')
    .populate('_user', 'photoUrl firstName lastName')
    .exec((err, userSessions) => {
      if (err) {
        console.error(err);
        return callback(err);
      }
      // Flatten
      const flattenedUserSessions = userSessions.map((userSession) => {
        return {
          _id: userSession._id,
          _user: userSession._user ? userSession._user._id : undefined,
          photoUrl: userSession._user ? userSession._user.photoUrl : undefined,
          firstName: userSession._user ? userSession._user.firstName : undefined,
          lastName: userSession._user ? userSession._user.lastName : undefined,
          table: userSession.table
        }
      });
      return callback(null, flattenedUserSessions);
  });
};

userSessionSchema.statics.updateUserSessionTable = (data, sessionId, callback) => {
  UserSession.findOneAndUpdate({
    _id: sessionId
  }, {
    table: data.table
  }, {
    upsert: false,
    new: true
  }, (err, userSession) => {
    if (err) {
      console.error(err);
      return callback(err);
    }
    else {
      return UserSession.getUserSessionList(callback);
    }
  });
};

const UserSession = mongoose.model('UserSession', userSessionSchema);

module.exports = UserSession;

