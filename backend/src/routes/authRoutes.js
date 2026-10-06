"use strict";

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendOtp, verifyOtp } = require("../services/otpService");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "preplace_secret_jwt_key_2026_secure_token";

const AVATAR_COLORS = [
  "#4f46e5", "#0ea5e9", "#10b981", "#f59e0b", "#ec4899", 
  "#8b5cf6", "#06b6d4", "#84cc16", "#f97316", "#e11d48"
];

function getRandomColor() {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}

function generateToken(user) {
  const userId = user._id ? user._id.toString() : user.id;
  return jwt.sign(
    { id: userId, email: user.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

/**
 * POST /api/auth/send-otp
 * Body: { email, purpose: 'signup' | 'login' | 'reset_password' }
 */
router.post("/send-otp", async (req, res) => {
  try {
    const { email, purpose = "signup" } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: cleanEmail });

    if (purpose === "signup" && existingUser && existingUser.isVerified) {
      return res.status(400).json({
        error: "An account with this email already exists. Please sign in instead."
      });
    }

    if (purpose === "login" && !existingUser) {
      return res.status(404).json({
        error: "No account found with this email. Please create an account first."
      });
    }

    if (purpose === "reset_password" && !existingUser) {
      return res.status(404).json({
        error: "No account found with this email."
      });
    }

    const result = await sendOtp(cleanEmail, purpose);

    return res.json({
      success: true,
      message: `Verification code sent to ${cleanEmail}`,
      previewOtp: result.previewOtp, // Available for instant preview/dev test
      emailSent: result.emailSent
    });
  } catch (err) {
    console.error("[AUTH] send-otp error:", err);
    return res.status(500).json({ error: "Failed to send verification code." });
  }
});

/**
 * POST /api/auth/signup
 * Body: { name, email, password, otp }
 */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: "Please provide your name (at least 2 characters)." });
    }
    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long." });
    }
    if (!otp) {
      return res.status(400).json({ error: "Please enter the 6-digit verification code." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    // Verify OTP
    const otpResult = await verifyOtp(cleanEmail, otp, "signup");
    if (!otpResult.valid) {
      return res.status(400).json({ error: otpResult.error });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const avatarColor = getRandomColor();

    let user = await User.findOne({ email: cleanEmail });
    if (user) {
      user.name = cleanName;
      user.passwordHash = passwordHash;
      user.isVerified = true;
      await user.save();
    } else {
      user = await User.create({
        name: cleanName,
        email: cleanEmail,
        passwordHash,
        avatarColor,
        isVerified: true
      });
    }

    const safeUser = user.toSafeObject();
    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: "Account created successfully!",
      token,
      user: safeUser
    });
  } catch (err) {
    console.error("[AUTH] signup error:", err);
    return res.status(500).json({ error: "Account creation failed. Please try again." });
  }
});

/**
 * POST /api/auth/login-password
 * Body: { email, password }
 */
router.post("/login-password", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please enter both email and password." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const safeUser = user.toSafeObject();
    const token = generateToken(user);

    return res.json({
      success: true,
      message: "Welcome back!",
      token,
      user: safeUser
    });
  } catch (err) {
    console.error("[AUTH] login error:", err);
    return res.status(500).json({ error: "Login failed. Please try again." });
  }
});

/**
 * POST /api/auth/login-otp
 * Body: { email, otp }
 */
router.post("/login-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Please provide both email and verification code." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(404).json({ error: "No account found with this email." });
    }

    const otpResult = await verifyOtp(cleanEmail, otp, "login");
    if (!otpResult.valid) {
      return res.status(400).json({ error: otpResult.error });
    }

    const safeUser = user.toSafeObject();
    const token = generateToken(user);

    return res.json({
      success: true,
      message: "Signed in successfully!",
      token,
      user: safeUser
    });
  } catch (err) {
    console.error("[AUTH] login-otp error:", err);
    return res.status(500).json({ error: "Login verification failed." });
  }
});

/**
 * POST /api/auth/reset-password
 * Body: { email, otp, newPassword }
 */
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: "Please provide email, verification code, and new password." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters long." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(404).json({ error: "No account found with this email." });
    }

    const otpResult = await verifyOtp(cleanEmail, otp, "reset_password");
    if (!otpResult.valid) {
      return res.status(400).json({ error: otpResult.error });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = passwordHash;
    await user.save();

    return res.json({
      success: true,
      message: "Password reset successfully! You can now sign in with your new password."
    });
  } catch (err) {
    console.error("[AUTH] reset-password error:", err);
    return res.status(500).json({ error: "Failed to reset password." });
  }
});

/**
 * GET /api/auth/me
 * Headers: { Authorization: "Bearer <token>" }
 */
router.get("/me", authMiddleware, (req, res) => {
  return res.json({
    success: true,
    user: req.user
  });
});

module.exports = router;
