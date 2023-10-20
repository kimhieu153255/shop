const storeModel = require("../models/Store.m.js");
const userModel = require("../models/User.m.js");
const ProductModel = require("../models/Product.m.js");

exports.CreateStore = async (req, res, next) => {
  try {
    const { name, address, userId } = req.body;
    console.log(name, address, userId);
    if (!name || !address || !userId)
      return res.status(400).send("Missing required fields");

    let check = await storeModel.findOne({ userId });
    if (check) return res.status(400).send("User haven a store");

    check = await storeModel.findOne({ name });
    if (check) return res.status(400).send("Store's name is already exist");

    const store = new storeModel({
      name,
      address,
      userId,
    });
    await store.save();

    let user = await userModel.findOne({ _id: userId });
    user.role = 1;
    await user.save();
    res.status(200).send({
      message: "Success!!!",
      data: { ...store, boss: user.username },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.GetStore = async (req, res, next) => {
  console.log("vào");
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).send("Missing required fields");

    const store = await storeModel.findOne({ userId });
    if (!store) return res.status(400).send("User don't have any store");
    res.status(200).send({ message: "Success!!!", data: store });
  } catch (err) {
    next(err);
  }
};

exports.GetAllCategory = async (req, res, next) => {
  try {
    const { storeId } = req.query;
    if (!storeId) return res.status(400).send("Missing required fields");
    const store = await storeModel.findById(storeId);
    if (!store) return res.status(400).send("Store is not exist");
    const categories = await ProductModel.find({ storeId }).distinct(
      "category"
    );
    res.status(200).send({
      message: "Success!!!",
      data: { storeId, name: store._id, categories },
    });
  } catch (err) {
    next(err);
  }
};
