"use strict";

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"]
    },
    passwordHash: {
      type: String,
      required: false // Optional for users created via OTP-only flows
    },
    avatarColor: {
      type: String,
      default: "#4f46e5"
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Method to return safe public profile
userSchema.methods.toSafeObject = function () {
  return {
    id: this._id.toString(),
    _id: this._id.toString(),
    name: this.name,
    email: this.email,
    avatar_color: this.avatarColor,
    is_verified: this.isVerified,
    created_at: this.createdAt
  };
};

module.exports = mongoose.model("User", userSchema);
