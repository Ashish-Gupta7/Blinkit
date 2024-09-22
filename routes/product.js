const express = require("express");
const router = express.Router();
const { productModel, productValidate } = require("../models/product-model");
const { categoryModel } = require("../models/category-model");
const upload = require("../config/multer-config");
const { validateAdmin } = require("../middlewares/admin-middleware");

router.get("/", async function (req, res) {
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

  let rnproducts = await productModel.aggregate([{ $sample: { size: 3 } }]);

  const resultObject = result.reduce((acc, item) => {
    acc[item.category] = item.products;
    return acc;
  }, {});

  res.render("index", { products: resultObject, rnproducts });
});

router.get("/delete/:id", validateAdmin, async function (req, res) {
  if (req.user.admin) {
    let prod = await productModel.findOneAndDelete({ _id: req.params.id });
    return res.redirect("/admin/products");
  } else {
    res.send("You are not allowed to delete the product.");
  }
});

router.post("/delete", validateAdmin, async function (req, res) {
  if (req.user.admin) {
    let prod = await productModel.findOneAndDelete({
      _id: req.body.product_id,
    });
    return res.redirect(req.get("Referrer") || "/");
  } else {
    res.send("You are not allowed to delete the product.");
  }
});

router.post("/", upload.single("image"), async function (req, res) {
  let { name, price, category, stock, description, image } = req.body;
  let { error } = productValidate({
    name,
    price,
    category,
    stock,
    description,
    image,
  });
  if (error) return res.send(error.message);

  let isCategory = await categoryModel.findOne({ name: category });

  if (!isCategory) {
    await categoryModel.create({ name: category });
  }

  let product = await productModel.create({
    name,
    price,
    category,
    stock,
    description,
    image: req.file.buffer,
  });
  res.redirect("/admin/dashboard");
});

module.exports = router;
