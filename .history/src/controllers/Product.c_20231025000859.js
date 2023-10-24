const productModel = require("../models/Product.m.js");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const bucket = require("../services/Firebase.s.js");
const storeModel = require("../models/Store.m.js");
const InforProductModel = require("../models/InforProduct.m.js");

exports.GetProductByStoreId = async (req, res, next) => {
  try {
    const { storeId } = req.params;
    if (!storeId) return res.status(400).send("storeId is not exist");
    const product = await productModel.findOne({ storeId });
    const infor = await InforProductModel.findOne({ productId: product._id });
    product = { ...product, imgSrc: infor.imgSrc, price: infor.price };
    if (!product) return res.status(400).send("Product is not exist");
    res.status(200).send({ message: "Success!!!", data: product });
  } catch (err) {
    next(err);
  }
};

exports.GetProductByName = async (req, res, next) => {
  try {
    const { name } = req.params;
    if (!name) return res.status(400).send("name is not exist");
    const product = await productModel.findOne({ name });
    const infor = await InforProductModel.findOne({ productId: product._id });
    product = { ...product, imgSrc: infor.imgSrc, price: infor.price };
    if (!product) return res.status(400).send("Product is not exist");
    res.status(200).send({ message: "Success!!!", data: product });
  } catch (err) {
    next(err);
  }
};

exports.GetProductByCategory = async (req, res, next) => {
  try {
    const { category, page, sort, from, to } = req.query;
    if (!category) return res.status(400).send("category is not exist");
    let products = await productModel.find({ category });
    for (let ind = 0; ind < products.length; ind++) {
      const infor = await InforProductModel.findOne({
        productId: products[ind]._id,
      });
      products[ind] = {
        ...products[ind]._doc,
        imgSrc: infor.imgSrc,
        price: infor.price,
      };
    }
    if (!products) return res.status(400).send("category is not exist");
    if (sort) {
      if (sort === "Low-to-high") {
        products.sort((a, b) => a.price - b.price);
      } else if (sort === "rate") {
        products.sort((a, b) => b.rate - a.rate);
      } else if (sort === "soldCount") {
        products.sort((a, b) => b.soldCount - a.soldCount);
      } else if (sort === "High-to-low") {
        products.sort((a, b) => b.price - a.price);
      } else if (sort === "lastest") {
        products.sort((a, b) => b.createdAt - a.createdAt);
      }
    }
    from &&
      (products = products.filter(
        (product) => product.price >= parseInt(from)
      ));
    to &&
      (products = products.filter((product) => product.price <= parseInt(to)));
    if (!page) page = 1;
    const limit = 15;
    const totalPage = Math.ceil(products.length / limit);
    const start = (page - 1) * limit;
    const end = page * limit;
    const data = products.slice(start, end);
    res.status(200).send({
      message: "Success!!!",
      data,
      totalPage,
    });
  } catch (err) {
    next(err);
  }
};
// for boss
exports.GetAllProductByStoreId = async (req, res, next) => {
  try {
    let { storeId, page, category, sort } = req.query;
    if (!storeId) return res.status(400).send("storeId is not exist");
    let products = await productModel.find({ storeId });

    for (let ind = 0; ind < products.length; ind++) {
      const infor = await InforProductModel.findOne({
        productId: products[ind]._id,
      });
      products[ind] = {
        ...products[ind]._doc,
        imgSrc: infor.imgSrc,
        price: infor.price,
      };
    }

    if (!products) return res.status(400).send("category is not exist");
    const total = products.length;
    if (category) {
      products = products.filter((product) => product.category === category);
    }
    if (sort) {
      if (sort === "Low-to-high") {
        products.sort((a, b) => a.price - b.price);
      } else if (sort === "rate") {
        products.sort((a, b) => b.rate - a.rate);
      } else if (sort === "soldCount") {
        products.sort((a, b) => b.soldCount - a.soldCount);
      } else if (sort === "High-to-low") {
        products.sort((a, b) => b.price - a.price);
      } else if (sort === "lastest") {
        products.sort((a, b) => b.createdAt - a.createdAt);
      }
    }
    if (!page) page = 1;
    const limit = 15;
    const totalPage = Math.ceil(products.length / limit);
    const start = (page - 1) * limit;
    const end = page * limit;
    products = products.slice(start, end);
    res.status(200).send({
      message: "Success!!!",
      data: products,
      totalPage,
      totalProduct: total,
    });
  } catch (err) {
    next(err);
  }
};

