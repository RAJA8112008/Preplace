"use strict";

const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "..", "frontend", "data", "git.js");
let src = fs.readFileSync(file, "utf8");

const story = (a) =>
  [
    "The problem before",
    a.problem,
    "",
    "What this is",
    a.what,
    "",
    "What it solves",
    a.solves,
    "",
    "Real-life example",
    a.example,
    "",
    "Uses",
    a.uses,
    "",
    "Watch out",
    a.watch
  ].join("\n");

const extraNotes = [
  {
    title: "Daily Git commands",
    body: story({
      problem:
        "People saved copies as project-final-v3.zip. Two laptops had different files. Nobody could say who changed login.js or how to go back.",
      what:
        "Git is a local photo album of the project. The daily words are status, add, commit, log, diff, pull, push.",
      solves:
        "You take a named snapshot, send it to GitHub, and pull what the team already saved.",
      example:
        "A class notebook. status is 'which pages are messy'. add is 'put these pages in the envelope'. commit is the photo. push is handing the album to the school shelf (GitHub).",
      uses:
        "Every job. Interviews ask the commands and the story (branch, merge, rebase, PR).",
      watch:
        "git add . then commit without reading status — secrets and junk ride along."
    })
  },
  {
    title: "GitHub is the shelf",
    body: story({
      problem:
        "The album lived on one laptop. The laptop died. A teammate could not review the work. There was no door called 'please merge this'.",
      what:
        "GitHub hosts a copy of the Git album, plus PRs, issues, and Actions. GitLab and Bitbucket do the same job.",
      solves:
        "Clone on a new machine. Open a PR so someone stamps your branch before main moves.",
      example:
        "The school library shelf. Your bag is Git. The shelf is GitHub. A PR is 'please put my chapter into the official book'.",
      uses:
        "Backup, team review, CI on every push, Pages/Vercel deploys.",
      watch:
        "Saying 'I use GitHub' when you cannot name commit, branch, or PR. Git works offline. The site is extra."
    })
  }
];

