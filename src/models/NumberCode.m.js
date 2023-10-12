const connectDB = require("../db/Connection");
const mongoose = require("mongoose");

const numberCodeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  newEmail: { type: String, unique: true },
  newPhone: { type: String, unique: true },
  type: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now, expires: "2m" },
});

const NumberCode = connectDB.model("NumberCode", numberCodeSchema);
module.exports = NumberCode;
