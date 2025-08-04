const Category = require("../models/category.model.js");
const mongoose = require("mongoose");
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    const response = {
      message: "Categories fetched successfully.",
      data: categories,
    };
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
const createCategory = async (req, res) => {
  const { categoryName, categoryDescription } = req.body;
  if (!categoryName) {
    return res.status(400).json({ message: "Category name is required." });
  }
  const existingCategory = await Category.findOne({ categoryName });
  if (existingCategory) {
    return res
      .status(400)
      .json({ message: "Category with this name already exists." });
  }
  if (!categoryDescription) {
    return res
      .status(400)
      .json({ message: "Category description is required." });
  }
  try {
    const newCategory = new Category({ categoryName, categoryDescription });
    await newCategory.save();
    const response = {
      message: "Category created successfully.",
      category: newCategory,
    };
    return res.status(201).json(response);
  } catch (error) {
    console.error("Error creating category:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
const getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }
    const response = {
      message: "Category fetched successfully.",
      category: category,
    };
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching category:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
const updateCategory = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Category ID is required." });
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid category ID." });
  }
  const { categoryName, categoryDescription } = req.body;
  const updateData = {};
  if (categoryName) {
    const existingCategory = await Category.findOne({
      categoryName: categoryName,
    });
    if (existingCategory && existingCategory._id.toString() !== id) {
      return res
        .status(400)
        .json({ message: "Category with this name already exists." });
    }
    updateData.categoryName = categoryName;
  }
  if (categoryDescription) {
    if (
      typeof categoryDescription !== "string" ||
      categoryDescription.trim() === ""
    ) {
      return res
        .status(400)
        .json({ message: "Category description must be a non-empty string." });
    }
    updateData.categoryDescription = categoryDescription;
  }
  if (Object.keys(updateData).length === 0) {
    return res
      .status(400)
      .json({ message: "At least one field must be provided for update." });
  }
  try {
    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found." });
    }
    const response = {
      message: "Category updated successfully.",
      category: updatedCategory,
    };
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error updating category:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
const deleteCategory = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ message: "Category ID is required." });
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid category ID." });
  }
  try {
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found." });
    }
    const response = {
      message: "Category deleted successfully.",
      category: deletedCategory,
    };
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
module.exports = {
  getAllCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
