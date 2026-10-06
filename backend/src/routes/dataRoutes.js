"use strict";

const express = require("express");
const router = express.Router();
const dataService = require("../services/dataService");

/**
 * GET /api/data
 * Returns the full dataset catalogue or topic list
 */
router.get("/", (req, res) => {
  try {
    const { full } = req.query;
    if (full === "true") {
      const allData = dataService.getAllData();
      return res.json({
        success: true,
        count: Object.keys(allData).length,
        data: allData
      });
    }

    const topics = dataService.getAllTopics();
    res.json({
      success: true,
      count: topics.length,
      topics,
      hint: "Add ?full=true to retrieve full dataset objects, or use /api/data/:slug or /api/topics/:slug for specific topics."
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/data/:slug
 * Fetch data for a specific slug (e.g. aws, docker, dsa-arrays)
 */
router.get("/:slug", (req, res) => {
  try {
    const { slug } = req.params;
    const topic = dataService.getTopic(slug);

    if (!topic) {
      return res.status(404).json({
        success: false,
        error: `Data key '${slug}' not found.`
      });
    }

    res.json({
      success: true,
      slug,
      data: topic
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
