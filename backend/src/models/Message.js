"use strict";

const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 120
    },
    subject: {
      type: String,
      trim: true,
      default: "Message for Raj Kumar",
      maxlength: 200
    },
    category: {
      type: String,
      enum: ["general", "doubt", "solution", "career", "feedback", "other"],
      default: "general"
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000
    },
    read: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Message", MessageSchema);
