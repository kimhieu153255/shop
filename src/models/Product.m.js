const mongoose = require("mongoose");
const connection = require("../db/Connection");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },

  description: { type: String, default: null },
  category: { type: String, default: null },
  rate: { type: Number, default: 0 },
  numberRate: { type: Number, default: 0 },
  soldCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Product = connection.model("Product", productSchema);
module.exports = Product;
