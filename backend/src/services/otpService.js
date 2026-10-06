"use strict";

const crypto = require("crypto");
const nodemailer = require("nodemailer");
const Otp = require("../models/Otp");

// Configure Transporter if SMTP environment variables are present
let transporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

/**
 * Generate a cryptographically random 6-digit OTP
 */
function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

/**
 * Send / Store OTP in MongoDB for an email
 */
async function sendOtp(email, purpose = "signup") {
  const cleanEmail = email.trim().toLowerCase();
  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

  // Invalidate previous OTPs for this email and purpose
  await Otp.updateMany(
    { email: cleanEmail, purpose, used: false },
    { $set: { used: true } }
  );

  // Store new OTP in MongoDB
  await Otp.create({
    email: cleanEmail,
    otp,
    purpose,
    expiresAt,
    used: false
  });

  console.log(`\n========================================`);
  console.log(`[PREPLACE OTP (MongoDB)] To: ${cleanEmail}`);
  console.log(`[PREPLACE OTP (MongoDB)] Purpose: ${purpose}`);
  console.log(`[PREPLACE OTP (MongoDB)] Code: >>> ${otp} <<<`);
  console.log(`[PREPLACE OTP (MongoDB)] Valid for 10 minutes`);
  console.log(`========================================\n`);

  let emailSent = false;
  if (transporter) {
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || `"Preplace" <noreply@preplace.com>`,
        to: cleanEmail,
        subject: `Your Preplace Verification Code: ${otp}`,
        text: `Your Preplace verification code is ${otp}. It will expire in 10 minutes.`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background: #ffffff;">
            <h2 style="color: #111827; margin-bottom: 8px;">Preplace Verification</h2>
            <p style="color: #4b5563; font-size: 15px; margin-bottom: 24px;">Use the verification code below to complete your ${purpose}:</p>
            <div style="background: #f3f4f6; padding: 16px 24px; font-size: 32px; font-weight: 700; letter-spacing: 6px; text-align: center; color: #4f46e5; border-radius: 8px; margin-bottom: 24px;">
              ${otp}
            </div>
            <p style="color: #9ca3af; font-size: 13px;">This code is valid for 10 minutes. If you didn't request this code, please ignore this email.</p>
          </div>
        `
      });
      emailSent = true;
    } catch (err) {
      console.error("[OTP] Failed to send email via SMTP:", err.message);
    }
  }

  return {
    success: true,
    email: cleanEmail,
    emailSent,
    // Return previewOtp so dev/testing in UI is completely frictionless
    previewOtp: otp
  };
}

/**
 * Verify OTP from MongoDB
 */
async function verifyOtp(email, otp, purpose = "signup") {
  const cleanEmail = email.trim().toLowerCase();
  const cleanOtp = (otp || "").trim();

  const record = await Otp.findOne({
    email: cleanEmail,
    otp: cleanOtp,
    purpose,
    used: false
  }).sort({ createdAt: -1 });

  if (!record) {
    return { valid: false, error: "Invalid verification code" };
  }

  if (new Date() > new Date(record.expiresAt)) {
    return { valid: false, error: "Verification code has expired. Please request a new one." };
  }

  // Mark as used
  record.used = true;
  await record.save();

  return { valid: true };
}

module.exports = {
  generateOtp,
  sendOtp,
  verifyOtp
};
