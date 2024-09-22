const mongoose = require("mongoose");
const Joi = require("joi");

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100,
    },
    category: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    stock: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    image: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

function productValidate(data) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    category: Joi.string().min(3).max(50).required(),
    stock: Joi.number().required(),
    price: Joi.number().min(0).required(),
    description: Joi.string().max(500),
    image: Joi.string(),
  });

  return schema.validate(data);
}

const productModel = mongoose.model("product", productSchema);

module.exports = { productModel, productValidate };
