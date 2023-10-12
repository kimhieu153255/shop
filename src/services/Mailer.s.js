const nodemailer = require("nodemailer");
require("dotenv").config();

const { EMAIL, PASSWORD } = process.env;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL,
    pass: PASSWORD,
  },
});

const sendMail = (email, numberCode) => {
  console.log(email, numberCode);
  const mailOptions = {
    from: EMAIL,
    to: email,
    subject: "Email Verification From Shop",
    html: `
      <h1>Hi, ${email}</h1>
      <p>Your verification code is: ${numberCode}</p>
    `,
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      return err;
    } else {
      return data;
    }
  });
};

module.exports = { sendMail };
