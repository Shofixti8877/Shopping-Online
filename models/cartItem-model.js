const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
  name: String,
  productID: String,
  amount: Number,
  totalPrice: Number,
  cartID: String,
  imgPath: String
});

module.exports = cartItemSchema;
