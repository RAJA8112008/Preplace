"use strict";

const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },
    otp: {
      type: String,
      required: true
    },
    purpose: {
      type: String,
      required: true,
      enum: ["signup", "login", "reset_password"]
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 } // Auto-delete documents when expired via MongoDB TTL
    },
    used: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Otp", otpSchema);
