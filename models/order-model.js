const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  customerID: String,
  cartID: String,
  finalPrice: Number,
  city: String,
  streetAddress: String,
  sendDate: String,
  creationDate: String,
  fourDigits: Number
});

module.exports = orderSchema;
