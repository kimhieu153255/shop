const router = require("express").Router();
const productC = require("../controllers/Product.c");
const verifyTokenW = require("../middlewares/VerifyToken.w");
const upload = require("../services/Multer.s");

router.get(
  "/api/getNumberProductBySizeColor",
  productC.GetNumberProductBySizeColor
);
router.get("/api/getSizeByColor", productC.GetSizeByColor);
router.get("/api/getColorBySize", productC.GetColorBySize);
router.get("/api/getAllSizeAndColor", productC.GetAllSizeAndColor);
// router.use(verifyTokenW);
// router.post("/api/add", productC.CreateNewProduct);
// router.get("/api/get", productC.GetAllProductByStoreId);
// router.get("/api/getAllCategories", productC.GetAllCategory);
router.get("/api/getProductByCategory", productC.GetProductByCategory);
router.post(
  "/api/uploadImg",
  upload.single("image"),
  productC.uploadImageToFirebase
);
router.post("/api/addProduct", productC.CreateNewProduct);
router.get("/api/getAllProductsByStoreId", productC.GetAllProductByStoreId);
router.get("/api/getPopularProducts", productC.GetPopularProducts);
router.get("/api/getNewProducts", productC.GetNewProducts);
router.get("/api/getProductById", productC.GetProductById);
router.get("/api/getProductOfStore", productC.GetProductOfStore);

module.exports = router;
