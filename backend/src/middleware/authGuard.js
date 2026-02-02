const { auth } = require("../services/firebase");

module.exports = async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing token" });
    }

    const token = header.split(" ")[1];

    const decoded = await auth.verifyIdToken(token);

    req.user = decoded; // contains uid

    next();
  } catch (err) {
    console.error("Auth error:", err.message);

    return res.status(401).json({ error: "Invalid token" });
  }
};