exports.GetAllProductByCategory = async (req, res, next) => {
  try {
    const { category, page, sort } = req.params;
    if (!category) return res.status(400).send("category is not exist");
    const products = await productModel.find({ category });
    for (let ind = 0; ind < products.length; ind++) {
      const infor = await InforProductModel.findOne({
        productId: products[ind]._id,
      });
      products[ind] = {
        ...products[ind]._doc,
        imgSrc: infor?.imgSrc,
        price: infor?.price,
      };
    }

    if (!products) return res.status(400).send("category is not exist");
    if (sort) {
      if (sort === "Low-to-high") {
        products.sort((a, b) => a.price - b.price);
      } else if (sort === "rate") {
        products.sort((a, b) => b.rate - a.rate);
      } else if (sort === "soldCount") {
        products.sort((a, b) => b.soldCount - a.soldCount);
      } else if (sort === "High-to-low") {
        products.sort((a, b) => b.price - a.price);
      } else if (sort === "lastest") {
        products.sort((a, b) => b.createdAt - a.createdAt);
      }
    }
    if (!page) page = 1;
    const limit = 15;
    const totalPage = Math.ceil(products.length / limit);
    const start = (page - 1) * limit;
    const end = page * limit;
    const data = products.slice(start, end);
    res.status(200).send({
      message: "Success!!!",
      data,
      totalPage,
    });
  } catch (err) {
    next(err);
  }
};

exports.uploadImageToFirebase = async (req, res, next) => {
  try {
    console.log("vào");
    if (!req.file) return res.status(400).json("No image file provided");

    const tempImagePath = req.file.path;
    const arr = req.file.originalname.split(".");

    if (arr.length < 2) return res.status(400).json("Name image is not valid");
    const nameFile = arr[0] + "-" + uuidv4() + "." + arr[1];

    const file = fs.readFileSync(tempImagePath);
    const options = {
      metadata: {
        contentType: "image/jpeg",
      },
    };

    const fileUploaded = bucket.file(`images/${nameFile}`);
    await fileUploaded.save(file, options);
    await fileUploaded.makePublic();
    const imgSrc = fileUploaded.publicUrl();
    fs.unlinkSync(tempImagePath);
    res.status(200).json({ message: "Success!!!", data: imgSrc });
  } catch (err) {
    next(err);
  }
};

