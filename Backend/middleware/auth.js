const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET = process.env.JWT_SECRET
function auth(req, res, next) {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    const verified = jwt.verify(token, SECRET);
    req.user = verified; // { id: ... }
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
}

module.exports = auth;