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
  const accountsKey = "prepplace-accounts-v1";
  const sessionKey = "prepplace-session-v1";
  const userDataKey = "prepplace-user-data-v1";
  const CONTACT = { name: "Raj Kumar", email: "kraj9380286@gmail.com" };
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

  const commentMark = (lang) => {
    if (lang === "python" || lang === "txt") return "#";
    if (lang === "sql") return "--";
    return "//";
  };

  const stripTrailComment = (text, lang) => {
    const t = String(text || "");
    if (lang === "sql") return t.replace(/\s+--.*$/, "").trim();
    if (lang === "python" || lang === "txt") return t.replace(/\s+#.*$/, "").trim();
    return t.replace(/\s+\/\/.*$/, "").trim();
  };

  const isNoiseCodeLine = (t, lang) => {
    const s = t.trim();
    if (!s) return true;
    if (s === "{" || s === "}" || s === "};" || s === "});" || s === "},") return true;
    if (/^(public|private|protected):$/.test(s)) return true;
    if (s === "@Override" || s === "from __future__ import annotations") return true;
    if (/^(#include|using namespace|import |from |package )/.test(s)) return true;
    if (/^class (ListNode|TreeNode|Node)\b/.test(s)) return true;
    if (/^struct (ListNode|TreeNode|Node)\b/.test(s)) return true;
    if (/^(int val;|ListNode \*?next|TreeNode \*?(left|right)|Node \*?(next|prev))/.test(s)) return true;
    if (lang === "python") return s.startsWith("#");
    return s.startsWith("//") || s.startsWith("/*") || s.startsWith("*") || s.startsWith("*/");
  };

  const explainDsaLine = (raw, lang) => {
    const s = stripTrailComment(raw, lang).replace(/;$/, "");
    if (!s) return "";

    if (/^class Solution\b/.test(s)) return "leetcode class — put the method you submit inside here";
    const fn = s.match(/^(?:function|def)\s+(\w+)/) || s.match(/\b(?:public|private|static|ListNode|TreeNode|vector<\w+>|int|string|bool|void|long)\s+(?:\w+\s+)*(\w+)\s*\(/);
    if (fn && fn[1] && !/^(if|for|while|switch|main|ListNode|TreeNode)$/.test(fn[1])) {
      return `${fn[1]} — this is the function you submit`;
    }

    if (/\b(const|let|var|int|size_t)\s+n\b/.test(s) || /\bn\s*=\s*(len\(|.*\.length|.*\.size\(\))/.test(s)) return "n = how many items we have";
    if (/\b(left|lo|l)\b\s*=\s*0\b/.test(s)) return "left pointer starts at the first index";
    if (/\b(right|hi|r)\b\s*=\s*(n\s*-\s*1|\w+\.length\s*-\s*1|len\()/.test(s)) return "right pointer starts at the last index";
    if (/\bslow\b\s*=\s*(head|0)\b/.test(s)) return "slow starts at the beginning (moves 1 step)";
    if (/\bfast\b\s*=\s*(head|0)\b/.test(s)) return "fast starts at the beginning (moves 2 steps)";
    if (/\b(prev)\b\s*=\s*(null|None|nullptr|NULL)\b/.test(s)) return "prev is the node behind us (starts empty)";
    if (/\b(curr|cur|current)\b\s*=\s*head\b/.test(s)) return "curr walks the list from the head";
    if (/\w+(->|\.)next\s*=\s*next\b/.test(s)) return "attaching to the next";
    if (/\bnext\b\s*=\s*(curr|cur)(->|\.)next/.test(s)) return "save next node before we break the link";
    if (/(curr|cur)(->|\.)next\s*=\s*prev/.test(s)) return "reverse this link: point to the previous node";
    if (/(curr|cur)(->|\.)prev\s*=\s*next/.test(s)) return "doubly list: old next becomes prev";
    if (/prev\s*=\s*(curr|cur)\b/.test(s)) return "this node is now the previous one";
    if (/(curr|cur)\s*=\s*next\b/.test(s)) return "walk forward to the saved next node";
    if (/slow\s*=\s*slow(->|\.)next\b/.test(s)) return "slow takes one step";
    if (/fast\s*=\s*fast(->|\.)next(->|\.)next/.test(s)) return "fast takes two steps";
    if (/\bleft\b\s*(\+\+| \+= 1| = left \+ 1)/.test(s)) return "move left pointer forward";
    if (/\bright\b\s*(--| \-= 1| = right - 1)/.test(s)) return "move right pointer backward";

    if (/new Map|unordered_map|HashMap|dict\(\)/.test(s)) return "hash map: remember a value we already saw";
    if (/new Set|unordered_set|HashSet|set\(\)/.test(s)) return "set: remember unique values we already saw";
    if (/\.set\(|\.put\(/.test(s)) return "store this value so we can look it up later";
    if (/\.has\(|\.containsKey\(|\.get\(/.test(s) && /map|seen|need|freq|index|want/i.test(s)) return "have we already seen the partner we need?";

    if (/for\s*\(.*\bj\b/.test(s) || /for j in/.test(s)) return "second loop: pick a later index j";
    if (/for\s*\(.*\bk\b/.test(s) || /for k in/.test(s)) return "third loop / walk this window";
    if (/for\s*\(.*\bi\b/.test(s) || /for i in/.test(s)) return "first loop: pick index i";
    if (/for\s*\(/.test(s) || /^for /.test(s)) return "walk each item in this collection";
    if (/while\s*\(.*fast/.test(s)) return "keep going while a two-step is still safe";
    if (/while\s*\(.*left.*right|while\s*\(.*\bl\b\s*<\s*\br\b/.test(s)) return "two pointers walk toward each other";
    if (/while\s*\(.*curr|while\s*\(.*cur/.test(s)) return "walk until we run out of nodes";
    if (/while\s*\(/.test(s)) return "repeat while this condition is still true";

    if (/if\s*\(.*===?\s*target|== target/.test(s)) return "this pair (or value) hits the target";
    if (/if\s*\(.*null|None|nullptr|NULL/.test(s)) return "stop if this pointer is empty";
    if (/if\s*\(/.test(s) || /elif |else if/.test(s)) return "only do the next lines when this is true";
    if (/^else\b/.test(s)) return "the if above was false, so do this instead";

    if (/return \[\]|return \{\}|return null|return nullptr|return None|return 0$|return -1/.test(s)) return "no valid answer — send the empty / fail value";
    if (/^return\b/.test(s)) return "answer is ready — leave the function";

    if (/Math\.max|\bmax\(/.test(s)) return "keep the bigger of these two values";
    if (/Math\.min|\bmin\(/.test(s)) return "keep the smaller of these two values";
    if (/\.sort\(|\bsort\(/.test(s)) return "sort so nearby values sit together";
    if (/\.push\(|\.append\(|\.add\(/.test(s)) return "add this item to the result";
    if (/\.pop\(|\.poll\(/.test(s)) return "take one item off the stack / queue";
    if (/\btemp\b\s*=/.test(s)) return "hold one value so we can swap safely";

    if (/\bdp\[/.test(s) && /=/.test(s)) return "fill this dp cell from smaller answers we already know";
    if (/(new Array|vector<|memset|fill\().*(dp|memo)|((dp|memo).*(new Array|vector<|memset|fill\())/i.test(s)) return "make the dp table (empty / impossible at first)";

    if (/const |let |var |int |long |bool |string |auto |def /.test(s) && /=/.test(s)) return "name this value so later lines can use it";
    return "";
  };

  const isStandaloneComment = (t, lang) => {
    if (!t) return false;
    if (/^#\s*(include|define|ifndef|ifdef|endif|pragma|undef)\b/.test(t)) return false;
    if (lang === "sql") return t.startsWith("--");
    if (lang === "python" || lang === "txt") return t.startsWith("#");
    return t.startsWith("//");
  };

  const hasTrailComment = (line, lang) => {
    if (lang === "sql") return /\s+--\s+\S/.test(line);
    if (lang === "python" || lang === "txt") return /[^#]\s+#\s+\S/.test(line);
    return /\s+\/\/\s+\S/.test(line);
  };

  const explainAppLine = (raw, lang) => {
    const s = stripTrailComment(raw, lang).replace(/;$/, "");
    if (!s) return "";

    if (/\bfetch\s*\(\s*["'`]https:\/\//.test(s)) return "ask the server on HTTPS — the safe encrypted path";
    if (/\bfetch\s*\(\s*["'`]http:\/\//.test(s)) return "plain HTTP — never send a password this way";
    if (/\bfetch\s*\(/.test(s)) return "ask the server for this URL";
    if (/\.json\s*\(/.test(s) && /res|response|r\b/.test(s)) return "turn the reply body into data we can use";
    if (/JSON\.stringify/.test(s) && /localStorage|setItem/.test(s)) return "save the list as text in the browser";
    if (/JSON\.stringify/.test(s)) return "turn this object into JSON text";
    if (/JSON\.parse/.test(s) && /localStorage|getItem/.test(s)) return "read the saved list back into objects";
    if (/JSON\.parse/.test(s)) return "turn JSON text back into an object";
    if (/localStorage\.setItem/.test(s) && /token/.test(s)) return "remember login in the browser";
    if (/localStorage\.setItem/.test(s)) return "keep this value after refresh";
    if (/localStorage\.getItem/.test(s) && /token/.test(s)) return "read the login ticket if we have one";
    if (/localStorage\.getItem/.test(s)) return "read what we saved last time";
    if (/localStorage\.removeItem/.test(s)) return "forget the login — this is logout";

    if (/bcrypt\.hash/.test(s)) return "scramble the password — never store the real one";
    if (/bcrypt\.compare/.test(s)) return "check the typed password against the saved scramble";
    if (/jwt\.sign/.test(s)) return "make a signed login ticket";
    if (/jwt\.verify/.test(s)) return "check the ticket is real and not expired";
    if (/Authorization|Bearer/.test(s)) return "send the login ticket with this request";
    if (/httpOnly/.test(s) || /sameSite/.test(s) || /secure:\s*true/.test(s)) return "cookie flags: JS cannot read it, HTTPS only";
    if (/res\.cookie|clearCookie/.test(s)) return "set or clear the session cookie";
    if (/req\.session/.test(s)) return "server-side login memory for this visitor";

    if (/app\.get\(\s*["'`]\/health/.test(s)) return "cheap URL the host pings to see if we are up";
    if (/app\.get\(\s*["'`]\/me/.test(s)) return "who is logged in — needs a valid ticket";
    if (/app\.get\(/.test(s)) return "GET — read data and send JSON back";
    if (/app\.post\(/.test(s) && /login/.test(s)) return "POST /login — check email and password";
    if (/app\.post\(/.test(s)) return "POST — create a new row and answer 201";
    if (/app\.patch\(|app\.put\(/.test(s)) return "PATCH/PUT — change an existing row";
    if (/app\.delete\(/.test(s)) return "DELETE — remove this row";
    if (/status\(401\)/.test(s)) return "401 — we do not know who you are";
    if (/status\(403\)/.test(s)) return "403 — we know you, but you may not do this";
    if (/status\(404\)/.test(s)) return "404 — that id is not here";
    if (/status\(400\)/.test(s)) return "400 — the input is missing or wrong";
    if (/status\(201\)/.test(s)) return "201 — created";
    if (/status\(204\)/.test(s)) return "204 — deleted, nothing to send back";
    if (/status\(429\)/.test(s)) return "429 — too many tries, slow down";
    if (/status\(409\)/.test(s)) return "409 — this email / value is already taken";
    if (/res\.json\(/.test(s)) return "send this data back as JSON";
    if (/res\.redirect/.test(s)) return "send the browser to another URL";
    if (/cors\(/.test(s)) return "allow this UI origin to call the API";
    if (/proxy/.test(s) || /proxy_pass/.test(s)) return "forward the request to the app behind this door";

    if (/\brole\b/.test(s) && /admin/.test(s) && /!==|!=|===|==/.test(s)) return "authorization — only an admin may continue";
    if (/user_id|userId/.test(s) && /!==|!=|===/.test(s)) return "authorization — this row must belong to you";
    if (/trim\(\)/.test(s) && /if \(/.test(s)) return "empty text is not a real task — stop here";
    if (/\.trim\(\)/.test(s)) return "drop extra spaces around the text";

    if (/\.push\(/.test(s)) return "Create — add this item to the list";
    if (/\.map\(/.test(s) && /done/.test(s)) return "Update — flip done on the matching id";
    if (/\.map\(/.test(s)) return "Update — replace the matching item, keep the rest";
    if (/\.filter\(/.test(s) && /done/.test(s)) return "keep only the tasks that are still open";
    if (/\.filter\(/.test(s)) return "Delete — drop the matching id, keep the rest";
    if (/\.forEach\(/.test(s) || /\.find\(/.test(s)) return "Read — walk or find an item in the list";

    if (/useState\(/.test(s)) return "React box that holds this value and redraws the screen";
    if (/useEffect\(/.test(s)) return "run this after the screen paints — good for loading data";
    if (/preventDefault/.test(s)) return "stop the form from reloading the page";
    if (/navigate\(|location\.hash/.test(s) && /login/.test(s)) return "send the user to the login screen";
    if (/navigate\(/.test(s) || /<Navigate/.test(s)) return "move to this page";
    if (/setTodos|setText|setErr|setUser|setLoading/.test(s)) return "update the screen with the new value";

    if (/insertOne|INSERT INTO/.test(s)) return "Create — write a new row / document";
    if (/find\(|findOne|SELECT /.test(s)) return "Read — load matching rows";
    if (/updateOne|\$set|UPDATE /.test(s)) return "Update — change fields on this row";
    if (/deleteOne|deleteMany|DELETE FROM/.test(s)) return "Delete — remove matching rows";
    if (/createIndex|UNIQUE/.test(s)) return "no two people can share this email";
    if (/ObjectId/.test(s)) return "Mongo id — check it is a real id first";
    if (/RETURNING/.test(s)) return "give the new row back after the insert";
    if (/BEGIN|COMMIT/.test(s)) return "all of these writes succeed together, or none do";
    if (/WHERE/.test(s) && /user_id|userId/.test(s)) return "only this user's rows — never the whole table";
    if (/CREATE TABLE/.test(s)) return "make the table and name its columns";
    if (/REFERENCES/.test(s)) return "this id must exist in the other table";
    if (/GROUP BY/.test(s)) return "one row per group — then sum or count";
    if (/ORDER BY/.test(s)) return "sort the result";

    if (/redis\.(get|set|del|incr)/.test(s) || /\bredis\b/.test(s) && /SET |GET |DEL |INCR /.test(s)) return "fast memory box — cache, session, or rate limit";
    if (/joblib\.dump/.test(s)) return "save the trained model to a file";
    if (/joblib\.load/.test(s)) return "load the saved model so we can predict";
    if (/\.fit\(/.test(s)) return "train — learn from these X and y rows";
    if (/\.predict\(/.test(s)) return "guess the label for this new input";
    if (/train_test_split/.test(s)) return "hold some rows back so we can test fairly";

    if (/^FROM /.test(s)) return "start the image from this known base";
    if (/^WORKDIR /.test(s)) return "later commands run in this folder";
    if (/^COPY /.test(s)) return "put these files into the image";
    if (/^RUN /.test(s)) return "install or build inside the image";
    if (/^CMD /.test(s)) return "this is the process the container starts";
    if (/listen 443/.test(s)) return "HTTPS port — TLS ends here";
    if (/listen 80/.test(s)) return "plain HTTP — usually redirect to 443";
    if (/ssl_certificate/.test(s)) return "the public certificate for HTTPS";
    if (/gitignore|\.env/.test(s) && /echo|>>/.test(s)) return "secrets stay out of Git";

    if (/^function |^async function |^const \w+ = (async )?\(/.test(s) || /^def /.test(s)) {
      const fn = s.match(/(?:function|def)\s+(\w+)/) || s.match(/const\s+(\w+)\s*=/);
      return fn ? `${fn[1]} — this function does one clear job` : "this function does one clear job";
    }
    if (/^if\s*\(/.test(s) || /^if /.test(s)) return "only do the next lines when this is true";
    if (/^else\b/.test(s)) return "the if above was false, so do this instead";
    if (/^try\b/.test(s)) return "try the happy path — catch will run if it fails";
    if (/^catch\b/.test(s)) return "the request failed — undo or show an error";
    if (/^return\b/.test(s)) return "answer is ready — leave the function";
    if (/^(const|let|var)\s+/.test(s) && /=/.test(s)) return "name this value so later lines can use it";
    return "";
  };

  const annotateAppCode = (code, lang) => {
    if (!code) return "";
    const mark = commentMark(lang);
    const out = [];
    for (const line of flattenAboveComments(code, lang).split("\n")) {
      const t = line.trim();
      if (!t || t === "{" || t === "}" || t === "};" || t === "});" || t === "},") {
        out.push(line);
        continue;
      }
      if (hasTrailComment(line, lang) || isStandaloneComment(t, lang)) {
        out.push(line);
        continue;
      }
      const meaning = explainAppLine(t, lang);
      if (meaning) out.push(`${line.replace(/\s+$/, "")}  ${mark} ${meaning}`);
      else out.push(line);
    }
    return out.join("\n");
  };

  const teachSrc = (src, lang, kind) => (kind === "dsa" ? annotateDsaCode(src, lang) : annotateAppCode(src, lang));

  const flattenAboveComments = (code, lang) => {
    const mark = commentMark(lang);
    const lines = String(code).split("\n");
    const out = [];
    let pending = [];
    for (const line of lines) {
      const t = line.trim();
      if (isStandaloneComment(t, lang)) {
        pending.push(t.replace(/^(\/\/|#|--)\s*/, ""));
        continue;
      }
      if (!t) {
        if (!pending.length) out.push(line);
        continue;
      }
      if (pending.length && t !== "{" && t !== "}" && t !== "};") {
        const note = pending.filter(Boolean).join(" · ");
        pending = [];
        if (!hasTrailComment(line, lang)) {
          out.push(`${line.replace(/\s+$/, "")}  ${mark} ${note}`);
          continue;
        }
      }
      pending = [];
      out.push(line);
    }
    return out.join("\n");
  };

  const showCode = (src, lang) =>
    paintCode(String(flattenAboveComments(src || "", lang)).replace(/\n{2,}/g, "\n").replace(/^\n+|\n+$/g, ""), lang);

  const annotateDsaCode = (code, lang) => {
    if (!code) return "";
    const mark = commentMark(lang);
    const out = [];
    for (const line of flattenAboveComments(code, lang).split("\n")) {
      const t = line.trim();
      if (isNoiseCodeLine(t, lang) || hasTrailComment(line, lang) || isStandaloneComment(t, lang)) {
        out.push(line);
        continue;
      }
      const meaning = explainDsaLine(t, lang);
      if (meaning) out.push(`${line.replace(/\s+$/, "")}  ${mark} ${meaning}`);
      else out.push(line);
    }
    return out.join("\n");
  };

  const paintLang = (ex) => {
    const l = String(ex?.lang || "").toLowerCase();
    if (l === "py" || l === "python") return "python";
    if (l === "cpp" || l === "c++") return "cpp";
    if (l === "c" || l === "java") return l;
    if (l === "sql") return "sql";
    if (l === "txt" || l === "bash" || l === "yml" || l === "yaml") return "txt";
    return "javascript";
  };

  const inferLang = (item) => {
    if (item?.lang) return paintLang(item);
    const c = String(item?.code || "");
    if (/^\s*(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|WITH)\b/im.test(c)) return "sql";
    if (/^\s*(from |import |def |print\(|joblib)/m.test(c)) return "python";
    if (/^\s*(FROM |WORKDIR |COPY |RUN |CMD |services:|on: \[|listen )/m.test(c)) return "txt";
    return "javascript";
  };

  const paintCode = (src, lang) => {
    if (!src) return "";
    const hashCmt = lang === "python" || lang === "txt";
    const isSql = lang === "sql";
    const mark = isSql ? "--" : hashCmt ? "#" : "//";
    return String(src).split("\n").map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return "";
      if (/^#\s*(include|define|ifndef|ifdef|endif|pragma|undef)\b/.test(trimmed)) {
        return `<span class="code-line"><span class="code-src">${escapeHtml(line)}</span></span>`;
      }
      if (/^(\/\/|#|--|\/\*|\*)/.test(trimmed) || trimmed.startsWith("*/")) {
        return `<span class="code-line is-cmt"><span class="code-cmt">${escapeHtml(line)}</span></span>`;
      }
      let cut = isSql ? line.search(/\s--/) : hashCmt ? line.search(/(^|[^"'])\s#/) : line.search(/\s\/\//);
      if (!hashCmt && !isSql && cut < 0) cut = line.search(/\/\/[a-zA-Z]/);
      if (cut >= 0) {
        const at = line.indexOf(mark, cut);
        if (at > 0) {
          return `<span class="code-line has-cmt"><span class="code-src">${escapeHtml(line.slice(0, at).trimEnd())}</span><span class="code-cmt">${escapeHtml(line.slice(at).trim())}</span></span>`;
        }
      }
      return `<span class="code-line"><span class="code-src">${escapeHtml(line)}</span></span>`;
    }).filter(Boolean).join("\n");
  };

  const dsaSrc = (block, lang) => annotateDsaCode(pickCode(block, lang) || block?.code || "", lang);

  const lcSlugOf = (item) => {
    const u = (item.links || []).find((l) => /leetcode\.com\/problems\//.test(l.url || ""));
    return u ? ((u.url.match(/leetcode\.com\/problems\/([^/]+)/) || [])[1] || "") : "";
  };

  const rajFor = (item) => {
    const pack = window.RAJ_SOLUTIONS || {};
    const slug = lcSlugOf(item);
    if (slug && pack[slug]) return pack[slug];
    const key = String(item.q || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return pack[key] || null;
  };

  const dsaSols = (item) => {
    const sols = (item.solutions || []).map((s) => Object.assign({}, s));
    const raj = rajFor(item);
    const src = raj && (raj.codes?.cpp || raj.codes?.javascript);
    if (src) {
      sols.unshift({
        name: "Raj's C++",
        time: "accepted",
        space: "from repo",
        why: `This is Raj Kumar's accepted file from ${raj.source === "gfg" ? "gfg-solutions" : "Leetcode"} — the comments are how he wrote the steps.`,
        code: src,
        codes: { cpp: src },
        raj: true,
        repo: raj.repo
      });
    }
    return sols;
  };

  const dsaLinks = (item) => (item.links || []).slice();

  const prettyLabel = (s) => (s === "all" ? "All" : String(s).charAt(0).toUpperCase() + String(s).slice(1));

  const renderFlow = (steps) => {
    if (!steps || !steps.length) return "";
    return `<ol class="flow-row">${steps.map((s, i) => `
      <li>
        <span class="flow-box">${escapeHtml(s)}</span>
        ${i < steps.length - 1 ? `<span class="flow-arrow" aria-hidden="true">→</span>` : ""}
      </li>`).join("")}</ol>`;
  };

  const renderLayers = (layers) => {
    if (!layers || !layers.length) return "";
    return `<div class="arch" role="img" aria-label="Architecture">${layers.map((row, ri) => `
      ${ri ? `<div class="arch-join" aria-hidden="true">↓</div>` : ""}
      <div class="arch-row">${row.map((cell) => {
        const label = typeof cell === "string" ? cell : cell.label;
        const tone = typeof cell === "string" ? "" : (cell.tone || "");
        return `<div class="arch-box ${escapeHtml(tone)}">${escapeHtml(label)}</div>`;
      }).join("")}</div>`).join("")}</div>`;
  };

  const renderVisuals = (item) => {
    if (!item) return "";
    const parts = [];
    if (item.layers) parts.push(`<p class="answer-label">Architecture</p>${renderLayers(item.layers)}`);
    if (item.flow) parts.push(`<p class="answer-label">Request flow</p>${renderFlow(item.flow)}`);
    return parts.join("");
  };

  const formalTitle = (q) => {
    const t = String(q || "").trim().replace(/\?+$/, "");
    if (!t) return "";
    if (/^(What|How|Why|When|Which|Who|Where|Explain|Describe|Compare|Name)\b/i.test(t)) return `${t}?`;
    if (/\svs\.?\s/i.test(t)) {
      const [left, right] = t.split(/\s+vs\.?\s+/i);
      return `What is the difference between ${left.trim()} and ${right.trim()}?`;
    }
    if (/\s\/\s/.test(t)) return `What are ${t.replace(/\s+\/\s+/g, " and ")}?`;
    return `What is ${t}?`;
  };

  const dropCasual = (text) => String(text || "")
    .split(/(?<=[.!?])\s+/)
    .filter((s) => {
      const line = s.trim();
      if (!line) return false;
      if (/teaching snippet|not a command list/i.test(line)) return false;
      if (/^(A|An)\s.+\.$/.test(line) && line.length < 92) return false;
      if (/\b(post office|waiter|fridge|bouncer|phone book|coat-check|hotel key|nametag|photocopy of a clean|subway map|valet ticket)\b/i.test(line)) return false;
      return true;
    })
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  const formalAnswerSections = (text) => {
    const parts = String(text || "").split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
    const labeled = { definition: [], works: [], config: [], risk: [] };
    for (const part of parts) {
      const labeledHead = part.match(/^(Definition|How it works|Configuration|Operational risk)\.\s*([\s\S]*)$/i);
      if (labeledHead) {
        const key = labeledHead[1].toLowerCase().startsWith("def") ? "definition"
          : labeledHead[1].toLowerCase().startsWith("how") ? "works"
          : labeledHead[1].toLowerCase().startsWith("conf") ? "config"
          : "risk";
        labeled[key].push(dropCasual(labeledHead[2]));
        continue;
      }
      if (/^In the code:/i.test(part)) labeled.config.push(dropCasual(part.replace(/^In the code:\s*/i, "")));
      else if (/^A common mistake/i.test(part)) labeled.risk.push(dropCasual(part.replace(/^A common mistake is\s*/i, "A frequent operational error is ")));
      else if (!labeled.definition.length) labeled.definition.push(dropCasual(part));
      else labeled.works.push(dropCasual(part));
    }
    const rows = [
      ["Definition", labeled.definition.join(" ")],
      ["How it works", labeled.works.join(" ")],
      ["Configuration", labeled.config.join(" ")],
      ["Operational risk", labeled.risk.join(" ")]
    ].filter(([, body]) => body);
    return rows;
  };

  const renderFormalAnswer = (text) => {
    const rows = formalAnswerSections(text);
    if (!rows.length) return `<p class="answer">${escapeHtml(text || "")}</p>`;
    return `<div class="answer-sections">${rows.map(([title, body]) => `
      <section class="answer-block">
        <h4>${escapeHtml(title)}</h4>
        <p>${escapeHtml(body)}</p>
      </section>`).join("")}</div>`;
  };

  const langBar = (active) => `
    <div class="lang-bar btn-group" role="tablist" aria-label="Code language">
      ${CODE_LANGS.map((l) =>
        `<button class="lang-btn ${l.id === active ? "active" : ""}" type="button" data-lang="${l.id}">${l.label}</button>`
      ).join("")}
    </div>`;

  const loadJson = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key) || "") || fallback; }
    catch { return fallback; }
  };

  const emptyBundle = () => ({ progress: {}, stars: {}, notes: {}, streak: { count: 0, last: "" } });

  const sessionEmail = () => (localStorage.getItem(sessionKey) || "").trim().toLowerCase();
  const currentUid = () => sessionEmail() || "guest";
  const currentUser = () => {
    const email = sessionEmail();
    if (!email) return null;
    return loadJson(accountsKey, {})[email] || null;
  };

  const migrateGuestOnce = (store) => {
    if (store.guest) return store;
    store.guest = {
      progress: loadJson(storageKey, {}),
      stars: loadJson(starKey, {}),
      notes: loadJson(noteKey, {}),
      streak: loadJson(streakKey, { count: 0, last: "" })
    };
    return store;
  };

  const readStore = () => migrateGuestOnce(loadJson(userDataKey, {}));
  const writeStore = (store) => localStorage.setItem(userDataKey, JSON.stringify(store));

  const userData = () => {
    const store = readStore();
    const uid = currentUid();
    if (!store[uid]) store[uid] = emptyBundle();
    return store[uid];
  };

  const patchUser = (fn) => {
    const store = readStore();
    const uid = currentUid();
    if (!store[uid]) store[uid] = emptyBundle();
    fn(store[uid]);
    writeStore(store);
  };

  const loadProgress = () => userData().progress || {};
  const saveProgress = (data) => patchUser((u) => { u.progress = data; });
  const doneSet = (topicId) => new Set(loadProgress()[topicId] || []);

  const toggleDone = (topicId, qid) => {
    const all = loadProgress();
    const set = new Set(all[topicId] || []);
    if (set.has(qid)) set.delete(qid); else set.add(qid);
    all[topicId] = [...set];
    saveProgress(all);
    if (set.has(qid)) bumpStreak();
  };

  const starSet = (topicId) => new Set((userData().stars || {})[topicId] || []);
  const toggleStar = (topicId, qid) => {
    patchUser((u) => {
      const set = new Set((u.stars || {})[topicId] || []);
      if (set.has(qid)) set.delete(qid); else set.add(qid);
      u.stars = u.stars || {};
      u.stars[topicId] = [...set];
    });
  };

  const noteId = (topicId, qid) => `${topicId}:${qid}`;
  const getNote = (topicId, qid) => (userData().notes || {})[noteId(topicId, qid)] || "";
  const saveNote = (topicId, qid, text) => {
    patchUser((u) => {
      u.notes = u.notes || {};
      u.notes[noteId(topicId, qid)] = text;
    });
  };

  const todayStamp = () => new Date().toISOString().slice(0, 10);
  const readStreak = () => userData().streak || { count: 0, last: "" };
  const bumpStreak = () => {
    const s = { ...readStreak() };
    const today = todayStamp();
    if (s.last === today) return;
    const y = new Date();
    y.setDate(y.getDate() - 1);
    const yesterday = y.toISOString().slice(0, 10);
    s.count = s.last === yesterday ? s.count + 1 : 1;
    s.last = today;
    patchUser((u) => { u.streak = s; });
  };

  const randomSalt = () => {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  const hashPass = async (password, salt) => {
    const raw = `${salt}:${password}`;
    if (globalThis.crypto?.subtle) {
      try {
        const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
        return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
      } catch { /* file:// and some browsers skip Web Crypto */ }
    }
    let h = 5381n;
    for (let i = 0; i < raw.length; i += 1) h = (h * 33n) + BigInt(raw.charCodeAt(i));
    return h.toString(16);
  };

  const currentPage = () => {
    const hash = location.hash.slice(2) || "";
    return hash.split("/")[0] || "home";
  };

  const paintChrome = () => {
    const page = currentPage();
    document.body.dataset.page = page;
    document.querySelectorAll("[data-nav]").forEach((a) => {
      a.classList.toggle("active", a.dataset.nav === page);
    });
    const bar = document.getElementById("authBar");
    if (!bar) return;
    const user = currentUser();
    bar.innerHTML = user
      ? `<span class="auth-hello">Hi, ${escapeHtml(user.name)}</span>
         <button class="btn" type="button" id="logoutBtn">Log out</button>`
      : `<a class="btn btn-ghost${page === "login" ? " active" : ""}" href="#/login">Log in</a>
         <a class="btn btn-primary${page === "signup" ? " active" : ""}" href="#/signup">Sign up</a>`;
    document.getElementById("logoutBtn")?.addEventListener("click", () => {
      localStorage.removeItem(sessionKey);
      paintChrome();
      route();
    });
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

  const showAuthError = (msg) => {
    const el = document.getElementById("authError");
    if (!el) return;
    el.hidden = false;
    el.textContent = msg;
  };

  const renderAuth = (mode) => {
    const signup = mode === "signup";
    const user = currentUser();
    if (user) {
      view.innerHTML = `
        <section class="form-page">
          <div class="page-actions">
            <a class="btn btn-ghost" href="#/">← Home</a>
          </div>
          <article class="auth-card">
            <h1>You are signed in</h1>
            <p>Hi ${escapeHtml(user.name)}. Progress, stars, notes, and your streak are saved under ${escapeHtml(user.email)} on this device.</p>
            <div class="form-actions">
              <button class="btn btn-primary btn-wide" type="button" id="logoutPageBtn">Log out</button>
            </div>
          </article>
        </section>`;
      document.getElementById("logoutPageBtn")?.addEventListener("click", () => {
        localStorage.removeItem(sessionKey);
        paintChrome();
        location.hash = "#/login";
      });
      return;
    }

    view.innerHTML = `
      <section class="form-page">
        <div class="page-actions">
          <a class="btn btn-ghost" href="#/">← Home</a>
        </div>
        <article class="auth-card">
          <h1>${signup ? "Create your account" : "Log in"}</h1>
          <p>${signup
            ? "Sign up so marked questions, stars, notes, and your streak stay with your name. Guest progress on this browser is copied into the new account."
            : "Log in to open the progress saved under your email on this device."}</p>
          <form id="authForm" class="auth-form">
            ${signup ? `<label>Your name<input class="auth-field" name="name" required maxlength="40" autocomplete="name" /></label>` : ""}
            <label>Email<input class="auth-field" name="email" type="email" required autocomplete="email" /></label>
            <label>Password<input class="auth-field" name="password" type="password" required minlength="6" autocomplete="${signup ? "new-password" : "current-password"}" /></label>
            <p class="form-error" id="authError" hidden></p>
            <div class="form-actions">
              <button class="btn btn-primary btn-wide" type="submit">${signup ? "Sign up and keep my progress" : "Log in"}</button>
              <a class="btn btn-ghost btn-wide" href="${signup ? "#/login" : "#/signup"}">${signup ? "I already have an account" : "Create an account"}</a>
            </div>
          </form>
          <p class="auth-note">Accounts stay in this browser. There is no PrepPlace server yet, so use the same device to see your progress.</p>
        </article>
      </section>`;

    document.getElementById("authForm")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const email = String(fd.get("email") || "").trim().toLowerCase();
      const password = String(fd.get("password") || "");
      const name = String(fd.get("name") || "").trim();
      const accounts = loadJson(accountsKey, {});

      if (!email || password.length < 6) {
        showAuthError("Use a real email and a password of at least 6 characters.");
        return;
      }

      if (signup) {
        if (!name) {
          showAuthError("Please add your name.");
          return;
        }
        if (accounts[email]) {
          showAuthError("That email is already signed up on this browser. Log in instead.");
          return;
        }
        const salt = randomSalt();
        const hash = await hashPass(password, salt);
        accounts[email] = { name, email, salt, hash, created: Date.now() };
        localStorage.setItem(accountsKey, JSON.stringify(accounts));
        const store = readStore();
        const guest = store.guest || emptyBundle();
        store[email] = {
          progress: { ...guest.progress },
          stars: { ...guest.stars },
          notes: { ...guest.notes },
          streak: { ...(guest.streak || { count: 0, last: "" }) }
        };
        writeStore(store);
        localStorage.setItem(sessionKey, email);
        location.hash = "#/";
        return;
      }

      const acc = accounts[email];
      if (!acc) {
        showAuthError("No account with that email on this browser. Sign up first.");
        return;
      }
      const hash = await hashPass(password, acc.salt);
      if (hash !== acc.hash) {
        showAuthError("Wrong password. Try again.");
        return;
      }
      localStorage.setItem(sessionKey, email);
      location.hash = "#/";
    });
  };

  const setContactStatus = (text, kind) => {
    const el = document.getElementById("contactStatus");
    if (!el) return;
    el.hidden = !text;
    el.textContent = text;
    el.className = `form-status${kind ? ` ${kind}` : ""}`;
  };

  const renderContact = () => {
    const user = currentUser();
    view.innerHTML = `
      <section class="form-page">
        <div class="page-actions">
          <a class="btn btn-ghost" href="#/">← Home</a>
        </div>
        <article class="auth-card">
          <h1>Message Raj Kumar</h1>
          <p>Write your note and press <strong>Send message</strong>. It goes to <strong>${CONTACT.email}</strong>.</p>
          <form id="contactForm" class="auth-form">
            <input class="honey" type="text" name="_gotcha" tabindex="-1" autocomplete="off" />
            <label>Your name<input class="auth-field" name="name" required maxlength="80" value="${escapeHtml(user?.name || "")}" /></label>
            <label>Your email<input class="auth-field" name="email" type="email" required value="${escapeHtml(user?.email || "")}" /></label>
            <label>Message<textarea class="auth-field" name="message" rows="7" required minlength="8" placeholder="What do you want Raj to know?"></textarea></label>
            <p class="form-status" id="contactStatus" hidden></p>
            <div class="form-actions">
              <button class="btn btn-primary btn-wide" type="submit" id="contactSend">Send message</button>
            </div>
          </form>
          <p class="auth-note">The first send asks Raj to confirm his inbox once. After that, every message lands in <strong>${CONTACT.email}</strong>.</p>
        </article>
      </section>`;

    const form = document.getElementById("contactForm");
    const sendBtn = document.getElementById("contactSend");
    form?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      if (String(fd.get("_gotcha") || "").trim()) return;
      const name = String(fd.get("name") || "").trim();
      const email = String(fd.get("email") || "").trim();
      const message = String(fd.get("message") || "").trim();
      if (!name || !email || message.length < 8) {
        setContactStatus("Please add your name, email, and a short message.", "is-error");
        return;
      }

      sendBtn.disabled = true;
      sendBtn.textContent = "Sending…";
      setContactStatus("Sending to Raj…", "");

      try {
        const res = await fetch(`https://formsubmit.co/ajax/${CONTACT.email}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({
            name,
            email,
            message,
            _subject: `PrepPlace message from ${name}`,
            _template: "table",
            _captcha: "false"
          })
        });
        const data = await res.json().catch(() => ({}));
        const ok = res.ok && data.success !== false && data.success !== "false";
        if (!ok) throw new Error(data.message || "Send failed");
        form.reset();
        if (user) {
          form.elements.name.value = user.name || "";
          form.elements.email.value = user.email || "";
        }
        setContactStatus(`Sent. Raj will see this at ${CONTACT.email}.`, "is-ok");
        sendBtn.disabled = false;
        sendBtn.textContent = "Send another";
      } catch {
        setContactStatus(`Could not send from this browser. Write Raj at ${CONTACT.email}.`, "is-error");
        sendBtn.disabled = false;
        sendBtn.textContent = "Send message";
        const subject = encodeURIComponent(`PrepPlace message from ${name}`);
        const body = encodeURIComponent(`From: ${name} <${email}>\n\n${message}`);
        window.open(`mailto:${CONTACT.email}?subject=${subject}&body=${body}`, "_blank");
      }
    });
  };

  const route = () => {
    paintChrome();
    const hash = location.hash.slice(2) || "";
    const [page, id, extra] = hash.split("/");
    if (page === "topic" && id && topicById(id)) renderTopic(id, extra);
    else if (page === "career" && id && careerById(id)) renderCareer(id);
    else if (page === "topics") renderTopics(searchInput.value);
    else if (page === "dsa") renderDsaSheet();
    else if (page === "login") renderAuth("login");
    else if (page === "signup") renderAuth("signup");
    else if (page === "contact") renderContact();
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
        <p>${(pack(t.id)?.examples || []).length} ${(pack(t.id)?.kind === "design" ? "workflows" : "code examples")} · ${p.done}/${p.total} done</p>
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
        <p class="account-line">${(() => {
          const user = currentUser();
          return user
            ? `Signed in as <strong>${escapeHtml(user.name)}</strong> · ${escapeHtml(user.email)}. Done questions, stars, and notes stay with this account.`
            : `You are a guest. <a href="#/signup">Sign up</a> to keep progress under your name, or <a href="#/login">log in</a>. Message <a href="#/contact">Raj Kumar</a> anytime.`;
        })()}</p>
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
            ${daily ? `<button class="btn btn-primary" type="button" id="openDaily">Open today's problem</button>` : ""}
            <button class="btn" type="button" id="openRandom">Random problem</button>
            <a class="btn btn-ghost" href="#/dsa">Full problem sheet</a>
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
      <div class="control-board">
        <div class="control-top">
          <span class="result-count">${list.length} problems</span>
          <div class="control-top-actions">
            <button class="btn btn-primary" type="button" id="sheetRandom">Random from list</button>
          </div>
        </div>
        <div class="control-block">
          <span class="filter-label">Topic</span>
          <div class="btn-group">
            <button class="chip ${topicF === "all" ? "active" : ""}" data-dsa-topic="all">All topics</button>
            ${dsaTopics().map((t) => `<button class="chip ${topicF === t.id ? "active" : ""}" data-dsa-topic="${t.id}">${t.title}</button>`).join("")}
          </div>
        </div>
        <div class="control-grid">
          <div class="control-block">
            <span class="filter-label">Level</span>
            <div class="btn-group">
              ${["all", "beginner", "intermediate", "advanced"].map((lv) =>
                `<button class="level-btn ${levelF === lv ? "active" : ""}" data-dsa-level="${lv}">${prettyLabel(lv)}</button>`
              ).join("")}
            </div>
          </div>
          <div class="control-block">
            <span class="filter-label">Status</span>
            <div class="btn-group">
              ${["all", "todo", "done", "starred"].map((b) =>
                `<button class="level-btn ${bagF === b ? "active" : ""}" data-dsa-bag="${b}">${prettyLabel(b)}</button>`
              ).join("")}
            </div>
          </div>
        </div>
        <div class="control-block">
          <span class="filter-label">Company</span>
          <div class="btn-group">
            <button class="chip ${companyF === "all" ? "active" : ""}" data-dsa-co="all">All companies</button>
            ${COMPANIES.map((c) => `<button class="chip ${companyF === c ? "active" : ""}" data-dsa-co="${c}">${c}</button>`).join("")}
          </div>
        </div>
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
      <div class="control-board">
        <div class="control-block">
          <span class="filter-label">Category</span>
          <div class="btn-group">
            ${categories.map((c) => `<button class="chip ${c === activeCat ? "active" : ""}" data-cat="${c}">${c}</button>`).join("")}
          </div>
        </div>
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

    const tab = window.topicTab || (data.kind === "dsa" || data.kind === "practice" ? "questions" : data.kind === "design" ? "notes" : "examples");
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
      const sols = data.kind === "dsa" ? dsaSols(item) : (item.solutions || []);
      if (sols && sols.length) {
        return `
          <div class="sol-tabs">
            ${sols.map((s, i) => `<button class="sol-tab ${i === 0 ? "active" : ""}" type="button" data-sol="${i}">${escapeHtml(s.name)}</button>`).join("")}
          </div>
          ${sols.map((s, i) => {
            const isRaj = s.raj || s.name === "Raj's C++";
            const useLang = isRaj ? "cpp" : lang;
            const raw = isRaj ? (s.codes?.cpp || s.code || "") : (pickCode(s, lang) || s.code || "");
            const src = teachSrc(raw, data.kind === "dsa" ? useLang : inferLang(s) || "javascript", data.kind);
            return `
            <div class="sol-panel ${i === 0 ? "open" : ""}" data-sol-panel="${i}">
              <p class="sol-meta"><span>Time ${escapeHtml(s.time || "")}</span><span>Space ${escapeHtml(s.space || "")}</span><span>${escapeHtml(isRaj ? "C++ · repo" : langLabel)}</span><span>simple words on each line</span></p>
              <p class="teach-body">${escapeHtml(s.why || "")}</p>
              ${src
                ? `<div class="code-wrap">
                <button class="copy-btn" type="button" data-sol-copy="${i}">Copy</button>
                <pre class="dsa-pre"><code>${showCode(src, data.kind === "dsa" ? useLang : inferLang(s) || "javascript")}</code></pre>
              </div>`
                : `<p class="empty">This solution is not in ${escapeHtml(langLabel)} yet. Pick JavaScript or another language.</p>`}
            </div>`;
          }).join("")}`;
      }
      const single = data.kind === "dsa" ? dsaSrc(item, lang) : (pickCode(item, lang) || item.code);
      if (!single) return "";
      const codeLang = data.kind === "dsa" ? lang : inferLang(item);
      return `<p class="answer-label">${data.kind === "practice" ? "Easy code" : "Code"} · ${escapeHtml(data.kind === "dsa" ? langLabel : codeLang)}</p><div class="code-wrap"><button class="copy-btn" type="button" data-q-copy>Copy</button><pre class="dsa-pre"><code>${showCode(teachSrc(single, codeLang, data.kind), codeLang)}</code></pre></div>`;
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
      <div class="tabs" role="tablist">
        <button class="tab ${tab === "examples" ? "active" : ""}" data-tab="examples">${data.kind === "design" ? "Workflows" : data.kind === "practice" ? "Starter code" : "Easy code"}</button>
        <button class="tab ${tab === "notes" ? "active" : ""}" data-tab="notes">Notes</button>
        <button class="tab ${tab === "questions" ? "active" : ""}" data-tab="questions">${allQuestions.length} ${data.kind === "practice" ? "labs" : "questions"}</button>
      </div>
      ${tab === "notes" ? `
        <section class="${data.kind === "design" ? "design-stack" : "note-grid"}">
          ${notes.map((n) => `<article class="note${data.kind === "design" ? " note-wide" : ""}"><h3>${escapeHtml(n.title)}</h3>${renderVisuals(n)}<p>${escapeHtml(n.body)}</p></article>`).join("")}
        </section>` : tab === "examples" ? `
        ${data.kind === "dsa" ? langBar(lang) : ""}
        <p class="example-intro">${data.kind === "design"
          ? "Each card is a complete design: architecture diagram, request flow, and the points you should state in an interview."
          : data.kind === "dsa"
            ? "Read the explanation first, then the code. Each line is commented the way Raj writes it on LeetCode. Switch JavaScript, Python, Java, C++, or C."
            : data.kind === "practice"
              ? "Each snippet is a small complete function. Code is on the left. Easy comments sit on the right of the same line."
              : "Read the explanation first, then the code. Comments sit on the right in easy words."}</p>
        <section class="example-list">
          ${examples.map((ex, i) => `
            <article class="example">
              <div class="example-head">
                <h3>${escapeHtml(ex.title)}</h3>
                <span class="badge">${escapeHtml(data.kind === "dsa" ? langLabel : data.kind === "design" ? "workflow" : (ex.lang || "code"))}</span>
              </div>
              ${renderVisuals(ex)}
              <div class="teach">
                <p class="answer-label">${data.kind === "design" ? "Design notes" : "Explanation"}</p>
                <p class="teach-body">${escapeHtml(ex.desc || "")}</p>
              </div>
              ${pickCode(ex, data.kind === "dsa" ? lang : "javascript") || ex.code ? `
              <p class="answer-label code-label">${data.kind === "design" ? "Interface sketch" : data.kind === "practice" ? "Easy code · comments on the right" : "Code · comments on the right"}</p>
              <div class="code-wrap">
                <button class="copy-btn" type="button" data-ex="${i}">Copy</button>
                <pre class="dsa-pre"><code>${showCode(data.kind === "dsa" ? dsaSrc(ex, lang) : teachSrc(pickCode(ex, "javascript") || ex.code || "", paintLang(ex), data.kind), data.kind === "dsa" ? lang : paintLang(ex))}</code></pre>
              </div>` : ""}
            </article>`).join("") || `<p class="empty">${data.kind === "design" ? "No workflows yet." : "No code examples yet."}</p>`}
        </section>` : `
        <div class="control-board">
          <div class="control-top">
            <input class="field board-search" id="qSearch" type="search" placeholder="Filter questions…" value="${escapeHtml(window.topicQuery || "")}" />
            <div class="control-top-actions">
              <span class="result-count">${questions.length} shown</span>
              <button class="btn btn-primary" type="button" id="topicRandom">Random</button>
            </div>
          </div>
          <div class="control-grid">
            <div class="control-block">
              <span class="filter-label">Level</span>
              <div class="btn-group">
                ${["all", "beginner", "intermediate", "advanced"].map((lv) =>
                  `<button class="level-btn ${level === lv ? "active" : ""}" data-level="${lv}">${prettyLabel(lv)}</button>`
                ).join("")}
              </div>
            </div>
            <div class="control-block">
              <span class="filter-label">Status</span>
              <div class="btn-group">
                ${["all", "todo", "done", "starred"].map((b) =>
                  `<button class="level-btn ${bagF === b ? "active" : ""}" data-bag="${b}">${prettyLabel(b)}</button>`
                ).join("")}
              </div>
            </div>
          </div>
          ${data.kind === "dsa" ? `
          <div class="control-block">
            <span class="filter-label">Company</span>
            <div class="btn-group">
              <button class="chip ${companyF === "all" ? "active" : ""}" data-co="all">All companies</button>
              ${COMPANIES.map((c) => `<button class="chip ${companyF === c ? "active" : ""}" data-co="${c}">${c}</button>`).join("")}
            </div>
          </div>` : ""}
          ${data.kind === "dsa" || allQuestions.some((q) => q.solutions) ? `
          <div class="control-block">
            <span class="filter-label">Language</span>
            ${langBar(lang)}
          </div>` : ""}
        </div>
        <section class="qa">
          ${questions.map((item) => `
            <article class="item ${done.has(item.id) ? "done" : ""} ${stars.has(item.id) ? "starred" : ""}" data-qid="${item.id}">
              <div class="q-bar">
                <button class="star-btn ${stars.has(item.id) ? "on" : ""}" type="button" data-star title="Save for revision">★</button>
                <button class="q-row" type="button">
                  <span class="num">${String(item.id).padStart(2, "0")}</span>
                  <span class="q-main">
                    <span class="q-title">${escapeHtml(data.kind === "dsa" || data.kind === "practice" ? item.q : formalTitle(item.q))}</span>
                    <span class="q-meta">
                      ${(item.ask ? companyList(item.ask) : []).map((c) => `<span class="meta-chip">${escapeHtml(c)}</span>`).join("")}
                      ${data.kind === "dsa" && rajFor(item) ? `<span class="meta-chip src">Raj's C++</span>` : ""}
                      ${(data.kind === "dsa" ? dsaLinks(item) : (item.links || [])).map((l) => `<span class="meta-chip src">${escapeHtml(l.name)}</span>`).join("")}
                    </span>
                  </span>
                  <span class="level lv-${item.level || "all"}">${prettyLabel(item.level || "")}</span>
                </button>
              </div>
              <div class="answer-wrap">
                ${(data.kind === "dsa" ? dsaLinks(item) : (item.links || [])).length ? `
                  <p class="answer-label">Solve on</p>
                  <p class="plink-row">
                    ${(data.kind === "dsa" ? dsaLinks(item) : item.links).map((l) => `<a class="plink" href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(l.name)} ↗</a>`).join("")}
                  </p>` : ""}
                ${item.solutions && item.solutions.length ? `
                  <p class="answer-label">Complexity</p>
                  <table class="cx-table">
                    <tr><th>Method</th><th>Time</th><th>Space</th></tr>
                    ${item.solutions.map((s) => `<tr><td>${escapeHtml(s.name)}</td><td>${escapeHtml(s.time || "")}</td><td>${escapeHtml(s.space || "")}</td></tr>`).join("")}
                  </table>` : ""}
                <p class="answer-label">${data.kind === "dsa" ? "Explanation" : data.kind === "practice" ? "What to do" : "Technical note"}</p>
                ${data.kind === "dsa" || data.kind === "practice" ? `<p class="answer">${escapeHtml(item.a)}</p>` : renderFormalAnswer(item.a)}
                ${renderVisuals(item)}
                ${data.kind !== "dsa" && data.kind !== "practice" && item.code ? `
                  <p class="answer-label">Reference configuration</p>
                  <div class="code-wrap">
                    <pre class="dsa-pre"><code>${showCode(teachSrc(item.code, inferLang(item), data.kind), inferLang(item))}</code></pre>
                  </div>` : ""}
                <div class="q-tools">
                  ${item.solutions ? `<button class="btn btn-primary" type="button" data-reveal>Show solutions</button>` : ""}
                  <button class="btn" type="button" data-timer>20 min timer</button>
                  <span class="timer-chip" data-timer-view hidden>20:00</span>
                </div>
                <div class="sol-spoiler">${renderSolutions(item)}</div>
                <label class="answer-label" for="note-${item.id}">My notes</label>
                <textarea class="self-note" id="note-${item.id}" data-note placeholder="Your approach, a bug you hit, or a follow-up…">${escapeHtml(getNote(id, item.id))}</textarea>
                <div class="q-tools">
                  <button class="done-btn" type="button">${done.has(item.id) ? "Marked done · undo" : "Mark as done"}</button>
                  <button class="btn" type="button" data-prev>Previous</button>
                  <button class="btn" type="button" data-next>Next</button>
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
      btn.addEventListener("click", () => btn.closest(".item").classList.toggle("open"));
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
          const raw = pickCode(ex, data.kind === "dsa" ? getLang() : "javascript") || ex?.code || "";
          const code = teachSrc(raw, data.kind === "dsa" ? getLang() : paintLang(ex), data.kind);
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
          const sols = data.kind === "dsa" ? dsaSols(item) : item?.solutions;
          const sol = sols?.[Number(btn.dataset.solCopy)];
          const useLang = sol?.raj ? "cpp" : getLang();
          const raw = sol?.raj ? (sol.codes?.cpp || sol.code || "") : (pickCode(sol, useLang) || sol?.code || "");
          const code = teachSrc(raw, useLang, data.kind);
          await copyText(code, btn);
        });
      });
      itemEl.querySelectorAll("[data-q-copy]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const qid = Number(itemEl.dataset.qid);
          const item = allQuestions.find((q) => q.id === qid);
          const raw = pickCode(item, getLang()) || item?.code || "";
          await copyText(teachSrc(raw, inferLang(item), data.kind), btn);
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
    else if (hash.startsWith("#/login") || hash.startsWith("#/signup") || hash.startsWith("#/contact")) return;
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
