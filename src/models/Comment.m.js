const mongoose = require("mongoose");
const connection = require("../db/Connection");

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  store: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
  content: { type: String, required: true },
  rating: { type: Number, required: true },
  image: { type: Array[String], default: "" },
});

const Comment = connection.model("Comment", commentSchema);
module.exports = Comment;
