const express = require("express");
const session = require("express-session");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const passport = require("./middlewares/Passport.w");
// setup session

const { store } = require("./db/MongoStore");

// app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, maxAge: 1000 * 10 },
    store,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));
// setup passport
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/error", (req, res) => {
  res.send("Error");
});

const userRouter = require("./routers/User.r");
app.use("/user", userRouter);
const storeRouter = require("./routers/Store.r");
app.use("/store", storeRouter);
const cartRouter = require("./routers/Cart.r");
app.use("/cart", cartRouter);
const productRouter = require("./routers/Product.r");
app.use("/product", productRouter);
const addressRouter = require("./routers/Address.r");
app.use("/address", addressRouter);
const orderRouter = require("./routers/Order.r");
app.use("/api/order", orderRouter);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Something went wrong");
});

app.get("/api/checkout/success", (req, res) => {
  res.send("success");
});

app.get("/api/checkout/canceled", (req, res) => {
  res.send("canceled");
});

app.listen(port, () => {
  console.log(`server is running in http://localhost:${port}`);
});
