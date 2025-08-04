const express = require("express");
const categoryRouter = express.Router();
const categoryController = require("../controllers/category.controller.js");
const { protectedRoute } = require("../middlewares/auth.middleware.js");

categoryRouter
  .route("/")
  .get(protectedRoute, categoryController.getAllCategories)
  .post(protectedRoute, categoryController.createCategory);

categoryRouter
  .route("/:id")
  .get(protectedRoute, categoryController.getCategoryById)
  .patch(protectedRoute, categoryController.updateCategory)
  .delete(protectedRoute, categoryController.deleteCategory);
module.exports = categoryRouter;
