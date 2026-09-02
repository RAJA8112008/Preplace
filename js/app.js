(function () {
  const view = document.getElementById("view");
  const searchInput = document.getElementById("globalSearch");
  const themeToggle = document.getElementById("themeToggle");
  const storageKey = "prepplace-progress-v1";
  const themeKey = "prepplace-theme";
  const langKey = "prepplace-code-lang";
  const CODE_LANGS = [
    { id: "javascript", label: "JavaScript" },
    { id: "python", label: "Python" },
    { id: "java", label: "Java" },
    { id: "cpp", label: "C++" },
    { id: "c", label: "C" }
  ];

  const getLang = () => {
    const saved = localStorage.getItem(langKey);
    return CODE_LANGS.some((l) => l.id === saved) ? saved : "javascript";
  };

  const setLang = (id) => localStorage.setItem(langKey, id);

  const pickCode = (block, lang) => {
    if (!block) return "";
    if (block.codes && block.codes[lang]) return block.codes[lang];
    if (lang === "javascript") return block.code || block.codes?.javascript || "";
    return "";
  };

  const langBar = (active) => `
    <div class="lang-bar" role="tablist" aria-label="Code language">
      ${CODE_LANGS.map((l) =>
        `<button class="lang-btn ${l.id === active ? "active" : ""}" type="button" data-lang="${l.id}">${l.label}</button>`
      ).join("")}
    </div>`;

  const loadProgress = () => {
    try { return JSON.parse(localStorage.getItem(storageKey) || "{}"); }
    catch { return {}; }
  };

  const saveProgress = (data) => localStorage.setItem(storageKey, JSON.stringify(data));

  const doneSet = (topicId) => new Set(loadProgress()[topicId] || []);

  const toggleDone = (topicId, qid) => {
    const all = loadProgress();
    const set = new Set(all[topicId] || []);
    if (set.has(qid)) set.delete(qid); else set.add(qid);
    all[topicId] = [...set];
    saveProgress(all);
  };

  const applyTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    themeToggle.textContent = theme === "dark" ? "☀" : "☾";
    localStorage.setItem(themeKey, theme);
  };

  applyTheme(localStorage.getItem(themeKey) || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  themeToggle.addEventListener("click", () => {
    applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  });

  const topicById = (id) => window.PREP_TOPICS.find((t) => t.id === id);
  const careerById = (id) => (window.PREP_CAREERS || []).find((c) => c.id === id);
  const pack = (id) => window.PREP_DATA[id];

  const careerProgress = (career) => {
    const ids = career.steps.map((s) => s.topic);
    return ids.reduce((acc, id) => {
      const p = progressFor(id);
      acc.done += p.done;
      acc.total += p.total;
      return acc;
    }, { done: 0, total: 0 });
  };

  const progressFor = (id) => {
    const total = pack(id)?.questions?.length || 100;
    const done = doneSet(id).size;
    return { done, total, pct: Math.round((done / total) * 100) };
  };

  const escapeHtml = (value) => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

  const copyText = async (code, btn) => {
    try { await navigator.clipboard.writeText(code); }
    catch {
      const ta = document.createElement("textarea");
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    btn.textContent = "Copied";
    setTimeout(() => { btn.textContent = "Copy"; }, 1200);
  };

  const route = () => {
    const hash = location.hash.slice(2) || "";
    const [page, id] = hash.split("/");
    if (page === "topic" && id && topicById(id)) renderTopic(id);
    else if (page === "career" && id && careerById(id)) renderCareer(id);
    else if (page === "topics") renderTopics(searchInput.value);
    else renderHome();
  };

  const topicCard = (t) => {
    const p = progressFor(t.id);
    return `
      <a class="card" href="#/topic/${t.id}">
        <div class="card-top">
          <span class="icon">${t.icon}</span>
          <span class="badge">${t.category}</span>
        </div>
        <h2>${t.title}</h2>
        <p>${t.blurb}</p>
        <p>${(pack(t.id)?.examples || []).length} code examples · ${p.done}/${p.total} done</p>
        <div class="progress"><span style="width:${p.pct}%"></span></div>
      </a>`;
  };

  const renderHome = (filter = "") => {
    const q = (filter || searchInput.value || "").trim().toLowerCase();
    const careers = (window.PREP_CAREERS || []).filter((c) => {
      const hay = `${c.title} ${c.blurb} ${c.builds} ${c.steps.map((s) => s.learn).join(" ")}`.toLowerCase();
      return !q || hay.includes(q);
    });

    const totals = window.PREP_TOPICS.reduce((acc, t) => {
      const p = progressFor(t.id);
      acc.questions += p.total;
      acc.done += p.done;
      return acc;
    }, { questions: 0, done: 0 });

    view.innerHTML = `
      <section class="hero">
        <h1>Pick a career. See what to learn.</h1>
        <p>Frontend, backend, MERN, full stack, ML, DevOps, and a FAANG DSA path. Each path shows the order, then opens notes, easy code, and practice questions.</p>
        <div class="stats">
          <div class="stat"><b>${window.PREP_CAREERS.length}</b><span>career paths</span></div>
          <div class="stat"><b>${window.PREP_TOPICS.length}</b><span>subjects</span></div>
          <div class="stat"><b>${totals.questions}</b><span>questions</span></div>
        </div>
      </section>
      <section class="career-grid">
        ${careers.map((c) => {
          const p = careerProgress(c);
          const pct = p.total ? Math.round((p.done / p.total) * 100) : 0;
          return `
            <a class="card career-card" href="#/career/${c.id}">
              <div class="card-top">
                <span class="icon">${c.icon}</span>
                <span class="badge">${c.steps.length} steps</span>
              </div>
              <h2>${c.title}</h2>
              <p>${c.blurb}</p>
              <p class="time">About ${c.time}</p>
              <p>${p.done}/${p.total} questions done</p>
              <div class="progress"><span style="width:${pct}%"></span></div>
            </a>`;
        }).join("") || `<p class="empty">No career matches that search.</p>`}
      </section>
      <p class="example-intro" style="margin-top:22px">
        Want one subject only? <a href="#/topics">Browse all subjects</a>
      </p>
    `;
  };

  const renderTopics = (filter = "") => {
    const q = (filter || searchInput.value || "").trim().toLowerCase();
    const categories = ["All", ...new Set(window.PREP_TOPICS.map((t) => t.category))];
    const activeCat = window.activeCategory || "All";
    const topics = window.PREP_TOPICS.filter((t) => {
      const data = pack(t.id);
      const hay = `${t.title} ${t.blurb} ${t.category} ${(data?.questions || []).map((x) => x.q).join(" ")}`.toLowerCase();
      return (activeCat === "All" || t.category === activeCat) && (!q || hay.includes(q));
    });

    view.innerHTML = `
      <section class="topic-head">
        <button class="back-btn" type="button" id="backHome">← Career paths</button>
        <h1>All subjects</h1>
        <p class="example-intro">Open any subject. DSA topics include brute, optimal, and more optimal solutions — the ones MAANG / FAANG ask most.</p>
      </section>
      <div class="filters">
        ${categories.map((c) => `<button class="chip ${c === activeCat ? "active" : ""}" data-cat="${c}">${c}</button>`).join("")}
      </div>
      <section class="grid">
        ${topics.map(topicCard).join("") || `<p class="empty">No subjects match that search.</p>`}
      </section>
    `;
    document.getElementById("backHome").addEventListener("click", () => { location.hash = "#/"; });
    view.querySelectorAll("[data-cat]").forEach((btn) => {
      btn.addEventListener("click", () => {
        window.activeCategory = btn.dataset.cat;
        renderTopics(searchInput.value);
      });
    });
  };

  const renderCareer = (id) => {
    const career = careerById(id);
    window.lastCareer = id;
    const p = careerProgress(career);
    const pct = p.total ? Math.round((p.done / p.total) * 100) : 0;

    view.innerHTML = `
      <section class="topic-head">
        <button class="back-btn" type="button" id="backHome">← All careers</button>
        <h1>${career.icon} ${career.title}</h1>
        <p class="example-intro">${escapeHtml(career.blurb)}</p>
        <div class="topic-meta">
          <span class="badge">About ${escapeHtml(career.time)}</span>
          <span>${p.done} / ${p.total} path questions done</span>
        </div>
        <div class="progress"><span style="width:${pct}%"></span></div>
      </section>

      <div class="two-col">
        <article class="learn-box">
          <h3>What you will be able to build</h3>
          <p class="example-intro">${escapeHtml(career.builds)}</p>
        </article>
        <article class="learn-box">
          <h3>Learn in this order</h3>
          <ol>
            ${career.steps.map((s) => `<li><strong>${escapeHtml(s.learn)}</strong></li>`).join("")}
          </ol>
        </article>
      </div>

      <h2 class="section-title">Roadmap — tap a step to study it</h2>
      <section class="roadmap">
        ${career.steps.map((s, i) => {
          const t = topicById(s.topic);
          const prog = progressFor(s.topic);
          return `
            <a class="step" href="#/topic/${s.topic}">
              <span class="step-num">${i + 1}</span>
              <div>
                <h3>${t ? t.icon + " " : ""}${escapeHtml(s.learn)}</h3>
                <p>${escapeHtml(s.why)}</p>
                <p>${prog.done}/${prog.total} questions done</p>
              </div>
            </a>`;
        }).join("")}
      </section>

      <article class="learn-box">
        <h3>Also learn (keep it simple)</h3>
        <ul>
          ${career.extra.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
      </article>
    `;
    document.getElementById("backHome").addEventListener("click", () => { location.hash = "#/"; });
  };

  const renderTopic = (id) => {
    const meta = topicById(id);
    const data = pack(id);
    if (!data) {
      view.innerHTML = `<p class="empty">This topic is still loading.</p>`;
      return;
    }

    const tab = window.topicTab || (data.kind === "dsa" ? "questions" : "examples");
    const level = window.topicLevel || "all";
    const query = (window.topicQuery || "").toLowerCase();
    const done = doneSet(id);
    const p = progressFor(id);
    const notes = data.notes || [];
    const examples = data.examples || [];
    const allQuestions = data.questions || [];
    const questions = allQuestions.filter((item) => {
      const matchLevel = level === "all" || item.level === level;
      const solText = (item.solutions || []).map((s) => {
        const langs = s.codes ? Object.values(s.codes).join(" ") : "";
        return `${s.name} ${s.why} ${s.code || ""} ${langs}`;
      }).join(" ");
      const hay = `${item.q} ${item.a} ${item.code || ""} ${item.ask || ""} ${solText}`.toLowerCase();
      return matchLevel && (!query || hay.includes(query));
    });

    const lang = getLang();
    const langLabel = CODE_LANGS.find((l) => l.id === lang)?.label || lang;

    const renderSolutions = (item) => {
      if (item.solutions && item.solutions.length) {
        return `
          <div class="sol-tabs">
            ${item.solutions.map((s, i) => `<button class="sol-tab ${i === 0 ? "active" : ""}" type="button" data-sol="${i}">${escapeHtml(s.name)}</button>`).join("")}
          </div>
          ${item.solutions.map((s, i) => {
            const src = pickCode(s, lang);
            return `
            <div class="sol-panel ${i === 0 ? "open" : ""}" data-sol-panel="${i}">
              <p class="sol-meta"><span>Time ${escapeHtml(s.time || "")}</span><span>Space ${escapeHtml(s.space || "")}</span><span>${escapeHtml(langLabel)}</span></p>
              <p class="teach-body">${escapeHtml(s.why || "")}</p>
              ${src
                ? `<div class="code-wrap">
                <button class="copy-btn" type="button" data-sol-copy="${i}">Copy</button>
                <pre><code>${escapeHtml(src)}</code></pre>
              </div>`
                : `<p class="empty">This solution is not in ${escapeHtml(langLabel)} yet. Pick JavaScript or another language.</p>`}
            </div>`;
          }).join("")}`;
      }
      const single = pickCode(item, lang) || item.code;
      if (!single) return "";
      return `<p class="answer-label">Code · ${escapeHtml(langLabel)}</p><div class="code-wrap"><pre><code>${escapeHtml(single)}</code></pre></div>`;
    };

    view.innerHTML = `
      <section class="topic-head">
        <button class="back-btn" type="button" id="backHome">${window.lastCareer ? "← Back to path" : "← Career paths"}</button>
        <h1>${meta.icon} ${meta.title}</h1>
        <div class="topic-meta">
          <span class="badge">${meta.category}</span>
          <span>${p.done} / ${p.total} questions done</span>
        </div>
        <div class="progress"><span style="width:${p.pct}%"></span></div>
      </section>
      <div class="tabs">
        <button class="tab ${tab === "examples" ? "active" : ""}" data-tab="examples">Easy code</button>
        <button class="tab ${tab === "notes" ? "active" : ""}" data-tab="notes">Notes</button>
        <button class="tab ${tab === "questions" ? "active" : ""}" data-tab="questions">${allQuestions.length} questions</button>
      </div>
      ${tab === "notes" ? `
        <section class="note-grid">
          ${notes.map((n) => `<article class="note"><h3>${escapeHtml(n.title)}</h3><p>${escapeHtml(n.body)}</p></article>`).join("")}
        </section>` : tab === "examples" ? `
        ${data.kind === "dsa" ? langBar(lang) : ""}
        <p class="example-intro">Read the explanation first, then the code. DSA topics can switch JavaScript, Python, Java, C++, or C.</p>
        <section class="example-list">
          ${examples.map((ex, i) => `
            <article class="example">
              <div class="example-head">
                <h3>${escapeHtml(ex.title)}</h3>
                <span class="badge">${escapeHtml(data.kind === "dsa" ? langLabel : (ex.lang || "code"))}</span>
              </div>
              <div class="teach">
                <p class="answer-label">Explanation</p>
                <p class="teach-body">${escapeHtml(ex.desc || "")}</p>
              </div>
              <p class="answer-label code-label">Code</p>
              <div class="code-wrap">
                <button class="copy-btn" type="button" data-ex="${i}">Copy</button>
                <pre><code>${escapeHtml(pickCode(ex, data.kind === "dsa" ? lang : "javascript") || ex.code || "")}</code></pre>
              </div>
            </article>`).join("") || `<p class="empty">No code examples yet.</p>`}
        </section>` : `
        <div class="toolbar">
          <input class="field" id="qSearch" type="search" placeholder="Filter questions…" value="${escapeHtml(window.topicQuery || "")}" />
          ${["all", "beginner", "intermediate", "advanced"].map((lv) =>
            `<button class="level-btn ${level === lv ? "active" : ""}" data-level="${lv}">${lv}</button>`
          ).join("")}
        </div>
        ${data.kind === "dsa" || allQuestions.some((q) => q.solutions) ? langBar(lang) : ""}
        <section class="qa">
          ${questions.map((item) => `
            <article class="item ${done.has(item.id) ? "done" : ""}" data-qid="${item.id}">
              <button class="q-row" type="button">
                <span class="num">${item.id}</span>
                <span>
                  ${escapeHtml(item.q)}
                  ${item.ask ? `<small class="ask">${escapeHtml(item.ask)}</small>` : ""}
                </span>
                <span class="level">${item.level}</span>
              </button>
              <div class="answer-wrap">
                <p class="answer-label">Explanation</p>
                <p class="answer">${escapeHtml(item.a)}</p>
                ${renderSolutions(item)}
                <button class="done-btn" type="button">${done.has(item.id) ? "Marked done · undo" : "Mark as done"}</button>
              </div>
            </article>`).join("") || `<p class="empty">No questions match this filter.</p>`}
        </section>`}
    `;

    document.getElementById("backHome").addEventListener("click", () => {
      location.hash = window.lastCareer ? `#/career/${window.lastCareer}` : "#/";
    });
    view.querySelectorAll("[data-tab]").forEach((btn) => {
      btn.addEventListener("click", () => { window.topicTab = btn.dataset.tab; renderTopic(id); });
    });
    const qSearch = document.getElementById("qSearch");
    if (qSearch) {
      qSearch.addEventListener("input", (e) => { window.topicQuery = e.target.value; renderTopic(id); qSearch.focus(); qSearch.setSelectionRange(e.target.value.length, e.target.value.length); });
    }
    view.querySelectorAll("[data-level]").forEach((btn) => {
      btn.addEventListener("click", () => { window.topicLevel = btn.dataset.level; renderTopic(id); });
    });
    view.querySelectorAll("[data-lang]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const open = [...view.querySelectorAll(".item.open")].map((el) => el.dataset.qid);
        setLang(btn.dataset.lang);
        renderTopic(id);
        open.forEach((qid) => view.querySelector(`.item[data-qid="${qid}"]`)?.classList.add("open"));
      });
    });
    view.querySelectorAll(".q-row").forEach((btn) => {
      btn.addEventListener("click", () => btn.parentElement.classList.toggle("open"));
    });
    view.querySelectorAll(".done-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const qid = Number(e.target.closest(".item").dataset.qid);
        toggleDone(id, qid);
        renderTopic(id);
      });
    });
    view.querySelectorAll("[data-ex]").forEach((btn) => {
      btn.addEventListener("click", async () => {
          const ex = examples[Number(btn.dataset.ex)];
          const code = pickCode(ex, data.kind === "dsa" ? getLang() : "javascript") || ex?.code || "";
          await copyText(code, btn);
      });
    });
    view.querySelectorAll(".item").forEach((itemEl) => {
      const panels = itemEl.querySelectorAll("[data-sol-panel]");
      const tabs = itemEl.querySelectorAll(".sol-tab");
      tabs.forEach((tabBtn) => {
        tabBtn.addEventListener("click", () => {
          const i = tabBtn.dataset.sol;
          tabs.forEach((t) => t.classList.toggle("active", t.dataset.sol === i));
          panels.forEach((p) => p.classList.toggle("open", p.dataset.solPanel === i));
        });
      });
      itemEl.querySelectorAll("[data-sol-copy]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const qid = Number(itemEl.dataset.qid);
          const item = allQuestions.find((q) => q.id === qid);
          const sol = item?.solutions?.[Number(btn.dataset.solCopy)];
          const code = pickCode(sol, getLang()) || sol?.code || "";
          await copyText(code, btn);
        });
      });
    });
  };

  searchInput.addEventListener("input", () => {
    const hash = location.hash;
    if (hash.startsWith("#/topic/")) {
      window.topicQuery = searchInput.value;
      renderTopic(hash.split("/")[2]);
    } else if (hash.startsWith("#/career/")) renderCareer(hash.split("/")[2]);
    else if (hash.startsWith("#/topics")) renderTopics(searchInput.value);
    else renderHome(searchInput.value);
  });

  window.addEventListener("hashchange", () => {
    window.topicTab = undefined;
    window.topicQuery = "";
    window.topicLevel = "all";
    route();
  });

  route();
})();
