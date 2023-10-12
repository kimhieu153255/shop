const mongoose = require("mongoose");
const connection = require("../db/Connection");

const inforProductSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: { type: Number, default: 1 },
  color: { type: String, default: null },
  size: { type: String, default: null },
  imgSrc: { type: String, default: null },
  price: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const InforProduct = connection.model("InforProduct", inforProductSchema);
module.exports = InforProduct;
