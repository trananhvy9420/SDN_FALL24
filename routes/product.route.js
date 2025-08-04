const express = require("express");
const productRouter = express.Router();
const productController = require("../controllers/product.controller.js");
const { protectedRoute } = require("../middlewares/auth.middleware.js");

productRouter
  .route("/")
  .get(protectedRoute, productController.getAllProducts)
  .post(protectedRoute, productController.createProduct);

productRouter
  .route("/:id")
  .get(protectedRoute, productController.getProductById)
  .patch(protectedRoute, productController.updateProduct)
  .delete(protectedRoute, productController.deleteProduct);
module.exports = productRouter;
