const router = require("express").Router();
const UserC = require("../controllers/user.c");
const passport = require("../middlewares/Passport.w");
const upload = require("../services/Multer.s");
const productC = require("../controllers/Product.c");

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/error",
  })
);

router.post("/register", UserC.Register);
router.post("/api/login", UserC.Login);
router.get("/api/logout", UserC.Logout);
router.post("/api/register", UserC.Register);
router.get("/api/get/:id", UserC.GetUserById);
router.post("/api/update/:id", UserC.UpdateUserById);
router.post("/api/verify/email", UserC.sentEmail);
router.post("/api/verify/email/confirm", UserC.changeEmail);
// change phone
router.post("/api/verify/phone", UserC.SendVerifyCodeToPhone);
router.post("/api/verify/phone/confirm", UserC.ChangePhone);
// change password
router.put("/api/change-password", UserC.ChangePassword);

router.post(
  "/api/uploadImg",
  upload.single("image"),
  productC.uploadImageToFirebase
);

module.exports = router;
