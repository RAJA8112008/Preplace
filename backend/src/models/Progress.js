"use strict";

const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true
    },
    // Solved problems array
    solvedProblems: [
      {
        problemId: { type: String, required: true },
        title: { type: String, default: "" },
        topicId: { type: String, default: "" },
        difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
        solvedAt: { type: Date, default: Date.now }
      }
    ],
    // Completed topics
    completedTopics: [
      {
        topicId: { type: String, required: true },
        completedAt: { type: Date, default: Date.now }
      }
    ],
    // Bookmarked questions/problems
    bookmarks: [
      {
        itemId: { type: String, required: true },
        title: { type: String, default: "" },
        category: { type: String, default: "problem" },
        savedAt: { type: Date, default: Date.now }
      }
    ],
    // Personal notes
    notes: [
      {
        topicId: { type: String, required: true },
        title: { type: String, default: "" },
        content: { type: String, default: "" },
        updatedAt: { type: Date, default: Date.now }
      }
    ],
    // Daily learning streak tracking
    streak: {
      current: { type: Number, default: 0 },
      highest: { type: Number, default: 0 },
      lastActiveDate: { type: String, default: "" } // YYYY-MM-DD format
    }
  },
  {
    timestamps: true
  }
);

// Method to update streak
progressSchema.methods.updateStreak = function () {
  const today = new Date().toISOString().split("T")[0];
  const lastDate = this.streak.lastActiveDate;

  if (lastDate === today) {
    // Already active today
    return;
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  if (lastDate === yesterday) {
    this.streak.current += 1;
  } else if (!lastDate) {
    this.streak.current = 1;
  } else {
    // Streak broken, reset to 1
    this.streak.current = 1;
  }

  if (this.streak.current > this.streak.highest) {
    this.streak.highest = this.streak.current;
  }

  this.streak.lastActiveDate = today;
};

module.exports = mongoose.model("Progress", progressSchema);
