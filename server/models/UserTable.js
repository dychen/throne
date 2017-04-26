const mongoose = require('mongoose');

const RESERVED_NAMES = ['None'];

// One-to-Many reference: http://mongoosejs.com/docs/populate.html
const userTableSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    default: ''
  },
  createdAt: {
    type: Date,
    required: true,
    default: new Date()
  }
}, {
  collection: 'user_tables'
});

userTableSchema.statics.getUserTableList = (callback) => {
  UserTable.find({}, 'name', (err, userTables) => {
    if (err) {
      console.error(err);
      return callback(err);
    }
    return callback(null, userTables);
  });
};

userTableSchema.statics.createUserTable = (data, callback) => {
  if (RESERVED_NAMES.includes(data.name))
    return callback('Could not create table with reserved name ' + data.name);
  UserTable.create({
    name: data.name,
    createdAt: new Date()
  }, (err, user) => {
    if (err) {
      console.error(err);
      return callback(err);
    }
    else {
      return UserTable.getUserTableList(callback);
    }
  });
};

userTableSchema.statics.updateUserTable = (data, tableId, callback) => {
  if (RESERVED_NAMES.includes(data.name))
    return callback('Could not update table with reserved name ' + data.name);
  UserTable.findOneAndUpdate({
    _id: tableId
  }, {
    name: data.name
  }, {
    upsert: true,
    new: true
  }, (err, userTable) => {
    if (err) {
      console.error(err);
      return callback(err);
    }
    else {
      return UserTable.getUserTableList(callback);
    }
  });
};

userTableSchema.statics.deleteUserTable = (tableId, callback) => {
  UserTable.findOneAndRemove({
    _id: tableId
  }, (err, userTable) => {
    if (err) {
      console.error(err);
      return callback(err);
    }
    else {
      return UserTable.getUserTableList(callback);
    }
  });
};

const UserTable = mongoose.model('UserTable', userTableSchema);

module.exports = UserTable;


