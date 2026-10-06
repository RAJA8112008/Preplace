"use strict";

const express = require("express");
const Progress = require("../models/Progress");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Helper to get or initialize progress
async function getOrCreateProgress(userId) {
  let doc = await Progress.findOne({ userId });
  if (!doc) {
    doc = await Progress.create({
      userId,
      solvedProblems: [],
      completedTopics: [],
      bookmarks: [],
      notes: [],
      streak: { current: 1, highest: 1, lastActiveDate: new Date().toISOString().split("T")[0] }
    });
  }
  return doc;
}

/**
 * GET /api/progress
 * Get full user progress, solved items, notes, bookmarks, and streak
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const progress = await getOrCreateProgress(req.user.id);
    return res.json({
      success: true,
      progress
    });
  } catch (err) {
    console.error("[PROGRESS] get error:", err);
    return res.status(500).json({ error: "Failed to fetch user progress" });
  }
});

/**
 * POST /api/progress/toggle-problem
 * Body: { problemId, title, topicId, difficulty }
 */
router.post("/toggle-problem", authMiddleware, async (req, res) => {
  try {
    const { problemId, title = "", topicId = "", difficulty = "medium" } = req.body;
    if (!problemId) {
      return res.status(400).json({ error: "Problem ID is required" });
    }

    const progress = await getOrCreateProgress(req.user.id);
    const existingIndex = progress.solvedProblems.findIndex((p) => p.problemId === problemId);

    let isSolved = false;
    if (existingIndex > -1) {
      // Remove from solved
      progress.solvedProblems.splice(existingIndex, 1);
      isSolved = false;
    } else {
      // Add to solved and update streak
      progress.solvedProblems.push({
        problemId,
        title,
        topicId,
        difficulty,
        solvedAt: new Date()
      });
      progress.updateStreak();
      isSolved = true;
    }

    await progress.save();

    return res.json({
      success: true,
      isSolved,
      problemId,
      solvedCount: progress.solvedProblems.length,
      streak: progress.streak,
      progress
    });
  } catch (err) {
    console.error("[PROGRESS] toggle-problem error:", err);
    return res.status(500).json({ error: "Failed to update problem status" });
  }
});

/**
 * POST /api/progress/toggle-bookmark
 * Body: { itemId, title, category }
 */
router.post("/toggle-bookmark", authMiddleware, async (req, res) => {
  try {
    const { itemId, title = "", category = "problem" } = req.body;
    if (!itemId) {
      return res.status(400).json({ error: "Item ID is required" });
    }

    const progress = await getOrCreateProgress(req.user.id);
    const idx = progress.bookmarks.findIndex((b) => b.itemId === itemId);

    let isBookmarked = false;
    if (idx > -1) {
      progress.bookmarks.splice(idx, 1);
      isBookmarked = false;
    } else {
      progress.bookmarks.push({ itemId, title, category, savedAt: new Date() });
      isBookmarked = true;
    }

    await progress.save();

    return res.json({
      success: true,
      isBookmarked,
      bookmarksCount: progress.bookmarks.length,
      bookmarks: progress.bookmarks
    });
  } catch (err) {
    console.error("[PROGRESS] toggle-bookmark error:", err);
    return res.status(500).json({ error: "Failed to update bookmark" });
  }
});

/**
 * POST /api/progress/toggle-topic
 * Body: { topicId }
 */
router.post("/toggle-topic", authMiddleware, async (req, res) => {
  try {
    const { topicId } = req.body;
    if (!topicId) {
      return res.status(400).json({ error: "Topic ID is required" });
    }

    const progress = await getOrCreateProgress(req.user.id);
    const idx = progress.completedTopics.findIndex((t) => t.topicId === topicId);

    let isCompleted = false;
    if (idx > -1) {
      progress.completedTopics.splice(idx, 1);
      isCompleted = false;
    } else {
      progress.completedTopics.push({ topicId, completedAt: new Date() });
      progress.updateStreak();
      isCompleted = true;
    }

    await progress.save();

    return res.json({
      success: true,
      isCompleted,
      completedTopicsCount: progress.completedTopics.length,
      completedTopics: progress.completedTopics,
      streak: progress.streak
    });
  } catch (err) {
    console.error("[PROGRESS] toggle-topic error:", err);
    return res.status(500).json({ error: "Failed to update topic status" });
  }
});

/**
 * POST /api/progress/save-note
 * Body: { topicId, title, content }
 */
router.post("/save-note", authMiddleware, async (req, res) => {
  try {
    const { topicId, title = "", content = "" } = req.body;
    if (!topicId) {
      return res.status(400).json({ error: "Topic ID is required" });
    }

    const progress = await getOrCreateProgress(req.user.id);
    const idx = progress.notes.findIndex((n) => n.topicId === topicId);

    if (idx > -1) {
      progress.notes[idx].title = title || progress.notes[idx].title;
      progress.notes[idx].content = content;
      progress.notes[idx].updatedAt = new Date();
    } else {
      progress.notes.push({
        topicId,
        title: title || topicId,
        content,
        updatedAt: new Date()
      });
    }

    progress.updateStreak();
    await progress.save();

    return res.json({
      success: true,
      message: "Note saved successfully",
      notes: progress.notes
    });
  } catch (err) {
    console.error("[PROGRESS] save-note error:", err);
    return res.status(500).json({ error: "Failed to save note" });
  }
});

/**
 * DELETE /api/progress/delete-note/:topicId
 */
router.delete("/delete-note/:topicId", authMiddleware, async (req, res) => {
  try {
    const { topicId } = req.params;
    const progress = await getOrCreateProgress(req.user.id);

    progress.notes = progress.notes.filter((n) => n.topicId !== topicId);
    await progress.save();

    return res.json({
      success: true,
      message: "Note removed",
      notes: progress.notes
    });
  } catch (err) {
    console.error("[PROGRESS] delete-note error:", err);
    return res.status(500).json({ error: "Failed to delete note" });
  }
});

module.exports = router;
