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
  const CONTACT = {
    name: "Raj Kumar",
    email: "kraj9380286@gmail.com",
    linkedin: "https://www.linkedin.com/in/raja-o/"
  };
  const statsCacheKey = "prepplace-public-stats-v1";
  const countedEmailsKey = "prepplace-counted-emails-v1";
  const myRatingKey = "prepplace-my-rating-v1";
  const ratedPublicKey = "prepplace-rated-public-v1";
  const ABACUS = "https://abacus.jasoncameron.dev";
  const ABACUS_NS = "prepplace-rajkumar";
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
    else if (lang === "html") ids.add("html");
    else if (lang === "txt") return ids;
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
    const flushPending = () => {
      if (!pending.length) return;
      pending.filter(Boolean).forEach((note) => out.push(`${mark} ${note}`));
      pending = [];
    };
    for (const line of lines) {
      const t = line.trim();
      if (isStandaloneComment(t, lang)) {
        pending.push(t.replace(/^(\/\/|#|--)\s*/, ""));
        continue;
      }
      if (!t) {
        flushPending();
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
    flushPending();
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
    if (/^\s*(FROM |WORKDIR |COPY |RUN |CMD |services:|on: \[|listen |location \/)/m.test(c)) return "txt";
    if (/^\s*(git |gh |curl |ssh-|npx newman |BASE=|### |#!\/)/m.test(c)) return "txt";
    if (/^\s*https?:\/\//.test(c.trim())) return "txt";
    return "javascript";
  };

  const commentCut = (line, lang) => {
    const hashCmt = lang === "python" || lang === "txt";
    const isSql = lang === "sql";
    const mark = isSql ? "--" : hashCmt ? "#" : "//";
    let inS = false;
    let inD = false;
    let inT = false;
    let esc = false;
    for (let i = 0; i < line.length; i += 1) {
      const ch = line[i];
      if (esc) { esc = false; continue; }
      if ((inS || inD || inT) && ch === "\\") { esc = true; continue; }
      if (!inS && !inD && !inT) {
        if (ch === "'") { inS = true; continue; }
        if (ch === "\"") { inD = true; continue; }
        if (ch === "`") { inT = true; continue; }
        if (line.startsWith(mark, i)) {
          if (mark === "//" && i > 0 && line[i - 1] === ":") continue;
          return i;
        }
      } else if (inS && ch === "'") inS = false;
      else if (inD && ch === "\"") inD = false;
      else if (inT && ch === "`") inT = false;
    }
    return -1;
  };

  const paintCode = (src, lang) => {
    if (!src) return "";
    return String(src).split("\n").map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return "";
      if (/^#\s*(include|define|ifndef|ifdef|endif|pragma|undef)\b/.test(trimmed)) {
        return `<span class="code-line"><span class="code-src">${escapeHtml(line)}</span></span>`;
      }
      if (/^(\/\/|#|--|\/\*|\*)/.test(trimmed) || trimmed.startsWith("*/")) {
        return `<span class="code-line is-cmt"><span class="code-cmt">${escapeHtml(line)}</span></span>`;
      }
      const at = commentCut(line, lang);
      if (at > 0) {
        return `<span class="code-line has-cmt"><span class="code-src">${escapeHtml(line.slice(0, at).trimEnd())}</span><span class="code-cmt">${escapeHtml(line.slice(at).trim())}</span></span>`;
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

  const pickSheetCpp = (item) => {
    const sols = item?.solutions || [];
    const score = (name) => {
      const n = String(name || "").toLowerCase();
      if (/more\s*optimal/.test(n)) return 0;
      if (/optimal/.test(n)) return 1;
      if (/brute/.test(n)) return 3;
      return 2;
    };
    let best = null;
    let bestScore = 99;
    for (const s of sols) {
      const cpp = s.codes?.cpp;
      if (!cpp) continue;
      const sc = score(s.name);
      if (sc < bestScore) {
        best = { sol: s, cpp };
        bestScore = sc;
      }
    }
    return best;
  };

  const wrapLeetCpp = (src) => {
    const body = String(src || "").replace(/^\s*\/\/\s*vector,\s*unordered_map,\s*string\s*\n?/i, "").trim();
    if (!body) return "";
    if (/class\s+Solution\b/.test(body)) return body;
    const indented = body.split("\n").map((l) => (l ? "    " + l : l)).join("\n");
    return `class Solution {\npublic:\n${indented}\n};`;
  };

  const rajTabFor = (item) => {
    const raj = rajFor(item);
    const repoSrc = raj && (raj.codes?.cpp || raj.codes?.javascript);
    if (repoSrc) {
      return {
        name: "Raj's C++",
        time: "accepted",
        space: "from repo",
        why: `This is Raj Kumar's accepted file from ${raj.source === "gfg" ? "gfg-solutions" : "Leetcode"} — the comments are how he wrote the steps.`,
        code: repoSrc,
        codes: { cpp: repoSrc },
        raj: true,
        fromRepo: true,
        repo: raj.repo
      };
    }
    const sheet = pickSheetCpp(item);
    if (!sheet) return null;
    const cpp = wrapLeetCpp(sheet.cpp);
    return {
      name: "Raj's C++",
      time: sheet.sol.time || "",
      space: sheet.sol.space || "",
      why: "C++ for this problem in the same class Solution shape as Raj's LeetCode files. Open this tab without switching the language buttons.",
      code: cpp,
      codes: { cpp },
      raj: true,
      fromRepo: false
    };
  };

  const dsaSols = (item) => {
    const sols = (item.solutions || []).map((s) => Object.assign({}, s));
    const tab = rajTabFor(item);
    if (tab) sols.unshift(tab);
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

  const TEACH_HEAD = /^(Summary|How the code works|What this is|What happens|What the code is doing|In the example|In the code|Also know|Say this in an interview|Watch out|Common mistake|Wrong answer|Check yourself|Follow-up questions|Worked example|In production|How it works|Definition|Configuration|Operational risk|Before you use this|Why we use it|When to pick this|The problem before|What it solves|Real-life example|Uses)\.?$/i;

  const extraForQuestion = (q, a) => {
    const hay = `${q} ${a}`.toLowerCase();
    const story = (problem, solves, example, uses, watch, what) => ({ problem, solves, example, uses, watch, what, before: problem, why: solves });
    if (/reverse proxy/.test((q || "").toLowerCase()) || (/reverse proxy/.test(hay) && !/what is nginx|\bnginx\b/.test((q || "").toLowerCase()))) {
      return story(
        "Your Node or FastAPI app sat on the street: port 3000 open to the whole internet. Visitors had to know that ugly port. HTTPS was hard. Two apps could not share one website name.",
        "A reverse proxy is the front desk. Guests only talk to the lobby (Nginx on 443). The desk walks the request to the kitchen (127.0.0.1:3000). Guests never enter the kitchen.",
        "A hotel: you ask the receptionist for room 12. You do not wander the staff corridors. Nginx is the receptionist. Express is room 12.",
        "Hide app ports, add HTTPS, serve photos from disk, send /api to Node and / to React, put two apps behind one domain.",
        "The app sees Nginx as the client unless you forward X-Forwarded-For. Do not leave :3000 public."
      );
    }
    if (/\bnginx\b/.test(hay) && !/kubernetes/.test(hay)) {
      return story(
        "Without Nginx, each app is its own front door. TLS, static files, and routing all sit inside Node — a job Node is poor at.",
        "Nginx is a specialist front door: files, HTTPS, and proxy_pass to the app. Your code stays on localhost.",
        "A mall has one main gate and many shops inside. Nginx is the gate. Your API is one shop.",
        "Static sites, reverse proxy, load-balance two Node processes, terminate HTTPS.",
        "Two server blocks both claiming default_server — the wrong site appears."
      );
    }
    if (/load balancer/.test(hay)) {
      return story(
        "One server took every click. When it died or got slow at noon, the whole site died.",
        "A load balancer is a traffic cop: it spreads requests across healthy boxes and stops sending to a dead one.",
        "A bank with one teller vs a hall with four windows and a person who says 'window 2 is free'.",
        "Scale reads, survive one machine dying, blue-green deploys.",
        "If every session lives only in one machine's RAM, you still need Redis or sticky sessions."
      );
    }
    if (/\bcdn\b/.test(hay)) {
      return story(
        "Every photo and JS file flew from one office in Mumbai to a user in New York. First paint was slow. That office melted on sale day.",
        "A CDN keeps copies of public files near the user, so the long flight happens once, not for every visitor.",
        "A newspaper printed in one city vs stacks at every railway station. The station stack is the CDN.",
        "JS bundles, images, fonts, public pages. Not a logged-in /api/me.",
        "A public CDN key that holds Ada's inbox is a leak."
      );
    }
    if (/postman|thunder client|\binsomnia\b|\bbruno\b|hoppscotch|newman/.test(hay)) {
      return story(
        "You tested the API only from the React page. A button hid the URL, the method, and the token. When the page failed you did not know if the kitchen was closed or the waiter wrote the order wrong. A teammate could not replay the same call. CI could not click Send. CORS hid another class of bugs that only the browser sees, so a green page still lied about the kitchen.",
        "You prove the kitchen works before you blame the dining room. Mobile, web, and a teammate can share the same saved orders in a collection. You see status, headers, and JSON without a spinner. Copy as curl for Slack or a pipeline. Environments swap localhost for staging without rewriting every ticket. The waiter is no longer the only window into the kitchen.",
        "A restaurant counter that is not the dining hall. You walk up, say one dosa (POST /orders), and see 201 plus the plate. If that fails, the waiter (React) is not the first suspect. The order pad shows method, URL, and the token header. A collection is a binder of those pads you can hand to QA. curl is the same pad spoken over the phone.",
        "Hit localhost, a staging URL, or a teammate's ngrok. Save login once and reuse the token. Export the same calls as curl for Slack or CI. Thunder Client lives in VS Code. Bruno stores the collection in Git. Swagger /docs is a live menu. Newman runs the collection in a pipeline so a broken kitchen fails the weigh station before merge.",
        "Postman is not a browser. CORS will not stop it. A green Send does not prove :5173 can call :3000. A token inside a shared collection is a leak if the collection lives in a public workspace. Do not treat 200 as 'the UI works'. Also do not paste production secrets into a cloud workspace you do not own or screenshot the Authorization header into Slack.",
        "Postman is a separate window for talking to an API. You pick GET or POST, type the URL, add headers and a body, press Send, and read the status plus JSON. The website UI is not in the way. A collection saves those calls. Environments hold tokens. curl is the same idea in the terminal. The browser is a different guest with CORS rules that Postman will never enforce."
      );
    }
    if (/\bcurl\b/.test(hay)) {
      return story(
        "A teammate had no Postman. CI cannot click Send. You needed the same request as text.",
        "curl is the terminal twin of Postman. Same method, URL, headers, and body. Postman can copy as curl.",
        "A phone call instead of a paper order pad. 'One dosa' is still POST /orders.",
        "README samples, GitHub issues, health checks, SSH on a server.",
        "A token inside a curl you paste into Slack is a leak."
      );
    }
    if (/openapi|\bswagger\b/.test(hay)) {
      return story(
        "The wiki listed routes that no longer exist. Frontend and backend argued about the JSON shape.",
        "OpenAPI is a machine menu of paths, bodies, and status codes. Swagger UI (often /docs) lets you Try it. FastAPI builds both from your functions.",
        "A menu the kitchen reprints when a dish dies — not a stained paper from last year.",
        "FastAPI /docs, Spring springdoc, any public API catalog. Import the spec into Postman.",
        "A public /docs on prod can leak admin routes."
      );
    }
    if (/\bgithub\b/.test(hay)) {
      return story(
        "The album lived on one laptop. The laptop died. A teammate could not review the work. There was no door called please merge this. Backup was a zip in Downloads. CI had nowhere to run. A new machine meant copying a folder on a pen drive and hoping the hidden .git attic came along. Two people emailed patches and overwrote each other's chapter.",
        "Clone on a new machine and you have the same history. Open a pull request so someone stamps your branch before main moves. Issues track the work. Actions can weigh every push. Pages or Vercel can ship a branch. The shelf holds the official book; your bag still holds Git even if the library website is down for an hour.",
        "Your bag is Git. The library shelf is GitHub. A pull request is please put my chapter into the official book. Issues are the slip on the librarian's desk. Actions are the weigh station at the door. Forks are a photocopy of the shelf you can mark up at home, then ask the librarian to stamp your chapter back into the official copy.",
        "Backup, clone on a new laptop, review, CI on every push, and deploys from a branch. Use PRs for internship work so a mentor can stamp the chapter. Host private homework or a public portfolio. GitLab and Bitbucket are other shelves with the same job: copy of Git, plus a door for merge and robots.",
        "Saying I use GitHub when you cannot name commit, branch, or pull request. Git works offline; the site is extra. Do not commit secrets and then push them to a public shelf. A force-push to shared main rewrites the official book while classmates still hold the old page numbers. Protect main so a stamp is required.",
        "GitHub is the school shelf: a hosted copy of your Git album, plus pull requests, issues, and Actions. GitLab and Bitbucket do the same job. Git still lives in the hidden .git folder on your laptop. The website is the librarian and the public shelf, not the camera. A clone is taking a copy of the shelf home. A PR is asking to add your chapter."
      );
    }
    if (/\bgit\b/.test(hay)) {
      return story(
        "People saved project-final-v3.zip. Two laptops had different files. Nobody could say who changed login.js or how to go back. A teammate overwrote a folder on a pen drive. The only history was a pile of zips named final2 and final2-really. A crash on Friday lost Thursday's work because the album lived in one bag with no shelf copy.",
        "You take a named snapshot, send it to the shelf, and pull what the team already saved. You can name a change, go back, and see who edited a line. A branch is a sticker so two people can write at once. A pull request is the stamp before the official book moves. Undo has restore, reset, and revert — pick the one that matches whether the photo was already shared.",
        "A class notebook. status is which pages are messy. add is put these pages in the envelope. commit is the photo. push hands the album to the school shelf. A branch is a sticker on one photo so you can write a new chapter without ripping the official book. merge copies the new pages back. rebase rewrites your private photos so they sit on the latest official page.",
        "Every job. Feature branches, pull requests, and undo with restore, reset, or revert. Interviews ask the daily words and the story: commit, branch, merge, rebase, PR. Use Git on a solo homework repo so the habit is there before a team shelf. Learn status before add, and read the envelope before you click the camera.",
        "git add . then commit without reading status — secrets and junk ride along. Do not reset shared main; revert instead, so classmates keep the same page numbers. Do not force-push a branch others already pulled. Write a message that names the change, not update. Keep .env out of the envelope. Nested git init makes a second attic nobody expected.",
        "Git is a local photo album of the project. Snapshots live in a hidden .git folder on your computer. The working tree is the desk. The staging area is the envelope. A commit is one photo with a message. A branch is a sticker on a photo. GitHub is only a host that keeps a copy. Git works with no website at all. Daily words: status, add, commit, pull, push."
      );
    }
    if (/fastapi|pydantic|uvicorn/.test(hay)) {
      return story(
        "A Python notebook cannot be called by a phone app. Flask made you check JSON by hand and write docs in a wiki that went stale.",
        "FastAPI turns a typed function into a URL. Wrong JSON is 422. /docs is a live menu. A model becomes POST /predict.",
        "A kitchen window: you read the menu (/docs), order POST /dosa, and get a plate (JSON). The cook is your Python function.",
        "CRUD APIs, login, ML /predict, file upload, internal tools. Same REST idea as Express, in Python.",
        "Validation is not login. A valid body can still be the wrong user. Put JWT in Depends."
      );
    }
    if ((/\brest\b|\bwhat is an api\b|\bapi\b/.test(hay)) && /http|json|endpoint|route|fastapi|express|resource/.test(hay)) {
      return story(
        "The website talked to the database from the browser, or every screen invented its own way to save a todo. Mobile and web could not share work. A password sat in the page.",
        "An API is a shared window: method + URL in, status + JSON out. The kitchen (server) owns the database. The dining room (UI) only orders.",
        "A restaurant: you do not cook. You order 'one dosa' (POST /orders). The kitchen answers 'ready' (201) or 'we are closed' (503).",
        "Mobile + web + another service all call the same /todos. FastAPI, Express, Go — same idea.",
        "GET must not delete. The browser never holds the database password."
      );
    }
    if (/webpage load|enter a url|type a url|type google/.test(hay)) {
      return story(
        "You typed a name. The browser did not know which computer that name is, or how to ask it safely. People jumped straight to 'HTML arrives' and skipped the hard parts.",
        "The page-load story is the shared path: find the computer (DNS), open a safe pipe (HTTPS), ask for a file (HTTP), get HTML, fetch extras, paint. Every login and API rides these same steps.",
        "A letter: look up the address in a phone book (DNS), lock the envelope (HTTPS), hand it to the post (HTTP), get a reply, then open the photos inside.",
        "Explaining any click: open Google, load an image, call /api/todos. Same order every time.",
        "Do not start at HTML. Interviewers wait for DNS and HTTPS first. The browser never talks to the database."
      );
    }
    if (/\bhttps\b/.test(hay) && /http/.test(hay)) {
      return story(
        "HTTP is a postcard: GET /login with the password written in ink. Anyone on the cafe Wi-Fi could read it and pretend to be you.",
        "HTTPS wraps that postcard in a locked envelope (TLS). The padlock also checks you reached the real bank, not a fake shop with a similar name.",
        "A cash van vs an open bicycle basket. Same money, different pipe. The language inside is still HTTP — GET, POST, JSON.",
        "Every login, cookie, token, and payment page. Redirect http:// to https:// on Nginx.",
        "Never send a password on http://. An https:// page that calls http:// is mixed content and the browser blocks it."
      );
    }
    if (/\bcors\b/.test(hay)) {
      return story(
        "Any website could tell the browser: 'call bank.com/api with the cookies you already have.' The bank would think it was the real app. Evil-site.com could empty the account.",
        "CORS is the bank's note to the browser: only this shop (https://app.com) may use my window. Postman is not a browser, so it skips this rule.",
        "A school canteen: students from this school may order. A stranger from another school is stopped at the gate — unless the canteen writes their name on the allow list.",
        "A React app on :5173 talking to an API on :3000. Production UI and API on different domains.",
        "You cannot fix CORS only in React. The server must allow the UI origin, or Nginx must make /api look same-origin."
      );
    }
    if (/event loop|microtask|macrotask/.test(hay)) {
      return story(
        "People thought fetch froze the page, or that setTimeout(0) ran immediately. Print order in interviews looked like magic.",
        "One cook, one counter. Finish the ticket in hand (sync), then small sticky notes (Promises), then the wall clock (setTimeout). The page can still spin a spinner.",
        "A chai stall with one person: pour this cup, then the next slip, then the timer for the boiling milk. He does not clone himself.",
        "Predict console.log order. Keep the UI alive while data loads. Know why await does not freeze the tab.",
        "await pauses only that async function, not the whole page."
      );
    }
    if (/\bvar\b[\s\S]*\blet\b|\bconst\b/.test(hay) && /scope|hoist|tdz|temporal/.test(hay)) {
      return story(
        "var leaked out of if-blocks and loops. A name you thought was local showed up later with a surprise value.",
        "let and const stay in their curly-brace room. const also refuses a second assignment to the same name, so you do not overwrite a URL by accident.",
        "A locker with a name tag. var was a tag you could still read in the hallway. let is a tag that stays inside the room.",
        "Every new variable in JS and React. const by default, let when the number must change.",
        "const only locks the name. An object inside const can still change its fields."
      );
    }
    if (/closure/.test(hay)) {
      return story(
        "A function returned and people thought its variables died. Then a click handler printed the wrong i, or two counters shared one number.",
        "A closure is a backpack: the inner function still carries the outer names after the outer function has gone home. Each call gets its own backpack.",
        "A locker key. You leave the gym (outer function returns) but the key still opens locker 7 (the saved n). Two members get two lockers.",
        "Counters, private passwords, React event handlers that remember the id from map().",
        "A loop with var and a click listener: every click sees the last i. Use let."
      );
    }
    if (/\bdom\b/.test(hay) && !/random/.test(hay)) {
      return story(
        "The page was dead text. To change a name you reloaded the whole site, or you edited HTML by hand and hoped.",
        "The DOM is the page as live objects. JavaScript finds a box, changes the text, and listens for a click — no full reload.",
        "A notice board. HTML is the paper. The DOM is the board with pins you can move. querySelector finds a pin. textContent writes a new note.",
        "Cards, todo lists, show/hide, forms. Daily frontend work before React, and still under React.",
        "Do not put user text into innerHTML. That is XSS. Use textContent."
      );
    }
    if (/\bdns\b/.test(hay)) {
      return story(
        "People can remember google.com, not 142.250.x.x. If you printed only the number on a poster, a server move would break every bookmark.",
        "DNS is the phone book: name in, IP out. You can change the machine behind the name without reprinting the poster.",
        "A shop sign says 'Ram Tea'. The actual stall may move to the next street. The sign still works if you update the phone book, not if you tattooed the old plot number.",
        "Every website, email MX records, load-balanced IPs, moving to a new host.",
        "DNS does not load HTML. It only answers 'which IP?'. HTTPS and HTTP come after. TTL can keep an old number for a while."
      );
    }
    if (/\bredis\b|cache-aside|in-memory store|ttl key|rediss:\/\//.test(hay)) {
      return story(
        "Every click asked Postgres the same thing: 'what is Ada's name?' A thousand users meant a thousand disk reads. Sessions lived in one Node process, so the second server did not know Ada was logged in.",
        "Redis is a shared RAM shelf next to the database. Check the shelf first. If the name is there, skip disk. If not, load Postgres, put a copy on the shelf with a timer, then answer.",
        "A chai stall: the cook does not grind leaves for every cup. A small pot stays hot on the counter (Redis). The big sack is in the store room (Postgres). When the pot is empty, refill from the sack.",
        "Cache a profile, hold a login session, count login tries, a cart for a day, a tiny job list, a live scoreboard. Not the only copy of money or users.",
        "FLUSHALL or a restart can wipe Redis. That should miss a cache or log people out — never delete the only user table. Always set a TTL."
      );
    }
    if (/mongodb|document store|mongoose|objectid|\.insertone|collection/.test(hay)) {
      return story(
        "A blog post is already a nested object: title, tags, comments. Splitting that into five SQL tables made every page load a pile of JOINs. Adding a new field meant ALTER TABLE and a migration weekend.",
        "Mongo stores one JSON-like document per thing. You save the object you already have. Fields can appear later without a schema change. find({ city: 'Pune' }) is the query.",
        "A student's file folder: one folder per student, papers stuffed inside (marks, photo, address). You pick up the whole folder. You do not run down the hall joining three registers unless you must.",
        "Posts with comments, product catalogs, events with extra fields, Node apps that think in objects. Not a bank ledger you will report across ten tables.",
        "Missing a field is just 'not there', not SQL NULL. Unique emails still need a unique index. Never pass req.body straight into find()."
      );
    }
    if (/create table|primary key|foreign key|postgres|mysql|relational|\bselect\b[\s\S]*\bfrom\b|\bsql\b/.test(hay) && !/nosql/.test(hay)) {
      return story(
        "Users lived in a JSON file or a spreadsheet on one laptop. Two people took the same email. An order saved with no user. A payment succeeded but stock did not drop.",
        "SQL is a shared ledger of tables with rules. UNIQUE email, FOREIGN KEY to a real user, BEGIN/COMMIT so two money updates succeed together or not at all.",
        "A school register: one row per student, one roll number that cannot repeat, one mark sheet that must point at a real student. The clerk cannot invent roll 99 if 99 is not in the book.",
        "Users, orders, money, marks, anything you will join or report on. PostgreSQL, MySQL, and SQLite all speak this language.",
        "UPDATE or DELETE without WHERE changes every row. Never glue user text into SQL — use $1 or ?."
      );
    }
    if (/oltp|olap|acid\b|replica vs shard|cap theorem|what is a database|pick a store/.test(hay)) {
      return story(
        "The only copy of users sat in a file on one laptop. Two tabs overwrote each other. A crash lost the afternoon's signups. You could not search except by opening the file.",
        "A database is a shared, crash-safe cabinet. Many people read and write at once. Indexes find a row fast. Rules (unique email) live in the cabinet, not only in your code.",
        "A bank vault vs a shoebox under the bed. The vault has a clerk (the engine), a catalog (indexes), and a rule that two people cannot take the same locker number.",
        "Any product with users. Start with one SQL database. Add Redis when the same read is too hot. Add Mongo when a document is the natural shape.",
        "A cache is not a database. A replica is a copy. A shard is a slice. Do not run a 20-second report on the checkout primary."
      );
    }
    if (/nosql|cassandra|dynamodb|wide-column|graph store|key-value/.test(hay)) {
      return story(
        "SQL JOINs got painful at huge write volume, or the thing you stored was already a nested object, or you only ever looked up by one key. People heard 'NoSQL' and thought 'no rules, always faster'.",
        "NoSQL is a family of cabinets, not one product. Document (Mongo), key-value (Redis, Dynamo), wide-column (Cassandra), graph (Neo4j). You pick the cabinet that matches how you look things up.",
        "A warehouse with bins labeled by SKU (key-value) vs a library card catalog you can ask any question (SQL). If you only ever grab bin A-12, a bin system is faster. If you ask 'all red shirts sold in Pune', you want tables.",
        "Known key lookups, nested documents, huge writes, friend graphs. SQL still wins for money, joins, and surprise reports.",
        "Picking Mongo from a tutorial, then spending a year rebuilding relations, is the usual regret."
      );
    }
    if (/cloudinary|upload preset|public_id|f_auto|q_auto/.test(hay) && !/ssh/.test((q || "").toLowerCase())) {
      return story(
        "Avatars sat in ./uploads on one Node box. A restart wiped the folder. The second server did not have the file. Mongo held base64 until documents got fat and every user read dragged a photo through the API. List pages shipped camera PNGs because nobody had a lab that could print a passport from a URL. Two waiters argued over a drawer that only existed under one dining-room table.",
        "Bytes leave your Node disk and live in the lab. Any API replica can show the same picture from the ticket. A phone gets a small WebP from the URL; a desktop asks for a larger crop. You did not write two files or run ImageMagick. A restart no longer shreds the only copy under the table, because the negative sits in Cloudinary and the CDN still holds yesterday's prints.",
        "Think of a print shop. You leave one negative: the original upload. The clerk prints a passport or a poster from that negative when the URL names the size. Your shop only keeps the ticket number, the public_id, in the register. Nobody tapes film under every table. Next year you can still order an 8x10 from roll 42 without hunting a second envelope in the kitchen.",
        "Use Cloudinary for MERN avatars, product shots, and post images, and for take-homes that say do not store files in Mongo. Anywhere two Node boxes or a container restart would lose ./uploads, send the negative to the lab. The dining room stays stateless: the register notes public_id, the CDN hangs the print, and ImageMagick never runs under the API table.",
        "Never put CLOUDINARY_API_SECRET in the React app or a VITE_ variable. That is handing the lab the master key to the safe. Anyone who opens DevTools can stamp fake tickets, shred Ada's negatives, or order huge prints on your bill. Do not treat the lab as a second Mongo for PDFs and backups. An unsigned preset with no size cap is an open dumpster.",
        "Cloudinary is a hosted photo lab plus a CDN. You upload once; the lab keeps the original bytes. You store a public_id in Mongo — locker number, not a print. The delivery URL is the order slip: cloud name, transforms such as w_400 or f_auto, then the id. The CDN caches each derived print at the edge so phones fetch a small copy without hitting your Node disk."
      );
    }
    if (/\bjwt\b|json web token/.test(hay)) {
      return story(
        "The server kept every login in its own RAM. The second server did not know Ada was logged in. Sticky sessions glued her to one box. Logging out everywhere was a spreadsheet of session ids.",
        "A JWT is a signed lunch pass: header, payload, signature. Any server with the secret can check the stamp. The server does not look up a session row on every click.",
        "A cinema ticket. The door person checks the stamp, not a phone call to the box office for every film. If you tear the ticket (change a field), the stamp no longer matches.",
        "Stateless APIs, mobile + web with the same /me, microservices that all trust one secret or public key.",
        "A JWT is not encrypted by default — anyone can read the payload. Do not put a password in it. Stealing the token is stealing the login until it expires."
      );
    }
    if (/\bssh\b|secure shell|ssh-keygen|authorized_keys|known_hosts|ssh-agent|ssh config|scp vs|sftp|jump host|bastion|port forwarding|publickey/.test((q || "").toLowerCase()) || /ssh-copy-id|permission denied \(publickey\)/.test(hay)) {
      return story(
        "You needed a shell on a machine across the city. Telnet sent the password in the clear. Anyone on café Wi‑Fi could read ada slash secret123 and walk into the server before you finished the first command. FTP copied files the same way: the badge was printed on the postcard. A second laptop had no way in except another shared password written on a sticky note next to the monitor.",
        "The line is encrypted, so the lobby cannot read the conversation. A public key sits in authorized_keys; the private file stays in your pocket and answers the challenge. You type on the laptop and the commands run on the other box. You can copy files with scp, tunnel a private database, and push git without pasting a password into every door on the street.",
        "A hotel desk: you show a key card, which is the private key. The clerk checks the card on file, authorized_keys. Then you walk the staff corridor. The lobby does not hear the conversation or copy the badge. A bastion is one public door in front of private rooms. If you lose the card, the clerk can take your name off the list without changing every lock in the building.",
        "VPS login, scp and rsync of folders, git at github.com, and a tunnel to a private database that must not sit on the street. Port 22 is the usual door. A jump host is one public lobby for many private rooms. Use an ssh config file so Host prod is a nickname, not a password you retype. Agents hold the unlocked card for the day so you do not type the passphrase every hop.",
        "A stolen private key is a stolen badge. Do not commit id_ed25519 or paste it in Slack. Do not set StrictHostKeyChecking=no just to silence a warning and follow a stranger at the desk. chmod 600 the private file. Disable password login once keys work. A world-writable authorized_keys is a lobby that accepts any photocopied card from the sidewalk.",
        "SSH is an encrypted phone line to another computer. You type on your laptop; the commands run on the remote box. The server stores your public key in authorized_keys. Your private key stays in your pocket and proves you are the card holder. The pipe is encryption, not a clear postcard. Port 22 is the usual door; a config file names Host aliases so you stop retyping long user-at-host strings."
      );
    }
    if (/\boop\b|object[- ]oriented|encapsulation|polymorphism|four pillars|what is inheritance|what is abstraction/.test(hay)) {
      return story(
        "Code was a pile of loose functions and global variables. A student name lived in three lists. Changing a fee rule meant hunting twenty files, and a typo in one list left a student without a marksheet on result day. Two clerks updated marks in different drawers and nobody could say which copy was true. A new intern added payFees in a fourth file and broke the old print path.",
        "Data and the actions that belong to it travel together. You change a fee rule in one class instead of twenty lists. A marksheet print reads the same folder that stored the marks. Interviews can ask you to draw Ada as one object, not a scatter of arrays. Polymorphism lets a list of shapes each draw themselves without a giant if-else of types in the hallway.",
        "A school register: one Student folder holds the name and the actions pay fees and print marksheet. You do not keep marks in a random drawer down the hall and hope the clerk walks there for every report. The stamp is the class. Ada and Bob are two inked copies. If the fee rule changes, you fix the stamp, not twenty loose slips on the floor.",
        "Java, C++, C#, Python, and modern JavaScript. Interviews always ask the four pillars plus class versus object, then they watch you write a tiny Student and call a method on one copy. Use objects when one thing has both data and rules. Use a short list of functions when the script is twenty lines and a class tree would be a costume on a shopping list.",
        "Not every problem wants a class tree. A list of functions is fine for a twenty-line script. Deep inheritance is how code goes stiff when a Square pretends to be a stretchy Rectangle. Do not make a God class that pays fees, sends email, and draws the UI. Encapsulation is not just private fields; it is not leaking the marksheet drawer to every hallway.",
        "OOP groups data and the actions that belong to it into objects. A class is the stamp. An object is one inked copy such as Ada or Bob. The four pillars are encapsulation, abstraction, inheritance, and polymorphism. You ask an object to print its marksheet instead of passing a name through five free functions that each open a different drawer down the hall."
      );
    }
    if (/ci\/cd|continuous integration|continuous delivery|continuous deployment|github actions|gitlab ci|gitlab-ci|jenkinsfile|workflow_dispatch|npm ci|status check/.test(hay)) {
      return story(
        "Ada merged on Friday. Tests ran only on her laptop. Bob copied a zip to the server with FTP. Monday morning checkout was 500 and nobody knew which box was live. Staging had a different node_modules than Ada remembered. Rollback meant asking who still had last week's zip in Downloads. Two people shipped two zips in the same hour and overwrote each other on the same folder.",
        "A red test stops the merge before the truck leaves. Prod runs the same artifact staging already tasted. Rollback is last week's stamped box, not a hunt through laptops. Every push gets the same recipe from a file in Git, so Bob cannot skip the weigh station because he is in a hurry. The sha on the box is the name you can revert to without baking again.",
        "A factory: every batch is weighed (CI). Only a stamped box goes on the truck (CD). You do not bake a new cake in the parking lot and call it the same batch. The recipe hangs on the wall as a YAML file in the repo. If the cake on the truck is wrong, you send yesterday's stamped box back, not a new mix from memory.",
        "GitHub Actions, GitLab CI, and Jenkins. Test on every pull request, build a sha, deploy to staging, then prod. Rollback is the previous sha. Use the same pipeline for Node, Python, Docker, and Terraform. A status check on the PR is the weigh ticket the clerk must see before main moves. Secrets live in the host, not in the YAML on the wall.",
        "A green deploy with no tests is CD without CI: the truck left without the scale. :latest in prod is a box with the label peeled off. Secrets pasted into the YAML are the recipe with the safe combination printed on it. Do not deploy from a laptop after a red pipeline just to save the afternoon. Pin versions so the factory does not change flour overnight.",
        "CI is a robot that tests every change on a clean machine. CD is putting that same tested box on a server, or keeping main always ready to ship. The recipe is a file in Git: install, test, build, maybe deploy. An artifact is the stamped box, named by commit sha. Staging tastes that box before prod. Rollback means the previous sha, not a new bake in the parking lot."
      );
    }
    if (/\bdocker\b|container image|dockerfile/.test(hay)) {
      return story(
        "'It works on my laptop' was the bug. Python 3.10 here, 3.12 there. A missing apt package on the server. Two hours to copy the same setup onto a new machine.",
        "Docker packs the app plus its OS bits into an image. The same box runs on your laptop, CI, and the cloud. A container is one running copy of that box.",
        "A tiffin dabba. The meal (app) and the box (OS libs) travel together. The office microwave (the host) only needs to know how to heat a dabba, not how you cooked at home.",
        "Same Node version everywhere, CI tests, one command to run Postgres + Redis + the API, ship to Kubernetes.",
        "A fat image with secrets baked in is a leak. Do not run the container as root if you can avoid it. Pin versions — latest moves under you."
      );
    }
    if (/vector|embedding|pgvector|pinecone|\brag\b/.test(hay)) {
      return story(
        "Keyword search missed 'bicycle' when the user typed 'bike'. A chatbot guessed from memory and invented a policy that was never in the docs.",
        "A vector store keeps meaning as lists of numbers. Close meanings sit close together. RAG finds the right paragraphs first, then the LLM writes from those paragraphs.",
        "A librarian who understands synonyms: you ask for 'something to ride to college' and she brings the bicycle aisle, not only books with that exact sentence.",
        "Chat over your PDFs, similar-product search, recommend 'more like this'. Users and orders still live in SQL or Mongo.",
        "A vector DB does not replace Postgres. Filter by tenant so one company cannot retrieve another company's chunks."
      );
    }
    return {};
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
    const problem = tip.problem || tip.before;
    const solves = tip.solves || tip.why;
    const hasProblem = hasTeachHead(out, "The problem before") || hasTeachHead(out, "Before you use this");
    const hasSolves = hasTeachHead(out, "What it solves") || hasTeachHead(out, "Why we use it");
    if (problem && !hasProblem) out = `The problem before\n${problem}\n\n${out}`;
    if (tip.what && !hasTeachHead(out, "What this is")) {
      out = hasTeachHead(out, "The problem before")
        ? insertAfterSection(out, "The problem before", "What this is", tip.what)
        : hasTeachHead(out, "Before you use this")
          ? insertAfterSection(out, "Before you use this", "What this is", tip.what)
          : `What this is\n${tip.what}\n\n${out}`;
    }
    if (solves && !hasSolves) {
      out = hasTeachHead(out, "What this is")
        ? insertAfterSection(out, "What this is", "What it solves", solves)
        : `What it solves\n${solves}\n\n${out}`;
    }
    if (tip.example && !hasTeachHead(out, "Real-life example")) {
      out = hasTeachHead(out, "What it solves")
        ? insertAfterSection(out, "What it solves", "Real-life example", tip.example)
        : hasTeachHead(out, "Why we use it")
          ? insertAfterSection(out, "Why we use it", "Real-life example", tip.example)
          : `${out}\n\nReal-life example\n${tip.example}`;
    }
    if (tip.uses && !hasTeachHead(out, "Uses")) {
      out = hasTeachHead(out, "Real-life example")
        ? insertAfterSection(out, "Real-life example", "Uses", tip.uses)
        : `${out}\n\nUses\n${tip.uses}`;
    }
    if (tip.extra && !hasTeachHead(out, "Also know") && !hasTeachHead(out, "Uses")) {
      out += `\n\nAlso know\n${tip.extra}`;
    }
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
    if (/^Summary\b/im.test(raw) || /^How the code works\b/im.test(raw) || /^What this is\b/im.test(raw) || /^Before you use this\b/im.test(raw) || /^Why we use it\b/im.test(raw) || /^What the code is doing\b/im.test(raw) || /^The problem before\b/im.test(raw) || /^What it solves\b/im.test(raw)) {
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
    if (/^wrong answer/i.test(t)) return "Wrong answer";
    if (/^check yourself/i.test(t)) return "Check yourself";
    if (/^follow-up questions/i.test(t)) return "Follow-up questions";
    if (/^worked example/i.test(t)) return "Worked example";
    if (/^in production/i.test(t)) return "In production";
    if (/^how the code works/i.test(t)) return "How the code works";
    if (/^summary$/i.test(t)) return "Summary";
    if (/^the problem before/i.test(t)) return "The problem before";
    if (/^before you use this/i.test(t)) return "The problem before";
    if (/^what it solves/i.test(t)) return "What it solves";
    if (/^why we use it/i.test(t)) return "What it solves";
    if (/^real-life example/i.test(t)) return "Real-life example";
    if (/^uses$/i.test(t)) return "Uses";
    if (/^when to pick this/i.test(t)) return "Uses";
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

  const simplifyLabText = (text) => {
    if (!text) return "";
    let clean = String(text || "").trim();
    // Remove lengthy storytelling metaphors
    clean = clean.replace(/A hotel:.*?(?=\n\n|$)/gi, "");
    clean = clean.replace(/Think of a print shop.*?(?=\n\n|$)/gi, "");
    clean = clean.replace(/A class notebook.*?(?=\n\n|$)/gi, "");
    clean = clean.replace(/A restaurant counter.*?(?=\n\n|$)/gi, "");
    clean = clean.replace(/A factory:.*?(?=\n\n|$)/gi, "");
    clean = clean.replace(/A tiffin dabba.*?(?=\n\n|$)/gi, "");

    // Retain clean, punchy sections: What this is, How it works, Key takeaways
    const lines = clean.split("\n");
    const filtered = [];
    let skipSection = false;

    for (const line of lines) {
      const trimmed = line.trim();
      if (/^(Follow-up questions|Check yourself|Wrong answer|The problem before|Real-life example)\b/i.test(trimmed)) {
        skipSection = true;
        continue;
      }
      if (/^(What this is|Summary|What happens|How the code works|In the code|Why we use it|Watch out|Key points|What it solves|Definition)\b/i.test(trimmed)) {
        skipSection = false;
      }
      if (!skipSection) {
        filtered.push(line);
      }
    }

    return filtered.join("\n").replace(/\n{3,}/g, "\n\n").trim();
  };

  const renderTeachText = (text, q) => {
    const raw = simplifyLabText(text);
    const src = autoTeach(raw, q);
    const simplifiedSrc = simplifyLabText(src);
    const lines = simplifiedSrc.replace(/\r/g, "").split("\n");
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
        ${body.split(/\n\n+/).map((p) => `<p>${escapeHtml(p.trim()).replace(/\n/g, "<br />")}</p>`).join("")}
      </section>`).join("")}</div>`;
  };

  const shortenPracticeAnswer = (text) => {
    if (!text) return "";
    const clean = simplifyLabText(text);
    const lines = clean.split("\n");
    const cut = lines.findIndex((line) =>
      /^(Also know|Wrong answer|Worked example|In production|Follow-up questions|Check yourself)\.?$/i.test(line.trim())
    );
    return (cut === -1 ? lines : lines.slice(0, cut)).join("\n").trim();
  };

  const wrapReadMore = (html, variant = "note") => `
    <div class="readmore readmore-${variant}" data-readmore>
      <div class="readmore-body">${html}</div>
      <div class="readmore-bar">
        <button type="button" class="readmore-btn" data-readmore-btn aria-expanded="false">Read more</button>
      </div>
    </div>`;

  const bindReadMore = (root) => {
    const boxes = [...(root || document).querySelectorAll("[data-readmore]")];
    const setup = (box) => {
      if (box.dataset.bound === "1") return;
      const btn = box.querySelector("[data-readmore-btn]");
      if (!btn) return;
      const wrap = box.closest(".answer-wrap");
      if (wrap && getComputedStyle(wrap).display === "none") return;
      box.dataset.bound = "1";
      btn.hidden = false;
      btn.addEventListener("click", () => {
        const open = box.classList.toggle("is-open");
        box.closest(".note")?.classList.toggle("is-open", open);
        btn.textContent = open ? "Read less" : "Read more";
        btn.setAttribute("aria-expanded", String(open));
      });
    };
    requestAnimationFrame(() => boxes.forEach(setup));
  };

  const splitNoteBody = (body) => {
    const text = String(body || "").replace(/\r/g, "").trim();
    if (!text) return { preview: "", sections: [] };
    const sections = [];
    let title = "";
    let buf = [];
    const flush = () => {
      const chunk = buf.join("\n").trim();
      if (title || chunk) sections.push({ title, body: chunk });
      buf = [];
    };
    const lines = text.split("\n");
    const headed = lines.some((line) => TEACH_HEAD.test(line.trim()));
    if (headed) {
      for (const line of lines) {
        if (TEACH_HEAD.test(line.trim())) {
          flush();
          title = prettyTeachHead(line.trim());
          continue;
        }
        buf.push(line);
      }
      flush();
    } else {
      text.split(/\n\n+/).map((p) => p.trim()).filter(Boolean).forEach((p) => {
        sections.push({ title: "", body: p });
      });
    }
    return { preview: sections[0]?.body || "", sections };
  };

  const noteInner = (n) => {
    const { preview, sections } = splitNoteBody(n?.body);
    const extra = sections.map((sec) => `
      <section class="answer-block">
        ${sec.title ? `<h4>${escapeHtml(sec.title)}</h4>` : ""}
        ${sec.body.split(/\n\n+/).map((p) => `<p>${escapeHtml(p.trim()).replace(/\n/g, "<br />")}</p>`).join("")}
      </section>`).join("");
    return `
      <div class="note-preview">${preview ? `<p>${escapeHtml(preview)}</p>` : ""}</div>
      <div class="note-extra">
        ${renderVisuals(n)}
        ${extra ? `<div class="answer-sections">${extra}</div>` : ""}
      </div>`;
  };

  const topicLangs = (data) => {
    const ids = data?.langs;
    if (ids && ids.length) return CODE_LANGS.filter((l) => ids.includes(l.id));
    return CODE_LANGS;
  };

  const topicLang = (data) => {
    const langs = topicLangs(data);
    const saved = getLang();
    return langs.some((l) => l.id === saved) ? saved : (langs[0]?.id || "javascript");
  };

  const langBar = (active, langs = CODE_LANGS) => `
    <div class="lang-bar btn-group" role="tablist" aria-label="Code language">
      ${langs.map((l) =>
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

  const localLearnerCount = () => Object.keys(loadJson(accountsKey, {})).length;

  const emptyPublicStats = () => ({
    learners: localLearnerCount(),
    ratingSum: 0,
    ratingN: 0
  });

  const readPublicStats = () => {
    const cache = loadJson(statsCacheKey, emptyPublicStats());
    return {
      learners: Math.max(Number(cache.learners) || 0, localLearnerCount()),
      ratingSum: Number(cache.ratingSum) || 0,
      ratingN: Number(cache.ratingN) || 0
    };
  };

  const writePublicStats = (stats) => {
    localStorage.setItem(statsCacheKey, JSON.stringify(stats));
    return stats;
  };

  const abacusFetch = async (path) => {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 4000);
    try {
      const res = await fetch(`${ABACUS}/${path}`, { cache: "no-store", signal: ctrl.signal });
      if (!res.ok) return 0;
      const data = await res.json();
      return Number(data.value ?? data.count) || 0;
    } catch {
      return 0;
    } finally {
      clearTimeout(t);
    }
  };

  const abacusGet = (key) => abacusFetch(`get/${ABACUS_NS}/${key}`);
  const abacusHit = (key) => abacusFetch(`hit/${ABACUS_NS}/${key}`);

  const refreshPublicStats = async () => {
    const local = readPublicStats();
    const [learners, ratingSum, ratingN] = await Promise.all([
      abacusGet("logins"),
      abacusGet("ratesum"),
      abacusGet("raten")
    ]);
    return writePublicStats({
      learners: Math.max(learners, local.learners, localLearnerCount()),
      ratingSum: Math.max(ratingSum, local.ratingSum),
      ratingN: Math.max(ratingN, local.ratingN)
    });
  };

  const countLearnerOnce = async (email) => {
    const key = String(email || "").trim().toLowerCase();
    if (!key) return;
    const counted = loadJson(countedEmailsKey, {});
    if (counted[key]) return;
    counted[key] = Date.now();
    localStorage.setItem(countedEmailsKey, JSON.stringify(counted));
    const remote = await abacusHit("logins");
    const stats = readPublicStats();
    stats.learners = Math.max(remote, localLearnerCount(), stats.learners);
    writePublicStats(stats);
  };

  const ratingAverage = (stats) => (stats.ratingN ? stats.ratingSum / stats.ratingN : 0);

  const ratingLabel = (stats) => (stats.ratingN ? ratingAverage(stats).toFixed(1) : "—");

  const starGlyphs = (avg) => {
    const n = Math.round(Number(avg) || 0);
    return "★".repeat(Math.min(5, Math.max(0, n))) + "☆".repeat(Math.max(0, 5 - n));
  };

  const mySiteRating = () => Number(localStorage.getItem(myRatingKey) || 0) || 0;

  const saveSiteRating = async (stars) => {
    const n = Math.min(5, Math.max(1, Number(stars) || 0));
    localStorage.setItem(myRatingKey, String(n));
    if (localStorage.getItem(ratedPublicKey) === "1") return readPublicStats();
    localStorage.setItem(ratedPublicKey, "1");
    const stats = readPublicStats();
    stats.ratingSum += n;
    stats.ratingN += 1;
    writePublicStats(stats);
    return readPublicStats();
  };

  const paintHomeSocial = (stats) => {
    const learners = Math.max(stats.learners, localLearnerCount());
    const avg = ratingAverage(stats);
    const learnerEl = document.getElementById("statLearners");
    const ratingEl = document.getElementById("statRatingVal");
    const ratingMeta = document.getElementById("statRatingMeta");
    const glyphs = document.getElementById("statRatingStars");
    const homeMeta = document.getElementById("homeRatingMeta");
    if (learnerEl) learnerEl.textContent = learners.toLocaleString();
    document.querySelectorAll("[data-learners]").forEach((el) => {
      el.textContent = learners.toLocaleString();
    });
    if (ratingEl) ratingEl.textContent = ratingLabel(stats);
    if (ratingMeta) {
      ratingMeta.textContent = stats.ratingN
        ? `${stats.ratingN.toLocaleString()} rating${stats.ratingN === 1 ? "" : "s"}`
        : "no ratings yet";
    }
    if (glyphs) glyphs.textContent = stats.ratingN ? starGlyphs(avg) : "☆☆☆☆☆";
    const mine = mySiteRating();
    document.querySelectorAll("[data-home-rate]").forEach((btn) => {
      const v = Number(btn.dataset.homeRate);
      btn.classList.toggle("on", mine ? v <= mine : stats.ratingN > 0 && v <= Math.round(avg));
    });
    if (homeMeta) {
      homeMeta.textContent = mine
        ? `You rated ${mine} / 5. Site average ${ratingLabel(stats)}${stats.ratingN ? ` from ${stats.ratingN.toLocaleString()} rating${stats.ratingN === 1 ? "" : "s"}` : ""}.`
        : stats.ratingN
          ? `${ratingLabel(stats)} / 5 from ${stats.ratingN.toLocaleString()} rating${stats.ratingN === 1 ? "" : "s"}. Tap a star to rate.`
          : "Be the first to rate Preplace. Tap a star.";
    }
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
    const parts = hash.split("/");
    if (parts[0] === "feedback" || (parts[0] === "contact" && parts[1] === "feedback")) return "feedback";
    return parts[0] || "home";
  };

  const paintChrome = () => {
    const page = currentPage();
    document.body.dataset.page = page;
    const hash = location.hash;
    const topicId = hash.startsWith("#/topic/") ? hash.slice(2).split("/")[1] : "";
    document.querySelectorAll("[data-nav]").forEach((a) => {
      const nav = a.dataset.nav;
      const on = nav === "practice-q"
        ? topicId === "practice-web"
        : nav === "practice"
          ? page === "practice" || (topicId.startsWith("practice-") && topicId !== "practice-web")
          : nav === page;
      a.classList.toggle("active", on);
    });
    if (window.PreplaceAuth && typeof window.PreplaceAuth.renderAuthBar === "function") {
      window.PreplaceAuth.renderAuthBar();
    }
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

  const FOCUS_LINES = [
    "One problem a day beats a week of panic.",
    "You do not need the whole path today. You need the next step.",
    "Brute force first. Then make it faster.",
    "Notes you can say out loud are notes you own.",
    "Labs teach the hands. Questions teach the interview.",
    "A short streak is still a streak. Open today's problem.",
    "Companies repeat the same ideas. Learn the idea, not the wording.",
    "Write the code. Then say why each line is there."
  ];

  const dailyFocusLine = () => {
    const day = todayStamp();
    let h = 0;
    for (let i = 0; i < day.length; i++) h = (h * 33 + day.charCodeAt(i)) >>> 0;
    return FOCUS_LINES[h % FOCUS_LINES.length];
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
    const next = theme === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    const colorMeta = document.getElementById("themeColor");
    if (colorMeta) colorMeta.setAttribute("content", next === "dark" ? "#12110f" : "#f4efe6");
    if (themeToggle) {
      themeToggle.textContent = next === "dark" ? "☀" : "☾";
      themeToggle.setAttribute("aria-pressed", String(next === "dark"));
      themeToggle.setAttribute("aria-label", next === "dark" ? "Switch to light mode" : "Switch to dark mode");
    }
    localStorage.setItem(themeKey, next);
  };

  const savedTheme = localStorage.getItem(themeKey);
  applyTheme(savedTheme === "dark" || savedTheme === "light"
    ? savedTheme
    : (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  themeToggle?.addEventListener("click", () => {
    applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  });

  const topicById = (id) => window.PREP_TOPICS.find((t) => t.id === id);
  const careerById = (id) => (window.PREP_CAREERS || []).find((c) => c.id === id);
  const pack = (id) => window.PREP_DATA[id];
  const practiceTopics = () => window.PREP_TOPICS.filter((t) => t.id.startsWith("practice-"));
  const labTopics = () => practiceTopics().filter((t) => t.id !== "practice-web");

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

  const showPendingWork = (el, feature) => {
    if (!el) return;
    el.hidden = false;
    el.textContent = `This work is pending. ${feature} is not active yet.`;
    el.className = "form-status is-pending";
  };

  const renderAuth = (mode) => {
    const signup = mode === "signup";
    view.innerHTML = `
      <section class="form-page">
        <div class="page-actions">
          <a class="btn btn-ghost" href="#/">← Home</a>
        </div>
        <article class="auth-card">
          <p class="pending-banner">Work pending</p>
          <h1>${signup ? "Create your account" : "Log in"}</h1>
          <p>${signup
            ? "This signup page is ready to look at. Creating an account is not active yet."
            : "This login page is ready to look at. Signing in is not active yet."}</p>
          <form id="authForm" class="auth-form" novalidate>
            ${signup ? `<label>Your name<input class="auth-field" name="name" maxlength="40" autocomplete="name" /></label>` : ""}
            <label>Email<input class="auth-field" name="email" type="email" autocomplete="email" /></label>
            <label>Password<input class="auth-field" name="password" type="password" minlength="6" autocomplete="${signup ? "new-password" : "current-password"}" /></label>
            <p class="form-status" id="authError" hidden></p>
            <div class="form-actions">
              <button class="btn btn-primary btn-wide" type="submit">${signup ? "Sign up" : "Log in"}</button>
              <a class="btn btn-ghost btn-wide" href="${signup ? "#/login" : "#/signup"}">${signup ? "I already have an account" : "Create an account"}</a>
            </div>
          </form>
          <p class="auth-note">Raj is still finishing accounts. You can use Preplace without logging in.</p>
        </article>
      </section>`;

    document.getElementById("authForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      showPendingWork(
        document.getElementById("authError"),
        signup ? "Sign up" : "Login"
      );
    });
  };

  const postToRaj = (fields) => {
    const frameName = "prepplaceMail";
    let frame = document.getElementById(frameName);
    if (!frame) {
      frame = document.createElement("iframe");
      frame.id = frameName;
      frame.name = frameName;
      frame.className = "honey";
      frame.title = "hidden";
      document.body.appendChild(frame);
    }
    const sink = document.createElement("form");
    sink.action = `https://formsubmit.co/${CONTACT.email}`;
    sink.method = "POST";
    sink.target = frameName;
    sink.className = "honey";
    const payload = {
      ...fields,
      _template: "table",
      _captcha: "false",
      _next: "https://formsubmit.co/ajax/thanks"
    };
    Object.entries(payload).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = String(value ?? "");
      sink.appendChild(input);
    });
    document.body.appendChild(sink);
    sink.submit();
    sink.remove();
  };

  const setContactStatus = (text, kind) => {
    const el = document.getElementById("contactStatus");
    if (!el) return;
    el.hidden = !text;
    el.textContent = text;
    el.className = `form-status${kind ? ` ${kind}` : ""}`;
  };

  const bindRajPhoto = () => {
    const dialog = document.getElementById("rajPhotoDialog");
    const lightImg = document.getElementById("lightboxImg");
    document.getElementById("openRajPhoto")?.addEventListener("click", () => {
      if (lightImg) {
        lightImg.src = "assets/raj.jpg";
        lightImg.alt = "Raj Kumar";
      }
      dialog?.showModal();
    });
    document.getElementById("closeRajPhoto")?.addEventListener("click", () => dialog?.close());
    dialog?.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
  };

  const renderContact = () => {
    const user = currentUser();
    view.innerHTML = `
      <section class="form-page">
        <div class="page-actions">
          <a class="btn btn-ghost" href="#/">← Home</a>
          <a class="btn" href="#/feedback">Feedback</a>
        </div>
        <article class="author-card">
          <button type="button" class="contact-photo-btn" id="openRajPhoto" aria-label="View Raj Kumar's full photo">
            <img class="contact-photo" src="assets/raj.jpg" width="88" height="88" alt="Raj Kumar" />
          </button>
          <div>
            <p class="hero-kicker">Author</p>
            <h2>Raj Kumar</h2>
            <p>I built Preplace so interview prep stays in one place: notes, DSA, labs, and the questions companies repeat.</p>
            <p class="contact-links">
              Email: <a href="mailto:${CONTACT.email}">${CONTACT.email}</a><br />
              LinkedIn: <a href="${CONTACT.linkedin}" target="_blank" rel="noopener noreferrer">linkedin.com/in/raja-o</a>
            </p>
          </div>
        </article>
        <article class="auth-card">
          <div class="contact-head">
            <div>
              <p class="hero-kicker">Direct Contact</p>
              <h1>Message Raj Kumar</h1>
              <p>Have a doubt in a DSA solution, need career guidance, or want to suggest interview questions? Send a direct message below.</p>
            </div>
          </div>
          <form id="contactForm" class="auth-form" novalidate>
            <label>Your name
              <input class="auth-field" name="name" maxlength="80" required value="${escapeHtml(user?.name || "")}" placeholder="Your name" />
            </label>
            <label>Your email
              <input class="auth-field" name="email" type="email" required value="${escapeHtml(user?.email || "")}" placeholder="you@example.com" />
            </label>
            <label>Topic / Category
              <select class="auth-field" name="category">
                <option value="general">General Message</option>
                <option value="doubt">DSA Doubt / Solution Question</option>
                <option value="solution">Suggest Missing Question / Solution</option>
                <option value="career">Career Guidance & Advice</option>
                <option value="feedback">Platform Suggestion</option>
              </select>
            </label>
            <label>Message
              <textarea class="auth-field" name="message" rows="8" required minlength="5" placeholder="What do you want to ask or tell Raj?"></textarea>
            </label>
            <p class="form-status" id="contactStatus" hidden></p>
            <div class="form-actions">
              <button class="btn btn-primary btn-wide" type="submit" id="contactSend">Send Message to Raj</button>
            </div>
          </form>
          <p class="auth-switch">Want to rate the site? <a href="#/feedback">Send feedback</a></p>
        </article>
        <dialog class="photo-lightbox" id="rajPhotoDialog" aria-label="Photo">
          <button type="button" class="photo-lightbox-close" id="closeRajPhoto">Close</button>
          <img class="photo-lightbox-img" id="lightboxImg" src="assets/raj.jpg" alt="" />
        </dialog>
      </section>`;

    const contactForm = document.getElementById("contactForm");
    const contactBtn = document.getElementById("contactSend");

    contactForm?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(contactForm);
      const name = String(fd.get("name") || "").trim();
      const email = String(fd.get("email") || "").trim();
      const category = String(fd.get("category") || "general").trim();
      const message = String(fd.get("message") || "").trim();

      if (!name) {
        setContactStatus("Please enter your name.", "is-error");
        return;
      }
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        setContactStatus("Please enter a valid email address so Raj can reply to you.", "is-error");
        return;
      }
      if (!message || message.length < 5) {
        setContactStatus("Please write a message with at least 5 characters.", "is-error");
        return;
      }

      setContactStatus("Sending your message to Raj...", "");
      if (contactBtn) {
        contactBtn.disabled = true;
        contactBtn.textContent = "Sending...";
      }

      try {
        const res = await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            category,
            subject: `Preplace message from ${name} (${category})`,
            message
          })
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setContactStatus("Message sent successfully! Raj will receive your message and get back to you.", "is-ok");
          contactForm.reset();
          if (user) {
            if (contactForm.elements.name) contactForm.elements.name.value = user.name || "";
            if (contactForm.elements.email) contactForm.elements.email.value = user.email || "";
          }
          if (contactBtn) contactBtn.textContent = "Send another message";
        } else {
          // Fallback to postToRaj if backend endpoint returns an issue
          postToRaj({
            name,
            email,
            category,
            message,
            _subject: `Preplace message from ${name}`
          });
          setContactStatus("Message dispatched! Raj will receive your note.", "is-ok");
          contactForm.reset();
          if (contactBtn) contactBtn.textContent = "Send another message";
        }
      } catch (err) {
        // Network fallback
        postToRaj({
          name,
          email,
          category,
          message,
          _subject: `Preplace message from ${name}`
        });
        setContactStatus("Message sent! Raj will review it.", "is-ok");
        contactForm.reset();
        if (contactBtn) contactBtn.textContent = "Send another message";
      } finally {
        if (contactBtn) contactBtn.disabled = false;
      }
    });

    bindRajPhoto();
  };

  const renderFeedback = () => {
    const user = currentUser();
    view.innerHTML = `
      <section class="form-page">
        <div class="page-actions">
          <a class="btn btn-ghost" href="#/">← Home</a>
          <a class="btn" href="#/contact">Message Raj</a>
        </div>
        <article class="auth-card">
          <p class="hero-kicker">Feedback</p>
          <h1>Site feedback</h1>
          <p>Tell Raj what to keep, what is confusing, or what to add next. Private doubts belong on Message Raj.</p>
          <form id="feedbackForm" class="auth-form">
            <input class="honey" type="text" name="_gotcha" tabindex="-1" autocomplete="off" />
            <label>Your name<input class="auth-field" name="name" required maxlength="80" value="${escapeHtml(user?.name || "")}" /></label>
            <label>Your email<input class="auth-field" name="email" type="email" required value="${escapeHtml(user?.email || "")}" /></label>
            <p class="filter-label">How is Preplace?</p>
            <div class="star-row" id="feedbackStars" role="group" aria-label="Rating">
              ${[1, 2, 3, 4, 5].map((n) => `<button type="button" class="star-pick" data-star="${n}" aria-label="${n} star${n > 1 ? "s" : ""}">★</button>`).join("")}
            </div>
            <input type="hidden" name="rating" id="feedbackRating" value="" />
            <label>Kind
              <select class="auth-field" name="kind">
                <option value="general">General</option>
                <option value="bug">Something is broken</option>
                <option value="content">Content request</option>
                <option value="thanks">Thank you</option>
              </select>
            </label>
            <label>Your feedback<textarea class="auth-field" name="feedback" rows="8" required minlength="8" placeholder="What should Raj know about the site?"></textarea></label>
            <p class="form-status" id="feedbackStatus" hidden></p>
            <div class="form-actions">
              <button class="btn btn-primary btn-wide" type="submit" id="feedbackSend">Send feedback</button>
            </div>
          </form>
          <p class="auth-switch">Need help with a question? <a href="#/contact">Message Raj</a></p>
        </article>
      </section>`;

    const setFeedbackStatus = (text, kind) => {
      const el = document.getElementById("feedbackStatus");
      if (!el) return;
      el.hidden = !text;
      el.textContent = text;
      el.className = `form-status${kind ? ` ${kind}` : ""}`;
    };

    const stars = view.querySelectorAll("[data-star]");
    const ratingInput = document.getElementById("feedbackRating");
    const paintStars = (n) => {
      stars.forEach((btn) => btn.classList.toggle("on", Number(btn.dataset.star) <= n));
    };
    stars.forEach((btn) => {
      btn.addEventListener("click", () => {
        const n = Number(btn.dataset.star);
        ratingInput.value = String(n);
        paintStars(n);
      });
    });

    const feedbackForm = document.getElementById("feedbackForm");
    const feedbackBtn = document.getElementById("feedbackSend");
    feedbackForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(feedbackForm);
      if (String(fd.get("_gotcha") || "").trim()) return;
      const name = String(fd.get("name") || "").trim();
      const email = String(fd.get("email") || "").trim();
      const kind = String(fd.get("kind") || "general").trim();
      const rating = String(fd.get("rating") || "").trim();
      const feedback = String(fd.get("feedback") || "").trim();
      if (!name || !email || feedback.length < 8) {
        setFeedbackStatus("Please add your name, email, and a short note.", "is-error");
        return;
      }
      postToRaj({
        name,
        email,
        kind,
        rating: rating || "not rated",
        feedback,
        _subject: `Preplace feedback from ${name}`
      });
      if (rating) saveSiteRating(rating);
      feedbackForm.reset();
      if (ratingInput) ratingInput.value = "";
      paintStars(0);
      if (user) {
        feedbackForm.elements.name.value = user.name || "";
        feedbackForm.elements.email.value = user.email || "";
      }
      setFeedbackStatus("Sent. Thank you — Raj will read this.", "is-ok");
      feedbackBtn.textContent = "Send more feedback";
    });
  };

  const renderDashboard = () => {
    if (window.PreplaceProgress && typeof window.PreplaceProgress.renderDashboardView === "function") {
      view.innerHTML = window.PreplaceProgress.renderDashboardView();
      if (window.PreplaceProgress.updateUIElements) window.PreplaceProgress.updateUIElements();
    } else {
      view.innerHTML = `<div class="dashboard-container"><p>Loading dashboard...</p></div>`;
    }
  };

  const route = () => {
    paintChrome();
    const hash = location.hash.slice(2) || "";
    const [page, id, extra] = hash.split("/");
    if (page === "topic" && id && topicById(id)) renderTopic(id, extra);
    else if (page === "career" && id && careerById(id)) renderCareer(id);
    else if (page === "topics") renderTopics(searchInput.value);
    else if (page === "practice") renderPracticeHub();
    else if (page === "dsa") renderDsaSheet();
    else if (page === "dashboard") renderDashboard();
    else if (page === "login") {
      if (window.PreplaceAuth) window.PreplaceAuth.openModal("login");
      renderHome();
    }
    else if (page === "signup") {
      if (window.PreplaceAuth) window.PreplaceAuth.openModal("signup");
      renderHome();
    }
    else if (page === "feedback" || (page === "contact" && id === "feedback")) renderFeedback();
    else if (page === "contact") renderContact();
    else if (page === "about") renderHome("", true);
    else renderHome();
  };

  const topicCard = (t) => {
    const p = progressFor(t.id);
    const data = pack(t.id);
    const kind = data?.kind;
    const count = kind === "practice" ? (data?.questions || []).length : (data?.examples || []).length;
    const unit = kind === "design" ? "workflows" : kind === "practice" ? "questions" : "code examples";
    return `
      <a class="card" href="#/topic/${t.id}">
        <div class="card-top">
          <span class="icon">${t.icon}</span>
          <span class="badge">${t.category}</span>
        </div>
        <h2>${t.title}</h2>
        <p>${t.blurb}</p>
        <p>${count} ${unit} · ${p.done}/${p.total} done</p>
        <div class="progress"><span style="width:${p.pct}%"></span></div>
      </a>`;
  };

  const renderHome = (filter = "", scrollAuthor = false) => {
    const q = (filter || searchInput.value || "").trim().toLowerCase();
    const sections = window.PREP_CAREER_SECTIONS || [];
    const careers = (window.PREP_CAREERS || []).filter((c) => {
      const sec = sections.find((s) => s.id === c.section);
      const hay = `${c.title} ${c.blurb} ${c.builds} ${sec?.title || ""} ${sec?.blurb || ""} ${c.steps.map((s) => s.learn).join(" ")}`.toLowerCase();
      return !q || hay.includes(q);
    });
    const askedTopic = topicById("practice-web");
    const askedQs = (pack("practice-web")?.questions || []).slice(0, 6);
    const showAsked = Boolean(askedTopic) && (!q
      || `${askedTopic.title} ${askedTopic.blurb} companies asked questions`.toLowerCase().includes(q)
      || askedQs.some((item) => item.q.toLowerCase().includes(q)));
    const careerCard = (c) => {
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
    };
    const visibleSections = sections
      .map((sec) => ({ ...sec, items: careers.filter((c) => c.section === sec.id) }))
      .filter((sec) => sec.items.length);
    const leftover = careers.filter((c) => !sections.some((s) => s.id === c.section));
    if (leftover.length) {
      visibleSections.push({ id: "more", title: "More paths", blurb: "", items: leftover });
    }

    const totals = window.PREP_TOPICS.reduce((acc, t) => {
      const p = progressFor(t.id);
      acc.questions += p.total;
      acc.done += p.done;
      return acc;
    }, { questions: 0, done: 0 });

    const user = currentUser();
    const publicStats = readPublicStats();
    const daily = dailyProblem();
    const dsaDone = dsaTopics().reduce((n, t) => n + progressFor(t.id).done, 0);
    const dsaTotal = dsaTopics().reduce((n, t) => n + progressFor(t.id).total, 0);
    const focusLine = dailyFocusLine();

    view.innerHTML = `
      <section class="hero">
        <div class="hero-stage">
          <div class="hero-copy">
            <div class="hero-brand">
              <img class="hero-logo" src="assets/logo.svg" width="64" height="64" alt="" />
              <p class="hero-kicker">Career paths · notes · practice</p>
            </div>
            <h1>Pick a career.<br />See what to learn.</h1>
            <p class="hero-lead">Frontend, backend, MERN, full stack, ML, DevOps, and a FAANG DSA path. Each path shows the order, then opens notes, easy code, and practice questions.</p>
            <!-- Work pending: signed-in / guest paragraph
            <p class="account-line">${user
              ? `Signed in as <strong>${escapeHtml(user.name)}</strong> · ${escapeHtml(user.email)}. Done questions, stars, and notes stay with this account.`
              : `You are a guest. <a href="#/signup">Sign up</a> to keep progress under your name, or <a href="#/login">log in</a>. Message <a href="#/contact">Raj Kumar</a> anytime.`
            }</p>
            -->
            <div class="hero-cta">
              <button class="btn btn-primary" type="button" id="scrollCareers">Browse paths</button>
              <a class="btn" href="#/topic/practice-web">Practice questions</a>
              <a class="btn" href="#/practice">Labs</a>
              <a class="btn btn-ghost" href="#/dsa">Problem sheet</a>
            </div>
          </div>
          <aside class="hero-panel" id="heroFocus">
            <p class="hero-kicker">Today's focus</p>
            <blockquote class="hero-quote">
              <p>${escapeHtml(focusLine)}</p>
            </blockquote>
            <div class="hero-cta hero-cta-stack">
              <a class="btn btn-primary" href="#/topic/practice-web">Practice questions</a>
              <a class="btn" href="#/practice">Labs</a>
              <a class="btn btn-ghost" href="#/contact">Message Raj</a>
            </div>
            <div class="hero-today">
              <p class="hero-kicker">Today's problem</p>
              <p>${daily ? `${daily.topicIcon} ${escapeHtml(daily.q)} · ${escapeHtml(daily.topicTitle)}` : "DSA topics are still loading."}</p>
              ${daily ? `<button class="btn btn-primary" type="button" id="openDailyHero">Open</button>` : ""}
            </div>
            <div class="hero-panel-meta">
              <div class="author-rate">
                <p class="filter-label">Rate this website</p>
                <div class="star-row" role="group" aria-label="Rate Preplace">
                  ${[1, 2, 3, 4, 5].map((n) => `<button type="button" class="star-pick" data-home-rate="${n}" aria-label="${n} star${n > 1 ? "s" : ""}">★</button>`).join("")}
                </div>
                <p class="site-rating-meta" id="homeRatingMeta"></p>
              </div>
            </div>
          </aside>
          <div class="hero-stats">
          <div class="stats">
            <div class="stat"><b>${window.PREP_CAREERS.length}</b><span>career paths</span></div>
            <div class="stat"><b>${window.PREP_TOPICS.length}</b><span>subjects</span></div>
            <div class="stat"><b>${totals.questions}</b><span>questions</span></div>
            <div class="stat"><b>${readStreak().count}</b><span>day streak</span></div>
          </div>
          <p class="social-bar">
            <span>
              <b id="statRatingVal">${ratingLabel(publicStats)}</b>
              / 5
              <span class="social-stars" id="statRatingStars">${publicStats.ratingN ? starGlyphs(ratingAverage(publicStats)) : "☆☆☆☆☆"}</span>
              <span id="statRatingMeta">${publicStats.ratingN ? `${publicStats.ratingN.toLocaleString()} rating${publicStats.ratingN === 1 ? "" : "s"}` : "no ratings yet"}</span>
            </span>
          </p>
          </div>
        </div>
      </section>
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
      </div>
      ${showAsked ? `
      <section class="home-practice" id="homePractice">
        <div class="home-paths-top">
          <h2 class="section-title">Companies asked questions</h2>
          <div class="hero-cta">
            <a class="btn btn-primary" href="#/topic/practice-web">Practice questions</a>
            <a class="btn" href="#/practice">Labs</a>
          </div>
        </div>
        <p class="example-intro">A short list of questions companies repeat. Open the full sheet for the rest.</p>
        <ol class="asked-list">
          ${askedQs.map((item) => `<li><a href="#/topic/practice-web/${item.id}">${escapeHtml(item.q)}</a></li>`).join("")}
        </ol>
      </section>` : ""}
      <div class="home-paths" id="homeCareers">
        <div class="home-paths-top">
          <h2 class="section-title">Choose a career path</h2>
          ${visibleSections.length > 1 ? `
          <nav class="home-jumps" aria-label="Path sections">
            ${visibleSections.map((sec) => `<button type="button" data-sec="${sec.id}">${escapeHtml(sec.title)}</button>`).join("")}
          </nav>` : ""}
        </div>
        ${visibleSections.map((sec) => `
          <section class="home-section" id="sec-${sec.id}">
            <div class="home-section-head">
              <h3>${escapeHtml(sec.title)}</h3>
              ${sec.blurb ? `<p>${escapeHtml(sec.blurb)}</p>` : ""}
            </div>
            <div class="career-grid">
              ${sec.items.map(careerCard).join("")}
            </div>
          </section>`).join("") || `<p class="empty">No career matches that search.</p>`}
      </div>
      <p class="example-intro" style="margin-top:22px">
        Want one subject only? <a href="#/topics">Browse all subjects</a> · <a href="#/dsa">Search every DSA problem</a>
      </p>
    `;
    document.getElementById("scrollCareers")?.addEventListener("click", () => {
      document.getElementById("homeCareers")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    document.querySelectorAll(".home-jumps [data-sec]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.getElementById(`sec-${btn.dataset.sec}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
    const openToday = () => {
      const p = dailyProblem();
      if (p) goProblem(p.topicId, p.id);
    };
    document.getElementById("openDaily")?.addEventListener("click", openToday);
    document.getElementById("openDailyHero")?.addEventListener("click", openToday);
    bindReadMore(view);
    document.getElementById("openRandom")?.addEventListener("click", () => {
      const p = randomProblem();
      if (p) goProblem(p.topicId, p.id);
    });
    paintHomeSocial(publicStats);
    view.querySelectorAll("[data-home-rate]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const stats = await saveSiteRating(btn.dataset.homeRate);
        paintHomeSocial(stats);
      });
    });
    refreshPublicStats().then((stats) => paintHomeSocial(stats));
    if (scrollAuthor) {
      requestAnimationFrame(() => {
        document.getElementById("heroFocus")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };

  const renderPracticeHub = () => {
    const q = (searchInput.value || "").trim().toLowerCase();
    const labs = labTopics().filter((t) => {
      const data = pack(t.id);
      const hay = `${t.title} ${t.blurb} ${(data?.questions || []).map((x) => x.q).join(" ")}`.toLowerCase();
      return !q || hay.includes(q);
    });
    view.innerHTML = `
      <section class="topic-head">
        <button class="back-btn" type="button" id="backHome">← Career paths</button>
        <h1>Labs</h1>
        <p class="example-intro">Small complete jobs you can code: cards, APIs, Docker, SQL, cloud, ML. Most-asked interview Q&amp;A is on Practice questions.</p>
        <div class="topic-meta">
          <span class="badge">${labs.length} lab${labs.length === 1 ? "" : "s"}</span>
          <a class="btn" href="#/topic/practice-web">Practice questions</a>
        </div>
      </section>
      <div class="career-grid">
        ${labs.map(topicCard).join("") || `<p class="empty">No labs match that search.</p>`}
      </div>
    `;
    document.getElementById("backHome").addEventListener("click", () => { location.hash = "#/"; });
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
    if (openQid === "notes" || openQid === "examples" || openQid === "questions") {
      window.topicTab = openQid;
      openQid = "";
    }
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
    const allQuestions = data.questions || [];
    const stacks = data.kind === "practice" ? collectStacks(data) : [];
    const showStacks = stacks.length > 1;
    let stackF = showStacks ? getStack() : "all";
    if (stackF !== "all" && !stacks.some((s) => s.id === stackF)) stackF = "all";
    const presentLevels = ["beginner", "intermediate", "advanced"].filter((lv) => allQuestions.some((q) => q.level === lv));
    const showLevel = presentLevels.length > 1;
    const askNames = allQuestions.flatMap((q) => companyList(q.ask));
    const hasMostAsked = askNames.some((c) => c.toLowerCase() === "most asked");
    const presentCos = COMPANIES.filter((c) => askNames.some((n) => n.toLowerCase() === c.toLowerCase()));
    const showCompany = hasMostAsked || presentCos.length > 0;
    const query = (window.topicQuery || "").toLowerCase();
    const stars = starSet(id);
    const done = doneSet(id);
    const p = progressFor(id);
    const notes = data.notes || [];
    const examples = (data.examples || []).filter((ex) => itemHasStack(ex, stackF));
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
      const hay = `${item.q} ${item.a} ${item.code || ""} ${item.ask || ""} ${solText} ${item.codes ? Object.values(item.codes).join(" ") : ""}`.toLowerCase();
      return matchLevel && matchC && matchS && matchB && (!query || hay.includes(query));
    });

    const useLangBar = data.kind === "dsa" || data.langBar;
    const langs = topicLangs(data);
    const lang = topicLang(data);
    const langLabel = langs.find((l) => l.id === lang)?.label || lang;

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
              <p class="sol-meta"><span>Time ${escapeHtml(s.time || "")}</span><span>Space ${escapeHtml(s.space || "")}</span><span>${escapeHtml(isRaj ? (s.fromRepo ? "C++ · repo" : "C++") : langLabel)}</span><span>simple words on each line</span></p>
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
      const single = data.kind === "dsa" ? dsaSrc(item, lang)
        : data.langBar ? (pickCode(item, lang) || item.code)
        : data.kind === "practice" ? practiceSrc(item, stackF)
        : (pickCode(item, lang) || item.code);
      if (!single) return "";
      const codeLang = useLangBar ? lang : data.kind === "practice" ? langOfStack(stackF, item) : inferLang(item);
      const shownLang = useLangBar ? langLabel
        : codeLang === "txt" ? "text"
        : codeLang === "sql" ? "SQL"
        : codeLang === "html" ? "HTML"
        : (STACKS.find((s) => s.id === (stackF === "all" ? "javascript" : stackF))?.label || codeLang);
      return `<p class="answer-label">${data.kind === "practice" ? "Easy code" : "Code"} · ${escapeHtml(shownLang)}</p><div class="code-wrap"><button class="copy-btn" type="button" data-q-copy>Copy</button><pre class="dsa-pre"><code>${showCode(teachSrc(single, codeLang, data.kind), codeLang)}</code></pre></div>`;
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
        <button class="tab ${tab === "notes" ? "active" : ""}" data-tab="notes">Notes${notes.length ? ` · ${notes.length}` : ""}</button>
        <button class="tab ${tab === "questions" ? "active" : ""}" data-tab="questions">${allQuestions.length} ${data.kind === "practice" && !data.langBar ? "labs" : "questions"}</button>
      </div>
      ${tab === "notes" ? `
        <section class="notes-board">
          <div class="notes-board-top">
            <p>${notes.length} note${notes.length === 1 ? "" : "s"} · each card opens the same way</p>
            ${notes.length > 6 ? `<input class="field notes-search" id="noteSearch" type="search" placeholder="Filter notes…" />` : ""}
          </div>
          <div class="design-stack">
            ${notes.map((n, i) => `<article class="note note-wide">
              <div class="note-head">
                <span class="note-num">${String(i + 1).padStart(2, "0")}</span>
                <h3>${escapeHtml(n.title)}</h3>
              </div>
              ${wrapReadMore(noteInner(n), "note")}
            </article>`).join("") || `<p class="empty">No notes in this subject yet.</p>`}
          </div>
        </section>` : tab === "examples" ? `
        ${useLangBar ? langBar(lang, langs) : ""}
        ${showStacks ? `<div class="control-board stack-board">${stackBar(stacks, stackF)}</div>` : ""}
        <p class="example-intro">${data.kind === "design"
          ? "Each card is a complete design: architecture diagram, request flow, and the points you should state in an interview."
          : data.kind === "dsa"
            ? "Read the explanation first, then the code. Each line is commented the way Raj writes it on LeetCode. Switch JavaScript, Python, Java, C++, or C."
            : data.langBar
              ? "Pick a language above. Same OOP idea, four languages. Comments sit on the right of the same line."
            : data.kind === "practice" && showStacks
              ? "Pick JS or React above. Same card project, two stacks. Code is on the left. Easy comments sit on the right of the same line."
              : data.kind === "practice"
                ? "Read the explanation, then the example. Comments sit on the right of the same line."
              : "Read the explanation first, then the code. Comments sit on the right in easy words."}</p>
        <section class="example-list">
          ${examples.map((ex, i) => `
            <article class="example">
              <div class="example-head">
                <h3>${escapeHtml(ex.title)}</h3>
                <span class="badge">${escapeHtml(useLangBar ? langLabel : data.kind === "design" ? "workflow" : data.kind === "practice" ? (STACKS.find((s) => s.id === (stackF === "all" ? (ex.lang === "txt" || ex.lang === "html" ? "html" : "javascript") : stackF))?.label || ex.lang || "code") : (ex.lang || "code"))}</span>
              </div>
              <div class="teach">
                <p class="answer-label">${data.kind === "design" ? "Design notes" : "Explanation"}</p>
                ${wrapReadMore(`${renderVisuals(ex)}${renderTeachText(ex.desc || "", ex.title)}`, "example")}
              </div>
              ${((useLangBar ? pickCode(ex, lang) : data.kind === "practice" ? practiceSrc(ex, stackF) : pickCode(ex, "javascript")) || ex.code) ? `
              <p class="answer-label code-label">${data.kind === "design" ? "Interface sketch" : data.kind === "practice" ? "Easy code · comments on the right" : "Code · comments on the right"}</p>
              <div class="code-wrap">
                <button class="copy-btn" type="button" data-ex="${i}">Copy</button>
                <pre class="dsa-pre"><code>${showCode(data.kind === "dsa" ? dsaSrc(ex, lang) : teachSrc(data.langBar ? (pickCode(ex, lang) || ex.code) : data.kind === "practice" ? practiceSrc(ex, stackF) : (pickCode(ex, "javascript") || ex.code || ""), data.langBar ? lang : data.kind === "practice" ? langOfStack(stackF, ex) : paintLang(ex), data.kind), useLangBar ? lang : data.kind === "practice" ? langOfStack(stackF, ex) : paintLang(ex))}</code></pre>
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
            ${showLevel ? `
            <div class="control-block">
              <span class="filter-label">Level</span>
              <div class="btn-group">
                ${["all", ...presentLevels].map((lv) =>
                  `<button class="level-btn ${level === lv ? "active" : ""}" data-level="${lv}">${prettyLabel(lv)}</button>`
                ).join("")}
              </div>
            </div>` : ""}
            <div class="control-block">
              <span class="filter-label">Status</span>
              <div class="btn-group">
                ${["all", "todo", "done", "starred"].map((b) =>
                  `<button class="level-btn ${bagF === b ? "active" : ""}" data-bag="${b}">${prettyLabel(b)}</button>`
                ).join("")}
              </div>
            </div>
            ${showStacks ? stackBar(stacks, stackF) : ""}
          </div>
          ${showCompany ? `
          <div class="control-block">
            <span class="filter-label">Company</span>
            <div class="btn-group">
              <button class="chip ${companyF === "all" ? "active" : ""}" data-co="all">All companies</button>
              ${hasMostAsked ? `<button class="chip ${companyF === "Most asked" ? "active" : ""}" data-co="Most asked">Most asked</button>` : ""}
              ${presentCos.map((c) => `<button class="chip ${companyF === c ? "active" : ""}" data-co="${c}">${c}</button>`).join("")}
            </div>
          </div>` : ""}
          ${useLangBar || allQuestions.some((q) => q.solutions) ? `
          <div class="control-block">
            <span class="filter-label">Language</span>
            ${langBar(lang, langs)}
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
                      ${data.kind === "dsa" && rajTabFor(item) ? `<span class="meta-chip src">Raj's C++</span>` : ""}
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
                ${wrapReadMore(data.kind === "dsa" ? `<p class="answer">${escapeHtml(item.a)}</p>` : renderTeachText(data.kind === "practice" ? shortenPracticeAnswer(item.a) : item.a, item.q), "answer")}
                ${renderVisuals(item)}
                ${data.kind === "practice" ? renderSolutions(item) : ""}
                ${data.kind !== "dsa" && data.kind !== "practice" && item.code ? `
                  <p class="answer-label">Reference configuration</p>
                  <div class="code-wrap">
                    <pre class="dsa-pre"><code>${showCode(teachSrc(item.code, inferLang(item), data.kind), inferLang(item))}</code></pre>
                  </div>` : ""}
                <div class="q-tools">
                  ${(data.kind === "dsa" ? dsaSols(item).length : item.solutions) ? `<button class="btn btn-primary" type="button" data-reveal>Show solutions</button>` : ""}
                  ${data.kind === "dsa" && rajTabFor(item) ? `<button class="btn btn-primary" type="button" data-raj-open>Raj's C++</button>` : ""}
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
    document.getElementById("noteSearch")?.addEventListener("input", (e) => {
      const q = e.target.value.trim().toLowerCase();
      view.querySelectorAll(".note").forEach((el) => {
        el.hidden = Boolean(q) && !el.textContent.toLowerCase().includes(q);
      });
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
      btn.addEventListener("click", () => {
        const item = btn.closest(".item");
        item.classList.toggle("open");
        bindReadMore(item);
      });
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
    view.querySelectorAll("[data-raj-open]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const itemEl = btn.closest(".item");
        const wrap = btn.closest(".answer-wrap");
        const box = wrap.querySelector(".sol-spoiler");
        box.classList.add("open");
        const reveal = wrap.querySelector("[data-reveal]");
        if (reveal) reveal.textContent = "Hide solutions";
        itemEl.querySelectorAll("[data-sol]").forEach((tab) => tab.classList.toggle("active", tab.dataset.sol === "0"));
        itemEl.querySelectorAll("[data-sol-panel]").forEach((panel) => panel.classList.toggle("open", panel.dataset.solPanel === "0"));
        box.scrollIntoView({ behavior: "smooth", block: "nearest" });
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
    bindReadMore(view);
    view.querySelectorAll("[data-ex]").forEach((btn) => {
      btn.addEventListener("click", async () => {
          const ex = examples[Number(btn.dataset.ex)];
          const raw = useLangBar
            ? pickCode(ex, lang)
            : data.kind === "practice" ? practiceSrc(ex, getStack()) : pickCode(ex, "javascript") || ex?.code || "";
          const code = teachSrc(raw, useLangBar ? lang : data.kind === "practice" ? langOfStack(getStack(), ex) : paintLang(ex), data.kind);
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
          const raw = data.langBar ? (pickCode(item, lang) || item?.code || "")
            : data.kind === "practice" ? practiceSrc(item, getStack())
            : pickCode(item, lang) || item?.code || "";
          await copyText(teachSrc(raw, useLangBar ? lang : data.kind === "practice" ? langOfStack(getStack(), item) : inferLang(item), data.kind), btn);
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
    else if (hash.startsWith("#/practice")) renderPracticeHub();
    else if (hash.startsWith("#/dsa")) renderDsaSheet();
    else if (hash.startsWith("#/login") || hash.startsWith("#/signup") || hash.startsWith("#/contact") || hash.startsWith("#/feedback")) return;
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
