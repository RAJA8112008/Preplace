(function () {
  const view = document.getElementById("view");
  const searchInput = document.getElementById("globalSearch");
  const themeToggle = document.getElementById("themeToggle");
  const storageKey = "prepplace-progress-v1";
  const themeKey = "prepplace-theme";
  const langKey = "prepplace-code-lang";
  const starKey = "prepplace-stars-v1";
  const noteKey = "prepplace-notes-v1";
  const streakKey = "prepplace-streak-v1";
  const COMPANIES = ["Google", "Meta", "Amazon", "Apple", "Microsoft", "Netflix", "Uber", "Adobe"];
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
    if (set.has(qid)) bumpStreak();
  };

  const loadJson = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key) || "") || fallback; }
    catch { return fallback; }
  };

  const starSet = (topicId) => new Set(loadJson(starKey, {})[topicId] || []);
  const toggleStar = (topicId, qid) => {
    const all = loadJson(starKey, {});
    const set = new Set(all[topicId] || []);
    if (set.has(qid)) set.delete(qid); else set.add(qid);
    all[topicId] = [...set];
    localStorage.setItem(starKey, JSON.stringify(all));
  };

  const noteId = (topicId, qid) => `${topicId}:${qid}`;
  const getNote = (topicId, qid) => loadJson(noteKey, {})[noteId(topicId, qid)] || "";
  const saveNote = (topicId, qid, text) => {
    const all = loadJson(noteKey, {});
    all[noteId(topicId, qid)] = text;
    localStorage.setItem(noteKey, JSON.stringify(all));
  };

  const todayStamp = () => new Date().toISOString().slice(0, 10);
  const readStreak = () => loadJson(streakKey, { count: 0, last: "" });
  const bumpStreak = () => {
    const s = readStreak();
    const today = todayStamp();
    if (s.last === today) return;
    const y = new Date();
    y.setDate(y.getDate() - 1);
    const yesterday = y.toISOString().slice(0, 10);
    s.count = s.last === yesterday ? s.count + 1 : 1;
    s.last = today;
    localStorage.setItem(streakKey, JSON.stringify(s));
  };

  const dsaTopics = () => window.PREP_TOPICS.filter((t) => t.id.startsWith("dsa-"));
  const allDsaProblems = () => dsaTopics().flatMap((t) =>
    (pack(t.id)?.questions || []).map((q) => ({
      ...q,
      topicId: t.id,
      topicTitle: t.title,
      topicIcon: t.icon
    }))
  );

  const companyList = (ask) => String(ask || "").split(/[·,]/).map((s) => s.trim()).filter(Boolean);

  const dailyProblem = () => {
    const list = allDsaProblems();
    if (!list.length) return null;
    const day = todayStamp();
    let h = 0;
    for (let i = 0; i < day.length; i++) h = (h * 33 + day.charCodeAt(i)) >>> 0;
    return list[h % list.length];
  };

  const randomProblem = (topicId) => {
    const list = topicId
      ? (pack(topicId)?.questions || []).map((q) => ({ ...q, topicId }))
      : allDsaProblems();
    if (!list.length) return null;
    return list[Math.floor(Math.random() * list.length)];
  };

  const goProblem = (topicId, qid) => { location.hash = `#/topic/${topicId}/${qid}`; };

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
    const [page, id, extra] = hash.split("/");
    if (page === "topic" && id && topicById(id)) renderTopic(id, extra);
    else if (page === "career" && id && careerById(id)) renderCareer(id);
    else if (page === "topics") renderTopics(searchInput.value);
    else if (page === "dsa") renderDsaSheet();
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
          <div class="stat"><b>${readStreak().count}</b><span>day streak</span></div>
        </div>
      </section>
      ${(() => {
        const daily = dailyProblem();
        const dsaDone = dsaTopics().reduce((n, t) => n + progressFor(t.id).done, 0);
        const dsaTotal = dsaTopics().reduce((n, t) => n + progressFor(t.id).total, 0);
        return `
      <div class="quick-row">
        <article class="quick-card">
          <h3>Today's problem</h3>
          <p>${daily ? `${daily.topicIcon} ${escapeHtml(daily.q)} · ${escapeHtml(daily.topicTitle)} · ${escapeHtml(daily.level || "")}` : "DSA topics are still loading."}</p>
          <div class="quick-actions">
            ${daily ? `<button class="tab" type="button" id="openDaily">Open</button>` : ""}
            <button class="tab" type="button" id="openRandom">Random problem</button>
            <a class="tab" href="#/dsa">Full problem sheet</a>
          </div>
        </article>
        <article class="quick-card">
          <h3>Your DSA progress</h3>
          <p>${dsaDone} / ${dsaTotal} interview problems done. Star a problem to revise it later.</p>
          <div class="progress"><span style="width:${dsaTotal ? Math.round((dsaDone / dsaTotal) * 100) : 0}%"></span></div>
        </article>
      </div>`;
      })()}
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
        Want one subject only? <a href="#/topics">Browse all subjects</a> · <a href="#/dsa">Search every DSA problem</a>
      </p>
    `;
    document.getElementById("openDaily")?.addEventListener("click", () => {
      const p = dailyProblem();
      if (p) goProblem(p.topicId, p.id);
    });
    document.getElementById("openRandom")?.addEventListener("click", () => {
      const p = randomProblem();
      if (p) goProblem(p.topicId, p.id);
    });
  };

  const renderDsaSheet = () => {
    const q = (searchInput.value || "").trim().toLowerCase();
    const topicF = window.dsaTopic || "all";
    const levelF = window.dsaLevel || "all";
    const companyF = window.dsaCompany || "all";
    const bagF = window.dsaBag || "all";
    const list = allDsaProblems().filter((item) => {
      const done = doneSet(item.topicId).has(item.id);
      const starred = starSet(item.topicId).has(item.id);
      const hay = `${item.q} ${item.ask || ""} ${item.topicTitle} ${item.level}`.toLowerCase();
      const matchQ = !q || hay.includes(q);
      const matchT = topicF === "all" || item.topicId === topicF;
      const matchL = levelF === "all" || item.level === levelF;
      const matchC = companyF === "all" || companyList(item.ask).some((c) => c.toLowerCase() === companyF.toLowerCase());
      const matchB = bagF === "all" || (bagF === "done" && done) || (bagF === "todo" && !done) || (bagF === "starred" && starred);
      return matchQ && matchT && matchL && matchC && matchB;
    });

    view.innerHTML = `
      <section class="topic-head">
        <button class="back-btn" type="button" id="backHome">← Career paths</button>
        <h1>Problem sheet</h1>
        <p class="example-intro">Every FAANG-style problem in one place. Filter by topic, company, level, or your stars. Click a name to study brute → optimal → more optimal.</p>
        <div class="topic-meta">
          <span class="badge">${list.length} shown</span>
          <span>${readStreak().count} day streak</span>
        </div>
      </section>
      <div class="filters">
        <button class="chip ${topicF === "all" ? "active" : ""}" data-dsa-topic="all">All topics</button>
        ${dsaTopics().map((t) => `<button class="chip ${topicF === t.id ? "active" : ""}" data-dsa-topic="${t.id}">${t.title}</button>`).join("")}
      </div>
      <div class="filters">
        ${["all", "beginner", "intermediate", "advanced"].map((lv) =>
          `<button class="level-btn ${levelF === lv ? "active" : ""}" data-dsa-level="${lv}">${lv}</button>`
        ).join("")}
        ${["all", "todo", "done", "starred"].map((b) =>
          `<button class="level-btn ${bagF === b ? "active" : ""}" data-dsa-bag="${b}">${b}</button>`
        ).join("")}
      </div>
      <div class="filters">
        <button class="chip ${companyF === "all" ? "active" : ""}" data-dsa-co="all">All companies</button>
        ${COMPANIES.map((c) => `<button class="chip ${companyF === c ? "active" : ""}" data-dsa-co="${c}">${c}</button>`).join("")}
      </div>
      <div class="quick-actions" style="margin:0 0 14px">
        <button class="tab" type="button" id="sheetRandom">Random from this list</button>
      </div>
      <table class="sheet-table">
        <thead>
          <tr><th>#</th><th>Problem</th><th>Topic</th><th>Level</th><th>Companies</th><th></th></tr>
        </thead>
        <tbody>
          ${list.map((item, i) => {
            const done = doneSet(item.topicId).has(item.id);
            const starred = starSet(item.topicId).has(item.id);
            return `<tr>
              <td>${i + 1}</td>
              <td><a href="#/topic/${item.topicId}/${item.id}">${escapeHtml(item.q)}</a></td>
              <td>${item.topicIcon} ${escapeHtml(item.topicTitle)}</td>
              <td>${escapeHtml(item.level || "")}</td>
              <td>${escapeHtml(item.ask || "")}</td>
              <td>${starred ? "★" : ""}${done ? " ✓" : ""}</td>
            </tr>`;
          }).join("") || `<tr><td colspan="6">No problems match.</td></tr>`}
        </tbody>
      </table>
    `;
    document.getElementById("backHome").addEventListener("click", () => { location.hash = "#/"; });
    view.querySelectorAll("[data-dsa-topic]").forEach((btn) => {
      btn.addEventListener("click", () => { window.dsaTopic = btn.dataset.dsaTopic; renderDsaSheet(); });
    });
    view.querySelectorAll("[data-dsa-level]").forEach((btn) => {
      btn.addEventListener("click", () => { window.dsaLevel = btn.dataset.dsaLevel; renderDsaSheet(); });
    });
    view.querySelectorAll("[data-dsa-bag]").forEach((btn) => {
      btn.addEventListener("click", () => { window.dsaBag = btn.dataset.dsaBag; renderDsaSheet(); });
    });
    view.querySelectorAll("[data-dsa-co]").forEach((btn) => {
      btn.addEventListener("click", () => { window.dsaCompany = btn.dataset.dsaCo; renderDsaSheet(); });
    });
    document.getElementById("sheetRandom")?.addEventListener("click", () => {
      if (!list.length) return;
      const p = list[Math.floor(Math.random() * list.length)];
      goProblem(p.topicId, p.id);
    });
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

  const renderTopic = (id, openQid) => {
    const meta = topicById(id);
    const data = pack(id);
    if (!data) {
      view.innerHTML = `<p class="empty">This topic is still loading.</p>`;
      return;
    }

    const tab = window.topicTab || (data.kind === "dsa" ? "questions" : "examples");
    const level = window.topicLevel || "all";
    const companyF = window.topicCompany || "all";
    const bagF = window.topicBag || "all";
    const query = (window.topicQuery || "").toLowerCase();
    const stars = starSet(id);
    const done = doneSet(id);
    const p = progressFor(id);
    const notes = data.notes || [];
    const examples = data.examples || [];
    const allQuestions = data.questions || [];
    const questions = allQuestions.filter((item) => {
      const matchLevel = level === "all" || item.level === level;
      const matchC = companyF === "all" || companyList(item.ask).some((c) => c.toLowerCase() === companyF.toLowerCase());
      const isDone = done.has(item.id);
      const isStar = stars.has(item.id);
      const matchB = bagF === "all" || (bagF === "done" && isDone) || (bagF === "todo" && !isDone) || (bagF === "starred" && isStar);
      const solText = (item.solutions || []).map((s) => {
        const langs = s.codes ? Object.values(s.codes).join(" ") : "";
        return `${s.name} ${s.why} ${s.code || ""} ${langs}`;
      }).join(" ");
      const hay = `${item.q} ${item.a} ${item.code || ""} ${item.ask || ""} ${solText}`.toLowerCase();
      return matchLevel && matchC && matchB && (!query || hay.includes(query));
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
          ${["all", "todo", "done", "starred"].map((b) =>
            `<button class="level-btn ${bagF === b ? "active" : ""}" data-bag="${b}">${b}</button>`
          ).join("")}
          <button class="tab" type="button" id="topicRandom">Random</button>
        </div>
        ${data.kind === "dsa" ? `
        <div class="filters">
          <button class="chip ${companyF === "all" ? "active" : ""}" data-co="all">All companies</button>
          ${COMPANIES.map((c) => `<button class="chip ${companyF === c ? "active" : ""}" data-co="${c}">${c}</button>`).join("")}
        </div>` : ""}
        ${data.kind === "dsa" || allQuestions.some((q) => q.solutions) ? langBar(lang) : ""}
        <section class="qa">
          ${questions.map((item) => `
            <article class="item ${done.has(item.id) ? "done" : ""} ${stars.has(item.id) ? "starred" : ""}" data-qid="${item.id}">
              <div class="q-bar">
                <button class="star-btn ${stars.has(item.id) ? "on" : ""}" type="button" data-star title="Save for revision">★</button>
                <button class="q-row" type="button">
                  <span class="num">${item.id}</span>
                  <span>
                    ${escapeHtml(item.q)}
                    ${item.ask ? `<small class="ask">${escapeHtml(item.ask)}</small>` : ""}
                    ${item.links && item.links.length ? `<small class="ask-links">${item.links.map((l) => escapeHtml(l.name)).join(" · ")}</small>` : ""}
                  </span>
                  <span class="level">${item.level}</span>
                </button>
              </div>
              <div class="answer-wrap">
                ${item.links && item.links.length ? `
                  <p class="answer-label">Solve on</p>
                  <p class="plink-row">
                    ${item.links.map((l) => `<a class="plink" href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(l.name)} ↗</a>`).join("")}
                  </p>` : ""}
                ${item.solutions && item.solutions.length ? `
                  <p class="answer-label">Complexity</p>
                  <table class="cx-table">
                    <tr><th>Method</th><th>Time</th><th>Space</th></tr>
                    ${item.solutions.map((s) => `<tr><td>${escapeHtml(s.name)}</td><td>${escapeHtml(s.time || "")}</td><td>${escapeHtml(s.space || "")}</td></tr>`).join("")}
                  </table>` : ""}
                <p class="answer-label">Explanation</p>
                <p class="answer">${escapeHtml(item.a)}</p>
                <div class="q-tools">
                  ${item.solutions ? `<button class="tab" type="button" data-reveal>Show solutions</button>` : ""}
                  <button class="tab" type="button" data-timer>20 min timer</button>
                  <span class="timer-chip" data-timer-view hidden>20:00</span>
                </div>
                <div class="sol-spoiler">${renderSolutions(item)}</div>
                <label class="answer-label" for="note-${item.id}">My notes</label>
                <textarea class="self-note" id="note-${item.id}" data-note placeholder="Your approach, a bug you hit, or a follow-up…">${escapeHtml(getNote(id, item.id))}</textarea>
                <div class="q-tools">
                  <button class="done-btn" type="button">${done.has(item.id) ? "Marked done · undo" : "Mark as done"}</button>
                  <button class="tab" type="button" data-prev>Previous</button>
                  <button class="tab" type="button" data-next>Next</button>
                </div>
              </div>
            </article>`).join("") || `<p class="empty">No questions match this filter.</p>`}
        </section>`}
    `;

    document.getElementById("backHome").addEventListener("click", () => {
      location.hash = window.lastCareer ? `#/career/${window.lastCareer}` : "#/";
    });
    view.querySelectorAll("[data-tab]").forEach((btn) => {
      btn.addEventListener("click", () => { window.topicTab = btn.dataset.tab; renderTopic(id, openQid); });
    });
    const qSearch = document.getElementById("qSearch");
    if (qSearch) {
      qSearch.addEventListener("input", (e) => { window.topicQuery = e.target.value; renderTopic(id, openQid); qSearch.focus(); qSearch.setSelectionRange(e.target.value.length, e.target.value.length); });
    }
    view.querySelectorAll("[data-level]").forEach((btn) => {
      btn.addEventListener("click", () => { window.topicLevel = btn.dataset.level; renderTopic(id, openQid); });
    });
    view.querySelectorAll("[data-bag]").forEach((btn) => {
      btn.addEventListener("click", () => { window.topicBag = btn.dataset.bag; renderTopic(id, openQid); });
    });
    view.querySelectorAll("[data-co]").forEach((btn) => {
      btn.addEventListener("click", () => { window.topicCompany = btn.dataset.co; renderTopic(id, openQid); });
    });
    document.getElementById("topicRandom")?.addEventListener("click", () => {
      const p = randomProblem(id);
      if (p) goProblem(id, p.id);
    });
    view.querySelectorAll("[data-lang]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const open = [...view.querySelectorAll(".item.open")].map((el) => el.dataset.qid);
        setLang(btn.dataset.lang);
        renderTopic(id, openQid);
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
        renderTopic(id, String(qid));
      });
    });
    view.querySelectorAll("[data-star]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const qid = Number(e.target.closest(".item").dataset.qid);
        toggleStar(id, qid);
        renderTopic(id, String(qid));
        view.querySelector(`.item[data-qid="${qid}"]`)?.classList.add("open");
      });
    });
    view.querySelectorAll("[data-reveal]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const box = btn.closest(".answer-wrap").querySelector(".sol-spoiler");
        const open = box.classList.toggle("open");
        btn.textContent = open ? "Hide solutions" : "Show solutions";
      });
    });
    view.querySelectorAll("[data-timer]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const chip = btn.parentElement.querySelector("[data-timer-view]");
        chip.hidden = false;
        if (chip.dataset.running === "1") return;
        chip.dataset.running = "1";
        let left = 20 * 60;
        const tick = () => {
          const m = Math.floor(left / 60);
          const s = left % 60;
          chip.textContent = `${m}:${String(s).padStart(2, "0")}`;
          if (left-- <= 0) {
            clearInterval(chip._tid);
            chip.textContent = "Time up — write brute first";
            chip.dataset.running = "0";
          }
        };
        tick();
        chip._tid = setInterval(tick, 1000);
      });
    });
    view.querySelectorAll("[data-note]").forEach((area) => {
      area.addEventListener("change", () => {
        saveNote(id, Number(area.closest(".item").dataset.qid), area.value);
      });
    });
    view.querySelectorAll("[data-prev], [data-next]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const qid = Number(btn.closest(".item").dataset.qid);
        const ids = allQuestions.map((q) => q.id);
        const i = ids.indexOf(qid);
        const next = btn.hasAttribute("data-next") ? ids[i + 1] : ids[i - 1];
        if (next) goProblem(id, next);
      });
    });
    const focusId = openQid || (location.hash.split("/")[3] || "");
    if (focusId) {
      const el = view.querySelector(`.item[data-qid="${focusId}"]`);
      if (el) {
        el.classList.add("open");
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
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
    }     else if (hash.startsWith("#/career/")) renderCareer(hash.split("/")[2]);
    else if (hash.startsWith("#/topics")) renderTopics(searchInput.value);
    else if (hash.startsWith("#/dsa")) renderDsaSheet();
    else renderHome(searchInput.value);
  });

  window.addEventListener("hashchange", () => {
    window.topicTab = undefined;
    window.topicQuery = "";
    window.topicLevel = "all";
    window.topicCompany = "all";
    window.topicBag = "all";
    route();
  });

  route();
})();
