const mongoose = require("mongoose");
const Joi = require("joi");

const paymentSchema = mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    method: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

function paymentValidate(data) {
  const schema = Joi.object({
    order: Joi.string().length(24).required(),
    amount: Joi.number().min(0).required(),
    method: Joi.string().required(),
    status: Joi.string().required(),
    transactionId: Joi.string().unique().required(),
  });

  return schema.validate(data);
}

const paymentModel = mongoose.model("payment", paymentSchema);

module.exports = { paymentModel, paymentValidate };
