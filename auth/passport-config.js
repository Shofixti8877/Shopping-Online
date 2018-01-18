const mongoose = require('mongoose');
const customerSchema = require('../models/customer-model');
const Customer = mongoose.model('customers', customerSchema);
//console.log(User);

const passportHandlers = {
  login: (username, password, done) => {
    Customer.findOne({ username: username}, (err, user) => {
      console.log(user);
      if (err) {return done(err); }
      // Return if user not found in database
      if (!user) {
        return done(null, false, {message: 'User not found'});
      }
      // Return if password is wrong
      if (!user.validPassword(password)) {
        return done(null, false, {message: 'Incorrect password'});
      }
      // If credentials are correct, return the user object
      return done(null, user);
    });
  },
  serializeUser: (user, done) => done(null, user),
  deserializeUser: (user, done) => done(null, user),
  validatedUser: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }

    return res.sendStatus(401);
  }
}

module.exports = passportHandlers;
