const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "cheia_mea_secreta";

exports.protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token lipsă. Trebuie să fii logat." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token invalid:", err.message);
    res.status(401).json({ message: "Token invalid" });
  }
};

