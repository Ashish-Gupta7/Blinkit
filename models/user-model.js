const { timeStamp } = require("console");
const mongoose = require("mongoose");

const addressSchema = mongoose.Schema({
  state: String,
  zip: Number,
  city: String,
  address: String,
});

const userSchema = mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    phone: Number,
    addresses: [addressSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", userSchema);