exports.CreateNewProduct = async (req, res, next) => {
  try {
    let product = req.body;
    if (!product) return res.status(400).send("Missing required fields");

    const storeId = await storeModel.findOne({ userId: req.body.userId });
    if (!storeId) return res.status(400).send("User don't have store");
    product = { ...product, storeId: storeId._id };
    console.log(product);
    const productTemp = {
      name: product.name,
      storeId: product.storeId,
      category: product.category,
      description: product.description,
    };

    const checkProduct = await productModel.findOne({ name: product.name });
    if (checkProduct) return res.status(400).send("Product is exist");

    const newProduct = new productModel(productTemp);
    await newProduct.save();

    const inforProductTemp = {
      productId: newProduct._id,
      color: product.color,
      size: product.size,
      quantity: product.quantity,
      imgSrc: product.imgSrc,
      price: product.price,
    };
    const newInforProduct = new InforProductModel(inforProductTemp);
    await newInforProduct.save();

    return res.status(200).send({
      message: "Success!!!",
      data: {
        product: productTemp,
        inforProduct: inforProductTemp,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.AddInforProductSameName = async (req, res, next) => {
  try {
    const inforProduct = req.body;
    const product = await productModel.findById(inforProduct.productId);
    if (!product) return res.status(400).send("Product is not exist");

    const inforProductTemp = {
      productId: product._id,
      color: inforProduct.color,
      size: inforProduct.size,
      quantity: inforProduct.quantity,
      imgSrc: req.body.imgSrc,
      price: inforProduct.price,
    };
    const newInforProduct = new InforProductModel(inforProductTemp);
    await newInforProduct.save();

    return res.status(200).send({
      message: "Success!!!",
      data: {
        product: product,
        inforProduct: inforProductTemp,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.GetPopularProducts = async (req, res, next) => {
  try {
    const { limit } = req.query;
    const products = await productModel.find();
    for (let ind = 0; ind < products.length; ind++) {
      const infor = await InforProductModel.findOne({
        productId: products[ind]._id,
      });
      products[ind] = {
        ...products[ind]._doc,
        imgSrc: infor?.imgSrc,
        price: infor?.price,
      };
    }
    products.sort((a, b) => b.soldCount - a.soldCount);
    return res.status(200).send({
      message: "Success!!!",
      data: products.slice(0, limit),
    });
  } catch (err) {
    next(err);
  }
};

exports.GetNewProducts = async (req, res, next) => {
  try {
    const { limit } = req.query;
    const products = await productModel.find();
    for (let ind = 0; ind < products.length; ind++) {
      const infor = await InforProductModel.findOne({
        productId: products[ind]._id,
      });
      products[ind] = {
        ...products[ind]._doc,
        imgSrc: infor?.imgSrc,
        price: infor?.price,
      };
    }
    products.sort((a, b) => b.createdAt - a.createdAt);
    return res.status(200).send({
      message: "Success!!!",
      data: products.slice(0, limit),
    });
  } catch (err) {
    next(err);
  }
};

exports.GetNumberProductBySizeColor = async (req, res, next) => {
  try {
    const { productId, color, size } = req.query;
    if (!productId) return res.status(400).send("productId is not exist");
    if (!color) return res.status(400).send("color is not exist");
    if (!size) return res.status(400).send("size is not exist");

    const inforProduct = await InforProductModel.findOne({
      productId,
      color,
      size,
    });
    if (!inforProduct) return res.status(400).send("InforProduct is not exist");
    console.log(inforProduct.quantity);
    res
      .status(200)
      .send({ message: "Success!!!", data: inforProduct.quantity });
  } catch (err) {
    next(err);
  }
};

exports.GetSizeByColor = async (req, res, next) => {
  try {
    const { id, color } = req.query;
    console.log("id", id);
    console.log("color", color);
    if (!id) return res.status(400).send("id is not exist");
    if (!color) return res.status(400).send("color is not exist");
    const inforProduct = await InforProductModel.find({ productId: id, color });
    if (!inforProduct) return res.status(400).send("InforProduct is not exist");
    const size = inforProduct.map((item) => item.size);
    res.status(200).send({ message: "Success!!!", data: size });
  } catch (err) {
    next(err);
  }
};

exports.GetColorBySize = async (req, res, next) => {
  try {
    const { id, size } = req.query;
    if (!id) return res.status(400).send("id is not exist");
    if (!size) return res.status(400).send("size is not exist");
    const inforProduct = await InforProductModel.find({ productId: id, size });
    if (!inforProduct) return res.status(400).send("InforProduct is not exist");
    const color = inforProduct.map((item) => item.color);
    res.status(200).send({ message: "Success!!!", data: color });
  } catch (err) {
    next(err);
  }
};

exports.GetAllSizeAndColor = async (req, res, next) => {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).send("id is not exist");
    const inforProduct = await InforProductModel.find({ productId: id });
    if (!inforProduct) return res.status(400).send("InforProduct is not exist");
    let size = inforProduct.map((item) => item.size);
    size = [...new Set(size)];
    let color = inforProduct.map((item) => item.color);
    color = [...new Set(color)];
    res
      .status(200)
      .send({ message: "Success!!!", data: { sizes: size, colors: color } });
  } catch (err) {
    next(err);
  }
};

exports.GetProductById = async (req, res, next) => {
  try {
    const { productId } = req.query;
    if (!productId) return res.status(400).send("id is not exist");
    const product = await productModel.findById(productId);

    if (!product) return res.status(400).send("Product is not exist");
    const inforProducts = await InforProductModel.find({ productId });

    if (!inforProducts)
      return res.status(400).send("InforProduct is not exist");
    res
      .status(200)
      .send({ message: "Success!!!", data: { product, inforProducts } });
  } catch (err) {
    next(err);
  }
};

exports.GetProductOfStore = async (req, res, next) => {
  try {
    const { category, page, sort, nameStore } = req.params;
    if (!nameStore) return res.status(400).send("storeId is not exist");
    const storeId = await storeModel.findOne({ name: nameStore })._id;
    const products = await productModel.find({ storeId });
    for (let ind = 0; ind < products.length; ind++) {
      const infor = await InforProductModel.findOne({
        productId: products[ind]._id,
      });
      products[ind] = {
        ...products[ind]._doc,
        imgSrc: infor?.imgSrc,
        price: infor?.price,
      };
    }

    if (!products) return res.status(400).send("category is not exist");
    if (sort) {
      if (sort === "Low-to-high") {
        products.sort((a, b) => a.price - b.price);
      } else if (sort === "rate") {
        products.sort((a, b) => b.rate - a.rate);
      } else if (sort === "soldCount") {
        products.sort((a, b) => b.soldCount - a.soldCount);
      } else if (sort === "High-to-low") {
        products.sort((a, b) => b.price - a.price);
      } else if (sort === "lastest") {
        products.sort((a, b) => b.createdAt - a.createdAt);
      }
    }
    if (!page) page = 1;
    const limit = 15;
    const totalPage = Math.ceil(products.length / limit);
    const start = (page - 1) * limit;
    const end = page * limit;
    const data = products.slice(start, end);
    res.status(200).send({
      message: "Success!!!",
      data,
      totalPage,
    });
  } catch (err) {
    next(err);
  }
};
