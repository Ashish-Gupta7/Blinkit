const express = require("express");
const router = express.Router();
require("dotenv").config();
const { adminModel } = require("../models/admin-model");
const brcypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validateAdmin = require("../middlewares/admin-middleware");

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

          let token = jwt.sign({ email: user.email }, process.env.JWT_KEY);
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
    let token = jwt.sign({ email: admin.email }, process.env.JWT_KEY);
    res.cookie("token", token);
    res.redirect("/admin/dashboard");
  }
});

router.get("/dashboard", validateAdmin, (req, res) => {
  res.render("admin_dashboard");
});

router.get("/logout", validateAdmin, (req, res) => {
  res.cookie("token", "");
  res.redirect("/admin/login");
});

module.exports = router;
