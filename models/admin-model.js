const mongoose = require("mongoose");
const Joi = require("joi");

const adminSchema = mongoose.Schema(
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
      select: false,
    },
    roll: {
      type: String,
      required: true,
      enum: ["admin", "superadmin"],
    },
  },
  {
    timestamps: true,
  }
);

function adminValidate(data) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    roll: Joi.string().valid("admin", "superadmin").required(),
  });

  return schema.validate(data);
}

const adminModel = mongoose.model("admin", adminSchema);

module.exports = { adminModel, adminValidate };
