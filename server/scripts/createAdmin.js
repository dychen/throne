const mongoose = require('mongoose');
const prompt = require('prompt');
const Admin = require('../models/Admin.js');

const createAdmin = (adminData, callback) => {
  Admin.create({
    google: {
      id: null,
      token: null,
      email: adminData.email,
      name: null
    },
  }, (err, admin) => {
    if (err) {
      console.error(err);
      return callback(err);
    }
    return callback(null, admin);
  });
};

const getConsoleInputs = (callback) => {
  const schema = {
    properties: {
      email: { description: 'Admin email', required: true }
    }
  };

  prompt.start();
  prompt.get(schema, (err, result) => {
    if (err) {
      console.error(err);
      return callback(err);
    }
    else {
      console.log('Creating a new admin with the email ' + result.email);
      createAdmin(result, callback);
    }
  });
};

// Run
mongoose.connect(process.env.MONGO_URL);
console.log('Create a new user. Reminder: Use all lowercase letters and' +
            ' remove periods from the email.')
console.log('  For example, John.Doe@gmail.com => johndoe@gmail.com');
getConsoleInputs((err, newAdmin) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  else {
    console.log('Successfully created new admin ' + newAdmin.google.email);
    process.exit();
  }
});
