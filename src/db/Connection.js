const mongoose = require("mongoose");
require("dotenv").config();

const { MONGODB_URI, MONGODB_NAME } = process.env;

const connectDB = mongoose.createConnection(`${MONGODB_URI}/${MONGODB_NAME}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = connectDB;
