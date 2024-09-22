const express = require("express");
const router = express.Router();
const { categoryModel, categoryValidate } = require("../models/category-model");
const { validateAdmin } = require("../middlewares/admin-middleware");

router.post("/create", validateAdmin, async function (req, res) {
  let category = await categoryModel.create({
    name: req.body.name,
  });
  console.log(category);

  // Deprecated res.redirect("back") ki jagah ye use karo
  res.redirect(req.get("Referrer") || "/");
});

module.exports = router;
