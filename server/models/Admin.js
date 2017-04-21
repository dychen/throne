const mongoose = require('mongoose');

const normalizeEmail = (email) => {
  return email.toLowerCase();
}

const adminSchema = new mongoose.Schema({
  google: {
    id: String,
    token: String,
    email: { type: String, required: true, unique: true, set: normalizeEmail },
    name: String
  }
}, {
  collection: 'admins'
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
