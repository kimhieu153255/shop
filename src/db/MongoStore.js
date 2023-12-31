const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
require("dotenv").config();

const { MONGODB_URI, MONGODB_SESSION } = process.env;
const store = new MongoDBStore({
  uri: `${MONGODB_URI}`,
  collection: MONGODB_SESSION,
});

module.exports = { store };
