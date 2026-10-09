/**
 * Preplace Progress & Dashboard Client Module
 * Synchronizes with MongoDB backend when authenticated, with offline localStorage support
 */

(function () {
  "use strict";

  const isLocalHost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const isLocalDevPort = isLocalHost && (window.location.port === "5500" || window.location.port === "3000" || window.location.port === "5173");
  const PRODUCTION_BACKEND_URL = "https://preplace-1.onrender.com";
  const API_BASE = window.PREPLACE_API_BASE || (isLocalDevPort ? "http://127.0.0.1:5000" : (window.location.hostname.includes("onrender.com") ? window.location.origin : PRODUCTION_BACKEND_URL));
  window.PREPLACE_API_BASE = API_BASE;
  const GUEST_STORAGE_KEY = "preplace_guest_progress";

  // Progress State
  let progress = {
    solvedProblems: [],
    completedTopics: [],
    bookmarks: [],
    notes: [],
    streak: { current: 1, highest: 1, lastActiveDate: new Date().toISOString().split("T")[0] }
  };

  // Load guest progress if exists
  try {
    const raw = localStorage.getItem(GUEST_STORAGE_KEY);
    if (raw) progress = { ...progress, ...JSON.parse(raw) };
  } catch (e) {}

  function getAuthToken() {
    return localStorage.getItem("preplace_auth_token");
  }

  function getUser() {
    try {
      return JSON.parse(localStorage.getItem("preplace_user_data"));
    } catch (e) {
      return null;
    }
  }

  // API Call helper
  async function apiCall(endpoint, method = "GET", body = null) {
    const token = getAuthToken();
    if (!token) return null;

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: body ? JSON.stringify(body) : null
      });

      if (!res.ok) throw new Error("API request failed");
      return await res.json();
    } catch (err) {
      console.warn("[Progress] API fallback:", err.message);
      return null;
    }
  }

  // Synchronize progress on startup
  async function fetchProgress() {
    const token = getAuthToken();
    if (token) {
      const data = await apiCall("/api/progress");
      if (data && data.progress) {
        progress = data.progress;
      }
    }
    updateUIElements();
    return progress;
  }

  function saveGuestProgress() {
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(progress));
    updateUIElements();
  }

  // =========================================================================
  // Problem, Topic, Bookmark, & Note Actions
  // =========================================================================

  async function toggleProblem(problemId, title = "", topicId = "", difficulty = "medium") {
    const token = getAuthToken();
    let isSolved = false;

    if (token) {
      const res = await apiCall("/api/progress/toggle-problem", "POST", {
        problemId,
        title,
        topicId,
        difficulty
      });
      if (res && res.progress) {
        progress = res.progress;
        isSolved = res.isSolved;
      }
    } else {
      const idx = progress.solvedProblems.findIndex((p) => p.problemId === problemId);
      if (idx > -1) {
        progress.solvedProblems.splice(idx, 1);
        isSolved = false;
      } else {
        progress.solvedProblems.push({
          problemId,
          title,
          topicId,
          difficulty,
          solvedAt: new Date().toISOString()
        });
        isSolved = true;
      }
      saveGuestProgress();
    }

    updateUIElements();
    showToastNotification(isSolved ? `Problem solved! 🎉` : "Marked as unsolved");
    return isSolved;
  }

  function isProblemSolved(problemId) {
    return progress.solvedProblems.some((p) => p.problemId === problemId);
  }

  async function toggleBookmark(itemId, title = "", category = "problem") {
    const token = getAuthToken();
    let isBookmarked = false;

    if (token) {
      const res = await apiCall("/api/progress/toggle-bookmark", "POST", {
        itemId,
        title,
        category
      });
      if (res) {
        progress.bookmarks = res.bookmarks;
        isBookmarked = res.isBookmarked;
      }
    } else {
      const idx = progress.bookmarks.findIndex((b) => b.itemId === itemId);
      if (idx > -1) {
        progress.bookmarks.splice(idx, 1);
        isBookmarked = false;
      } else {
        progress.bookmarks.push({ itemId, title, category, savedAt: new Date().toISOString() });
        isBookmarked = true;
      }
      saveGuestProgress();
    }

    updateUIElements();
    showToastNotification(isBookmarked ? "Saved to Bookmarks 🔖" : "Removed from Bookmarks");
    return isBookmarked;
  }

  function isBookmarked(itemId) {
    return progress.bookmarks.some((b) => b.itemId === itemId);
  }

  async function toggleTopic(topicId) {
    const token = getAuthToken();
    let isCompleted = false;

    if (token) {
      const res = await apiCall("/api/progress/toggle-topic", "POST", { topicId });
      if (res) {
        progress.completedTopics = res.completedTopics;
        if (res.streak) progress.streak = res.streak;
        isCompleted = res.isCompleted;
      }
    } else {
      const idx = progress.completedTopics.findIndex((t) => t.topicId === topicId);
      if (idx > -1) {
        progress.completedTopics.splice(idx, 1);
        isCompleted = false;
      } else {
        progress.completedTopics.push({ topicId, completedAt: new Date().toISOString() });
        isCompleted = true;
      }
      saveGuestProgress();
    }

    updateUIElements();
    showToastNotification(isCompleted ? "Topic completed! 🚀" : "Topic marked incomplete");
    return isCompleted;
  }

  function isTopicCompleted(topicId) {
    return progress.completedTopics.some((t) => t.topicId === topicId);
  }

  async function saveNote(topicId, title, content) {
    const token = getAuthToken();
    if (token) {
      const res = await apiCall("/api/progress/save-note", "POST", { topicId, title, content });
      if (res && res.notes) progress.notes = res.notes;
    } else {
      const idx = progress.notes.findIndex((n) => n.topicId === topicId);
      if (idx > -1) {
        progress.notes[idx].content = content;
        progress.notes[idx].title = title || progress.notes[idx].title;
        progress.notes[idx].updatedAt = new Date().toISOString();
      } else {
        progress.notes.push({ topicId, title, content, updatedAt: new Date().toISOString() });
      }
      saveGuestProgress();
    }
    showToastNotification("Study note saved 📝");
  }

  async function deleteNote(topicId) {
    const token = getAuthToken();
    if (token) {
      const res = await apiCall(`/api/progress/delete-note/${topicId}`, "DELETE");
      if (res && res.notes) progress.notes = res.notes;
    } else {
      progress.notes = progress.notes.filter((n) => n.topicId !== topicId);
      saveGuestProgress();
    }
    showToastNotification("Note removed");
  }

  function showToastNotification(msg) {
    if (window.PreplaceAuth && typeof window.showToast === "function") {
      window.showToast(msg, "success");
    }
  }

  function updateUIElements() {
    // Update all checkbox buttons on page
    document.querySelectorAll(".prep-check-btn[data-problem-id]").forEach((btn) => {
      const pid = btn.dataset.problemId;
      if (isProblemSolved(pid)) {
        btn.classList.add("checked");
        btn.setAttribute("aria-checked", "true");
        btn.innerHTML = `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>`;
      } else {
        btn.classList.remove("checked");
        btn.setAttribute("aria-checked", "false");
        btn.innerHTML = "";
      }
    });
  }

  // =========================================================================
  // Dashboard HTML Renderer
  // =========================================================================
  function renderDashboardView() {
    const user = getUser();
    const solved = progress.solvedProblems || [];
    const easyCount = solved.filter((p) => (p.difficulty || "easy").toLowerCase() === "easy").length;
    const mediumCount = solved.filter((p) => (p.difficulty || "").toLowerCase() === "medium").length;
    const hardCount = solved.filter((p) => (p.difficulty || "").toLowerCase() === "hard").length;
    const streakDays = progress.streak?.current || 1;

    const careers = [
      { id: "frontend", name: "Frontend Engineer", icon: "🎨", total: 24 },
      { id: "backend", name: "Backend Engineer", icon: "⚙️", total: 28 },
      { id: "mern", name: "MERN Stack Developer", icon: "⚡", total: 32 },
      { id: "fullstack", name: "Full Stack Engineer", icon: "🌐", total: 35 },
      { id: "devops", name: "DevOps & Cloud Engineer", icon: "☁️", total: 22 },
      { id: "ml", name: "Machine Learning Engineer", icon: "🤖", total: 18 },
      { id: "dsa", name: "FAANG DSA Master", icon: "🏆", total: 75 }
    ];

    const initials = (user?.name || "Learner")
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    return `
      <div class="dashboard-container">
        
        <!-- Header -->
        <div class="dashboard-header">
          <div class="dashboard-user-hero">
            <div class="dashboard-user-avatar" style="background-color: ${user?.avatar_color || '#4f46e5'}">
              ${initials}
            </div>
            <div>
              <h1 class="dashboard-title">${user ? escapeHtml(user.name) : "My Learning Dashboard"}</h1>
              <p class="dashboard-subtitle">${user ? escapeHtml(user.email) : "Sign in to keep your progress synced across devices"}</p>
            </div>
          </div>

          <div class="streak-hero-badge">
            <span class="streak-flame">🔥</span>
            <span>${streakDays} Day${streakDays === 1 ? "" : "s"} Streak</span>
          </div>
        </div>

        <!-- Metric Cards -->
        <div class="dashboard-stats-grid">
          
          <div class="stat-metric-card">
            <div class="stat-metric-top">
              <span class="stat-metric-label">Problems Solved</span>
              <div class="stat-metric-icon">🎯</div>
            </div>
            <div class="stat-metric-value">${solved.length}</div>
            <div class="diff-pills-wrap">
              <span class="diff-pill easy">Easy: ${easyCount}</span>
              <span class="diff-pill medium">Med: ${mediumCount}</span>
              <span class="diff-pill hard">Hard: ${hardCount}</span>
            </div>
          </div>

          <div class="stat-metric-card">
            <div class="stat-metric-top">
              <span class="stat-metric-label">Completed Topics</span>
              <div class="stat-metric-icon">📚</div>
            </div>
            <div class="stat-metric-value">${progress.completedTopics?.length || 0}</div>
            <div class="stat-metric-label" style="margin-top: 10px;">Across 10 core engineering tracks</div>
          </div>

          <div class="stat-metric-card">
            <div class="stat-metric-top">
              <span class="stat-metric-label">Saved Bookmarks</span>
              <div class="stat-metric-icon">🔖</div>
            </div>
            <div class="stat-metric-value">${progress.bookmarks?.length || 0}</div>
            <div class="stat-metric-label" style="margin-top: 10px;">Pinned problems & interview notes</div>
          </div>

          <div class="stat-metric-card">
            <div class="stat-metric-top">
              <span class="stat-metric-label">Study Notes</span>
              <div class="stat-metric-icon">📝</div>
            </div>
            <div class="stat-metric-value">${progress.notes?.length || 0}</div>
            <div class="stat-metric-label" style="margin-top: 10px;">Personal revision takeaways</div>
          </div>

        </div>

        <!-- Career Path Tracks -->
        <div class="dashboard-section">
          <h2 class="dashboard-section-title"><span>🚀</span> Career Path Completion</h2>
          <div class="career-cards-grid">
            ${careers
              .map((c) => {
                const count = solved.filter((p) => p.topicId?.startsWith(c.id) || p.topicId === c.id).length;
                const pct = Math.min(100, Math.round((count / c.total) * 100));
                return `
                  <a class="career-progress-card" href="#/career/${c.id}">
                    <div class="career-card-top">
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <span>${c.icon}</span>
                        <span class="career-card-name">${c.name}</span>
                      </div>
                      <span style="font-weight: 700; font-size: 13px; font-family: 'IBM Plex Mono', monospace;">${pct}%</span>
                    </div>
                    <div class="career-progress-bar-bg">
                      <div class="career-progress-bar-fill" style="width: ${pct}%;"></div>
                    </div>
                    <div style="font-size: 12px; color: var(--fg-muted);">
                      ${count} of ${c.total} questions mastered
                    </div>
                  </a>
                `;
              })
              .join("")}
          </div>
        </div>

        <!-- Activity & Notes Split View -->
        <div class="dashboard-split-grid">
          
          <!-- Recent Solved Problems -->
          <div class="dashboard-panel-card">
            <div class="dashboard-panel-header">
              <h3 class="dashboard-panel-title"><span>✅</span> Recently Solved</h3>
              <span style="font-size: 12px; color: var(--fg-muted);">${solved.length} Total</span>
            </div>
            
            ${
              solved.length === 0
                ? `<div class="dashboard-empty">
                    <div class="dashboard-empty-icon">🎯</div>
                    <p>No solved problems yet. Head over to the <a href="#/dsa" style="color: var(--accent);">Problem sheet</a> to start ticking them off!</p>
                  </div>`
                : `<div class="dashboard-items-list">
                    ${solved
                      .slice(-8)
                      .reverse()
                      .map(
                        (p) => `
                        <div class="dashboard-item-row">
                          <div style="display: flex; align-items: center; gap: 8px; overflow: hidden;">
                            <span class="diff-pill ${p.difficulty || "medium"}" style="flex: none; padding: 2px 6px; font-size: 10px;">${p.difficulty || "Med"}</span>
                            <strong style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(p.title || p.problemId)}</strong>
                          </div>
                          <button class="prep-check-btn checked" data-problem-id="${p.problemId}" title="Toggle status" type="button">
                            <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                          </button>
                        </div>
                      `
                      )
                      .join("")}
                  </div>`
            }
          </div>

          <!-- Personal Study Notes -->
          <div class="dashboard-panel-card">
            <div class="dashboard-panel-header">
              <h3 class="dashboard-panel-title"><span>📝</span> Personal Study Notes</h3>
              <span style="font-size: 12px; color: var(--fg-muted);">${progress.notes?.length || 0} Notes</span>
            </div>

            ${
              (!progress.notes || progress.notes.length === 0)
                ? `<div class="dashboard-empty">
                    <div class="dashboard-empty-icon">💡</div>
                    <p>You haven't written any study notes yet. You can add notes inside any Topic or Lab page.</p>
                  </div>`
                : `<div class="dashboard-items-list">
                    ${progress.notes
                      .slice(-6)
                      .reverse()
                      .map(
                        (n) => `
                        <div class="dashboard-item-row" style="flex-direction: column; align-items: flex-start; gap: 6px;">
                          <div style="display: flex; width: 100%; justify-content: space-between; align-items: center;">
                            <strong style="color: var(--accent); font-size: 13px;">${escapeHtml(n.title || n.topicId)}</strong>
                            <button class="auth-sublink" style="color: #ef4444;" onclick="window.PreplaceProgress.deleteNote('${n.topicId}').then(() => location.reload())">Delete</button>
                          </div>
                          <p style="margin: 0; font-size: 12px; color: var(--fg); line-height: 1.4;">${escapeHtml(n.content)}</p>
                        </div>
                      `
                      )
                      .join("")}
                  </div>`
            }
          </div>

        </div>

      </div>
    `;
  }

  function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/[&<>"']/g, (m) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[m]);
  }

  // Bind click handler for all problem check buttons on document
  document.addEventListener("click", async (e) => {
    const btn = e.target.closest(".prep-check-btn[data-problem-id]");
    if (!btn) return;

    e.preventDefault();
    e.stopPropagation();

    const problemId = btn.dataset.problemId;
    const title = btn.dataset.title || btn.closest("tr, .question-card, .dashboard-item-row")?.querySelector("strong, h3, a")?.textContent?.trim() || problemId;
    const topicId = btn.dataset.topicId || "";
    const difficulty = btn.dataset.difficulty || "medium";

    await toggleProblem(problemId, title, topicId, difficulty);
  });

  // Global exports
  window.PreplaceProgress = {
    fetchProgress,
    toggleProblem,
    isProblemSolved,
    toggleBookmark,
    isBookmarked,
    toggleTopic,
    isTopicCompleted,
    saveNote,
    deleteNote,
    renderDashboardView,
    updateUIElements
  };

  // Init on load
  document.addEventListener("DOMContentLoaded", () => {
    fetchProgress();
  });
})();
