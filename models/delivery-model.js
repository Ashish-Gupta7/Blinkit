const mongoose = require("mongoose");
const Joi = require("joi");

const deliverySchema = mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order",
      required: true,
    },
    deliveryBoy: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "shipped", "delivered", "canceled"],
    },
    trackingURL: {
      type: String,
    },
    estimatedDeliveryTime: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

function deliveryValidate(data) {
  const schema = Joi.object({
    order: Joi.string().length(24).required(),
    deliveryBoy: Joi.string().min(3).max(50).required(),
    status: Joi.string()
      .valid("pending", "shipped", "delivered", "canceled")
      .required(),
    trackingURL: Joi.string(),
    estimatedDeliveryTime: Joi.number().min(0).required(),
  });

  return schema.validate(data);
}

const deliveryModel = mongoose.model("delivery", deliverySchema);

module.exports = { deliveryModel, deliveryValidate };