const examples = [
  {
    title: "First day: init, add, commit",
    lang: "txt",
    desc: story({
      problem: "A folder was just files. There was no history.",
      what: "init makes the hidden .git attic. add fills the envelope. commit takes the photo.",
      solves: "You have snapshot 1 with a message.",
      example: "Buy an album, choose pages, click the camera.",
      uses: "New projects that are not a clone.",
      watch: "init inside an existing repo. Nested attics."
    }),
    code: `git init
git status
git add README.md app.js
git commit -m "Add first draft"
git log --oneline`
  },
  {
    title: "Daily save",
    lang: "txt",
    desc: story({
      problem: "You edited five files and could not remember what was ready.",
      what: "status, diff, add the ones you mean, commit one idea.",
      solves: "The next snapshot is a story, not 'update'.",
      example: "Read the messy desk, put only the login pages in the envelope.",
      uses: "Every working hour.",
      watch: "git add . with a .env sitting there."
    }),
    code: `git status
git diff
git add src/login.js
git commit -m "Reject empty passwords on login"
git status`
  },
  {
    title: "Clone and make a branch",
    lang: "txt",
    desc: story({
      problem: "Work happened on main. A teammate could not review a clean slice.",
      what: "clone copies the album. switch -c makes a sticker for this job.",
      solves: "main stays clean. Your work has a name.",
      example: "Photocopy the textbook, then a sticky note 'login' on your draft.",
      uses: "Every team repo.",
      watch: "Committing on main when the team forbids it."
    }),
    code: `git clone https://github.com/org/app.git
cd app
git switch -c feat/login
# older Git: git checkout -b feat/login`
  },
  {
    title: "Push to GitHub and set upstream",
    lang: "txt",
    desc: story({
      problem: "The branch existed only on your laptop. A PR needs a remote branch.",
      what: "push -u origin feat/login sends the sticker and remembers the pair.",
      solves: "Later push and pull need no extra words.",
      example: "Put your chapter on the school shelf under the same title.",
      uses: "Opening a PR.",
      watch: "pushing to origin/main by habit."
    }),
    code: `git remote -v
git push -u origin feat/login
# later, on this branch:
git push
git pull`
  },
  {
    title: "Fetch vs pull",
    lang: "txt",
    desc: story({
      problem: "You wanted to look at the team's new commits without mixing them into your files yet.",
      what: "fetch updates postcards (origin/main). pull is fetch plus merge or rebase into your branch.",
      solves: "Look first (fetch + log). Combine when you are ready (pull).",
      example: "Mail arrives in the box (fetch). Filing it into your notebook is pull.",
      uses: "Before a PR. After a weekend.",
      watch: "pull with a dirty desk that clashes."
    }),
    code: `git fetch origin
git log --oneline HEAD..origin/main
git pull --rebase origin main
# or: git merge origin/main`
  },
  {
    title: "See history and a file",
    lang: "txt",
    desc: story({
      problem: "Who changed this line? What did the last commit do?",
      what: "log is the chain. show is one photo. blame is last author per line.",
      solves: "You read the album before you blame a person.",
      example: "A museum label on each sentence.",
      uses: "Debugging, reviews.",
      watch: "blame as a gotcha. The last touch is not always the bug."
    }),
    code: `git log --oneline -15
git show HEAD
git diff main...HEAD
git blame src/login.js`
  },
  {
    title: "Undo uncommitted work",
    lang: "txt",
    desc: story({
      problem: "You broke a file and wanted last commit's text back.",
      what: "restore puts a file back. restore --staged unstages. The branch sticker does not move.",
      solves: "Desk matches the last photo for that file.",
      example: "Throw the draft page, keep the printed one.",
      uses: "Local oops.",
      watch: "restore has no recycle bin."
    }),
    code: `git restore src/login.js
git restore --staged src/login.js
# old: git checkout -- src/login.js`
  },
  {
    title: "Undo the last commit (private branch)",
    lang: "txt",
    desc: story({
      problem: "You committed too soon. The work should stay on the desk.",
      what: "reset --soft HEAD~1 moves the sticker back and keeps files staged.",
      solves: "You can edit the envelope and commit again.",
      example: "Peel the last photo off a private draft. The pages are still in your hand.",
      uses: "A branch only you pushed, or not pushed yet.",
      watch: "reset on shared main. Use revert there."
    }),
    code: `git reset --soft HEAD~1
# --mixed (default): keep files, unstage
# --hard: also wipe the desk — dangerous`
  },
  {
    title: "Revert on main (safe undo)",
    lang: "txt",
    desc: story({
      problem: "A bad commit is already on origin/main. Teammates pulled it.",
      what: "revert adds a new commit that applies the opposite patch.",
      solves: "History stays honest. No force-push.",
      example: "Print a correction page. Do not burn the library book.",
      uses: "Shared branches.",
      watch: "reset --hard origin/main after others pulled."
    }),
    code: `git revert HEAD
git revert abc1234
git push`
  },
  {
    title: "Merge a feature into main",
    lang: "txt",
    desc: story({
      problem: "The feature is done. main should include it.",
      what: "switch to main, pull, merge the feature, push.",
      solves: "A join in the album (or a fast-forward slide).",
      example: "Staple your chapter into the official book.",
      uses: "Small teams without a PR bot. Same idea as the GitHub merge button.",
      watch: "merge conflicts — finish them before you push."
    }),
    code: `git switch main
git pull
git merge feat/login
# fix files if Git paused, then:
git add .
git commit
git push`
  },
  {
    title: "Rebase a private branch",
    lang: "txt",
    desc: story({
      problem: "main moved. Your branch is an old side road. The PR diff looks huge.",
      what: "rebase copies your commits onto the new main. New hashes. One line.",
      solves: "Reviewers see only your idea on top of today.",
      example: "Reprint your chapter after the textbook got a new edition.",
      uses: "A branch only you use.",
      watch: "rebase a branch others already pulled, then force-push without lease."
    }),
    code: `git fetch origin
git rebase origin/main
# if conflict: edit, git add FILE, git rebase --continue
# git rebase --abort
git push --force-with-lease`
  },
  {
    title: "Stash, switch, pop",
    lang: "txt",
    desc: story({
      problem: "Half-done files blocked a hotfix checkout.",
      what: "stash pockets the desk. switch to hotfix. come back and stash pop.",
      solves: "Two jobs, one attic, no fake commit.",
      example: "Coat pocket. Not the album.",
      uses: "Quick branch hops.",
      watch: "Many stashes. pop the wrong one. Stash does not travel to a new clone."
    }),
    code: `git stash push -m "wip login"
git switch main
git switch -c hotfix/crash
# ...
git switch feat/login
git stash pop`
  },
  {
    title: "Conflict markers",
    lang: "txt",
    desc: story({
      problem: "Both sides changed the same lines. Git paused.",
      what: "Markers show HEAD vs incoming. You write one valid file, add, continue.",
      solves: "The mix is a human sentence, not two drafts.",
      example: "Two people wrote the title. The teacher picks one line.",
      uses: "merge and rebase.",
      watch: "Committing the <<<<<<< markers."
    }),
    code: `# <<<<<<< HEAD
# title = "Welcome Ada"
# =======
# title = "Welcome Bob"
# >>>>>>> feat/login
#
# keep one version, then:
git add src/app.js
git commit          # if merge
# git rebase --continue   # if rebase`
  },
  {
    title: "Open a GitHub PR (gh)",
    lang: "txt",
    desc: story({
      problem: "The branch is on GitHub but nobody was asked to stamp it.",
      what: "A PR is the review form: this branch into main. gh can open it from the terminal.",
      solves: "Review, CI, merge button. Git still does the merge.",
      example: "Please put my chapter into the official book.",
      uses: "Every company repo.",
      watch: "PRs from a stale fork. Fetch upstream first."
    }),
    code: `git push -u origin feat/login
gh pr create --fill
# or open the URL GitHub prints
# GitHub → Pull requests → New`
  },
  {
    title: ".gitignore and untrack",
    lang: "txt",
    desc: story({
      problem: "node_modules and .env were in the first commit.",
      what: "gitignore hides untracked paths. Already tracked files need rm --cached.",
      solves: "The next photo drops them. Disk still has the file.",
      example: "A do-not-photograph list. Old photos still have the mess until you rewrite.",
      uses: "Every Node, Python, and env file.",
      watch: "gitignore alone does not untrack."
    }),
    code: `echo ".env" >> .gitignore
echo "node_modules/" >> .gitignore
git rm --cached .env
git add .gitignore
git commit -m "Stop tracking .env"
# then rotate the leaked secret`
  },
  {
    title: "Force-with-lease (not --force)",
    lang: "txt",
    desc: story({
      problem: "You rebased. A normal push is rejected. --force can erase Sam's new commit.",
      what: "force-with-lease pushes only if origin still matches the postcard you fetched.",
      solves: "Rewrite your private branch without clobbering Sam.",
      example: "Replace your chapter only if nobody slipped a page in while you were gone.",
      uses: "After rebase on a personal feature branch.",
      watch: "--force on main."
    }),
    code: `git fetch origin
git push --force-with-lease origin feat/login
# never: git push --force origin main`
  },
  {
    title: "Cherry-pick a hotfix",
    lang: "txt",
    desc: story({
      problem: "The crash fix is on main. The release branch also needs that one commit.",
      what: "cherry-pick copies one commit's patch as a new commit on this branch.",
      solves: "One idea, two lines, new hash.",
      example: "Photocopy one page into another notebook.",
      uses: "Hotfixes, backports.",
      watch: "Picking a merge commit without -m."
    }),
    code: `git switch release/1.2
git cherry-pick abc1234
git push`
  },
  {
    title: "Tag a release",
    lang: "txt",
    desc: story({
      problem: "main moved. Nobody remembered which commit was v1.2.0.",
      what: "An annotated tag is a museum label on one commit. Push tags too.",
      solves: "Installers and GitHub Releases point at a frozen photo.",
      example: "A plaque on one textbook edition.",
      uses: "Releases.",
      watch: "Moving a published tag. Forgetting git push --tags."
    }),
    code: `git tag -a v1.2.0 -m "Spring release"
git push origin v1.2.0
# git push --tags`
  }
];

