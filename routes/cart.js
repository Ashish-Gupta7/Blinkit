const express = require("express");
const router = express.Router();
const {
  validateAdmin,
  userIsLoggedin,
} = require("../middlewares/admin-middleware");
const { categoryModel } = require("../models/category-model");
const { userModel } = require("../models/user-model");
const { productModel } = require("../models/product-model");
const { cartModel, cartValidate } = require("../models/cart-model");

router.get("/", userIsLoggedin, async (req, res) => {
  try {
    let cart = await cartModel
      .findOne({ user: req.session.passport.user })
      .populate("products");

    let cartDataStructure = {};

    cart.products.forEach((product) => {
      let key = product._id.toString();
      if (cartDataStructure[key]) {
        cartDataStructure[key].quantity += 1;
      } else {
        cartDataStructure[key] = {
          ...product._doc,
          quantity: 1,
        };
      }
    });
    let finalArray = Object.values(cartDataStructure);
    let finalPrice = cart.totalPrice + 34; // 30 for delivery charge and 4 for Handling charge
    res.render("cart", {
      cart: finalArray,
      finalPrice,
      userId: req.session.passport.user,
    });
  } catch (err) {
    res.send(err.message);
  }
});

router.get("/add/:id", userIsLoggedin, async (req, res) => {
  try {
    let cart = await cartModel.findOne({ user: req.session.passport.user });
    let product = await productModel.findOne({ _id: req.params.id });
    if (!cart) {
      cart = await cartModel.create({
        user: req.session.passport.user,
        products: [req.params.id],
        totalPrice: Number(product.price),
      });
    } else {
      cart.products.push(req.params.id);
      cart.totalPrice = Number(cart.totalPrice) + Number(product.price);
      await cart.save();
    }

    res.redirect("/products");
  } catch (err) {
    res.send(err.message);
  }
});

router.get("/remove/:id", userIsLoggedin, async (req, res) => {
  try {
    let cart = await cartModel.findOne({ user: req.session.passport.user });
    let product = await productModel.findOne({ _id: req.params.id });
    if (!cart) return res.send("Something went wrong while removing item.");
    let prodId = cart.products.indexOf(req.params.id);
    if (prodId !== -1) {
      cart.products.splice(prodId, 1);
      cart.totalPrice = Number(cart.totalPrice) - Number(product.price);
    } else res.send("Item is not in the cart");

    await cart.save();
    res.redirect("/cart");
  } catch (err) {
    res.send(err.message);
  }
});

module.exports = router;
