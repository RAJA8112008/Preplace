(function () {
  const view = document.getElementById("view");
  const searchInput = document.getElementById("globalSearch");
  const themeToggle = document.getElementById("themeToggle");
  const storageKey = "prepplace-progress-v1";
  const themeKey = "prepplace-theme";
  const langKey = "prepplace-code-lang";
  const stackKey = "prepplace-practice-stack";
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
  const STACKS = [
    { id: "javascript", label: "JS" },
    { id: "react", label: "React" },
    { id: "html", label: "HTML" },
    { id: "sql", label: "SQL" },
    { id: "redis", label: "Redis" },
    { id: "mongo", label: "Mongo" }
  ];

  const getLang = () => {
    const saved = localStorage.getItem(langKey);
    return CODE_LANGS.some((l) => l.id === saved) ? saved : "javascript";
  };

  const setLang = (id) => localStorage.setItem(langKey, id);

  const getStack = () => {
    const saved = localStorage.getItem(stackKey) || window.topicStack || "all";
    if (saved === "all" || STACKS.some((s) => s.id === saved)) return saved;
    return "all";
  };

  const setStack = (id) => {
    window.topicStack = id;
    localStorage.setItem(stackKey, id);
  };

  const pickCode = (block, lang) => {
    if (!block) return "";
    if (block.codes && block.codes[lang]) return block.codes[lang];
    if (lang === "javascript") return block.code || block.codes?.javascript || "";
    if (lang === "react") return block.codes?.react || "";
    if (lang === "html") return block.codes?.html || (block.lang === "txt" || block.lang === "html" ? block.code : "") || "";
    if (lang === "sql") return block.codes?.sql || (block.lang === "sql" ? block.code : "") || "";
    return "";
  };

  const langOfStack = (stack, item) => {
    if (stack === "sql" || item?.lang === "sql") return "sql";
    if (stack === "html" || item?.lang === "html" || item?.lang === "txt") return "txt";
    return "javascript";
  };

  const itemStackIds = (item) => {
    const ids = new Set();
    if (item?.codes) Object.keys(item.codes).forEach((k) => ids.add(k));
    if (item?.stack) ids.add(item.stack);
    const lang = String(item?.lang || "").toLowerCase();
    if (lang === "sql") ids.add("sql");
    else if (lang === "html" || lang === "txt") ids.add("html");
    else if (item?.code || lang === "js" || lang === "javascript") ids.add("javascript");
    return ids;
  };

  const collectStacks = (data) => {
    const ids = new Set();
    for (const item of [...(data.examples || []), ...(data.questions || [])]) {
      itemStackIds(item).forEach((k) => ids.add(k));
    }
    return STACKS.filter((s) => ids.has(s.id));
  };

  const itemHasStack = (item, stack) => {
    if (!stack || stack === "all") return true;
    return itemStackIds(item).has(stack);
  };

  const practiceSrc = (item, stack) => {
    const want = stack && stack !== "all" ? stack : "javascript";
    return pickCode(item, want) || (want === "javascript" ? item?.code || "" : "") || "";
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

  const TEACH_HEAD = /^(What this is|What happens|What the code is doing|In the example|In the code|Also know|Say this in an interview|Watch out|Common mistake|How it works|Definition|Configuration|Operational risk|Before you use this|Why we use it|When to pick this)\.?$/i;

  const extraForQuestion = (q, a) => {
    const hay = `${q} ${a}`.toLowerCase();
    if (/webpage load|enter a url|type a url|type google/.test(hay)) {
      return {
        before: "You only need to know that a URL is a name (google.com) plus a path (/search). The browser does not already know the computer's number.",
        why: "We tell this story because every web feature — login, API, image — rides the same steps. If you skip DNS or TLS, the rest of the answer sounds guessed.",
        extra: "A CDN or cache can skip a step if you have been here before. Service workers can serve a saved page offline. Always tell the story in this order: find the computer, open a safe pipe, ask, get HTML, fetch extras, paint.",
        watch: "Do not start at HTML. Interviewers wait for DNS and HTTPS first. Do not say the browser talks to the database."
      };
    }
    if (/\bhttps\b/.test(hay) && /http/.test(hay)) {
      return {
        before: "HTTP is just the request language (GET /path). Anyone on the wire can read it unless you wrap it.",
        why: "We use HTTPS so passwords, cookies, and tokens are not sent as plain text. The certificate also helps prove you reached the real host, not a fake one.",
        extra: "HTTPS is HTTP riding inside TLS. The padlock is the encrypted pipe plus that certificate check.",
        watch: "Never send a password on http://. An https:// page that calls http:// is mixed content and the browser blocks it."
      };
    }
    if (/\bcors\b/.test(hay)) {
      return {
        before: "Know what an origin is: scheme + host + port. https://app.com and http://app.com are two origins. So are localhost:5173 and localhost:3000.",
        why: "Browsers add CORS so a random site cannot call your API with the user's cookies as if it were your UI. It protects the user, not your server from Postman.",
        extra: "Postman and curl are not browsers, so they do not apply CORS. A mobile app talking to an API also does not.",
        watch: "You cannot fix CORS only in React. The server must allow the UI origin, or you proxy /api so the browser sees one origin."
      };
    }
    if (/event loop|microtask|macrotask/.test(hay)) {
      return {
        before: "JavaScript on one page runs one thing at a time. setTimeout and fetch do not freeze the page; they finish later.",
        why: "We learn the event loop so we can predict print order and why a spinner still moves while data loads.",
        extra: "Remember the print order: sync first, then Promise.then, then setTimeout(0). That one fact proves you understand the loop.",
        watch: "await does not pause the whole page. It only pauses that async function."
      };
    }
    if (/\bvar\b[\s\S]*\blet\b|\bconst\b/.test(hay) && /scope|hoist|tdz|temporal/.test(hay)) {
      return {
        before: "A variable is a name that holds a value. You need this before objects, functions, and React state.",
        why: "We use let and const so a name cannot leak outside its block the way var can. That prevents silent bugs.",
        extra: "Use const by default. Use let when the name must change. Skip var in new code.",
        watch: "const only locks the name. An object inside const can still change its fields."
      };
    }
    if (/closure/.test(hay)) {
      return {
        before: "Know that an inner function can see names from the function that created it, even after the outer function returned.",
        why: "We use closures for counters, private passwords, and event handlers that still remember the value from when they were created.",
        extra: "Each call to the outer function gets its own private variables. Two counters do not share n.",
        watch: "A loop with var and a click listener is the classic bug: every click sees the last i. Use let."
      };
    }
    if (/\bdom\b/.test(hay) && !/random/.test(hay)) {
      return {
        before: "HTML is the page text. The DOM is that page as objects JavaScript can find and change.",
        why: "We use the DOM to show cards, handle clicks, and update text without reloading the whole page.",
        extra: "You find nodes with querySelector, change text with textContent, and listen with addEventListener. That is the whole daily job.",
        watch: "Do not put user text into innerHTML. That is XSS. Use textContent."
      };
    }
    if (/\bdns\b/.test(hay)) {
      return {
        before: "People type names (prepplace.dev). Packets travel to numbers (IP addresses). Something must translate.",
        why: "We use DNS so you can change servers without printing a new IP on every poster. One name, many possible machines over time.",
        extra: "TTL says how long a resolver may remember an old IP. After you change an A record, some users still hit the old box until TTL dies.",
        watch: "DNS does not load your HTML. It only answers 'which IP?'. HTTPS and HTTP come after."
      };
    }
    if (/\bredis\b|cache-aside|in-memory store|ttl key|rediss:\/\//.test(hay)) {
      return {
        before: "You already need a real database (Postgres or Mongo) for users, orders, and money. Redis is the extra fast shelf next to it. Learn GET, SET, and EX (seconds to live) first. Install Redis locally or use a free cloud URL. Default port is 6379.",
        why: "We use Redis so the same hot read does not hit the database a thousand times. Sessions, rate limits, and leaderboards need a shared, fast store that every API server can see. An in-memory Map on one Node process is invisible to the other processes.",
        extra: "Redis lives in RAM, so it is often under 1 ms. It is a cache, session store, counter, tiny queue, and pub/sub bus — not the only copy of an order. Always set a TTL on cache keys. Prefix keys (prod:user:1) so apps do not clash.",
        watch: "A FLUSHALL or a restart without persistence can wipe Redis. That should log people out or miss a cache — never delete the only user table. Do not run KEYS * in production; use SCAN."
      };
    }
    if (/mongodb|document store|mongoose|objectid|\.insertone|collection/.test(hay)) {
      return {
        before: "If you know a JavaScript object, you already know a document. You do not CREATE TABLE first. Still decide what one document means (one student, one post). Install MongoDB or use Atlas. A collection is the folder of those documents.",
        why: "We use Mongo when the thing you load is already a nested object and the shape changes often. One post with comments inside can be one document. Node teams like that it looks like JSON.",
        extra: "A collection is like a table name. A document is one object. Fields can differ from one document to the next. Mongo adds _id if you do not. Query with find({ city: \"Pune\" }), not SELECT. Unique emails still need a unique index.",
        watch: "Missing a field is not a SQL NULL column — the field is simply not there. Do not treat Mongo as 'no rules': money across two documents still needs a transaction or a better shape. Never pass req.body straight into find()."
      };
    }
    if (/create table|primary key|foreign key|postgres|mysql|relational|\bselect\b[\s\S]*\bfrom\b|\bsql\b/.test(hay) && !/nosql/.test(hay)) {
      return {
        before: "Think of one spreadsheet per thing: students, courses. Decide the columns and which column is the unique id. Then write CREATE TABLE. You talk to the engine with SQL, not with JavaScript objects. PostgreSQL and MySQL are two engines that speak SQL.",
        why: "We use SQL when facts must stay consistent: users, orders, money, unique emails, and reports that join tables. Constraints (PRIMARY KEY, UNIQUE, FOREIGN KEY) refuse bad rows even if the app has a bug. Transactions (BEGIN / COMMIT) keep two money updates together.",
        extra: "CRUD is INSERT, SELECT, UPDATE, DELETE. Always use WHERE on UPDATE and DELETE. Use $1 or ? so user text stays data, not extra SQL. Index the columns you filter and join on. EXPLAIN shows whether a query used an index.",
        watch: "UPDATE or DELETE without WHERE changes every row. String-gluing SQL is injection. Do not stuff students and courses into one table with repeating columns — use a key and a JOIN."
      };
    }
    if (/oltp|olap|acid\b|replica vs shard|cap theorem|what is a database|pick a store/.test(hay)) {
      return {
        before: "An app should not keep the only copy of users in a JSON file on one laptop. Decide what you store (rows, documents, keys) and what questions you ask before you pick a brand.",
        why: "We use a database so many users can read and write at once, survive a crash, search with indexes, and keep rules (unique email, foreign keys). The app sends a query; the engine owns the disk.",
        extra: "Tables + money + joins → Postgres. Nested JSON you always load together → Mongo. Hot keys and TTL → Redis. Huge append logs → Kafka or a warehouse. Similarity search → a vector store. Most products start with one SQL database and add the others as a need appears.",
        watch: "A cache is not a database. A replica is a copy (reads / failover). A shard is a slice of the data. Do not run a 20-second report on the checkout primary."
      };
    }
    if (/nosql|cassandra|dynamodb|wide-column|graph store|key-value/.test(hay)) {
      return {
        before: "NoSQL is not 'no schema' and not 'always faster than SQL'. It is a family: document (Mongo), key-value (Redis, DynamoDB), wide-column (Cassandra), graph (Neo4j). Write your queries first, then pick the family.",
        why: "We use NoSQL when the access pattern is a known key, a nested document, huge write volume, or a walk of connections. SQL still wins for money, joins, and ad-hoc reports.",
        extra: "In NoSQL, duplication is often the design. In SQL, duplication is usually a mistake until you denormalize on purpose. Dynamo and Cassandra want the query listed on day one.",
        watch: "Picking Mongo from a tutorial, then spending a year rebuilding relations, is the usual regret. Missing unique constraints so two accounts share an email is a product bug."
      };
    }
    if (/vector|embedding|pgvector|pinecone|\brag\b/.test(hay)) {
      return {
        before: "Your users and orders still live in SQL or Mongo. A vector store only holds embeddings (lists of numbers) plus the chunk of text they came from. You need an embedding model first.",
        why: "We use vectors when search must match meaning ('bike' ≈ 'bicycle'), not only the same letters. RAG finds the right paragraphs, then an LLM writes the answer.",
        extra: "Always filter by tenant or user so one company cannot retrieve another company's chunks. Keyword search and vector search solve different jobs; hybrid does both.",
        watch: "A vector DB does not replace Postgres. Do not dump raw user files without an access check on retrieve."
      };
    }
    return {
      before: "Read the question as a story: what already exists, then what this tool adds. Name the pieces before you jump into code.",
      why: "We use this because it does one job better than doing that job by hand or in the wrong place. Say that job in one sentence first.",
      extra: "Say this as a short story in order. One example beats a list of buzzwords. Name the next step before you show syntax.",
      watch: "If you skip a step, the rest of the story sounds like a guess. Pause after each heading and check the listener followed you."
    };
  };

  const hasTeachHead = (text, name) => new RegExp("^" + name + "\\b", "im").test(String(text || ""));

  const insertAfterSection = (text, afterName, head, body) => {
    const lines = String(text || "").split("\n");
    let i = lines.findIndex((l) => new RegExp("^" + afterName + "\\b", "i").test(l.trim()));
    if (i < 0) return `${head}\n${body}\n\n${text}`;
    let j = i + 1;
    while (j < lines.length && !TEACH_HEAD.test(lines[j].trim())) j += 1;
    lines.splice(j, 0, "", head, body, "");
    return lines.join("\n");
  };

  const injectTeachExtras = (text, tip) => {
    let out = String(text || "").trim();
    if (!out) return "";
    if (tip.before && !hasTeachHead(out, "Before you use this")) {
      out = `Before you use this\n${tip.before}\n\n${out}`;
    }
    if (tip.why && !hasTeachHead(out, "Why we use it")) {
      out = hasTeachHead(out, "What this is")
        ? insertAfterSection(out, "What this is", "Why we use it", tip.why)
        : `Why we use it\n${tip.why}\n\n${out}`;
    }
    if (tip.extra && !hasTeachHead(out, "Also know")) out += `\n\nAlso know\n${tip.extra}`;
    if (tip.watch && !hasTeachHead(out, "Watch out")) out += `\n\nWatch out\n${tip.watch}`;
    return out;
  };

  const formalToTeach = (text) => {
    const parts = String(text || "").split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
    if (!parts.some((p) => /^(Definition|How it works|Configuration|Operational risk)\./i.test(p))) return "";
    const chunks = [];
    for (const part of parts) {
      const m = part.match(/^(Definition|How it works|Configuration|Operational risk)\.\s*([\s\S]*)$/i);
      if (!m) {
        chunks.push(part);
        continue;
      }
      const key = m[1].toLowerCase();
      const head = key.startsWith("def") ? "What this is"
        : key.startsWith("how") ? "What happens"
        : key.startsWith("conf") ? "Also know"
        : "Watch out";
      chunks.push(head, m[2].trim(), "");
    }
    return chunks.join("\n").trim();
  };

  const autoTeach = (text, q) => {
    const raw = String(text || "").trim();
    if (!raw) return "";
    const tip = extraForQuestion(q || "", raw);
    const labeled = formalToTeach(raw);
    if (labeled) return injectTeachExtras(labeled, tip);
    if (/^What this is\b/im.test(raw) || /^Before you use this\b/im.test(raw) || /^Why we use it\b/im.test(raw) || /^What the code is doing\b/im.test(raw)) {
      return injectTeachExtras(raw, tip);
    }
    const parts = raw.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
    let built = "";
    if (parts.length >= 3) {
      built = ["What this is", parts[0], "", "What happens", parts.slice(1, -1).join("\n\n"), "", "Watch out", parts[parts.length - 1]].join("\n");
    } else if (parts.length === 2) {
      built = ["What this is", parts[0], "", "What happens", parts[1]].join("\n");
    } else {
      const bits = raw.match(/[^.!?]+[.!?]+(?:\s+|$)/g) || [raw];
      const what = bits.slice(0, 2).join("").trim();
      const rest = bits.slice(2).join("").trim();
      built = ["What this is", what, "", "What happens", rest || what].join("\n");
    }
    return injectTeachExtras(built, tip);
  };

  const prettyTeachHead = (h) => {
    const t = String(h || "").replace(/\.$/, "").trim();
    if (/^before you use this/i.test(t)) return "Before you use this";
    if (/^why we use it/i.test(t)) return "Why we use it";
    if (/^when to pick this/i.test(t)) return "When to pick this";
    if (/^what this is/i.test(t)) return "What this is";
    if (/^what happens/i.test(t)) return "What happens";
    if (/^what the code is doing/i.test(t)) return "What the code is doing";
    if (/^in the (example|code)/i.test(t)) return "What the code is doing";
    if (/^also know/i.test(t)) return "Also know";
    if (/^say this/i.test(t)) return "Say this in an interview";
    if (/^watch out/i.test(t)) return "Watch out";
    if (/^common mistake/i.test(t)) return "Watch out";
    if (/^definition/i.test(t)) return "What this is";
    if (/^how it works/i.test(t)) return "What happens";
    if (/^configuration/i.test(t)) return "Also know";
    if (/^operational risk/i.test(t)) return "Watch out";
    return t;
  };

  const renderTeachText = (text, q) => {
    const src = autoTeach(text, q);
    const lines = src.replace(/\r/g, "").split("\n");
    const sections = [];
    let title = "";
    let buf = [];
    const flush = () => {
      const body = buf.join("\n").trim();
      if (body) sections.push([title, body]);
      buf = [];
    };
    for (const line of lines) {
      if (TEACH_HEAD.test(line.trim())) {
        flush();
        title = prettyTeachHead(line.trim());
        continue;
      }
      buf.push(line);
    }
    flush();
    if (!sections.length) return `<p class="answer">${escapeHtml(text || "")}</p>`;
    return `<div class="answer-sections">${sections.map(([head, body]) => `
      <section class="answer-block">
        ${head ? `<h4>${escapeHtml(head)}</h4>` : ""}
        <p>${escapeHtml(body)}</p>
      </section>`).join("")}</div>`;
  };

  const langBar = (active) => `
    <div class="lang-bar btn-group" role="tablist" aria-label="Code language">
      ${CODE_LANGS.map((l) =>
        `<button class="lang-btn ${l.id === active ? "active" : ""}" type="button" data-lang="${l.id}">${l.label}</button>`
      ).join("")}
    </div>`;

  const stackBar = (stacks, active) => {
    if (!stacks.length) return "";
    return `
      <div class="control-block">
        <span class="filter-label">Stack</span>
        <div class="btn-group" role="tablist" aria-label="Code stack">
          <button class="chip ${active === "all" ? "active" : ""}" type="button" data-stack="all">All</button>
          ${stacks.map((s) =>
            `<button class="chip ${active === s.id ? "active" : ""}" type="button" data-stack="${s.id}">${s.label}</button>`
          ).join("")}
        </div>
      </div>`;
  };

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
    const stacks = data.kind === "practice" ? collectStacks(data) : [];
    let stackF = data.kind === "practice" ? getStack() : "all";
    if (stackF !== "all" && !stacks.some((s) => s.id === stackF)) stackF = "all";
    const query = (window.topicQuery || "").toLowerCase();
    const stars = starSet(id);
    const done = doneSet(id);
    const p = progressFor(id);
    const notes = data.notes || [];
    const examples = (data.examples || []).filter((ex) => itemHasStack(ex, stackF));
    const allQuestions = data.questions || [];
    const questions = allQuestions.filter((item) => {
      const matchLevel = level === "all" || item.level === level;
      const matchC = companyF === "all" || companyList(item.ask).some((c) => c.toLowerCase() === companyF.toLowerCase());
      const matchS = itemHasStack(item, stackF);
      const isDone = done.has(item.id);
      const isStar = stars.has(item.id);
      const matchB = bagF === "all" || (bagF === "done" && isDone) || (bagF === "todo" && !isDone) || (bagF === "starred" && isStar);
      const solText = (item.solutions || []).map((s) => {
        const langs = s.codes ? Object.values(s.codes).join(" ") : "";
        return `${s.name} ${s.why} ${s.code || ""} ${langs}`;
      }).join(" ");
      const hay = `${item.q} ${item.a} ${item.code || ""} ${item.ask || ""} ${solText}`.toLowerCase();
      return matchLevel && matchC && matchS && matchB && (!query || hay.includes(query));
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
      const single = data.kind === "dsa" ? dsaSrc(item, lang) : data.kind === "practice" ? practiceSrc(item, stackF) : (pickCode(item, lang) || item.code);
      if (!single) return "";
      const codeLang = data.kind === "dsa" ? lang : data.kind === "practice" ? langOfStack(stackF, item) : inferLang(item);
      const stackLabel = STACKS.find((s) => s.id === (stackF === "all" ? "javascript" : stackF))?.label || codeLang;
      return `<p class="answer-label">${data.kind === "practice" ? "Easy code" : "Code"} · ${escapeHtml(data.kind === "dsa" ? langLabel : data.kind === "practice" ? stackLabel : codeLang)}</p><div class="code-wrap"><button class="copy-btn" type="button" data-q-copy>Copy</button><pre class="dsa-pre"><code>${showCode(teachSrc(single, codeLang, data.kind), codeLang)}</code></pre></div>`;
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
          ${notes.map((n) => `<article class="note${data.kind === "design" ? " note-wide" : ""}"><h3>${escapeHtml(n.title)}</h3>${renderVisuals(n)}${/^(What this is|Before you use this|Why we use it|When to pick this)\b/im.test(n.body || "") ? renderTeachText(n.body, n.title) : `<p>${escapeHtml(n.body)}</p>`}</article>`).join("")}
        </section>` : tab === "examples" ? `
        ${data.kind === "dsa" ? langBar(lang) : ""}
        ${data.kind === "practice" && stacks.length ? `<div class="control-board stack-board">${stackBar(stacks, stackF)}</div>` : ""}
        <p class="example-intro">${data.kind === "design"
          ? "Each card is a complete design: architecture diagram, request flow, and the points you should state in an interview."
          : data.kind === "dsa"
            ? "Read the explanation first, then the code. Each line is commented the way Raj writes it on LeetCode. Switch JavaScript, Python, Java, C++, or C."
            : data.kind === "practice"
              ? "Pick JS or React above. Same card project, two stacks. Code is on the left. Easy comments sit on the right of the same line."
              : "Read the explanation first, then the code. Comments sit on the right in easy words."}</p>
        <section class="example-list">
          ${examples.map((ex, i) => `
            <article class="example">
              <div class="example-head">
                <h3>${escapeHtml(ex.title)}</h3>
                <span class="badge">${escapeHtml(data.kind === "dsa" ? langLabel : data.kind === "design" ? "workflow" : data.kind === "practice" ? (STACKS.find((s) => s.id === (stackF === "all" ? (ex.lang === "txt" || ex.lang === "html" ? "html" : "javascript") : stackF))?.label || ex.lang || "code") : (ex.lang || "code"))}</span>
              </div>
              ${renderVisuals(ex)}
              <div class="teach">
                <p class="answer-label">${data.kind === "design" ? "Design notes" : "Explanation"}</p>
                ${renderTeachText(ex.desc || "", ex.title)}
              </div>
              ${((data.kind === "dsa" ? pickCode(ex, lang) : data.kind === "practice" ? practiceSrc(ex, stackF) : pickCode(ex, "javascript")) || ex.code) ? `
              <p class="answer-label code-label">${data.kind === "design" ? "Interface sketch" : data.kind === "practice" ? "Easy code · comments on the right" : "Code · comments on the right"}</p>
              <div class="code-wrap">
                <button class="copy-btn" type="button" data-ex="${i}">Copy</button>
                <pre class="dsa-pre"><code>${showCode(data.kind === "dsa" ? dsaSrc(ex, lang) : teachSrc(data.kind === "practice" ? practiceSrc(ex, stackF) : (pickCode(ex, "javascript") || ex.code || ""), data.kind === "practice" ? langOfStack(stackF, ex) : paintLang(ex), data.kind), data.kind === "dsa" ? lang : data.kind === "practice" ? langOfStack(stackF, ex) : paintLang(ex))}</code></pre>
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
            ${data.kind === "practice" ? stackBar(stacks, stackF) : ""}
          </div>
          ${data.kind === "dsa" || allQuestions.some((q) => q.ask) ? `
          <div class="control-block">
            <span class="filter-label">Company</span>
            <div class="btn-group">
              <button class="chip ${companyF === "all" ? "active" : ""}" data-co="all">All companies</button>
              ${data.kind === "practice" ? `<button class="chip ${companyF === "Most asked" ? "active" : ""}" data-co="Most asked">Most asked</button>` : ""}
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
                <p class="answer-label">${data.kind === "dsa" ? "Explanation" : data.kind === "practice" ? (item.ask ? "Interview answer" : "What to do") : "Technical note"}</p>
                ${data.kind === "dsa" ? `<p class="answer">${escapeHtml(item.a)}</p>` : renderTeachText(item.a, item.q)}
                ${renderVisuals(item)}
                ${data.kind === "practice" ? renderSolutions(item) : ""}
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
                <div class="sol-spoiler">${data.kind === "practice" ? "" : renderSolutions(item)}</div>
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
    view.querySelectorAll("[data-stack]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const open = [...view.querySelectorAll(".item.open")].map((el) => el.dataset.qid);
        setStack(btn.dataset.stack);
        renderTopic(id, openQid);
        open.forEach((qid) => view.querySelector(`.item[data-qid="${qid}"]`)?.classList.add("open"));
      });
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
          const raw = data.kind === "dsa"
            ? pickCode(ex, getLang())
            : data.kind === "practice" ? practiceSrc(ex, getStack()) : pickCode(ex, "javascript") || ex?.code || "";
          const code = teachSrc(raw, data.kind === "dsa" ? getLang() : data.kind === "practice" ? langOfStack(getStack(), ex) : paintLang(ex), data.kind);
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
          const raw = data.kind === "practice" ? practiceSrc(item, getStack()) : pickCode(item, getLang()) || item?.code || "";
          await copyText(teachSrc(raw, data.kind === "practice" ? langOfStack(getStack(), item) : inferLang(item), data.kind), btn);
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
