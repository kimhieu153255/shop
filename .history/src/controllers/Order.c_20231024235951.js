const OrderModel = require("../models/Order.m");
const UserModel = require("../models/User.m");
const ProductModel = require("../models/Product.m");
const InforProductModel = require("../models/InforProduct.m");
const CartController = require("./Cart.c");

exports.AddOrder = async (req, res, next) => {
  try {
    const { productOrderArr, userId } = req.body;
    console.log(req.body);
    if (!userId) return res.status(400).send("Missing userId!!!");
    if (!productOrderArr)
      return res.status(400).send("Missing ProductOrderArr!!!");
    const checkUserId = await UserModel.findById(userId);
    if (!checkUserId) return res.status(400).send("UserId is not exist!!!");

    const checkProduct = await ProductModel.find({
      _id: { $in: productOrderArr.map((item) => item.productId) },
    });
    if (checkProduct.length !== productOrderArr.length)
      return res.status(400).send("Product is not exist!!!");

    const newOrder = new OrderModel(req.body);

    // decrease quantity of product
    for (let i = 0; i < productOrderArr.length; i++) {
      const inforProduct = await InforProductModel.findOne({
        productId: productOrderArr[i].productId,
        color: productOrderArr[i].color,
        size: productOrderArr[i].size,
      });

      const check = await CartController.RemoveProductFromCart(
        productOrderArr,
        userId
      );
      if (!check) return res.status(400).send("Remove product from cart fail");

      if (inforProduct.quantity < productOrderArr[i].quantity)
        return res
          .status(400)
          .send(
            `Quantity of ${productOrderArr[i].name} is not enough!!! Please check again!!!`
          );
      inforProduct.quantity -= productOrderArr[i].quantity;
      await inforProduct.save();
    }
    await newOrder.save();
    res.status(200).send({ message: "Success!!!", data: newOrder });
  } catch (err) {
    next(err);
  }
};

exports.SaveOrder = async (req, res, next) => {
  try {
    console.log(req.body);
    //remove product from cart
    const { productOrderArr, userId } = req.body;
    if (!userId) return res.status(400).send("Missing userId!!!");
    const check = await CartController.RemoveProductFromCart(
      productOrderArr,
      userId
    );

    productOrderArr.forEach(async (item) => {
      const inforProduct = await InforProductModel.findOne({
        productId: item.productId,
        color: item.color,
        size: item.size,
      });
      if (inforProduct.quantity < item.quantity)
        return res
          .status(400)
          .send(
            `Quantity of ${item.name} is not enough!!! Please check again!!!`
          );
      inforProduct.quantity -= item.quantity;
      await inforProduct.save();
    });

    if (!check) return res.status(400).send("Remove product from cart fail");

    const newOrder = new OrderModel(req.body);
    await newOrder.save();
    res.status(200).send({ message: "Success!!!", data: newOrder });
  } catch (err) {
    next(err);
  }
};

exports.GetOrder = async (req, res, next) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).send("Missing userId!!!");
    const orders = await OrderModel.find({ userId }).populate("addressUserId");

    res.status(200).send({ message: "Success!!!", data: orders });
  } catch (err) {
    next(err);
  }
};

exports.RefundOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).send("Missing orderId!!!");
    const order = await OrderModel.findById(orderId);
    if (!order) return res.status(400).send("Order is not exist!!!");
    if (order.status !== "pending")
      return res.status(400).send("Order is already completed!!!");
    order.status = "refund";
    await order.save();
    res.status(200).send({ message: "Success!!!" });
  } catch (err) {
    next(err);
  }
};
