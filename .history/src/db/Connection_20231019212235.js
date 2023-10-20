const mongoose = require("mongoose");
require("dotenv").config();

const { MONGODB_URI } = process.env;

const connectDB = mongoose.createConnection(`${MONGODB_URI}`, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
});

module.exports = connectDB;
