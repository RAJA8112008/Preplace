"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

let cachedData = null;
let cachedTopics = null;

function loadAllData() {
  if (cachedData) return { data: cachedData, topics: cachedTopics };

  const dataDir = path.resolve(__dirname, "..", "..", "..", "frontend", "data");
  const prepData = {};
  let rajSolutions = {};

  if (fs.existsSync(dataDir)) {
    const files = fs.readdirSync(dataDir).filter(f => f.endsWith(".js"));

    files.forEach(file => {
      try {
        const filePath = path.join(dataDir, file);
        const code = fs.readFileSync(filePath, "utf8");

        const sandbox = {
          window: {
            PREP_DATA: prepData,
            RAJ_SOLUTIONS: rajSolutions
          }
        };

        vm.createContext(sandbox);
        vm.runInContext(code, sandbox, { filename: file, timeout: 2000 });

        if (sandbox.window.RAJ_SOLUTIONS && Object.keys(sandbox.window.RAJ_SOLUTIONS).length > 0) {
          rajSolutions = sandbox.window.RAJ_SOLUTIONS;
        }
      } catch (err) {
        console.error(`[DataService] Error parsing ${file}:`, err.message);
      }
    });
  }

  // Format topics list
  const topics = Object.entries(prepData).map(([slug, content]) => {
    const isArray = Array.isArray(content);
    const notesCount = content?.notes?.length || 0;
    const questionsCount = content?.questions?.length || (isArray ? content.length : 0);
    const examplesCount = content?.examples?.length || 0;

    // Derive a clean title from slug
    const cleanTitle = slug
      .split("-")
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    return {
      slug,
      title: content?.title || cleanTitle,
      kind: content?.kind || (slug.startsWith("dsa-") ? "dsa" : slug.startsWith("practice-") ? "practice" : "topic"),
      notesCount,
      questionsCount,
      examplesCount
    };
  });

  cachedData = prepData;
  cachedTopics = topics;

  return { data: cachedData, topics: cachedTopics };
}

function getAllTopics() {
  const { topics } = loadAllData();
  return topics;
}

function getTopic(slug) {
  const { data } = loadAllData();
  const cleanSlug = String(slug || "").trim().toLowerCase();
  return data[cleanSlug] || null;
}

function getAllData() {
  const { data } = loadAllData();
  return data;
}

function search(query) {
  const { data } = loadAllData();
  const q = String(query || "").trim().toLowerCase();
  if (!q) return [];

  const results = [];

  Object.entries(data).forEach(([slug, content]) => {
    if (slug.toLowerCase().includes(q)) {
      results.push({ slug, match: "topic_title", item: { title: slug } });
    }

    if (content?.notes) {
      content.notes.forEach((note, idx) => {
        if (note.title?.toLowerCase().includes(q) || note.body?.toLowerCase().includes(q)) {
          results.push({ slug, type: "note", index: idx, title: note.title, snippet: (note.body || "").slice(0, 160) });
        }
      });
    }

    if (content?.questions) {
      content.questions.forEach((question, idx) => {
        if (question.q?.toLowerCase().includes(q) || question.a?.toLowerCase().includes(q)) {
          results.push({ slug, type: "question", id: question.id || idx + 1, q: question.q, level: question.level });
        }
      });
    }
  });

  return results.slice(0, 50); // limit top 50 matches
}

module.exports = {
  loadAllData,
  getAllTopics,
  getTopic,
  getAllData,
  search
};
