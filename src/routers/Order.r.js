const router = require("express").Router();
const OrderController = require("../controllers/Order.c");
const StripeController = require("../controllers/Stripe.c");

router.post("/add", OrderController.AddOrder);
router.post("/save", OrderController.SaveOrder);
router.get("/get", OrderController.GetOrder);
router.post("/create-checkout-session", StripeController.createCheckoutSession);
router.get("/refund", StripeController.RefundPayment);
router.get("/get-payment-intent", StripeController.getPaymentIntent);
router.delete("/deleteOrder", OrderController.DeleteOrder);

module.exports = router;