const askById = {
  1: "Most asked · Amazon · Google · Microsoft",
  2: "Most asked · Amazon · Google · Microsoft · Meta",
  5: "Most asked · Amazon · Google",
  7: "Most asked · Amazon · Microsoft",
  8: "Most asked · Amazon · Google · Microsoft",
  9: "Most asked · Amazon · Microsoft",
  13: "Most asked · Amazon · Google · Microsoft",
  16: "Most asked · Amazon · Google",
  19: "Most asked · Amazon · Google · Microsoft · Meta",
  22: "Most asked · Amazon · Google · Microsoft",
  24: "Most asked · Amazon · Google · Microsoft · Meta",
  25: "Most asked · Amazon · Google",
  28: "Most asked · Amazon · Google · Microsoft",
  30: "Most asked · Amazon · Google · Microsoft · Meta · Uber",
  31: "Most asked · Amazon · Google · Microsoft",
  35: "Most asked · Amazon · Microsoft",
  37: "Most asked · Amazon · Google · Microsoft",
  38: "Most asked · Amazon · Google · Microsoft",
  39: "Most asked · Amazon · Google · Microsoft · Meta",
  43: "Most asked · Amazon · Microsoft · Google",
  47: "Most asked · Amazon · Google",
  55: "Most asked · Amazon · Google · Microsoft",
  56: "Most asked · Amazon · Microsoft · Google",
  68: "Most asked · Amazon · Google · Microsoft",
  69: "Most asked · Amazon · Google · Microsoft · Meta",
  82: "Most asked · Amazon · Google · Microsoft",
  100: "Most asked · Amazon · Google · Microsoft · Meta"
};

