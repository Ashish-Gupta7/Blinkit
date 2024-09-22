const express = require("express");
const router = express.Router();
const { userModel, userValidate } = require("../models/user-model");

router.get("/login", function (req, res) {
  res.render("user_login");
});

router.get("/profile", (req, res) => {
  res.send("djshnd");
});

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) return next(err);
      res.clearCookie("connect.sid");
      res.redirect("/users/login");
    });
  });
});

module.exports = router;
