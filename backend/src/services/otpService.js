"use strict";

const crypto = require("crypto");
const nodemailer = require("nodemailer");
const Otp = require("../models/Otp");

// Dynamic transporter helper
function getTransporter() {
  const host = process.env.SMTP_HOST || "smtp-relay.brevo.com";
  const user = process.env.SMTP_USER;
  const pass =
    process.env.SMTP_PASS ||
    (process.env.BREVO_API_KEY && process.env.BREVO_API_KEY.startsWith("xsmtpsib-")
      ? process.env.BREVO_API_KEY
      : null);

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: { user, pass }
    });
  }
  return null;
}

/**
 * Generate a cryptographically random 6-digit OTP
 */
function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

/**
 * Generate responsive HTML email template for OTP
 */
function buildOtpHtml(otp, purpose) {
  const actionText =
    purpose === "signup"
      ? "creating your Preplace account"
      : purpose === "reset_password"
      ? "resetting your Preplace password"
      : "signing in to Preplace";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Preplace Verification Code</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4efe6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 16px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; background-color: #ffffff; border-radius: 16px; border: 1px solid #d8cfc0; box-shadow: 0 10px 30px rgba(28,25,20,0.08); overflow: hidden;">
              
              <!-- Header -->
              <tr>
                <td style="padding: 32px 32px 20px; text-align: center; background: #fffaf2; border-bottom: 1px solid #ebe3d4;">
                  <h1 style="margin: 0; font-family: Georgia, serif; font-size: 26px; color: #1c1914; font-weight: 700;">Preplace</h1>
                  <p style="margin: 6px 0 0; color: #5c564c; font-size: 13px;">Pick a career. See what to learn.</p>
                </td>
              </tr>

              <!-- Body Content -->
              <tr>
                <td style="padding: 32px 32px 24px;">
                  <h2 style="margin: 0 0 12px; font-size: 18px; color: #1c1914; font-weight: 600;">Verification Code</h2>
                  <p style="margin: 0 0 24px; font-size: 15px; color: #5c564c; line-height: 1.5;">
                    Please use the following 6-digit code for <strong>${actionText}</strong>:
                  </p>

                  <!-- OTP Box -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 24px;">
                    <tr>
                      <td align="center" style="background-color: #f3d7c6; border: 1.5px dashed #b4532a; border-radius: 12px; padding: 18px 24px;">
                        <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #b4532a;">
                          ${otp}
                        </span>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0 0 8px; font-size: 13px; color: #5c564c;">
                    ⏳ This code is valid for <strong>10 minutes</strong>.
                  </p>
                  <p style="margin: 0; font-size: 12px; color: #8c8273;">
                    If you did not request this verification code, you can safely ignore this email.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 20px 32px; background-color: #faf6f0; border-top: 1px solid #ebe3d4; text-align: center;">
                  <p style="margin: 0; font-size: 12px; color: #8c8273;">
                    © ${new Date().getFullYear()} Preplace. Empowering engineers worldwide.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

/**
 * Send email via Brevo REST API (Fast & Reliable HTTPS)
 */
async function sendViaBrevo(toEmail, otp, purpose) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey || apiKey.startsWith("xsmtpsib-")) return false; // xsmtpsib keys are for SMTP, not REST API

  const senderEmail = process.env.BREVO_SENDER_EMAIL || "officialraja421@gmail.com";
  const senderName = process.env.BREVO_SENDER_NAME || "PrePlace";
  const htmlContent = buildOtpHtml(otp, purpose);

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey.trim(),
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        sender: {
          name: senderName,
          email: senderEmail
        },
        to: [
          {
            email: toEmail
          }
        ],
        subject: `Your Preplace Verification Code: ${otp}`,
        htmlContent: htmlContent
      })
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("[Brevo REST API] Error:", data);
      return false;
    }

    console.log(`[Brevo REST API] Email delivered to ${toEmail}. Message ID:`, data.messageId);
    return true;
  } catch (err) {
    console.error("[Brevo REST API] Network error:", err.message);
    return false;
  }
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

  // 1. Try Brevo REST API first (if xkeysib API key is configured)
  if (process.env.BREVO_API_KEY && !process.env.BREVO_API_KEY.startsWith("xsmtpsib-")) {
    emailSent = await sendViaBrevo(cleanEmail, otp, purpose);
  }

  // 2. Send via SMTP transporter (Brevo SMTP relay / standard SMTP)
  const smtpTransporter = getTransporter();
  if (!emailSent && smtpTransporter) {
    try {
      const htmlContent = buildOtpHtml(otp, purpose);
      const fromName = process.env.BREVO_SENDER_NAME || "PrePlace";
      const fromEmail = process.env.BREVO_SENDER_EMAIL || "officialraja421@gmail.com";

      const info = await smtpTransporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to: cleanEmail,
        subject: `Your Preplace Verification Code: ${otp}`,
        text: `Your Preplace verification code is ${otp}. It will expire in 10 minutes.`,
        html: htmlContent
      });
      console.log(`[Brevo SMTP] Email delivered to ${cleanEmail}. Message ID:`, info.messageId);
      emailSent = true;
    } catch (err) {
      console.error("[Brevo SMTP] Delivery error:", err.message);
    }
  }

  return {
    success: true,
    email: cleanEmail,
    emailSent,
    // Return previewOtp for dev/instant testing assistance
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