function injectAsk(text, id, ask) {
  const re = new RegExp(`("id": ${id},\\s*"level": "[^"]+",\\s*"q": "[^"]+",)`, "m");
  if (!re.test(text)) {
    console.warn("no match for id", id);
    return text;
  }
  if (new RegExp(`"id": ${id},[\\s\\S]*?"ask":`).test(text.slice(text.search(new RegExp(`"id": ${id},`)), text.search(new RegExp(`"id": ${id},`)) + 400)) && text.includes(`"id": ${id}`) ) {
    // skip if this block already has ask nearby — check local window
  }
  return text.replace(re, `$1\n      "ask": ${JSON.stringify(ask)},`);
}

for (const [id, ask] of Object.entries(askById)) {
  const before = src;
  src = injectAsk(src, Number(id), ask);
  if (src === before) console.warn("failed ask", id);
}

const extraQs = [
  {
    id: 101,
    level: "beginner",
    q: "What commands do you run every day?",
    ask: "Most asked · Amazon · Google · Microsoft",
    lang: "txt",
    a: story({
      problem: "People recited twenty commands and could not save work safely.",
      what: "status, add, commit, pull, push. log and diff when you need the story.",
      solves: "You know what is messy, you photograph one idea, you sync with the shelf.",
      example: "Desk check, envelope, camera, mail.",
      uses: "Every developer job.",
      watch: "push without pull on a shared branch. add . without status."
    }),
    code: `git status
git add -p
git commit -m "Reject empty passwords"
git pull --rebase
git push`
  },
  {
    id: 102,
    level: "beginner",
    q: "How do you put a new project on GitHub?",
    ask: "Most asked · Amazon · Microsoft · Google",
    lang: "txt",
    a: story({
      problem: "The code lived only on a laptop. A recruiter asked for a link.",
      what: "Create an empty GitHub repo. Add origin. Push main. Do not upload a zip if you can push Git.",
      solves: "A URL, history, and a place for PRs.",
      example: "Buy a shelf slot, then put the album on it.",
      uses: "Portfolio, team start.",
      watch: "Pushing .env. Adding a README with a password."
    }),
    code: `git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/you/app.git
git push -u origin main`
  },
  {
    id: 103,
    level: "beginner",
    q: "How do you start work on a team repo?",
    ask: "Most asked · Amazon · Google · Microsoft · Meta",
    lang: "txt",
    a: story({
      problem: "You edited main while others pushed. Your PR fought everyone.",
      what: "clone, switch to main, pull, new branch named for the job, then code.",
      solves: "Your sticker is a small honest gap.",
      example: "Copy the textbook, start a new sticky note, do not write in the library copy.",
      uses: "Every company onboarding.",
      watch: "Working on a week-old main."
    }),
    code: `git clone https://github.com/org/app.git
cd app
git switch main
git pull
git switch -c feat/search`
  },
  {
    id: 104,
    level: "intermediate",
    q: "How do you update your PR with latest main?",
    ask: "Most asked · Amazon · Google · Microsoft",
    lang: "txt",
    a: story({
      problem: "main moved. GitHub says the branch is out of date. Merge conflicts wait.",
      what: "fetch, rebase (or merge) origin/main onto your branch, fix, force-with-lease if you rebased.",
      solves: "Reviewers see your work on today's book.",
      example: "Reprint your chapter onto the new edition.",
      uses: "Long PRs.",
      watch: "plain --force. merge and rebase mixed without a team rule."
    }),
    code: `git fetch origin
git rebase origin/main
# fix conflicts, git add, git rebase --continue
git push --force-with-lease`
  },
  {
    id: 105,
    level: "beginner",
    q: "What is the GitHub PR checklist companies want?",
    ask: "Most asked · Amazon · Google · Microsoft · Meta · Adobe",
    lang: "txt",
    a: story({
      problem: "PRs said 'fix' with 40 files and no test. Reviewers bounced them.",
      what: "Small branch, clear title, what/why in the body, screenshots if UI, tests green, no secrets, one idea.",
      solves: "Someone can stamp in minutes. CI is the robot reviewer.",
      example: "A chapter with a title, a summary, and no extra homework stuffed in.",
      uses: "Every job after the first week.",
      watch: "One PR that refactors the world and adds a feature."
    }),
    code: `# title: Reject empty passwords on login
# body: Empty passwords skipped hashing.
# How to test: POST /login with "" → 400
# Checks: unit-tests, lint`
  },
  {
    id: 106,
    level: "intermediate",
    q: "How do you recover a deleted branch or lost commit?",
    ask: "Most asked · Amazon · Google · Microsoft",
    lang: "txt",
    a: story({
      problem: "You deleted the branch. The work seemed gone.",
      what: "reflog still saw the tip on this laptop. Recreate the sticker on that hash. GitHub PR also lists the sha.",
      solves: "The photo was in the attic. The name was missing.",
      example: "The sticky note fell off. The page number is in your diary.",
      uses: "Local disasters.",
      watch: "Uncommitted desk files were never in that commit."
    }),
    code: `git reflog
git switch -c feat/login abc1234
# or from a closed PR sha on GitHub`
  },
  {
    id: 107,
    level: "beginner",
    q: "What GitHub extras do interviews ask besides Git?",
    ask: "Most asked · Amazon · Google · Microsoft",
    lang: "txt",
    a: story({
      problem: "Candidates stopped at add/commit/push. Companies use PRs, protection, and Actions every day.",
      what: "PR review, branch protection on main, required checks, CODEOWNERS, Actions CI, Issues, draft PRs, squash merge.",
      solves: "You sound like you have worked on a team repo, not only a class folder.",
      example: "The library has rules: no writing in the official book without a stamp and a robot grade.",
      uses: "SDE intern and new grad loops.",
      watch: "Reciting product names. Say what problem each extra fixes."
    }),
    code: `# branch protection: PR + 1 review + tests
# Actions: on pull_request → npm test
# CODEOWNERS: /src/billing/  @ada`
  },
  {
    id: 108,
    level: "intermediate",
    q: "How do you keep a fork up to date?",
    ask: "Most asked · Google · Microsoft · Meta",
    lang: "txt",
    a: story({
      problem: "Your PR into the original repo included six months of unrelated commits.",
      what: "Add upstream. fetch. merge or rebase upstream/main into your main. branch from today.",
      solves: "The PR is a small honest gap.",
      example: "Photocopy the latest official book before you write a new chapter.",
      uses: "Open source. Some internships.",
      watch: "Opening a PR from a stale fork main."
    }),
    code: `git remote add upstream https://github.com/org/app.git
git fetch upstream
git switch main
git merge upstream/main
git push origin main`
  },
  {
    id: 109,
    level: "beginner",
    q: "How do you set your name and email?",
    ask: "Most asked · Microsoft · Amazon",
    lang: "txt",
    a: story({
      problem: "Commits said root@laptop or a personal Gmail on a work repo.",
      what: "user.name and user.email. global is this user. local overrides for one repo.",
      solves: "The stamp on each photo is the right person.",
      example: "A name tag on the album.",
      uses: "First-day setup. Work vs personal machines.",
      watch: "Committing as someone else to 'look like' a teammate."
    }),
    code: `git config --global user.name "Ada Lovelace"
git config --global user.email "ada@company.com"
git config user.email "ada@company.com"   # this repo only
git config --list --show-origin`
  },
  {
    id: 110,
    level: "intermediate",
    q: "How do you sign in to GitHub from Git? (HTTPS vs SSH)",
    ask: "Most asked · Amazon · Google · Microsoft",
    lang: "txt",
    a: story({
      problem: "Password Git is dead. push asked for a password and failed.",
      what: "HTTPS uses a personal access token. SSH uses a key: public half on GitHub, private half on the laptop.",
      solves: "The host knows you. The album is the same either door.",
      example: "A badge (token) or a house key (SSH).",
      uses: "Every push.",
      watch: "Pasting the private key into chat. Committing id_rsa."
    }),
    code: `# SSH (usual on a laptop you keep)
ssh-keygen -t ed25519 -C "ada@company.com"
# copy ~/.ssh/id_ed25519.pub → GitHub → SSH keys
git remote set-url origin git@github.com:you/app.git
ssh -T git@github.com`
  }
];

