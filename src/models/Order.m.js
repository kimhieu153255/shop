const connection = require("../db/Connection");
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  productOrderArr: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: { type: String, default: null },
      quantity: { type: Number, default: 1 },
      color: { type: String, default: null },
      price: { type: Number, default: 0 },
      imgSrc: { type: String, default: null },
      size: { type: String, default: null },
    },
  ],
  totalPrice: { type: Number, default: 0 },
  sessionId: { type: String, default: null },
  state: { type: String, default: "pending" },
  addressUserId: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
  createdAt: { type: Date, default: Date.now },
});

const Order = connection.model("Order", orderSchema);
module.exports = Order;
