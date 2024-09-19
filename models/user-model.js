const mongoose = require("mongoose");
const Joi = require("joi");

const addressSchema = mongoose.Schema({
  state: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  zip: {
    type: Number,
    required: true,
    min: 10000,
    max: 999999,
  },
  city: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  address: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100,
  },
});

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /.+\@.+\..+/,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    phone: {
      type: Number,
      required: true,
      match: /^[0-9]{10}$/,
    },
    addresses: {
      type: [addressSchema],
    },
  },
  {
    timestamps: true,
  }
);

function userValidate(data) {
  const addressSchema = Joi.object({
    state: Joi.string().min(2).max(50).required(),
    zip: Joi.number().integer().min(10000).max(999999).required(),
    city: Joi.string().min(2).max(50).required(),
    address: Joi.string().min(5).max(100).required(),
  });

  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().min(10).max(15).required(),
    addresses: Joi.array().items(addressSchema),
  });

  return schema.validate(data);
}

const userModel = mongoose.model("user", userSchema);

module.exports = { userModel, userValidate };