if (!src.includes('"title": "Daily Git commands"')) {
  src = src.replace(
    `    {
      "title": "GitHub extras",`,
    extraNotes
      .map(
        (n) => `    {
      "title": ${JSON.stringify(n.title)},
      "body": ${JSON.stringify(n.body)}
    },
`
      )
      .join("") +
      `    {
      "title": "GitHub extras",`
  );
}

if (!src.includes('"title": "First day: init, add, commit"')) {
  const examplesJson = JSON.stringify(examples, null, 2)
    .split("\n")
    .map((line, i) => (i === 0 ? line : "  " + line))
    .join("\n");
  src = src.replace(
    `  ],
  "questions": [`,
    `  ],
  "examples": ${examplesJson},
  "questions": [`
  );
}

if (!src.includes('"id": 101')) {
  const extraJson = extraQs
    .map((q) => {
      const obj = {
        id: q.id,
        level: q.level,
        q: q.q,
        ask: q.ask,
        lang: q.lang,
        a: q.a,
        code: q.code
      };
      return JSON.stringify(obj, null, 2)
        .split("\n")
        .map((line, i) => (i === 0 ? "    " + line : "    " + line))
        .join("\n");
    })
    .join(",\n");
  src = src.replace(/\n  \]\n};\s*$/, `,\n${extraJson}\n  ]\n};\n`);
}

fs.writeFileSync(file, src);
console.log("patched", file, "asks", Object.keys(askById).length, "examples", examples.length, "newQs", extraQs.length);
