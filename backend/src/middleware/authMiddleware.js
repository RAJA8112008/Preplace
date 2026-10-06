"use strict";

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "preplace_secret_jwt_key_2026_secure_token";

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No authentication token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-passwordHash");

    if (!user) {
      return res.status(401).json({ error: "User no longer exists." });
    }

    req.user = user.toSafeObject();
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired session token." });
  }
}

module.exports = authMiddleware;
