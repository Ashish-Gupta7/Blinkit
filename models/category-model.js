const mongoose = require("mongoose");
const Joi = require("joi");

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

function categoryValidate(data) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).unique().required(),
  });

  return schema.validate(data);
}

const categoryModel = mongoose.model("category", categorySchema);

module.exports = { categoryModel, categoryValidate };
