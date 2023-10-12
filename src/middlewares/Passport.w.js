const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const userModel = require("../models/User.m");
const crypto = require("crypto");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        console.log(username, password);
        const user = await userModel.findOne({ email: username });
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        const hashPassword = crypto
          .createHash("sha256")
          .update(password)
          .digest("hex");
        if (user.password !== hashPassword) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  console.log(user);
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  console.log(user);
  cb(null, user);
});

module.exports = passport;
