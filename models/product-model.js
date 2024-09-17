const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: String,
  category: String,
  stock: Boolean,
  price: Number,
  description: String,
  image: String,
});

module.exports = mongoose.model("product", productSchema);
