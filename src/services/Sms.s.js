require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

exports.SendSms = (to, body) => {
  // to: 0987654321
  if (to.startsWith("0")) to = "+84" + to.slice(1);
  client.messages
    .create({
      body,
      from: "+18158699261",
      to,
    })
    .then((message) => console.log(message));
};
