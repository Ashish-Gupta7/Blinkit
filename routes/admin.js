const express = require("express");
const router = express.Router();
require("dotenv").config();
const { adminModel } = require("../models/admin-model");
const brcypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validateAdmin } = require("../middlewares/admin-middleware");
const { productModel } = require("../models/product-model");
const { categoryModel } = require("../models/category-model");

if (
  typeof process.env.NODE_ENV !== undefined &&
  process.env.NODE_ENV === "DEVELOPMENT"
) {
  router.get("/create", function (req, res) {
    try {
      brcypt.genSalt(10, (err, salt) => {
        brcypt.hash("adminpassword", salt, async (err, hash) => {
          let user = await new adminModel({
            name: "Ashish",
            email: "admin@admin.com",
            password: hash,
            role: "admin",
          });

          await user.save();

          let token = jwt.sign(
            { email: user.email, admin: true },
            process.env.JWT_KEY
          );
          res.cookie("token", token);
          res.send(user);
        });
      });
    } catch (err) {
      res.send(err.message);
    }
  });
}

router.get("/login", (req, res) => {
  res.render("admin_login");
});

router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  let admin = await adminModel.findOne({ email }).select("+password");
  if (!admin) return res.send("this admin is not available");

  let valid = await brcypt.compare(password, admin.password);
  if (valid) {
    let token = jwt.sign(
      { email: admin.email, admin: true },
      process.env.JWT_KEY
    );
    res.cookie("token", token);
    res.redirect("/admin/dashboard");
  }
});

router.get("/dashboard", validateAdmin, async (req, res) => {
  let prodCount = await productModel.countDocuments();
  let categCount = await categoryModel.countDocuments();
  res.render("admin_dashboard", { prodCount, categCount });
});

router.get("/products", validateAdmin, async (req, res) => {
  let products = await productModel.find();
  const result = await productModel.aggregate([
    {
      $group: {
        _id: "$category",
        products: {
          $push: "$$ROOT",
        },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        products: { $slice: ["$products", 10] },
      },
    },
  ]);

  const resultObject = result.reduce((acc, item) => {
    acc[item.category] = item.products;
    return acc;
  }, {});

  res.render("admin_products", { products: resultObject });
});

router.get("/logout", validateAdmin, (req, res) => {
  res.cookie("token", "");
  res.redirect("/admin/login");
});

module.exports = router;
