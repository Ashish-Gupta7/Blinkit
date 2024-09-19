const mongoose = require("mongoose");
const Joi = require("joi");

const orderSchema = mongoose.Schema(
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
    address: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 100,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "processed", "shipped", "delivered", "canceled"],
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "payment",
      required: true,
    },
    delivery: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "delivery",
    },
  },
  {
    timestamps: true,
  }
);

function orderValidate(data) {
  const schema = Joi.object({
    user: Joi.string().length(24).required(),
    products: Joi.array().items(Joi.string().length(24)).required(),
    totalPrice: Joi.number().min(0).required(),
    address: Joi.string().min(5).max(100).required(),
    status: Joi.string()
      .valid("pending", "processed", "shipped", "delivered", "canceled")
      .required(),
    payment: Joi.string().length(24).required(),
    delivery: Joi.string().length(24),
  });

  return schema.validate(data);
}

const OrderModel = mongoose.model("order", orderSchema);

module.exports = { OrderModel, orderValidate };
