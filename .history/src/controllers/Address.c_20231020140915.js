const AddressModel = require("../models/Address.m");
const UserModel = require("../models/User.m");

exports.AddAddress = async (req, res, next) => {
  try {
    const address = req.body;
    const { userId } = req.query;
    console.log(address, userId);
    if (!userId) return res.status(400).send("Missing userId!!!");
    const checkUserId = await UserModel.findById(userId);
    console.log(checkUserId);
    console.log("vào");
    if (!checkUserId) return res.status(400).send("UserId is not exist!!!");

    if (
      !address.name ||
      !address.phone ||
      !address.province ||
      !address.district ||
      !address.ward ||
      !address.specific
    )
      return res.status(400).send("Missing some field");

    const addresses = await AddressModel.find({
      userId,
      province: address.province,
      district: address.district,
      ward: address.ward,
      specific: address.specific,
    });
    if (addresses.length > 0)
      return res.status(400).send("Address is already exist");
    const defaultAddress = await AddressModel.findOne({
      userId,
      isDefault: true,
    });
    const newAddress = new AddressModel({
      userId,
      name: address.name,
      phone: address.phone,
      province: address.province,
      district: address.district,
      ward: address.ward,
      specific: address.specific,
      isDefault: defaultAddress ? false : true,
    });
    await newAddress.save();
    return res.status(200).send({ message: "Success!!!", data: newAddress });
  } catch (err) {
    next(err);
  }
};

exports.GetAddresses = async (req, res, next) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).send("Missing userId!!!");
    const checkUserId = await UserModel.findById(userId);
    if (!checkUserId) return res.status(400).send("UserId is not exist!!!");
    const addresses = await AddressModel.find({ userId });
    res.status(200).send({ message: "Success!!!", data: addresses });
  } catch (err) {
    next(err);
  }
};

exports.GetDefaultAddress = async (req, res, next) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).send("Missing userId!!!");

    const checkUserId = await UserModel.findById(userId);
    if (!checkUserId) return res.status(400).send("UserId is not exist!!!");

    const defaultAddress = await AddressModel.findOne({
      userId,
      isDefault: true,
    });

    res.status(200).send({ message: "Success!!!", data: defaultAddress });
  } catch (err) {
    next(err);
  }
};

exports.UpdateAddress = async (req, res, next) => {
  try {
    const { userId, addressId } = req.query;
    if (!userId || !addressId)
      res.status(400).send("Missing userId or addressId!!!");

    const checkUserId = await UserModel.findById(userId);
    if (!checkUserId) return res.status(400).send("UserId is not exist!!!");

    const checkAddressId = await AddressModel.findById(addressId);
    if (!checkAddressId)
      return res.status(400).send("AddressId is not exist!!!");

    const address = req.body;
    if (
      !address.name ||
      !address.phone ||
      !address.province ||
      !address.district ||
      !address.ward ||
      !address.specific
    )
      return res.status(400).send("Missing some field");
    const updateAddress = await AddressModel.findOneAndUpdate(
      { _id: addressId, userId },
      {
        name: address.name,
        phone: address.phone,
        province: address.province,
        district: address.district,
        ward: address.ward,
        specific: address.specific,
        isDefault: address.isDefault,
      },
      { new: true }
    );
    res.status(200).send({ message: "Success!!!", data: updateAddress });
  } catch (err) {
    next(err);
  }
};

exports.SetDefaultAddress = async (req, res, next) => {
  try {
    const { addressId } = req.query;
    if (!addressId) res.status(400).send("Missing addressId!!!");

    const checkAddressId = await AddressModel.findById(addressId);
    if (!checkAddressId)
      return res.status(400).send("AddressId is not exist!!!");

    if (checkAddressId.isDefault)
      return res.status(400).send("Address is already default!!!");

    const address = await AddressModel.findOneAndUpdate(
      { _id: addressId, userId: checkAddressId.userId },
      { isDefault: true },
      { new: true }
    );

    await AddressModel.updateMany(
      { userId: checkAddressId.userId, _id: { $ne: addressId } },
      { isDefault: false }
    );

    res.status(200).send({ message: "Success!!!", data: address });
  } catch (err) {
    next(err);
  }
};

exports.DeleteAddress = async (req, res, next) => {
  try {
    const { addressId } = req.query;
    if (!addressId) res.status(400).send("Missing addressId!!!");
    await AddressModel.deleteOne({ _id: addressId });
    res.status(200).send({ message: "Success!!!" });
  } catch (err) {
    next(err);
  }
};
