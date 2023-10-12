const router = require("express").Router();
const cartController = require("../controllers/Cart.c");
const verifyTokenW = require("../middlewares/VerifyToken.w");

// router.use(verifyTokenW);
router.post("/api/add", cartController.AddProductToCart);
router.post("/api/addDetail", cartController.AddInforProductToCart);
router.get("/api/get", cartController.GetCartByUserId);
router.put("/api/update", cartController.UpdateCart);
router.delete("/api/delete", cartController.DeleteCart);

module.exports = router;
