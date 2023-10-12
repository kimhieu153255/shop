const mongoose = require("mongoose");
const connection = require("../db/Connection");

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createAt: { type: Date, default: Date.now },
});

const Store = connection.model("Store", storeSchema);
module.exports = Store;
