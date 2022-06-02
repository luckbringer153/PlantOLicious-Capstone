const express = require("express");
const authorizeUser = require("./utils");
const productsRouter = express.Router();
const {
  createProduct,
  getAllProducts,
  updateProduct,
  getProductById,
  destroyProduct,
} = require("../db/models/products");

module.exports = productsRouter;

productsRouter.get("/", async (req, res, next) => {
  try {
    const products = await getAllProducts();
    res.send(products);
  } catch (err) {
    next(err);
  }
});

productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const product = await getProductById(req.params.productId);
    res.send(product);
  } catch (err) {
    next(err);
  }
});

productsRouter.post("/", authorizeUser, async (req, res, next) => {
  try {
    console.log("This is the body:", req.body);
    const {
      title,
      price,
      description,
      category,
      inStockQuantity,
      photoLinkHref,
    } = req.body;

    const product = await createProduct({
      title,
      price,
      description,
      category,
      inStockQuantity,
      photoLinkHref,
    });

    res.send(product);
  } catch (err) {
    next(err);
  }
});

productsRouter.patch("/:productId", authorizeUser, async (req, res, next) => {
  try {
    const {
      title,
      price,
      description,
      category,
      inStockQuantity,
      photoLinkHref,
    } = req.body;

    const product = await updateProduct({
      id: req.params.productId,
      title,
      price,
      description,
      category,
      inStockQuantity,
      photoLinkHref,
    });

    res.send(product);
  } catch (err) {
    next(err);
  }
});

productsRouter.delete("/:productId", authorizeUser, async (req, res, next) => {
  try {
    const deleteProduct = await destroyProduct(req.params.productId);
    res.send(deleteProduct);
  } catch (err) {
    next(err);
  }
});
