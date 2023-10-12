const storeC = require("../controllers/Store.c");
const router = require("express").Router();
const productC = require("../controllers/Product.c");
const verifyTokenW = require("../middlewares/VerifyToken.w");
const upload = require("../services/Multer.s");

router.use(verifyTokenW);
router.post("/api/register", storeC.CreateStore);
router.get("/api/get", storeC.GetStore);

router.get("/api/getAllCategories", storeC.GetAllCategory);

module.exports = router;
