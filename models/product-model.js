const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: String,
  categoryID: String,
  price: Number,
  imgPath: String
});

module.exports = productSchema;
