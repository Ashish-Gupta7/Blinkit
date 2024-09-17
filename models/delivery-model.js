const mongoose = require("mongoose");

const deliverySchema = mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "order",
  },
  deliveryBoy: String,
  status: String,
  trackingURL: String,
  estimatedDeliveryTime: Number,
});

module.exports = mongoose.model("delivery", deliverySchema);
