const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  customerID: String,
  creationDate: String,
});

module.exports = cartSchema;
