"use strict";

const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const Message = require("../models/Message");

// Helper for SMTP transporter
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
 * POST /api/messages
 * Send a message to Raj Kumar
 */
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, category, message } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Please enter your name" });
    }
    if (!email || !email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      return res.status(400).json({ error: "Please provide a valid email address" });
    }
    if (!message || message.trim().length < 5) {
      return res.status(400).json({ error: "Please enter a message (at least 5 characters)" });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanSubject = (subject || `New message from ${cleanName} on Preplace`).trim();
    const cleanCategory = category || "general";
    const cleanMessage = message.trim();

    // 1. Save message in MongoDB
    const savedMessage = await Message.create({
      name: cleanName,
      email: cleanEmail,
      subject: cleanSubject,
      category: cleanCategory,
      message: cleanMessage,
      read: false
    });

    // 2. Email alert to Raj
    const adminEmail = process.env.BREVO_SENDER_EMAIL || "officialraja421@gmail.com";
    const transporter = getTransporter();

    if (transporter) {
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <body style="margin:0; padding:24px; background:#f4efe6; font-family:sans-serif; color:#1c1914;">
          <div style="max-width:560px; margin:0 auto; background:#ffffff; border-radius:12px; border:1px solid #d8cfc0; padding:28px; box-shadow:0 4px 15px rgba(0,0,0,0.05);">
            <div style="border-bottom:1px solid #ebe3d4; padding-bottom:16px; margin-bottom:20px;">
              <h2 style="margin:0 0 6px; color:#1c1914;">New Message for Raj Kumar</h2>
              <span style="background:#e8dfd1; color:#5c564c; padding:4px 10px; border-radius:6px; font-size:12px; font-weight:600; text-transform:uppercase;">
                Category: ${cleanCategory}
              </span>
            </div>

            <p style="margin:0 0 8px; font-size:14px; color:#5c564c;"><strong>From:</strong> ${cleanName} &lt;${cleanEmail}&gt;</p>
            <p style="margin:0 0 16px; font-size:14px; color:#5c564c;"><strong>Subject:</strong> ${cleanSubject}</p>

            <div style="background:#fffaf2; border-left:4px solid #b4532a; padding:16px; border-radius:4px; font-size:15px; line-height:1.6; white-space:pre-wrap; color:#2c2822;">${cleanMessage}</div>

            <p style="margin:24px 0 0; font-size:12px; color:#8c8273; border-top:1px solid #ebe3d4; padding-top:16px;">
              You can reply directly to this email to get back to <strong>${cleanEmail}</strong>.
            </p>
          </div>
        </body>
        </html>
      `;

      transporter.sendMail({
        from: `"PrePlace Contact" <${adminEmail}>`,
        to: adminEmail,
        replyTo: `"${cleanName}" <${cleanEmail}>`,
        subject: `[PrePlace Message] ${cleanSubject}`,
        text: `From: ${cleanName} (${cleanEmail})\nCategory: ${cleanCategory}\n\n${cleanMessage}`,
        html: emailHtml
      }).catch(err => {
        console.error("[Message to Raj Email Alert Error]:", err.message);
      });
    }

    return res.status(201).json({
      success: true,
      message: "Your message has been sent to Raj Kumar! Thank you.",
      id: savedMessage._id
    });
  } catch (err) {
    console.error("[Message Error]:", err);
    return res.status(500).json({ error: "Could not send your message right now. Please try again later." });
  }
});

module.exports = router;
