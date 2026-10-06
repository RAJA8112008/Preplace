"use strict";

const express = require("express");
const router = express.Router();
const dataService = require("../services/dataService");

/**
 * GET /api/topics
 * Returns list of all available topics with metadata and question/note counts
 */
router.get("/", (req, res) => {
  try {
    const { kind, search: searchQuery } = req.query;
    let topics = dataService.getAllTopics();

    if (kind) {
      topics = topics.filter(t => t.kind.toLowerCase() === String(kind).toLowerCase());
    }

    if (searchQuery) {
      const q = String(searchQuery).toLowerCase();
      topics = topics.filter(t => t.slug.toLowerCase().includes(q) || t.title.toLowerCase().includes(q));
    }

    res.json({
      success: true,
      total: topics.length,
      topics
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/topics/search
 * Search across all topics, notes, questions, and solutions
 */
router.get("/search", (req, res) => {
  try {
    const { q } = req.query;
    if (!q || !String(q).trim()) {
      return res.status(400).json({ success: false, error: "Query parameter 'q' is required" });
    }

    const results = dataService.search(q);
    res.json({
      success: true,
      query: q,
      count: results.length,
      results
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/topics/:slug
 * Fetch full content for a specific topic (e.g. aws, docker, javascript, dsa-arrays)
 */
router.get("/:slug", (req, res) => {
  try {
    const { slug } = req.params;
    const topic = dataService.getTopic(slug);

    if (!topic) {
      return res.status(404).json({
        success: false,
        error: `Topic '${slug}' not found. Check GET /api/topics for available topics.`
      });
    }

    res.json({
      success: true,
      slug,
      kind: topic.kind || (slug.startsWith("dsa-") ? "dsa" : "practice"),
      data: topic
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/topics/:slug/questions
 * Fetch only questions for a specific topic
 */
router.get("/:slug/questions", (req, res) => {
  try {
    const { slug } = req.params;
    const { level } = req.query;
    const topic = dataService.getTopic(slug);

    if (!topic) {
      return res.status(404).json({ success: false, error: `Topic '${slug}' not found.` });
    }

    let questions = topic.questions || (Array.isArray(topic) ? topic : []);

    if (level) {
      questions = questions.filter(q => String(q.level).toLowerCase() === String(level).toLowerCase());
    }

    res.json({
      success: true,
      slug,
      count: questions.length,
      questions
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/topics/:slug/notes
 * Fetch only notes for a specific topic
 */
router.get("/:slug/notes", (req, res) => {
  try {
    const { slug } = req.params;
    const topic = dataService.getTopic(slug);

    if (!topic) {
      return res.status(404).json({ success: false, error: `Topic '${slug}' not found.` });
    }

    const notes = topic.notes || [];
    res.json({
      success: true,
      slug,
      count: notes.length,
      notes
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
