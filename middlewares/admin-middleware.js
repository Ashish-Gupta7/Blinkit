let jwt = require("jsonwebtoken");
require("dotenv").config();

function validateAdmin(req, res, next) {
  try {
    let token = req.cookies.token;
    if (!token) return res.send("You need to login first");
    let data = jwt.verify(token, process.env.JWT_KEY);
    req.user = data;
    next();
  } catch (err) {
    res.send(err.message);
  }
}

function userIsLoggedin(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/users/login");
}

module.exports = { validateAdmin, userIsLoggedin };
