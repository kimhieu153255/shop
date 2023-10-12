require("dotenv").config();
const jwt = require("jsonwebtoken");
const VerifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. Token not provided." });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token." });
    if (decoded.exp < Date.now() / 1000)
      return res.status(403).json({ message: "Token expired." });
    req.userId = decoded;
    console.log(decoded);
    next();
  });
};

module.exports = VerifyToken;
