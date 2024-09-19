const mongoose = require("mongoose");
const Joi = require("joi");

const cartSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true,
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

function cartValidate(data) {
  const schema = Joi.object({
    user: Joi.string().length(24).required(),
    products: Joi.array().items(Joi.string().length(24)).required(),
    totalPrice: Joi.number().min(0).required(),
  });

  return schema.validate(data);
}

const cartModel = mongoose.model("cart", cartSchema);

module.exports = { cartModel, cartValidate };
