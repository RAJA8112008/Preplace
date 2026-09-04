const { spawnSync } = require("child_process");

const filled = spawnSync("git", ["credential", "fill"], {
  input: "protocol=https\nhost=github.com\n\n",
  encoding: "utf8"
});

if (filled.status !== 0) {
  console.error("credential-failed");
  process.exit(1);
}

const cred = {};
for (const line of filled.stdout.split(/\r?\n/)) {
  const i = line.indexOf("=");
  if (i > 0) cred[line.slice(0, i)] = line.slice(i + 1);
}

const user = cred.username;
const token = cred.password;
if (!user || !token) {
  console.error("no-github-credentials");
  process.exit(1);
}

const body = JSON.stringify({
  name: "DSA",
  description: "223 FAANG DSA problems with brute, optimal, and more optimal solutions in JavaScript, Python, Java, C++, and C.",
  private: false,
  has_issues: true
});

fetch("https://api.github.com/user/repos", {
  method: "POST",
  headers: {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "prepplace-dsa-export"
  },
  body
}).then(async (res) => {
  const text = await res.text();
  let json = {};
  try { json = JSON.parse(text); } catch { /* ignore */ }
  if (res.status === 201) {
    console.log("created", json.html_url);
    return;
  }
  if (res.status === 422 && /already exists/i.test(text)) {
    console.log("exists", `https://github.com/${user}/DSA`);
    return;
  }
  console.error("api-failed", res.status, json.message || text.slice(0, 200));
  process.exit(1);
}).catch((err) => {
  console.error("fetch-failed", err.message);
  process.exit(1);
});
