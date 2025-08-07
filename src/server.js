function autentificare(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ message: "Lipsă token" });

    const token = authHeader.split(" ")[1]; // luăm partea după Bearer
    if (!token) return res.status(401).json({ message: "Token invalid (gol)" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token invalid" });
  }
}
