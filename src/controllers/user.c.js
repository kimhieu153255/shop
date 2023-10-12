const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userModel = require("../models/User.m");
const NumberCodeModel = require("../models/NumberCode.m");
const nodemailerService = require("../services/Mailer.s");
const storeModel = require("../models/Store.m");
const { SendSms } = require("../services/Sms.s");
const { uploadImageToFirebase } = require("./Product.c");

exports.Login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    let user = await userModel.findOne({ username });
    if (!user) {
      return res.status(400).send("User is not exist");
    }
    const hashPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");
    if (user.password !== hashPassword) {
      return res.status(400).send("Password is incorrect");
    }
    console.log("qua");
    const SECRET_KEY = process.env.SECRET_KEY;
    const token = jwt.sign({ id: user._id }, SECRET_KEY, {
      expiresIn: "1h",
    });
    const store = await storeModel.findOne({ userId: user._id });
    res.status(200).send({
      token,
      user,
      storeId: store?._id,
      expiresAt: Date.now() + 1 * 60 * 60 * 1000,
    });
  } catch (err) {
    next(err);
  }
};

exports.Logout = async (req, res, next) => {
  try {
    req.session.destroy((err) => {
      if (err) return res.status(400).send("Logout failed");
      res.clearCookie("connect.sid");
      res.status(200).send("Logout successfully");
    });
  } catch (err) {
    next(err);
  }
};

exports.Register = async (req, res, next) => {
  try {
    const { username, email, password, confirmPassword, phone } = req.body;
    let user = await userModel.findOne({ username });
    if (user) {
      return res.status(400).send("User is already exist");
    }
    let emailTmp = await userModel.findOne({ email });
    if (emailTmp) {
      return res.status(400).send("Email is already exist");
    }
    if (password !== confirmPassword) {
      return res.status(400).send("Password is not match");
    }
    const hashPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");
    user = new userModel({
      username,
      email,
      password: hashPassword,
      phone,
    });
    await user.save();
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

exports.GetUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(400).send("User is not exist");
    }
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

exports.sentEmail = async (req, res, next) => {
  try {
    const { newEmail, id } = req.body;
    console.log(newEmail, id);
    //id lấy trong cookie
    const numberCode = Math.floor(100000 + Math.random() * 900000);
    nodemailerService.sendMail(newEmail, numberCode);
    const numberCodeModel = new NumberCodeModel({
      userId: id,
      newEmail,
      code: numberCode,
      type: "email",
    });
    await NumberCodeModel.deleteMany({ userId: id, type: "email" });
    await numberCodeModel.save();
    res.status(200).send({
      message: "Sent email successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.changeEmail = async (req, res, next) => {
  try {
    const { id, numberCode, newEmail } = req.body;
    console.log(id, numberCode, newEmail);
    const code = await NumberCodeModel.findOne({
      userId: id,
      newEmail,
      type: "email",
    });
    if (!code) return res.status(400).send({ err: "Code is not exist" });
    if (code.code !== numberCode)
      return res.status(400).send({ err: "Code is incorrect" });
    let user = await userModel.findById(id);
    if (!user) return res.status(400).send({ err: "User is not exist" });
    user.email = newEmail;
    await user.save();
    await NumberCodeModel.deleteOne({ userId: id, newEmail });
    const token = jwt.sign({ user: user.username }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    res.status(200).send({
      message: "Change password successfully",
      user,
      token,
    });
  } catch (err) {
    next(err);
  }
};

exports.UpdateUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, gender, DOB, avatar } = req.body;
    console.log(name, gender, DOB, avatar);
    let user = await userModel.findById(id);
    if (!user) {
      return res.status(400).send("User is not exist");
    }
    if (!name && !DOB && user.gender == gender)
      return res.status(400).send({ message: "Nothing to update" });
    name && (user.name = name);
    DOB && (user.DOB = DOB);
    user.gender = gender;
    avatar && (user.avatar = avatar);
    await user.save();
    const token = jwt.sign({ user: user.name }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    res.status(200).send({ user, token, message: "Update successfully!!!" });
  } catch (err) {
    next(err);
  }
};

exports.SendVerifyCodeToPhone = async (req, res, next) => {
  try {
    const { userId, newPhone } = req.body;
    console.log(userId, newPhone);
    let numberCode = Math.floor(100000 + Math.random() * 900000);
    while (await userModel.findOne({ code: numberCode, type: "phone" })) {
      numberCode = Math.floor(100000 + Math.random() * 900000);
    }
    const body = `Your verification code is: ${numberCode}`;
    SendSms(newPhone, body);
    const numberCodeModel = new NumberCodeModel({
      userId,
      newPhone,
      code: numberCode,
      type: "phone",
    });
    await NumberCodeModel.deleteMany({ userId, type: "phone" });
    await numberCodeModel.save();
    res.status(200).send({
      message: "Sent sms successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.ChangePhone = async (req, res, next) => {
  try {
    const { numberCode } = req.body;
    const { userId } = req.query;
    if (!userId) return res.status(400).send("User is not exist");
    const code = await NumberCodeModel.findOne({
      userId,
      type: "phone",
    });
    if (!code) return res.status(400).send("Code is not exist");
    if (code.code !== numberCode)
      return res.status(400).send("Code is incorrect");
    let user = await userModel.findById(userId);
    user.phone = code.newPhone;
    await user.save();
    await NumberCodeModel.deleteOne({ userId, type: "phone" });
    const token = jwt.sign({ user: user.username }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(200).send({
      message: "Change phone successfully",
      user,
      token,
    });
  } catch (err) {
    next(err);
  }
};

exports.ChangePassword = async (req, res, next) => {
  try {
    const { newPassword, oldPassword } = req.body;
    console.log(newPassword, oldPassword);
    const { userId } = req.query;
    if (!userId) return res.status(400).send("User is not exist");
    console.log("qua 1");

    let user = await userModel.findById(userId);
    if (!user) return res.status(400).send("User is not exist");
    console.log("qua 2");
    const hashOldPass = crypto
      .createHash("sha256")
      .update(oldPassword)
      .digest("hex");
    console.log(hashOldPass, user.password);
    if (user.password !== hashOldPass)
      return res.status(400).send("Old password is incorrect");
    console.log("qua 3");

    const hashNewPass = crypto
      .createHash("sha256")
      .update(newPassword)
      .digest("hex");
    user.password = hashNewPass;
    await user.save();
    const token = jwt.sign({ user: user.username }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    res.status(200).send({
      message: "Change password successfully",
      user,
      token,
    });
  } catch (err) {
    next(err);
  }
};
