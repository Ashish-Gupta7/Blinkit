const mongoose = require("mongoose");
const Joi = require("joi");

const orderSchema = mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
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
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "processing", "shipped", "delivered", "canceled"],
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
    user: Joi.string().required(),
    products: Joi.array().items(Joi.string()).required(),
    totalPrice: Joi.number().min(0).required(),
    address: Joi.string(),
    status: Joi.string()
      .valid("pending", "processing", "shipped", "delivered", "canceled")
      .required(),
    payment: Joi.string().required(),
    delivery: Joi.string(),
  });

  return schema.validate(data);
}

const orderModel = mongoose.model("order", orderSchema);

module.exports = { orderModel, orderValidate };
