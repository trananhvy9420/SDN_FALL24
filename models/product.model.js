const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productSchema = new Schema(
  {
    productName: {
      type: String,
      required: true,
      unique: true,
    },
    productDescription: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      max: 9999,
    },
    isFeature: {
      type: Boolean,
      default: false,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
