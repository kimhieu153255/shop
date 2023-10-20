require("dotenv").config();
const FRONTEND_DOMAIN = process.env.FRONTEND_DOMAIN;
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const OrderController = require("./Order.c");
const CartController = require("./Cart.c");

exports.createCheckoutSession = async (req, res, next) => {
  try {
    const line_items = req.body.productOrderArr.map((item) => {
      return {
        price_data: {
          currency: "vnd",
          product_data: {
            name: item.name,
            images: [item.imgSrc],
          },
          unit_amount: item.price,
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${FRONTEND_DOMAIN}/checkout/success`,
      cancel_url: `${FRONTEND_DOMAIN}/user/cart`,
      payment_intent_data: {
        metadata: {
          userId: "123",
        },
      },
    });
    console.log("Sessionid:", session.id);
    res.send({
      url: session.url,
      sessionId: session.id,
    });
  } catch (err) {
    next(err);
  }
};

exports.RefundPayment = async (req, res, next) => {
  try {
    // const { chargeId } = req.query;
    const { sessionId } = req.query;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const refund = await stripe.refunds.create({
      payment_intent: session.payment_intent || "",
    });
    console.log("Refund details:", refund);
    return res.status(200).send({ message: "Success!!!", data: refund });
  } catch (err) {
    next(err);
  }
};

exports.getPaymentIntent = async (req, res, next) => {
  try {
    const { sessionId } = req.query;
    // const sessionId = "cs_test_a1aF1obefDsVTkPneE5JP0XlOD2wDDpPzejGYKKG8oC8A1r5d18bJu9rUO";
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log("Session:", session);
    return res.status(200).send({ message: "Success!!!", data: session });
  } catch (err) {
    next(err);
  }
};
