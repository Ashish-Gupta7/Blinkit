const express = require("express");
const router = express.Router();
const { paymentModel } = require("../models/payment-model");
const { orderModel } = require("../models/order-model");
const { cartModel } = require("../models/cart-model");

router.get(
  "/:userId/:orderId/:paymentId/:signature",
  async function (req, res) {
    let paymentDetails = await paymentModel.findOne({
      orderId: req.params.orderId,
    });
    if (!paymentDetails) return res.send("Sorry, Payment not completed");
    if (
      req.params.signature === paymentDetails.signature &&
      req.params.paymentId === paymentDetails.paymentId
    ) {
      let cart = await cartModel.findOne({ user: req.params.userId });

      await orderModel.create({
        orderId: req.params.orderId,
        user: req.params.userId,
        products: cart.products,
        totalPrice: cart.totalPrice,
        status: "processing",
        payment: paymentDetails._id,
      });

      res.redirect(`/map/${req.params.orderId}`);
    } else {
      res.send("invalid payment");
    }
  }
);

router.post("/address/:orderId", async function (req, res) {
  let order = await orderModel.findOne({ orderId: req.params.orderId });
  if (!order) return res.send("Sorry, this order does not exist!");
  if (!req.body.address) return res.send("You must provide an address");
  order.address = req.body.address;
  order.save();
  res.redirect("/");
});

module.exports = router;
