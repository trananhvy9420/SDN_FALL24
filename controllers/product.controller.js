const Product = require("../models/product.model");
const mongoose = require("mongoose");
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    const response = {
      message: "Products fetched successfully.",
      data: products,
    };
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
const createProduct = async (req, res) => {
  const { productName, productDescription, price, category, isFeature, image } =
    req.body;
  if (
    !productName ||
    !price ||
    !category ||
    !image ||
    !productDescription ||
    !isFeature
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }
  if (typeof isFeature !== "boolean") {
    return res.status(400).json({ message: "isFeature must be a boolean." });
  }
  if (typeof productName !== "string" || productName.trim() === "") {
    return res.status(400).json({ message: "Product name is required." });
  }
  if (
    typeof productDescription !== "string" ||
    productDescription.trim() === ""
  ) {
    return res
      .status(400)
      .json({ message: "Product description is required." });
  }
  if (typeof price !== "number" || price < 0 || price > 9999) {
    return res
      .status(400)
      .json({ message: "Price must be a number between 0 and 9999." });
  }
  if (!mongoose.Types.ObjectId.isValid(category)) {
    return res.status(400).json({ message: "Invalid category ID." });
  }
  try {
    const existingProduct = await Product.findOne({ productName });
    if (existingProduct) {
      return res
        .status(400)
        .json({ message: "Product with this name already exists." });
    }
    const newProduct = new Product({
      productName: productName,
      productDescription: productDescription,
      price: price,
      category: category,
      isFeature: isFeature,
      image: image,
    });
    await newProduct.save();
    const response = {
      message: "Product created successfully.",
      product: newProduct,
    };
    return res.status(201).json(response);
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
const getProductById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Product ID is required." });
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product ID." });
  }
  try {
    const product = await Product.findById(id).populate("category");
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    const response = {
      message: "Product fetched successfully.",
      product: product,
    };
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
const updateProduct = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Product ID is required." });
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product ID." });
  }
  const { productName, productDescription, price, category, isFeature, image } =
    req.body;
  const updateData = {};
  if (productName) {
    if (typeof productName !== "string" || productName.trim() === "") {
      return res
        .status(400)
        .json({ message: "Product name must be a non-empty string." });
    }
    const existingProduct = await Product.findOne({
      productName: productName,
      _id: { $ne: id },
    });
    if (existingProduct) {
      return res
        .status(400)
        .json({ message: "Product with this name already exists." });
    }
    updateData.productName = productName;
  }
  if (productDescription) {
    if (
      typeof productDescription !== "string" ||
      productDescription.trim() === ""
    ) {
      return res
        .status(400)
        .json({ message: "Product description must be a non-empty string." });
    }
    updateData.productDescription = productDescription;
  }
  if (price) {
    if (typeof price !== "number" || price < 0 || price > 9999) {
      return res
        .status(400)
        .json({ message: "Price must be a number between 0 and 9999." });
    }
    updateData.price = price;
  }
  if (category) {
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: "Invalid category ID." });
    }
    updateData.category = category;
  }
  if (isFeature) {
    if (typeof isFeature !== "boolean") {
      return res.status(400).json({ message: "isFeature must be a boolean." });
    }
    updateData.isFeature = isFeature;
  }
  if (image) {
    updateData.image = image;
  }
  if (Object.keys(updateData).length === 0) {
    return res
      .status(400)
      .json({ message: "At least one field must be provided for update." });
  }
  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }
    const response = {
      message: "Product updated successfully.",
      product: updatedProduct,
    };
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Product ID is required." });
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product ID." });
  }
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }
    const response = {
      message: "Product deleted successfully.",
      product: deletedProduct,
    };
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
