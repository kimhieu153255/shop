const mongoose = require("mongoose");
const connection = require("../db/Connection");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, default: "" },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: Number, default: 0 },
  role: { type: Number, default: 0 },
  DOB: { type: Date, default: Date.now },
  phone: { type: String, required: true },
  address: { type: String, default: "" },
  avatar: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = connection.model("User", userSchema);
module.exports = User;
