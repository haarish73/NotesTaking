const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET
function auth(req, res, next) {
  const authHeader = req.header("Authorization");

  console.log("📥 RAW AUTH HEADER:", authHeader);

  if (!authHeader) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    // split Bearer token
    const token = authHeader.split(" ")[1];

    console.log("🔑 EXTRACTED TOKEN:", token);
    console.log("🔐 JWT SECRET (auth):", SECRET);

    const verified = jwt.verify(token, SECRET);

    console.log("✅ VERIFIED IN AUTH:", verified);

    req.user = verified;
    next();
  } catch (err) {
    console.log("❌ VERIFY ERROR:", err.message);
    res.status(400).json({ message: "Invalid token" });
  }
}

module.exports = auth;