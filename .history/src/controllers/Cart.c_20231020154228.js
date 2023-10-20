const CartModel = require("../models/Cart.m.js");
const StoreModel = require("../models/Store.m.js");
const ProductModel = require("../models/Product.m.js");
const InforProduct = require("../models/InforProduct.m.js");
const InforProductModel = require("../models/InforProduct.m.js");

exports.AddProductToCart = async (req, res, next) => {
  try {
    const { userId, productId } = req.body;
    console.log(userId, productId);
    if (!userId || !productId)
      return res.status(400).send("Missing some field");
    const inforProduct = await InforProductModel.findOne({ productId });
    if (inforProduct.quantity <= 0)
      return res.status(400).send("Product is out of stock");
    const { color, size } = inforProduct;
    const isExists = await CartModel.findOne({
      userId,
      productId,
    });
    inforProduct.quantity -= 1;
    if (isExists) {
      const tempCart = await CartModel.updateOne(
        { userId, productId },
        { $inc: { quantity: 1 } }
      );
      await inforProduct.save();
      return res.status(200).send({ message: "Success!!!", data: tempCart });
    }
    await inforProduct.save();
    const cart = await CartModel({ userId, productId, color, size });
    await cart.save();
    return res.status(200).send({ message: "Success!!!", data: cart });
  } catch (err) {
    next(err);
  }
};

exports.GetCartByUserId = async (req, res, next) => {
  try {
    const { userId } = req.query;
    console.log("userId", userId);
    if (!userId) return res.status(400).send("userId is not exist");

    const ListCart = [];
    const cart = await CartModel.find({ userId });

    for (let i = 0; i < cart.length; i++) {
      const product = await ProductModel.findOne({ _id: cart[i].productId });
      if (!product) return res.status(400).send("Product is not exist");

      const inforProduct = await InforProduct.findOne({
        productId: product._id,
      });

      if (!inforProduct)
        return res.status(400).send("InforProduct is not exist");

      // if (inforProduct.quantity < cart[i].quantity)
      //   return res.status(400).send("Product is out of stock");

      const store = await StoreModel.findOne({ _id: product.storeId });
      if (!store) return res.status(400).send("Store is not exist");

      const index = ListCart.findIndex((item) => item.store === store.name);
      if (index === -1) {
        ListCart.push({
          store: store.name,
          id: store._id,
          checked: false,
          items: [
            {
              id: product._id,
              name: product.name,
              price: inforProduct.price,
              img: inforProduct.imgSrc,
              color: cart[i].color,
              size: cart[i].size,
              // colorChoosen: cart[i].color,
              // sizeChoosen: cart[i].size,
              quantity: cart[i].quantity,
              createdAt: cart[i].createdAt,
              numberPro: inforProduct.quantity,
              check: false,
            },
          ],
        });
      } else {
        ListCart[index].items.push({
          id: product._id,
          name: product.name,
          price: inforProduct.price,
          img: inforProduct.imgSrc,
          color: cart[i].color,
          size: cart[i].size,
          numberPro: inforProduct.quantity,
          quantity: cart[i].quantity,
          createdAt: cart[i].createdAt,
          check: false,
        });
      }
    }
    if (ListCart.length === 0)
      return res.status(200).send({ message: "Empty!!!", ListCart: [] });
    res.status(200).send({ message: "Success!!!", ListCart });
  } catch (err) {
    next(err);
  }
};

exports.UpdateCart = async (req, res, next) => {
  try {
    const { userId, productId, quantity, color, size } = req.body;
    if (!userId || !productId)
      return res.status(400).send("Missing some field");
    const cart = await CartModel.findOne({ userId, productId });
    if (!cart) return res.status(400).send("Cart is not exist");
    const inforProduct = await InforProduct.findOne({
      productId,
      color,
      size,
    });
    color && (cart.color = color);
    size && (cart.size = size);
    quantity && (cart.quantity += quantity);
    quantity && (inforProduct.quantity -= quantity);
    await inforProduct.save();
    await cart.save();
    res.status(200).send({ message: "Success!!!", data: cart });
  } catch (err) {
    next(err);
  }
};

exports.DeleteCart = async (req, res, next) => {
  try {
    const { userId, productId, color, size } = req.body;
    console.log(userId, productId, color, size);
    if (!userId || !productId)
      return res.status(400).send("Missing some field");
    const cart = await CartModel.findOne({ userId, productId, color, size });
    if (!cart) return res.status(400).send("Cart is not exist");
    const inforProduct = await InforProduct.findOne({
      productId,
      color,
      size,
    });
    inforProduct.quantity += cart.quantity;
    await inforProduct.save();
    await cart.deleteOne();
    res.status(200).send({ message: "Success!!!" });
  } catch (err) {
    next(err);
  }
};

exports.AddInforProductToCart = async (req, res, next) => {
  try {
    const { userId, productId, color, size, quantity } = req.body;
    console.log(userId, productId, color, size, quantity);
    if (!userId || !productId || !color || !size || !quantity)
      return res.status(400).send("Missing some field");
    const tempCart = await CartModel.findOne({
      userId,
      productId,
    });
    if (tempCart)
      return res.status(400).send("Product is already exist in cart");
    const inforProduct = await InforProduct.findOne({
      productId,
      color,
      size,
    });
    if (!inforProduct) return res.status(400).send("InforProduct is not exist");
    if (inforProduct.quantity < quantity)
      return res.status(400).send("Product is out of stock");
    inforProduct.quantity -= quantity;
    await inforProduct.save();
    const cart = new CartModel({ userId, productId, color, size, quantity });
    await cart.save();
    res.status(200).send({ message: "Success!!!", data: cart });
  } catch (err) {
    next(err);
  }
};

//
exports.RemoveProductFromCart = async (productOrderArr, userId) => {
  try {
    productOrderArr.forEach(async (item) => {
      const cart = await CartModel.findOne({
        userId,
        productId: item.productId,
        color: item.color,
        size: item.size,
      });
      if (!cart) return false;
      await cart.deleteOne();
    });
    return true;
  } catch (err) {
    return false;
  }
};
