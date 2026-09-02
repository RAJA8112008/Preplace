window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA.git = {
  "notes": [
    {
      "title": "What Git is",
      "body": "Git is a version control tool. Version control means it stores snapshots of your project as you work. Each snapshot is called a commit. The whole history lives on your computer in a hidden folder named .git. A website like GitHub is only a host that keeps a copy. You can use Git with no website at all. The idea to learn first is the chain of snapshots, not a list of commands."
    },
    {
      "title": "Three states",
      "body": "Git keeps the same files in three places. The working tree is the files you see and edit on disk. Staging (also called the index) is the packing list for the next snapshot. The repository is the saved commits. git add copies a chosen version into staging. git commit freezes staging into a new commit. Editing a file does not save history until you stage and commit."
    },
    {
      "title": "Commit",
      "body": "A commit is one frozen snapshot plus a short message. It also points at the commit before it, so history is a chain. Git names the commit with a hash, a long fingerprint of its contents. Commits are not edited in place. If you rewrite history, Git makes new commits with new hashes. Old commits can still exist until nothing points at them."
    },
    {
      "title": "Branch",
      "body": "A branch is a movable name that points at one commit. It is a sticker, not a copy of every file. Creating a branch is cheap. Teams often keep one official branch named main. Feature branches hold work until review. When you commit, the branch sticker you are on slides forward to the new snapshot."
    },
    {
      "title": "HEAD",
      "body": "HEAD is Git's 'you are here' pointer. Usually HEAD points at a branch name, and that branch points at a commit. Detached HEAD means HEAD points at a raw commit id instead of a branch. New commits in that state have no branch sticker unless you create one. That is how work gets easy to lose."
    },
    {
      "title": "merge vs rebase",
      "body": "Merge joins two lines of commits and usually creates a merge commit with two parents. Rebase copies your commits onto another base so the story looks like one line. Copied commits get new hashes. Do not rebase a branch other people already pulled. Shared history should grow by adding, not by swapping ids."
    },
    {
      "title": "Remote",
      "body": "A remote is a nickname for another copy of the repo, often named origin. fetch downloads new commits without changing your files. pull is fetch plus merge or rebase into your branch. push sends your commits to the remote. A tracking branch such as origin/main is your last postcard of the remote's main, not your local main itself."
    },
    {
      "title": "PR / MR",
      "body": "A pull request (PR) or merge request (MR) is a review form on top of Git. You ask to copy one branch into another, usually into main. Reviewers, tests, and comments live on that form. Git itself only has commits and branches. The website adds the social layer. Merge on the site still creates Git commits."
    },
    {
      "title": "Undo map",
      "body": "Undo depends on what you want to keep. restore changes files or unstages them. reset --soft moves the branch but keeps your work staged. reset --hard also resets the files, so uncommitted work can vanish. revert adds a new commit that undoes an old one, which is the safe choice on shared main. Published history should not be rewritten unless the team agrees."
    },
    {
      "title": ".gitignore",
      "body": ".gitignore is a list of path patterns Git should not track. Build folders, secret env files, and OS junk belong there. A file already in a commit stays tracked even if you add its name later. To stop tracking it you must remove it from the index while leaving your disk copy. Then the ignore rule can work."
    },
    {
      "title": "Good commits",
      "body": "A good commit is small and about one idea. The message is a short command, such as 'Add login validation'. Never put passwords, keys, or huge binaries in a commit. Read your own diff before you push. Future you will search these messages when something breaks."
    },
    {
      "title": "GitHub extras",
      "body": "GitHub adds extras around Git: Actions for tests, CODEOWNERS for review routing, and branch protection on main. Draft PRs, squash merge, tags, and releases are website features. Open source often uses a fork: your copy, then a PR into the original. Git still stores the snapshots. The extras are how teams work together."
    }
  ],
  "questions": [
    {
      "id": 1,
      "level": "beginner",
      "q": "What is Git?",
      "a": "Git is a tool that saves snapshots of your project over time.\nA snapshot is called a commit. Git stores the whole chain of commits on your computer. A website is only another copy of that chain.\nIn the code:\nThe album object is Git's history. photos is the list of commits. Each photo has an id, a caption (the message), and the file text at that moment. latest is a pointer at the newest photo. The last comment says the album lives on your computer.\nA common mistake is treating Git as a website. Git works offline. The cloud is optional.",
      "code": "// Git is a photo album, not a \"run these commands\" list\nalbum = {\n  photos: [\n    { id: \"c1\", caption: \"first draft\", files: { \"app.js\": \"hi\" } },\n    { id: \"c2\", caption: \"add hello\",   files: { \"app.js\": \"hello\" } }\n  ],\n  latest: \"c2\"   // a sticky note on the newest photo\n};\n// the album lives on your computer; the cloud is only a copy"
    },
    {
      "id": 2,
      "level": "beginner",
      "q": "Git vs GitHub?",
      "a": "Git and GitHub are different tools that people mix up because the names sound alike.\nGit runs on your computer and saves snapshots. GitHub is a website that hosts copies, reviews, and issues. GitLab and Bitbucket do the same job as GitHub for Git repos.\nIn the code:\ntools.git is local and saves snapshots. tools.github is on the internet and hosts copies. The comments say Git does not need GitHub, but GitHub needs Git under the hood.\nA common mistake is saying 'I do not have Git, I only use GitHub.' The site is using Git for you.",
      "code": "// two different things with similar names\ntools = {\n  git:    { where: \"your computer\", job: \"save snapshots\" },\n  github: { where: \"the internet\",  job: \"host copies, reviews, issues\" }\n};\n// Git does not need GitHub\n// GitHub needs Git under the hood"
    },
    {
      "id": 3,
      "level": "beginner",
      "q": "What is a repository?",
      "a": "A repository (repo) is your project folder plus its hidden history.\nThe visible files are what you edit. The hidden .git folder holds commits, branch names, and settings. Clone copies that whole history, not only today's files.\nIn the code:\nproject_folder has app.js and README.md you can see. .git is the attic: photos are commits, names.main is a branch sticker on c3. Without .git you only have papers, not the album.\nA common mistake is deleting .git to 'clean up.' That throws away the entire history.",
      "code": "// a repository is folder + hidden history\nproject_folder = {\n  \"app.js\":     \"current text you see\",\n  \"README.md\":  \"how to open the project\",\n  \".git\": {                          // the attic (usually hidden)\n    photos: [\"c1\", \"c2\", \"c3\"],      // commits\n    names:  { main: \"c3\" }           // branch stickers\n  }\n};"
    },
    {
      "id": 4,
      "level": "beginner",
      "q": "git init?",
      "a": "git init starts a new local repo in a folder that was just a normal folder.\nIt creates an empty .git attic. Your files stay on disk. Nothing is snapshotted until you stage and commit.\nIn the code:\nBefore, folder has app.js and .git is null. After, the same app.js is still on the desk, and .git has empty photos and names. The last comment says no files are snapshotted yet.\nA common mistake is running init inside an existing repo. You get a nested attic and a confused history.",
      "code": "// before: a normal school folder\nfolder = { \"app.js\": \"hello\", \".git\": null };\n\n// after init: same files, plus an empty album\nfolder = {\n  \"app.js\": \"hello\",                 // still on your desk\n  \".git\": { photos: [], names: {} }  // empty attic ready for photos\n};\n// no files are snapshotted until you later stage and commit"
    },
    {
      "id": 5,
      "level": "beginner",
      "q": "git clone?",
      "a": "Clone copies someone else's full repo onto your computer.\nYou get the files and the commit history. The copy usually remembers the original URL as origin.\nIn the code:\nonline_album has a url, photos c1–c3, and latest_branch main. my_copy has the same photos, a desk with files from photo c3, and origin pointing back at the URL.\nA common mistake is thinking clone is a zip of today's files only. You also got the old snapshots.",
      "code": "// clone = photocopy the whole scrapbook\nonline_album = {\n  url: \"https://example.com/team/app\",\n  photos: [\"c1\", \"c2\", \"c3\"],\n  latest_branch: \"main\"\n};\n\nmy_copy = {\n  photos: [\"c1\", \"c2\", \"c3\"],           // same history\n  desk:   { \"app.js\": \"from photo c3\" }, // files you can edit\n  origin: \"https://example.com/team/app\" // sticky note: where it came from\n};"
    },
    {
      "id": 6,
      "level": "beginner",
      "q": "working tree, staging, repo?",
      "a": "Git uses three places for the same project: working tree, staging, and repo.\nThe working tree is the files on disk. Staging is the packing list for the next commit. The repo is the saved commits. The next snapshot looks like staging, not like the whole messy desk.\nIn the code:\ndesk is the working tree with app.js v3 and todo.txt. basket is staging with only app.js v3. album.last still has the old versions. next_photo is set to basket, so todo.txt would not be in the next commit.\nA common mistake is editing files and expecting Git to remember them with no add.",
      "code": "// three boxes, same project\ndesk    = { \"app.js\": \"v3\", \"todo.txt\": \"buy milk\" }; // working tree\nbasket  = { \"app.js\": \"v3\" };                         // staging / index\nalbum   = { last: { \"app.js\": \"v2\", \"todo.txt\": \"old\" } }; // repo\n\n// next photo will look like the BASKET, not the whole desk\nnext_photo = basket;"
    },
    {
      "id": 7,
      "level": "beginner",
      "q": "git add?",
      "a": "git add copies a chosen version of a file from the working tree into staging.\nThe file on disk can keep changing after that. Staging holds the version you picked. A commit photographs staging, not every dirty file.\nIn the code:\nYou edited a.js and b.js on the desk. basket starts empty. After you choose a.js, basket has only new A. b.js stays on the desk only, so it is not in the next snapshot.\nA common mistake is adding a whole folder when you only meant one file. Staging is a choice.",
      "code": "// you edited two files on the desk\ndesk   = { \"a.js\": \"new A\", \"b.js\": \"new B\" };\nbasket = {};                              // empty envelope\nalbum  = { last: { \"a.js\": \"old A\", \"b.js\": \"old B\" } };\n\n// you only choose a.js for the next photo\nbasket = { \"a.js\": \"new A\" };\n// b.js is still only on the desk — not in the next snapshot"
    },
    {
      "id": 8,
      "level": "beginner",
      "q": "git commit?",
      "a": "A commit is one frozen snapshot of staging, plus a message, plus a parent pointer.\nGit gives it an id. History is a chain of these snapshots. The files on disk can change after the click. The commit will not.\nIn the code:\ncommit_c2 has id c2, message Add login title, files with app.js hello, and parent c1. The last comment says the desk can change; photo c2 will not.\nA common mistake is committing with an empty message or committing files you never staged on purpose.",
      "code": "// a commit is a photo + a pointer to the older photo\ncommit_c2 = {\n  id: \"c2\",\n  message: \"Add login title\",     // caption\n  files: { \"app.js\": \"hello\" },   // what was in the basket\n  parent: \"c1\"                    // the photo before this one\n};\n// the desk can change now; photo c2 will not change"
    },
    {
      "id": 9,
      "level": "beginner",
      "q": "git status?",
      "a": "git status is a report of the three places. It does not change anything.\nIt shows which branch you are on, what is staged, what is edited but unstaged, and what Git has never tracked.\nIn the code:\nreport.you_are_on is main. in_basket is app.js, ready for the next photo. on_desk is notes.txt, edited but not staged. unknown is secret.env, untracked. The last line says read the report before the next snapshot.\nA common mistake is ignoring untracked files. That is how secrets sneak into a later add .",
      "code": "// status is a report, not an action\nreport = {\n  you_are_on: \"main\",\n  in_basket:  [\"app.js\"],          // ready for the next photo\n  on_desk:    [\"notes.txt\"],       // edited but not in the envelope\n  unknown:    [\"secret.env\"]       // Git has never tracked this path\n};\n// read the report before you take the next snapshot"
    },
    {
      "id": 10,
      "level": "beginner",
      "q": "git log?",
      "a": "git log shows the chain of commits, usually newest first.\nEach line is a snapshot with an id, a message, and a parent. It is a view of the album, not an edit.\nIn the code:\nlog is an array: c3 Fix crash parent c2, then c2 Add title parent c1, then c1 First draft with no parent. The comment says you are looking, not changing.\nA common mistake is thinking log is 'all files on disk.' It is history of commits, not a folder listing.",
      "code": "// history is a chain (newest at the top when you read it)\nlog = [\n  { id: \"c3\", message: \"Fix crash\",   parent: \"c2\" },\n  { id: \"c2\", message: \"Add title\",   parent: \"c1\" },\n  { id: \"c1\", message: \"First draft\", parent: null }\n];\n// you are looking at the album, not changing it"
    },
    {
      "id": 11,
      "level": "beginner",
      "q": "git diff?",
      "a": "git diff shows what changed between two versions, as added and removed lines.\nYou use it before you stage or commit, so you see the story you are about to save.\nIn the code:\nlast_photo is Hello world. desk_now is Hello Nitin. diff_story has a minus line for the old text and a plus line for the new text. The comment says read this story before putting the new text in the album.\nA common mistake is committing without reading the diff. Typos and debug dumps hide there.",
      "code": "// diff is \"what is different\", as a story\nlast_photo = \"Hello world\";\ndesk_now   = \"Hello Nitin\";\n\ndiff_story = [\n  \"- Hello world\",   // line that left\n  \"+ Hello Nitin\"    // line that arrived\n];\n// read this story before you put the new text in the album"
    },
    {
      "id": 12,
      "level": "beginner",
      "q": "What is a commit hash?",
      "a": "A commit hash is a fingerprint of that commit's exact contents.\nGit hashes the files, the parent, the message, and more. Change one letter and you get a new id. That is why rewritten history looks like new commits.\nIn the code:\ncommit has files, parent c1, and message Add hello. fingerprint of those bytes becomes a9f3c1. The last comment says one letter change in app.js makes a new id.\nA common mistake is shortening a hash in your head and grabbing the wrong commit. Use enough characters to be unique.",
      "code": "// a hash is a fingerprint of the photo's contents\ncommit = {\n  files:   { \"app.js\": \"hello\" },\n  parent:  \"c1\",\n  message: \"Add hello\"\n};\n// fingerprint(\"those exact bytes\") -> \"a9f3c1...\"\n// change one letter in app.js and the fingerprint becomes a new id"
    },
    {
      "id": 13,
      "level": "beginner",
      "q": "What is a branch?",
      "a": "A branch is a name that points at one commit.\nIt is a sticker on a photo, not a second copy of the project. Adding a branch does not duplicate all files. When you commit on that branch, only that sticker moves.\nIn the code:\nphotos are c1, c2, c3. stickers.main points at c2. stickers.feature points at c3. The comment says adding a sticker does not copy all files.\nA common mistake is thinking a branch is a folder of files. It is a pointer.",
      "code": "// branches are stickers on photos, not extra folders\nphotos = { c1: {}, c2: {}, c3: {} };\n\nstickers = {\n  main:    \"c2\",   // team bookmark\n  feature: \"c3\"    // your experiment bookmark\n};\n// adding a sticker does not copy all files"
    },
    {
      "id": 14,
      "level": "beginner",
      "q": "git branch and git checkout / switch?",
      "a": "git branch creates a new sticker. checkout or switch moves you onto a branch and updates your files to match that commit.\nHEAD records which sticker you stand on. New commits move that sticker only.\nIn the code:\nstickers start with main and login both on c2. HEAD is login. After a new photo, stickers.login becomes c3 and desk matches c3. main still points at c2.\nA common mistake is committing while standing on the wrong branch. Always check which sticker HEAD is on.",
      "code": "// you are a person standing at a bookmark\nstickers = { main: \"c2\", login: \"c2\" };\nHEAD = \"login\";                 // you stand at the login sticker\n\n// after a new photo on login:\nstickers.login = \"c3\";\ndesk = files_of(\"c3\");          // desk matches the photo you stand on\n// main still points at c2"
    },
    {
      "id": 15,
      "level": "beginner",
      "q": "What is main or master?",
      "a": "main (older repos sometimes say master) is the agreed official branch.\nThe name is a convention, not magic. Teams protect it so people cannot secretly move it backward. Feature work lives on other stickers until review.\nIn the code:\nstickers.main is c10, the published textbook page. login and bugfix are scratch work. protected.main is true, so you should not move that sticker backward in secret.\nA common mistake is committing straight to main on a shared project. Use a feature branch.",
      "code": "// names are stickers; \"main\" is the agreed official one\nstickers = {\n  main:     \"c10\",  // published textbook page\n  login:    \"c12\",  // scratch work\n  bugfix:   \"c11\"\n};\nprotected.main = true;  // do not secretly move this sticker backward"
    },
    {
      "id": 16,
      "level": "beginner",
      "q": "What is HEAD?",
      "a": "HEAD is the 'you are here' arrow.\nNormally it points at a branch name, and that name points at a commit. Detached HEAD points at a commit id directly, with no branch in between.\nIn the code:\nstickers has main at c5 and feature at c7. HEAD.points_at is feature, so you_are_on_commit is c7. The commented line shows detached HEAD pointing at c3.\nA common mistake is ignoring 'detached HEAD' warnings and committing there. Those commits have no sticker.",
      "code": "// HEAD is the \"you are here\" arrow\nstickers = { main: \"c5\", feature: \"c7\" };\n\n// normal: HEAD -> branch name -> commit\nHEAD = { points_at: \"feature\" };\nyou_are_on_commit = stickers[HEAD.points_at];  // c7\n\n// detached: HEAD -> commit id directly\n// HEAD = { points_at: \"c3\" };"
    },
    {
      "id": 17,
      "level": "beginner",
      "q": "detached HEAD danger?",
      "a": "Detached HEAD means you stand on a commit that has no branch name.\nIf you commit there, the new snapshot has no sticker. Switching back to a branch leaves that work hard to find.\nIn the code:\nHEAD is c4 (detached). new_photo is c4b. stickers.main is still c9, nothing points at c4b. After you walk to main, c4b is in the attic with no sticker.\nA common mistake is checking out an old tag, committing a fix, then switching to main and wondering where the fix went.",
      "code": "// you stand on a photo with no sticker\nHEAD = \"c4\";                 // detached\nnew_photo = \"c4b\";           // you save work here\nstickers = { main: \"c9\" };   // nothing points at c4b\n\n// later you walk to main\nHEAD = \"main\";\n// c4b is still in the attic, but no sticker finds it — easy to lose"
    },
    {
      "id": 18,
      "level": "beginner",
      "q": "What is a remote?",
      "a": "A remote is a nickname in your address book for another copy of the repo.\norigin is the usual name for 'the copy I cloned from.' upstream often means the original project you forked. The nickname is local. The bytes live at the URL.\nIn the code:\naddress_book.origin is your GitHub copy. address_book.upstream is the org project. The comment says the nickname is local.\nA common mistake is pushing to the wrong nick. Read the address book before you send work.",
      "code": "// remotes are nicknames in an address book\naddress_book = {\n  origin:   \"https://github.com/you/app\",     // your copy online\n  upstream: \"https://github.com/org/app\"      // the source project\n};\n// the nickname is local; the album bytes live at the URL"
    },
    {
      "id": 19,
      "level": "beginner",
      "q": "git fetch vs pull vs push?",
      "a": "fetch, pull, and push are three different mail actions.\nfetch updates your postcards of the remote and does not change your files. pull is fetch plus combining into your local branch. push sends your commits to the remote.\nIn the code:\nlocal_main is c5. mailbox origin/main starts at c5. After FETCH, mailbox origin/main is c8 but local_main stays c5. PULL would combine. PUSH would send local photos online.\nA common mistake is using pull when you only wanted to look. fetch is the look.",
      "code": "// three different mail actions\nlocal_main   = \"c5\";\nmailbox      = { \"origin/main\": \"c5\" };  // last time you checked\n\n// FETCH: mailbox updates, desk stays\nmailbox[\"origin/main\"] = \"c8\";\nlocal_main = \"c5\";                       // you have not filed yet\n\n// PULL: fetch + combine into local_main\n// PUSH: send local photos into the online album"
    },
    {
      "id": 20,
      "level": "beginner",
      "q": "What is origin/main?",
      "a": "origin/main is not the same sticker as your local main.\norigin/main is your last remembered position of the remote's main. They can disagree until you merge or rebase.\nIn the code:\nstickers.main is c5, your local bookmark. stickers['origin/main'] is c8, the team's bookmark last time you looked. The comment says they can disagree.\nA common mistake is thinking origin/main updates while you type. It updates when you fetch.",
      "code": "// two different stickers that look similar\nstickers = {\n  main:         \"c5\",   // your local textbook bookmark\n  \"origin/main\": \"c8\"   // postcard: team's bookmark last time you looked\n};\n// they can disagree until you merge or rebase"
    },
    {
      "id": 21,
      "level": "beginner",
      "q": "git remote -v?",
      "a": "git remote -v prints the address book: nicknames and URLs.\nYou read it to know which nick will receive a push. fetch and push use those URLs.\nIn the code:\ncontacts has origin at github.com/you/app.git and upstream at github.com/org/app.git. The question to ask is which nick receives your photos.\nA common mistake is adding a second remote and then pushing to origin by habit.",
      "code": "// the address book you should read before sending work\ncontacts = [\n  { nick: \"origin\",   url: \"github.com/you/app.git\" },\n  { nick: \"upstream\", url: \"github.com/org/app.git\" }\n];\n// question to ask: which nick will receive my photos?"
    },
    {
      "id": 22,
      "level": "beginner",
      "q": "What is .gitignore?",
      "a": ".gitignore is a 'do not photograph' list of path patterns.\nMatched untracked files will not show as candidates to add (except with force). Secrets, downloads, and build output belong here.\nIn the code:\nignore_list has node_modules/, .env, dist/, and *.log. desk_files includes app.js, .env, and dist/app.js. tracked_candidates keeps only app.js after filtering.\nA common mistake is adding node_modules after it was already committed. Ignore does not untrack by itself.",
      "code": "// a \"do not photograph\" list (patterns)\nignore_list = [\n  \"node_modules/\",   // downloaded libraries, not your writing\n  \".env\",            // secrets\n  \"dist/\",           // built output\n  \"*.log\"\n];\ndesk_files = [\"app.js\", \".env\", \"dist/app.js\"];\ntracked_candidates = desk_files.filter(f => !matches(ignore_list, f));\n// result: only app.js is a candidate to enter the album"
    },
    {
      "id": 23,
      "level": "beginner",
      "q": "How do you stop tracking a committed file but keep it locally?",
      "a": "To stop tracking a file that is already in history, you remove it from the index and keep it on disk, then ignore it.\nThe next commit no longer contains that path. Your working copy still has the file. Old commits still have it until history is rewritten.\nIn the code:\nlast_photo and desk both have build.zip. next_photo drops build.zip. desk still has it. ignore_list then includes build.zip.\nA common mistake is deleting the file from disk when you only meant to stop tracking it.",
      "code": "// the file is in the last photo AND on the desk\nlast_photo = { \"app.js\": \"...\", \"build.zip\": \"huge\" };\ndesk       = { \"app.js\": \"...\", \"build.zip\": \"huge\" };\n\n// next photo: drop build.zip from history view, keep desk copy\nnext_photo = { \"app.js\": \"...\" };\ndesk       = { \"app.js\": \"...\", \"build.zip\": \"huge\" }; // still on table\nignore_list.push(\"build.zip\");"
    },
    {
      "id": 24,
      "level": "beginner",
      "q": "What is a pull request?",
      "a": "A pull request is a conversation wrapped around copying one branch into another.\nIt lists the commits, reviews, and CI checks. People merge only when the form is accepted. Git still does the actual merge as commits.\nIn the code:\npull_request.from_branch is login, into_branch is main, photos_to_copy are c11 and c12, reviews and checks.tests green. The comment says people click merge when the form is accepted.\nA common mistake is treating a PR as a Git object. It lives on the website.",
      "code": "// a PR is a conversation wrapped around two bookmarks\npull_request = {\n  from_branch: \"login\",\n  into_branch: \"main\",\n  photos_to_copy: [\"c11\", \"c12\"],\n  reviews: [\"looks good\", \"please rename this\"],\n  checks:  { tests: \"green\" }\n};\n// people click merge only when the form is accepted"
    },
    {
      "id": 25,
      "level": "beginner",
      "q": "fork vs branch?",
      "a": "A branch is a sticker in one repo. A fork is a whole extra copy of the repo under another owner.\nOn a team repo you push a branch and open a PR. On open source you often push to your fork, then ask the original to copy your branch.\nIn the code:\nteam_album owner is org. your_fork owner is you, with feature at c12. You push to your_fork, then ask org to copy feature into their main.\nA common mistake is pushing a fork's work to origin when origin is the org and you have no write access.",
      "code": "// same idea, different ownership\nteam_album = {\n  owner: \"org\",\n  stickers: { main: \"c10\", your_pr_branch: null }\n};\nyour_fork = {\n  owner: \"you\",\n  stickers: { main: \"c10\", feature: \"c12\" }\n};\n// you push to your_fork, then ask org to copy feature into their main"
    },
    {
      "id": 26,
      "level": "intermediate",
      "q": "fast-forward merge?",
      "a": "A fast-forward merge happens when the target branch is a direct ancestor of the other.\nGit just slides the sticker forward. There is no extra merge commit. History stays one line.\nIn the code:\nline is c1, c2, c3 with c3 only on feature. stickers.main is c2, feature is c3. After fast-forward, main is also c3. Still one line, no extra merge photo.\nA common mistake is forcing a merge commit when a fast-forward was enough, or the opposite: expecting a merge commit and getting a slide.",
      "code": "// main is an ancestor of feature — a straight line\nline = [\"c1\", \"c2\", \"c3\"];   // c3 is only on feature\nstickers = { main: \"c2\", feature: \"c3\" };\n\n// fast-forward: slide main to the same photo\nstickers.main = \"c3\";\n// still one line, no extra \"merge\" photo"
    },
    {
      "id": 27,
      "level": "intermediate",
      "q": "three-way merge?",
      "a": "A three-way merge uses three snapshots: the last shared parent, your tip, and their tip.\nGit mixes the changes. If both sides changed the same spot, a human must finish the mix. The result is often a merge commit with two parents.\nIn the code:\nbase is hello. ours is hello Ada. theirs is hello Bob. merge_commit.parents are ours_id and theirs_id. files is mix(base, ours, theirs).\nA common mistake is resolving by deleting the other side blindly. Read both drafts.",
      "code": "// three photos in, one mixed photo out\nbase   = { \"app.js\": \"hello\" };       // last shared parent\nours   = { \"app.js\": \"hello Ada\" };   // your tip\ntheirs = { \"app.js\": \"hello Bob\" };   // their tip\n\nmerge_commit = {\n  parents: [\"ours_id\", \"theirs_id\"],\n  files:   mix(base, ours, theirs)    // may need a human if both changed the same spot\n};"
    },
    {
      "id": 28,
      "level": "intermediate",
      "q": "What is a merge conflict?",
      "a": "A merge conflict means Git paused because both sides changed the same lines.\nIt writes both drafts into the file with marker lines. The file is unfinished until you delete the markers and keep one clear version.\nIn the code:\napp_js shows <<<<<<< HEAD with Welcome Ada, then =======, then Welcome Bob from feature, then >>>>>>>. The comment says delete the markers and keep one clear version.\nA common mistake is committing the file with the markers still inside. The app will break and the conflict is not done.",
      "code": "// Git paused and left both drafts in the file\napp_js = `\ntitle = \"Welcome\"\n<<<<<<< HEAD\ntitle = \"Welcome Ada\"     // your side (the branch you are on)\n=======\ntitle = \"Welcome Bob\"     // their side (incoming)\n>>>>>>> feature\n`;\n// delete the markers and keep one clear version before the next photo"
    },
    {
      "id": 29,
      "level": "intermediate",
      "q": "How do you resolve a conflict?",
      "a": "You resolve a conflict by editing the file into one valid version, then staging it, then finishing the merge commit.\nThe conflict was an unfinished mix, not a special file type.\nIn the code:\napp_js becomes one sentence, Welcome Ada and Bob, with no markers. basket holds that app.js. merge_commit is snapshot(basket).\nA common mistake is running a reset --hard to 'make it go away' and losing both sides of the work.",
      "code": "// after a human chooses\napp_js = `\ntitle = \"Welcome Ada and Bob\"\n`;\n// markers are gone — one sentence remains\nbasket = { \"app.js\": app_js };\nmerge_commit = snapshot(basket);\n// the conflict was an unfinished mix, not a special file type"
    },
    {
      "id": 30,
      "level": "intermediate",
      "q": "git merge vs rebase?",
      "a": "Merge keeps a join commit with two parents, so you can still see both lines. Rebase copies your commits onto another base so history looks linear.\nCopied commits get new ids. The ideas can be the same. The fingerprints are not.\nIn the code:\nThe MERGE diagram shows c4 on main and c5 on yours meeting at merge photo c6. The REBASE diagram shows c3' and c5' after c4, new photos with new ids.\nA common mistake is rebasing a branch that teammates already pulled. Their commits will not match yours.",
      "code": "// MERGE: keep the join\n//   c1 -- c2 -- c4 (main)\n//           \\\n//            c3 -- c5 (yours) --> merge photo c6 with parents c4 and c5\n\n// REBASE: copy yours after c4\n//   c1 -- c2 -- c4 -- c3' -- c5'\n// c3' is a new photo with a new id, same idea as c3"
    },
    {
      "id": 31,
      "level": "intermediate",
      "q": "When is rebase dangerous?",
      "a": "Rebase is dangerous when other people already have the old commit ids.\nYou reprint the novel with new fingerprints. Their next pull looks like two different books fighting.\nIn the code:\nyour_laptop has c1, c2', c3' after a rewrite. sams_laptop still has c1, c2, c3. The comment says Sam's next pull looks like a fight. Safe rebase is a private feature only you used.\nA common mistake is rebase then force-push to a shared branch without telling anyone.",
      "code": "// you rewrote photos that Sam already has\nyour_laptop = { photos: [\"c1\", \"c2'\", \"c3'\"] };  // new fingerprints\nsams_laptop = { photos: [\"c1\", \"c2\",  \"c3\"] };   // old fingerprints\n\n// Sam's next pull looks like a fight between two different novels\n// safe rebase: a private feature only you used"
    },
    {
      "id": 32,
      "level": "intermediate",
      "q": "git pull --rebase?",
      "a": "git pull --rebase fetches the remote commits, then copies your local commits on top of them.\nYour ideas get new ids (cY'). History on your branch looks like one line: theirs first, then yours.\nIn the code:\norigin_main is c1, c2, c3. your_main is c1, c2, cY. After, your_main is c1, c2, c3, cY'. cY' is a new photo of the same idea on top of c3.\nA common mistake is pull --rebase with uncommitted files that clash. Stash or commit first.",
      "code": "// before pull --rebase\norigin_main = [\"c1\", \"c2\", \"c3\"];     // they added c3\nyour_main   = [\"c1\", \"c2\", \"cY\"];     // you added cY locally\n\n// after: your idea is copied after theirs\nyour_main   = [\"c1\", \"c2\", \"c3\", \"cY'\"];\n// cY' is a new photo of the same idea sitting on top of c3"
    },
    {
      "id": 33,
      "level": "intermediate",
      "q": "git fetch --prune?",
      "a": "git fetch --prune updates remote-tracking names and deletes local postcards for branches that died on the server.\nWithout prune, you keep ghost names like origin/old-login.\nIn the code:\nbefore has origin/main and origin/old-login. online_now only has main. after_prune only has origin/main. The ghost name is gone from your viewing copy.\nA common mistake is trying to check out a pruned branch that only existed as a leftover postcard.",
      "code": "// leftover postcard after the real online branch died\nbefore = { \"origin/main\": \"c9\", \"origin/old-login\": \"c4\" };\nonline_now = { main: \"c9\" };          // old-login is gone on the server\n\nafter_prune = { \"origin/main\": \"c9\" };\n// the ghost name origin/old-login is removed from your viewing copy"
    },
    {
      "id": 34,
      "level": "intermediate",
      "q": "set upstream?",
      "a": "Setting upstream links a local branch to a remote branch.\nThen pull means update that postcard and combine. push means send to that same remote branch. Without upstream, Git asks you where to push.\nIn the code:\nbranch_login.local_tip is c12. upstream is origin/login. The comments describe pull and push using that pair.\nA common mistake is pushing login to origin/main because no upstream was set and you guessed.",
      "code": "// a local branch remembers its pair online\nbranch_login = {\n  local_tip: \"c12\",\n  upstream:  \"origin/login\"    // the paired postcard\n};\n// pull means: update origin/login, then combine into local login\n// push means: send local login photos to origin/login"
    },
    {
      "id": 35,
      "level": "intermediate",
      "q": "git stash?",
      "a": "git stash parks uncommitted changes in a side pocket so your working tree matches the last commit.\nYou can switch branches, then pop the pocket later. Stash is not a named commit. It lives on this laptop.\nIn the code:\ndesk starts half done. pocket copies that. desk becomes clean like the last photo. Later desk = pocket again. The last comment says if you lose the coat, the pocket is gone.\nA common mistake is stacking many stashes and popping the wrong one, or never committing work that needed a real snapshot.",
      "code": "// stash is a coat pocket, not the album\ndesk  = { \"app.js\": \"half done\" };\npocket = { \"app.js\": \"half done\" };\ndesk  = { \"app.js\": \"clean like last photo\" };  // you can switch bookmarks\n\n// later, empty the pocket onto the desk again\ndesk = pocket;\n// if you lose the coat, the pocket is gone — it was never a named photo"
    },
    {
      "id": 36,
      "level": "intermediate",
      "q": "stash vs commit?",
      "a": "A WIP commit is in the album and can travel with the branch. A stash is a local sticky note.\nUse a commit when you want the work named and shared. Use stash for a short, private pause.\nIn the code:\nwip_commit has id cW and message WIP login. stash_pocket has the same files and label wip. cW rides with the branch. stash_pocket is this laptop only.\nA common mistake is stashing, cloning a new machine, and expecting the stash to be there.",
      "code": "// two ways to pause\nwip_commit = { id: \"cW\", message: \"WIP login\", files: { \"app.js\": \"half\" } };\nstash_pocket = { files: { \"app.js\": \"half\" }, label: \"wip\" };\n\n// cW is in the album and can ride with the branch\n// stash_pocket is a sticky side note on THIS laptop only"
    },
    {
      "id": 37,
      "level": "intermediate",
      "q": "git reset --soft --mixed --hard?",
      "a": "reset moves the branch sticker to another commit. The flags choose what happens to staging and files.\n--soft keeps files and staging as they were. --mixed (default) keeps files, clears staging. --hard makes files match the target commit and can delete uncommitted work.\nIn the code:\nstickers.main moves to c9 in all kinds. soft keeps basket and desk like c10. mixed clears basket to c9, desk still c10. hard makes both like c9.\nA common mistake is reset --hard on a shared branch, or when you still needed the desk changes.",
      "code": "// you move the sticker; three strengths of \"how much to wipe\"\nstickers.main = \"c9\";          // was c10 — pointer moves in all kinds\n\nsoft   = { basket: \"like c10\", desk: \"like c10\" }; // history moved, work kept staged\nmixed  = { basket: \"like c9\",  desk: \"like c10\" }; // work still on desk, unstaged\nhard   = { basket: \"like c9\",  desk: \"like c9\"  }; // desk matches old photo — can lose work"
    },
    {
      "id": 38,
      "level": "intermediate",
      "q": "git revert?",
      "a": "git revert undoes a commit by adding a new commit that applies the opposite patch.\nThe bad commit stays in history. Shared branches stay honest because you did not rewrite ids.\nIn the code:\nalbum is c1, c2_bad, c3. revert_photo c4 has message Revert c2_bad, files opposite_of c2_bad, parent c3. album then includes c4. c2_bad still exists.\nA common mistake is reset on origin/main to hide a bad commit. Teammates still have it.",
      "code": "// undo by adding, not by erasing\nalbum = [\"c1\", \"c2_bad\", \"c3\"];\n\nrevert_photo = {\n  id: \"c4\",\n  message: \"Revert c2_bad\",\n  files: opposite_of(\"c2_bad\"),\n  parent: \"c3\"\n};\nalbum = [\"c1\", \"c2_bad\", \"c3\", \"c4\"];  // c2_bad still exists"
    },
    {
      "id": 39,
      "level": "intermediate",
      "q": "reset vs revert?",
      "a": "reset rewinds a sticker (private drafts). revert appends an undo commit (shared history).\nSame bug, two policies. On main that others pulled, revert. On a branch only you have, reset can be fine.\nIn the code:\nshared_main after revert is c1, c2_bad, c3, c4_undo. private_feature.tip rewinds to c1 so c2_bad may become unnamed.\nA common mistake is reset --hard origin/main after a public bad commit. Use revert.",
      "code": "// same bug, two policies\nshared_main = [\"c1\", \"c2_bad\", \"c3\"];\n\n// revert (safe on shared): append\nshared_main = [\"c1\", \"c2_bad\", \"c3\", \"c4_undo\"];\n\n// reset (private draft only): rewind sticker\nprivate_feature = [\"c1\", \"c2_bad\"];\nprivate_feature.tip = \"c1\";  // c2_bad may become unnamed"
    },
    {
      "id": 40,
      "level": "intermediate",
      "q": "git restore?",
      "a": "git restore is about files, not about moving branch stickers.\nYou can unstage (make the index match HEAD) or discard working tree changes (make the file match HEAD). The branch pointer stays put.\nIn the code:\ndesk and basket both have oops. last has good. unstage keeps desk oops and basket good. discard makes both good. The comment says you did not move the branch sticker.\nA common mistake is restore on a file you still needed. There is no trash can.",
      "code": "// restore is about files, not about jumping bookmarks\ndesk   = { \"app.js\": \"oops\" };\nbasket = { \"app.js\": \"oops\" };\nlast   = { \"app.js\": \"good\" };\n\nunstage = { desk: \"oops\", basket: \"good\" };  // envelope matches last photo\ndiscard = { desk: \"good\", basket: \"good\" };  // desk matches last photo too\n// you did not move the branch sticker"
    },
    {
      "id": 41,
      "level": "intermediate",
      "q": "amend?",
      "a": "amend remakes the last commit instead of adding a new one.\nGit creates a new hash. The old last commit may become unnamed. Only do this if you have not pushed, or if the team agrees to rewrite.\nIn the code:\nold_last is c10 with message typo. basket has extra line. new_last is c10b with message Add login, same parent, sticker moves to c10b. c10 may become unnamed.\nA common mistake is amending a commit that is already on origin. Others still have c10.",
      "code": "// last photo is remade, not edited in place\nold_last = { id: \"c10\", message: \"typo\", files: { \"a.js\": \"v1\" } };\nbasket   = { \"a.js\": \"v1 plus missed line\" };\n\nnew_last = { id: \"c10b\", message: \"Add login\", files: basket, parent: old_last.parent };\nstickers.feature = \"c10b\";\n// c10 may become unnamed; c10b is the new tip"
    },
    {
      "id": 42,
      "level": "intermediate",
      "q": "interactive rebase?",
      "a": "Interactive rebase lets you edit a todo list of commits as Git copies them onto a new base.\npick keeps a commit. squash folds it into the previous one. reword changes only the message. Result: fewer commits, new hashes, same ideas.\nIn the code:\ntodo picks c1, squashes c2 oops forgot import, rewords c3 Fix crash. The comment says fewer photos, new fingerprints.\nA common mistake is squashing a commit that was already reviewed and pushed as its own id.",
      "code": "// a todo list for copying photos onto a new base\ntodo = [\n  \"pick   c1  Add files\",\n  \"squash c2  oops forgot import\",   // fold into the previous photo\n  \"reword c3  Fix crash\"             // change only the caption\n];\n// result: fewer photos, new fingerprints, same ideas"
    },
    {
      "id": 43,
      "level": "intermediate",
      "q": "squash merge on GitHub?",
      "a": "Squash merge on GitHub takes a PR's many commits and adds one summary commit on main.\nThe feature branch's individual commits are not replayed as-is. The tree (final files) of the feature usually becomes that one commit.\nIn the code:\nfeature is c1,c2,c3. main_before is m1,m2. squash_on_main is m3 with message Add login (#42), files of c3, parent m2 only. feature's c1–c3 are not in main's line.\nA common mistake is looking for your three PR commits on main after a squash. You will see one.",
      "code": "// PR had three photos; main receives one summary\nfeature = [\"c1\", \"c2\", \"c3\"];\nmain_before = [\"m1\", \"m2\"];\n\nsquash_on_main = {\n  id: \"m3\",\n  message: \"Add login (#42)\",\n  files: files_of(\"c3\"),      // final tree of the feature\n  parent: \"m2\"                // only one parent\n};\n// feature's c1,c2,c3 are not in main's line"
    },
    {
      "id": 44,
      "level": "intermediate",
      "q": "rebase merge vs merge commit vs squash?",
      "a": "Three ways to land a PR: a merge commit (two parents), rebase merge (copied commits in a line), or squash (one commit).\nBranch protection often locks the team to one button so history stays consistent.\nIn the code:\nmerge_commit is m3 with parents main_tip and feature_tip. rebase_merge is c1' c2' c3'. squash_merge is one s1.\nA common mistake is mixing all three on the same repo until git log is unreadable.",
      "code": "// same PR, three textbook layouts\nmerge_commit = \"main -- m3 (parents: main_tip, feature_tip)\";\nrebase_merge = \"main -- c1' -- c2' -- c3'\";   // copied commits\nsquash_merge = \"main -- s1\";                  // one blob of all changes\n// branch protection often locks the team to one button"
    },
    {
      "id": 45,
      "level": "intermediate",
      "q": "git bisect?",
      "a": "git bisect is a binary search through commits to find the first bad snapshot.\nYou mark a known good and a known bad. Git jumps to the middle. You test and mark. Repeat until one commit is the first bad.\nIn the code:\nphotos go from c1 good to c5 bad. round1 is middle c3. If c3 is good, the bug is in c4 or c5. round2 is c4.\nA common mistake is testing with dirty local files, so 'good' and 'bad' are not really about that commit.",
      "code": "// jump to the middle photo, mark it, repeat\nphotos = [\"c1 good\", \"c2 ?\", \"c3 ?\", \"c4 ?\", \"c5 bad\"];\n\nround1 = \"c3\";  // middle\n// if c3 is good, the bug is in c4 or c5\nround2 = \"c4\";\n// first bad photo is the one where good became bad"
    },
    {
      "id": 46,
      "level": "intermediate",
      "q": "git blame?",
      "a": "git blame annotates each line with the last commit that changed it, plus the author.\nThe useful next step is reading that commit's message, not blaming a person.\nIn the code:\nfile_with_notes shows login() from c12 by Ada, return token from c40 by Bob, closing brace from c12. The comment says read the photo message next.\nA common mistake is using blame as a gotcha. Lines move; the last touch is not always the bug's cause.",
      "code": "// each line remembers its last photo\nfile_with_notes = [\n  { line: \"function login() {\", last_photo: \"c12\", author: \"Ada\" },\n  { line: \"  return token;\",    last_photo: \"c40\", author: \"Bob\" },\n  { line: \"}\",                  last_photo: \"c12\", author: \"Ada\" }\n];\n// read the photo message next — that is the real context"
    },
    {
      "id": 47,
      "level": "intermediate",
      "q": "git cherry-pick?",
      "a": "cherry-pick copies one commit's patch onto another branch as a new commit.\nThe new commit has a new hash and a new parent. The change can be the same idea.\nIn the code:\nhotfix_on_main is c80 Fix crash. release_line is r1, r2. copied r3 has the same patch, parent r2. c80 and r3 are twins with different fingerprints.\nA common mistake is cherry-picking a merge commit without knowing which parent Git will use.",
      "code": "// copy one idea onto another line\nhotfix_on_main = { id: \"c80\", message: \"Fix crash\", patch: \"...\" };\n\nrelease_line = [\"r1\", \"r2\"];\ncopied = { id: \"r3\", message: \"Fix crash\", patch: same_as(\"c80\"), parent: \"r2\" };\nrelease_line = [\"r1\", \"r2\", \"r3\"];\n// c80 and r3 are twins with different fingerprints"
    },
    {
      "id": 48,
      "level": "intermediate",
      "q": "cherry-pick conflicts?",
      "a": "cherry-pick can conflict when the patch expects old surrounding lines that this branch does not have.\nYou get the same markers as a merge. You write one valid version, then continue the pick.\nIn the code:\nincoming_hunk expects color = red, replace with blue. here_now is color = crimson. conflict shows current crimson vs picked blue. You write one valid line and finish.\nA common mistake is aborting and retrying the same pick without fixing the surrounding code.",
      "code": "// the patch expects old context that this branch does not have\nincoming_hunk = { expect: \"color = red\", replace: \"color = blue\" };\nhere_now     = { text: \"color = crimson\" };  // different words\n\nconflict = `\n<<<<<<< current\ncolor = crimson\n=======\ncolor = blue\n>>>>>>> picked\n`;\n// you write one valid line, then finish the copied photo"
    },
    {
      "id": 49,
      "level": "intermediate",
      "q": "What is a tag?",
      "a": "A tag is a label on one commit, often a release version.\nUnlike a branch, a release tag should stay on that commit. main can slide forward. The museum label stays put.\nIn the code:\nphotos.c100 is the release files. labels v1.2.0 points at c100. stickers.main later is c105. the v1.2.0 label still points at c100.\nA common mistake is moving a published tag to a new commit. Installers and users get a different build under the same name.",
      "code": "// a tag is a label on one photo\nphotos = { c100: { files: { \"app.js\": \"release\" } } };\nlabels = { \"v1.2.0\": \"c100\" };\n\nstickers.main = \"c105\";     // main may slide forward\nlabels[\"v1.2.0\"] = \"c100\";  // the museum label should stay put"
    },
    {
      "id": 50,
      "level": "intermediate",
      "q": "lightweight vs annotated tag?",
      "a": "A lightweight tag is only a name pointing at a commit. An annotated tag is a real object with a message, tagger, and date.\nReleases should use annotated tags so the label carries who and why.\nIn the code:\nlightweight is name v1 pointing at c100. annotated is v1.2.0 pointing at c100 with message Spring release, tagged_by Ada, and a date.\nA common mistake is tagging locally and forgetting to push tags. The website will not show the release.",
      "code": "// two label styles\nlightweight = { name: \"v1\", points_at: \"c100\" };\n\nannotated = {\n  name: \"v1.2.0\",\n  points_at: \"c100\",\n  message: \"Spring release\",\n  tagged_by: \"Ada\",\n  date: \"2026-03-01\"\n};"
    },
    {
      "id": 51,
      "level": "intermediate",
      "q": "What is HEAD~1 vs HEAD^?",
      "a": "HEAD~1 and HEAD^ both mean 'first parent, one step back' on a normal commit. On a merge commit they still mean the first parent. HEAD^2 means the second parent, the incoming branch.\n~n walks n generations along first parents. Carets pick which parent of a merge.\nIn the code:\ncM has parents cA and cB. HEAD is cM. HEAD_tilde1 and HEAD_caret are both cA. HEAD_caret2 is cB, the incoming branch.\nA common mistake is using ^2 on a commit that is not a merge. There is no second parent.",
      "code": "// a merge photo has two parents\ncM = { parents: [\"cA\", \"cB\"] };  // first parent cA, second cB\nHEAD = \"cM\";\n\nHEAD_tilde1 = \"cA\";  // ~1 = first parent, one generation\nHEAD_caret  = \"cA\";  // ^  = first parent\nHEAD_caret2 = \"cB\";  // ^2 = second parent (the incoming branch)"
    },
    {
      "id": 52,
      "level": "intermediate",
      "q": "merge commit parents?",
      "a": "A merge commit has two parents. The first parent is the branch you were on. The second is the branch you merged in.\nWalking main along first parents skips the feature's inner commits unless you follow the other parent.\nIn the code:\nmerge id cM has parents c_main then c_login. First-parent walk of main goes through c_main then cM. c_login is still reachable as the other parent.\nA common mistake is thinking a merge deleted the feature commits. They are still in the graph via the second parent.",
      "code": "// you were on main and merged login\nmerge = {\n  id: \"cM\",\n  parents: [\"c_main\", \"c_login\"],  // [first, second]\n  message: \"Merge branch login\"\n};\n// first-parent walk of main: ... c_main, cM, ...\n// c_login is still reachable as the other parent"
    },
    {
      "id": 53,
      "level": "intermediate",
      "q": "git reflog?",
      "a": "reflog is a local diary of where HEAD has been on this machine.\nIt records checkouts, commits, and resets. A commit with no branch can still appear here. It is not shared when you push.\nIn the code:\nreflog lists HEAD_was c10 from a commit, c9 from a reset, c8 from checkout. The comment says c10 may have no sticker, but the camera still saw it.\nA common mistake is expecting reflog on a teammate's laptop to show your lost commit. It is local.",
      "code": "// a local camera log of the \"you are here\" arrow\nreflog = [\n  { HEAD_was: \"c10\", why: \"commit: Add login\" },\n  { HEAD_was: \"c9\",  why: \"reset: move main back\" },\n  { HEAD_was: \"c8\",  why: \"checkout: main\" }\n];\n// c10 may have no sticker, but the camera still saw it"
    },
    {
      "id": 54,
      "level": "advanced",
      "q": "dangling commit / fsck?",
      "a": "A dangling commit is a snapshot nothing named still points to.\nBranches, tags, and reflog keep commits reachable. Garbage collection may delete dangling objects after a waiting period.\nIn the code:\nstickers.main is c9. attic still has c10_lost. reachable is a walk from stickers. dangling is c10_lost. GC may delete it later.\nA common mistake is thinking reset --hard instantly shreds the old tip. reflog often still has it for a while.",
      "code": "// reachability is what keeps a photo alive\nstickers = { main: \"c9\" };\nattic = [\"c7\", \"c8\", \"c9\", \"c10_lost\"];\n\nreachable = walk_from(stickers);  // c9, c8, c7, ...\ndangling = [\"c10_lost\"];          // no name points here\n// garbage collection may delete dangling after a waiting period"
    },
    {
      "id": 55,
      "level": "intermediate",
      "q": "force push?",
      "a": "A force push moves the remote branch sticker to your story even if the remote had commits you do not have.\nThat can erase someone else's work from that branch name. force-with-lease only proceeds if the remote still matches the postcard you remember.\nIn the code:\norigin_login is c5, maybe including Sam's c6. your_login is c5b after a rebase. force would set origin to c5b even if c6 existed. lease should stop you if Sam added c6.\nA common mistake is --force on main. Use lease, and only on a private branch.",
      "code": "// the online sticker is moved to YOUR story\norigin_login = \"c5\";     // maybe includes Sam's c6\nyour_login   = \"c5b\";    // you rebased; new ids\n\n// force: origin_login becomes c5b even if c6 existed\n// force-with-lease: only if origin_login is still the c5 you remember\n// if Sam already added c6, lease should stop you"
    },
    {
      "id": 56,
      "level": "intermediate",
      "q": "branch protection?",
      "a": "Branch protection is website rules on an official branch, usually main.\nTypical rules: must use a PR, required reviews, required status checks, no force push. Git on your laptop still can create commits. The host refuses the dangerous update.\nIn the code:\nprotection.branch is main, must_use_pr true, one review, tests and lint required, force push false. The album tool can still merge through the PR door.\nA common mistake is trying to push straight to main and blaming Git. The host is blocking you on purpose.",
      "code": "// rules on the official sticker\nprotection = {\n  branch: \"main\",\n  must_use_pr: true,\n  required_reviews: 1,\n  required_checks: [\"tests\", \"lint\"],\n  allow_force_push: false\n};\n// the album tool still can merge through the allowed door (the PR)"
    },
    {
      "id": 57,
      "level": "beginner",
      "q": "What is a good commit message?",
      "a": "A good commit message explains what changed and why, in the imperative: 'Reject empty passwords'.\nThe subject is short. The body can hold the reason. 'update' teaches nobody.\nIn the code:\nbad is update. ok is Add login button. good has subject Reject empty passwords on login and a body about empty passwords skipping hashing.\nA common mistake is describing what you felt ('fixed stuff') instead of what the snapshot did.",
      "code": "// captions that help future-you\nbad  = \"update\";\nok   = \"Add login button\";\ngood = {\n  subject: \"Reject empty passwords on login\",\n  body: \"Empty passwords were stored as success and skipped hashing.\"\n};\n// subject is a short command; body is the reason"
    },
    {
      "id": 58,
      "level": "beginner",
      "q": "atomic commits?",
      "a": "Atomic commits mean one idea per snapshot.\nIf a crash fix, a docs rewrite, and a whitespace change are glued together, revert and bisect become painful. Split them into three commits.\nIn the code:\nmessy c9 touches login.js, README.md, and all.css. c9a, c9b, c9c each hold one file idea.\nA common mistake is 'I'll split it later' and then pushing the glued commit to a PR.",
      "code": "// two ideas accidentally glued together\nmessy = {\n  id: \"c9\",\n  files: { \"login.js\": \"fix crash\", \"README.md\": \"rewrite docs\", \"all.css\": \"tabs to spaces\" }\n};\n\n// three lunch boxes\nc9a = { files: { \"login.js\": \"fix crash\" } };\nc9b = { files: { \"README.md\": \"rewrite docs\" } };\nc9c = { files: { \"all.css\": \"tabs to spaces\" } };"
    },
    {
      "id": 59,
      "level": "intermediate",
      "q": "git add -p?",
      "a": "git add -p stages hunks inside a file, not the whole file.\nYou can put the login change in this commit and leave the debug dump on the desk.\nIn the code:\ndesk_app_js has login() as idea A and debugDump() as idea B. basket_for_photo1 only has login. desk_still has the debug dump.\nA common mistake is add . on a file that contains two unrelated ideas.",
      "code": "// one file, two ideas\ndesk_app_js = [\n  \"function login() { ... }\",     // idea A: login\n  \"function debugDump() { ... }\"  // idea B: leftover debug\n];\n\nbasket_for_photo1 = [\"function login() { ... }\"];\ndesk_still        = [\"function debugDump() { ... }\"];\n// photo1 can ship login without the debug dump"
    },
    {
      "id": 60,
      "level": "intermediate",
      "q": "What is the index / staging area really?",
      "a": "The index (staging area) is a packing list of path, blob hash, and file mode.\nThe next commit's tree is built from that list, not from a loose glance at the desk. Untracked paths are simply not in the list.\nIn the code:\nindex has app.js blob_aaa and README.md blob_bbb. next_commit_tree is that list. secret.env on the desk is not in the list, so it will not be in the photo.\nA common mistake is thinking staging is a copy of the whole folder. It is a chosen list.",
      "code": "// .git/index is a packing list\nindex = [\n  { path: \"app.js\",     hash: \"blob_aaa\", mode: \"100644\" },\n  { path: \"README.md\",  hash: \"blob_bbb\", mode: \"100644\" }\n];\nnext_commit_tree = index;   // this list becomes the photo\n// \"secret.env\" on the desk is not in the list, so it will not be in the photo"
    },
    {
      "id": 61,
      "level": "advanced",
      "q": "Git object types?",
      "a": "Git stores four object types: blob (file bytes), tree (a directory listing of names to hashes), commit (tree + parents + message), and tag (annotated label).\nThe object's name is the hash of its bytes.\nIn the code:\nblob is hello bytes. tree lists app.js pointing at the blob hash. commit points at the tree, parent c1, message Add hello. tag points at the commit with name v1.0.0.\nA common mistake is thinking a commit stores a full tarball of the project each time. Trees reuse blob hashes.",
      "code": "// four object kinds\nblob   = { type: \"blob\",   bytes: \"hello\" };\ntree   = { type: \"tree\",   entries: [{ name: \"app.js\", hash: hash(blob) }] };\ncommit = { type: \"commit\", tree: hash(tree), parents: [\"c1\"], message: \"Add hello\" };\ntag    = { type: \"tag\",    object: hash(commit), name: \"v1.0.0\" };\n// the hash of the bytes is the object's name"
    },
    {
      "id": 62,
      "level": "advanced",
      "q": "content-addressed store?",
      "a": "Git is content-addressed: the same bytes get the same blob name.\nTwo files with identical text share one stored blob. That is why copies are cheap until the text differs.\nIn the code:\nstore('hello') twice yields abc123 both times. tree1 has app.js at abc123. tree2 has app.js and copy.js both at abc123. Two paths, one pile of bytes.\nA common mistake is renaming a file and expecting Git to treat it as brand-new content. The blob can stay the same.",
      "code": "// same text => same blob name\nblob_hello = store(\"hello\");     // name: \"abc123\"\nblob_again = store(\"hello\");     // name: \"abc123\" (reuse)\n\ntree1 = { \"app.js\": \"abc123\" };\ntree2 = { \"app.js\": \"abc123\", \"copy.js\": \"abc123\" };\n// two paths, one stored pile of bytes"
    },
    {
      "id": 63,
      "level": "intermediate",
      "q": "git show?",
      "a": "git show peeks at a commit or a file inside a commit without moving HEAD.\nYour working tree can still be different. You only looked.\nIn the code:\nphoto_c2.tree has app.js hello and README docs. peek reads app.js from that tree. The comment says your desk can still have different text.\nA common mistake is checkout when you only meant to read. show does not rewrite the desk.",
      "code": "// peek at a file inside a photo without moving bookmarks\nphoto_c2 = {\n  tree: { \"app.js\": \"hello\", \"README.md\": \"docs\" }\n};\npeek = photo_c2.tree[\"app.js\"];  // \"hello\"\n// your desk can still have different text; you only looked"
    },
    {
      "id": 64,
      "level": "intermediate",
      "q": "git checkout <file> old meaning?",
      "a": "Old git checkout did two jobs: switch branches, and restore files. New Git splits them: switch for branches, restore for files.\nSame tool, two meanings depending on arguments, which confused people.\nIn the code:\nswitch_job moves HEAD to feature and rewrites the desk to those files. restore_job leaves HEAD alone and rewrites only app.js from the last photo.\nA common mistake is checkout -- file thinking you switched branches. You only restored a file.",
      "code": "// two jobs that used to share one word\nswitch_job  = { move_HEAD: \"feature\", rewrite_desk: \"files of feature\" };\nrestore_job = { move_HEAD: null,      rewrite_desk: { \"app.js\": last_photo } };\n\n// old checkout did both depending on arguments\n// new words keep the jobs apart"
    },
    {
      "id": 65,
      "level": "beginner",
      "q": "untracked vs ignored vs tracked?",
      "a": "Tracked means the path is in the last commit (Git knows it). Untracked means it is on disk and Git has no name for it yet. Ignored means untracked and matching .gitignore.\nStatus treats those three differently.\nIn the code:\napp.js is tracked. notes.local is untracked. node_modules/ is ignored.\nA common mistake is calling an ignored file 'deleted' because a short ls hid it. It is still on disk.",
      "code": "// three labels for paths\npaths = {\n  \"app.js\":        \"tracked\",     // in the last photo\n  \"notes.local\":   \"untracked\",   // on desk, Git has no name for it yet\n  \"node_modules/\": \"ignored\"      // untracked AND matches ignore_list\n};"
    },
    {
      "id": 66,
      "level": "intermediate",
      "q": "How do you ignore a file that is already tracked?",
      "a": "A .gitignore rule does nothing to a path that is already tracked.\nYou must drop it from the index (stop tracking) while keeping the disk file, then the ignore list can hide future changes.\nIn the code:\ntracked still has debug.log. ignore_list includes debug.log but next_photo_if_you_forget still has it. next_photo_after_drop removes it from the photo. desk_keeps_file still has the bytes.\nA common mistake is adding a pattern and wondering why git status still shows the file. It is still tracked.",
      "code": "// ignore_list alone does nothing to a tracked path\ntracked = { \"debug.log\": \"bytes\" };\nignore_list = [\"debug.log\"];\nnext_photo_if_you_forget = { \"debug.log\": \"bytes\" };  // still there\n\nnext_photo_after_drop = { /* debug.log removed */ };\nignore_list = [\"debug.log\"];\ndesk_keeps_file = { \"debug.log\": \"bytes\" };"
    },
    {
      "id": 67,
      "level": "intermediate",
      "q": "skip-worktree vs assume-unchanged?",
      "a": "skip-worktree and assume-unchanged hide local edits to a tracked file so status looks clean.\nThe album still has the original. This is a smell compared to a real untracked .env. Teammates will not get your hidden desk change.\nIn the code:\nlast_photo has theme light. desk has theme dark. flags skip-worktree. status_looks_clean is true. The album still has light.\nA common mistake is using this instead of env files, then a deploy overwrites your hidden local config.",
      "code": "// a tracked config you secretly customized\nlast_photo = { \"config.yml\": \"theme: light\" };\ndesk       = { \"config.yml\": \"theme: dark\" };  // your laptop only\n\nflags = { \"config.yml\": \"skip-worktree\" };\nstatus_looks_clean = true;   // Git hides the desk difference\n// the album still has theme: light — a smell compared to a real .env file"
    },
    {
      "id": 68,
      "level": "beginner",
      "q": "What should never be committed?",
      "a": "Never commit secrets, private keys, install folders you can regenerate, or huge binaries that change every commit.\nSource, README, and .gitignore belong in the album.\nIn the code:\nnever_in_album lists .env, id_rsa, node_modules/, video.mp4. ok_in_album is app.js, README.md, .gitignore.\nA common mistake is committing .env 'just for the team.' Rotate that secret; it is now in history.",
      "code": "// a packing list of things that should stay off the photo\nnever_in_album = [\n  \".env\",              // passwords\n  \"id_rsa\",            // private key\n  \"node_modules/\",     // can be reinstalled\n  \"video.mp4\"          // huge binary versions forever\n];\nok_in_album = [\"app.js\", \"README.md\", \".gitignore\"];"
    },
    {
      "id": 69,
      "level": "intermediate",
      "q": "You committed a secret. Now what?",
      "a": "If you committed a secret, change the real key at the provider first. Deleting the file in a new commit does not erase it from old snapshots.\nHistory rewrite is a later, team-wide step. Assume the leaked value is public.\nIn the code:\nalbum c4 still has API_KEY=real-secret. c5 removes .env from that photo only. must_do_first is change the real API key. history_rewrite is optional later with everyone re-cloning.\nA common mistake is only deleting .env on main and leaving the key live at the vendor.",
      "code": "// a new photo that deletes .env is NOT a full fix\nalbum = [\n  { id: \"c4\", files: { \".env\": \"API_KEY=real-secret\" } },  // still here\n  { id: \"c5\", files: { \".env\": undefined } }               // gone from THIS photo only\n];\nmust_do_first = \"change the real API key at the provider\";\nhistory_rewrite = \"optional later, with the whole team re-cloning\";"
    },
    {
      "id": 70,
      "level": "advanced",
      "q": "git filter-repo?",
      "a": "git filter-repo rewrites history into new commit ids, for example dropping a secret file from every snapshot.\nTeammates must reset to the new history. Old clones still have the old ids and the secret.\nIn the code:\nold c1 and c2 both contain secret.txt. reprinted n1 and n2 have only app.js. n1 is not c1. teammates must reset to the reprint.\nA common mistake is filter-repo then expecting old PR links and hashes to still match.",
      "code": "// rewrite makes a new universe of ids\nold = [\n  { id: \"c1\", files: { \"app.js\": \"ok\", \"secret.txt\": \"key\" } },\n  { id: \"c2\", files: { \"app.js\": \"ok\", \"secret.txt\": \"key\" } }\n];\nreprinted = [\n  { id: \"n1\", files: { \"app.js\": \"ok\" } },\n  { id: \"n2\", files: { \"app.js\": \"ok\" } }\n];\n// n1 is not c1; teammates must reset to the reprint"
    },
    {
      "id": 71,
      "level": "intermediate",
      "q": "LFS?",
      "a": "Git LFS stores a tiny pointer in Git and the real large bytes in a separate warehouse.\nAfter checkout, LFS fills in the working copy file. Clones stay smaller in the Git objects, if everyone uses LFS.\nIn the code:\ngit_blob is an lfs-pointer with oid sha256:aaa. warehouse holds the 2GB video. working_copy demo.mp4 has the real bytes after LFS fills in.\nA common mistake is adding a huge file without LFS, then enabling LFS later. History still has the fat blob.",
      "code": "// what Git sees vs where the bytes live\ngit_blob = { type: \"lfs-pointer\", size: 80, oid: \"sha256:aaa\" };\nwarehouse = { \"sha256:aaa\": video_bytes_2gb };\n\nworking_copy = {\n  \"demo.mp4\": video_bytes_2gb   // after LFS fills in the pointer\n};\n// the album photos store the pointer, not 2GB each time"
    },
    {
      "id": 72,
      "level": "intermediate",
      "q": "Why are large binaries painful in Git?",
      "a": "Git stores a full blob for each version of a binary. Binaries do not diff or compress like text, so clones grow with every version.\nYou often need only the latest file, but you download every old blob.\nIn the code:\nversions c1–c3 each hold a 50MB video. clone_weight is 150MB of video history even if you only need v3. Text reuses blobs much better.\nA common mistake is committing build artifacts or screen recordings 'temporarily.' They stay forever in that clone.",
      "code": "// each photo keeps a full copy of the binary object\nversions = [\n  { photo: \"c1\", video: \"50MB v1\" },\n  { photo: \"c2\", video: \"50MB v2\" },\n  { photo: \"c3\", video: \"50MB v3\" }\n];\nclone_weight = \"150MB of video history, even if you only need v3\";\n// text files compress and reuse blobs much better"
    },
    {
      "id": 73,
      "level": "intermediate",
      "q": "submodule?",
      "a": "A submodule is a Git repo nested in another. The parent stores a URL and a pinned commit, not the child's full file text.\nYou must fetch that nested repo or the folder looks empty.\nIn the code:\nparent has app.js and vendor/lib as a submodule pinned at c88. child_at_c88 has index.js. If you forget to fill the nested album, vendor/lib looks empty.\nA common mistake is cloning the parent without initializing submodules, then wondering why vendor is empty.",
      "code": "// parent album stores a pointer, not the child's full text\nparent = {\n  \"app.js\": \"...\",\n  \"vendor/lib\": { submodule: true, url: \"other/lib\", pinned_photo: \"c88\" }\n};\nchild_at_c88 = { \"index.js\": \"library code\" };\n// if you forget to fill the nested album, vendor/lib looks empty"
    },
    {
      "id": 74,
      "level": "intermediate",
      "q": "subtree vs submodule?",
      "a": "subtree copies another project's files into your tree as normal files. submodule stores a pointer.\nsubtree clones are simpler. History of the two projects is mixed. submodule keeps histories separate but needs extra fetch steps.\nIn the code:\nyour_tree has vendor/lib/index.js as copied library code. submodule would store a pointer instead of those bytes.\nA common mistake is treating subtree files as a live clone of upstream. Updates are copy steps, not automatic.",
      "code": "// subtree pastes another project as normal files\nyour_tree = {\n  \"app.js\": \"...\",\n  \"vendor/lib/index.js\": \"copied library code\"  // real files in YOUR photos\n};\n// submodule would store a pointer instead of index.js bytes\n// subtree: simpler clone, heavier mixed history"
    },
    {
      "id": 75,
      "level": "intermediate",
      "q": "monorepo vs many repos?",
      "a": "A monorepo is one album for many apps and libraries. Many repos split those into separate albums.\nA monorepo PR can change ui and web together. Many repos need matching versions across three places.\nIn the code:\nmonorepo has apps/web, apps/api, libs/ui. many_repos has org/web, org/api, org/ui. Three albums, three versions to coordinate.\nA common mistake is splitting repos only to 'feel cleaner,' then drowning in version mismatch.",
      "code": "// two layouts of the same company code\nmonorepo = {\n  \"apps/web/\": {},\n  \"apps/api/\": {},\n  \"libs/ui/\": {}\n};  // one album, one PR can change ui + web together\n\nmany_repos = {\n  \"org/web\": {},\n  \"org/api\": {},\n  \"org/ui\": {}\n};  // three albums, three versions to coordinate"
    },
    {
      "id": 76,
      "level": "beginner",
      "q": "clone --depth?",
      "a": "clone --depth downloads only recent commits, a shallow clone.\nYou see today's files but not the full attic. Some history commands cannot answer until you deepen.\nIn the code:\nfull is c1 through c5. shallow_depth_1 is only c5. shallow_depth_2 is c4 and c5.\nA common mistake is running blame or bisect on a depth-1 clone and thinking Git is broken. The old photos were never downloaded.",
      "code": "// full attic vs a thin recent slice\nfull   = [\"c1\", \"c2\", \"c3\", \"c4\", \"c5\"];\nshallow_depth_1 = [\"c5\"];           // you see today, not the 2019 photos\nshallow_depth_2 = [\"c4\", \"c5\"];\n// some history questions cannot be answered until you deepen"
    },
    {
      "id": 77,
      "level": "intermediate",
      "q": "sparse checkout?",
      "a": "Sparse checkout keeps the full history in .git but only checks out some folders onto the desk.\nUseful in a huge monorepo when you only work in apps/web.\nIn the code:\nalbum_tree has apps/web, apps/api, docs. sparse_filter is apps/web. desk only has apps/web. You are not carrying docs and api on the table.\nA common mistake is thinking sparse checkout deleted those folders from history. They are still in the album.",
      "code": "// the album has everything; the desk has a subset\nalbum_tree = { \"apps/web\": {}, \"apps/api\": {}, \"docs\": {} };\nsparse_filter = [\"apps/web\"];\ndesk = { \"apps/web\": {} };\n// you are not carrying docs/ and apps/api on the table"
    },
    {
      "id": 78,
      "level": "intermediate",
      "q": "partial clone?",
      "a": "A partial clone downloads commit and tree names first, and fetches file blobs on demand.\nThe structure exists. Some file bytes are still at the warehouse until you need them.\nIn the code:\npartial.commits_and_trees are downloaded. blobs.app.js is downloaded because you opened it. old/huge.bin is not fetched yet.\nA common mistake is measuring clone time once, then being surprised the first checkout of a huge path is slow.",
      "code": "// history names arrive before all file bytes\npartial = {\n  commits_and_trees: \"downloaded\",\n  blobs: {\n    \"app.js\": \"downloaded because you opened it\",\n    \"old/huge.bin\": \"not fetched yet\"\n  }\n};\n// the album structure exists; some papers are still at the warehouse"
    },
    {
      "id": 79,
      "level": "beginner",
      "q": "HTTPS vs SSH remotes?",
      "a": "HTTPS and SSH are two ways to prove who you are when talking to the remote.\nHTTPS often uses a token. SSH uses a key pair. The album on the other side is the same.\nIn the code:\nhttps_door uses a token. ssh_door uses a private_key. Same album behind the door. The proof is how the host recognizes you.\nA common mistake is pasting a password into HTTPS after GitHub disabled password Git. Use a token or SSH.",
      "code": "// two door styles in the address book\nhttps_door = { url: \"https://github.com/you/app.git\", proof: \"token\" };\nssh_door   = { url: \"git@github.com:you/app.git\",     proof: \"private_key\" };\n\n// same album on the other side of the door\n// the proof is how the host recognizes you"
    },
    {
      "id": 80,
      "level": "intermediate",
      "q": "SSH key for GitHub?",
      "a": "An SSH key pair is two halves of one lock. The public half goes on GitHub. The private half never leaves your machine.\nGitHub can verify you without seeing the private file.\nIn the code:\nkeypair.public is ssh-ed25519 AAAA... that goes to GitHub. private is the BEGIN OPENSSH block. github_account.authorized_keys gets the public half.\nA common mistake is copying the private key to a chat or into the repo. That is a stolen badge. Make a new pair.",
      "code": "// two halves of one lock\nkeypair = {\n  public:  \"ssh-ed25519 AAAA... you@laptop\",  // this goes to GitHub\n  private: \"-----BEGIN OPENSSH PRIVATE KEY-----\" // this NEVER leaves your machine\n};\ngithub_account.authorized_keys.push(keypair.public);\n// GitHub can verify signatures from the private half without seeing it"
    },
    {
      "id": 81,
      "level": "intermediate",
      "q": "signed commits?",
      "a": "A signed commit adds a cryptographic seal so others can check the author key, not just the name string anyone could type.\nGitHub can show Verified when the seal matches a known key.\nIn the code:\ncommit has author_name Ada, which anyone could type. seal uses Ada's signing key over commit.id. github_badge is Verified if it matches.\nA common mistake is trusting author_name in git log as identity. Names are not proof without a signature.",
      "code": "// a commit plus a seal\ncommit = {\n  id: \"c20\",\n  author_name: \"Ada\",          // anyone could type this\n  message: \"Fix login\"\n};\nseal = { key: \"Ada's signing key\", over: commit.id };\ngithub_badge = seal_matches_known_key ? \"Verified\" : \"Unverified\";"
    },
    {
      "id": 82,
      "level": "beginner",
      "q": "What is GitHub Actions?",
      "a": "GitHub Actions is automation that runs when GitHub events happen, such as a pull request.\nA workflow file is a recipe: get the files from that commit, then run tests. It is CI sitting on the website, not a Git command.\nIn the code:\non pull_request starts the job. checkout gets the files from that photo. npm test is the robot's grading step. The last comment says this is a story of automation.\nA common mistake is putting secrets in the workflow file in plain text. Use encrypted Actions secrets.",
      "code": "# a teaching recipe: what should happen on a new photo\nname: tests\non:\n  pull_request: {}          # when a review form opens\njobs:\n  check:\n    steps:\n      - uses: actions/checkout@v4   # get the files from that photo\n      - run: npm test               # the robot's grading step\n# this is a story of automation, not a list of git commands"
    },
    {
      "id": 83,
      "level": "intermediate",
      "q": "status checks?",
      "a": "Status checks are robot reports attached to a commit on a PR.\nBranch protection can refuse merge until required checks are green.\nIn the code:\ncommit_c12.checks has unit-tests green and lint red. can_merge is false because lint is red. The stamp stays locked.\nA common mistake is merging from the command line to skip a red check. Protection exists because red meant something.",
      "code": "// the review form reads robot reports on a photo\ncommit_c12.checks = [\n  { name: \"unit-tests\", result: \"green\" },\n  { name: \"lint\",       result: \"red\" }\n];\ncan_merge = protection.required_checks.every(n => is_green(n));\n// lint is red, so the stamp stays locked"
    },
    {
      "id": 84,
      "level": "beginner",
      "q": "CODEOWNERS?",
      "a": "CODEOWNERS is a file that maps paths to people who should review changes.\nA PR that touches billing can auto-request Ada and Bob. It is routing, not Git physics.\nIn the code:\n/docs/ maps to @docs-team. /src/billing/ maps to @ada @bob. A PR that edits src/billing/tax.js asks Ada and Bob.\nA common mistake is putting a team that nobody watches, then thinking CODEOWNERS replaced real review.",
      "code": "# CODEOWNERS is a routing table for reviews\n# path                  who should stamp\n/docs/                  @docs-team\n/src/billing/           @ada @bob\n# a PR that edits src/billing/tax.js asks Ada and Bob"
    },
    {
      "id": 85,
      "level": "intermediate",
      "q": "draft PR?",
      "a": "A draft PR is the same form with a WIP sign. Review and merge rules often wait until you mark it ready.\nYou can still push commits. You are saying 'not for stamp yet.'\nIn the code:\npr.state is draft, review_required false. Then state becomes ready and the stamp process starts.\nA common mistake is leaving a PR in draft forever while people think the work is not ready to look at.",
      "code": "// the same form, two moods\npr = {\n  from: \"login\",\n  into: \"main\",\n  state: \"draft\",          // WIP sign on the folder\n  review_required: false   // until you mark it ready\n};\npr.state = \"ready\";        // now the stamp process starts"
    },
    {
      "id": 86,
      "level": "intermediate",
      "q": "fork workflow: sync with upstream?",
      "a": "Fork workflow: your origin is your copy. upstream is the original project. You fetch upstream, update your main, then branch from today.\nA PR into upstream is then a small gap, not a year of drift.\nIn the code:\nupstream.main is c90. origin.main is c70, behind. After copy, origin.main is c90. feature branches from c90.\nA common mistake is opening a PR from a fork that is months behind, so the diff includes unrelated upstream commits.",
      "code": "// two albums you must keep related\nupstream = { main: \"c90\" };          // original project\norigin   = { main: \"c70\" };          // your fork, behind\n\n// after you copy upstream main into your idea of main\norigin.main = \"c90\";\nfeature     = branch_from(\"c90\");    // new work starts from today\n// now a PR into upstream is a small, honest gap"
    },
    {
      "id": 87,
      "level": "intermediate",
      "q": "git worktree?",
      "a": "A worktree is a second working directory that shares the same .git attic.\nYou can have feature files on one desk and hotfix files on another, without stashing.\nIn the code:\nattic has photos including c9 and c12. desk_a is feature at c12. desk_b is hotfix at c9. No coat-pocket stash needed to jump.\nA common mistake is checking out the same branch in two worktrees. Git usually refuses; each branch can be checked out once.",
      "code": "// one attic, two desks\nattic = { photos: [\"c1\", \"c2\", \"c9\", \"c12\"] };\ndesk_a = { HEAD: \"feature\", files: files_of(\"c12\") };\ndesk_b = { HEAD: \"hotfix\",  files: files_of(\"c9\") };\n// no coat-pocket stash needed to jump; you walk to the other table"
    },
    {
      "id": 88,
      "level": "advanced",
      "q": "rerere?",
      "a": "rerere means reuse recorded resolution. Git remembers how you resolved a conflict and can apply the same mix next time.\nHelpful when you rebase the same clash over and over.\nIn the code:\nconflict_fingerprint is the same two hunks in app.js. recorded_resolution is Welcome Ada and Bob. next_time_same_clash reapplies that mix.\nA common mistake is trusting rerere blindly after the surrounding code changed. Read the result.",
      "code": "// a saved answer for a repeated clash\nconflict_fingerprint = \"same two hunks in app.js\";\nrecorded_resolution = { \"app.js\": \"title = Welcome Ada and Bob\" };\n\nnext_time_same_clash = recorded_resolution;\n// Git reapplies the saved mix instead of making you retype it"
    },
    {
      "id": 89,
      "level": "advanced",
      "q": "octopus merge?",
      "a": "An octopus merge is a commit with more than two parents, joining several branches at once.\nNormal merges have two parents. Octopus is rare and hard to reason about if any conflict appears.\nIn the code:\nnormal cM has parents main and feature. octopus cO has parents main, a, b, c. Four parents, a rare family meeting.\nA common mistake is octopus-merging instead of merging one branch at a time when conflicts are likely.",
      "code": "// two-parent (normal) vs many-parent (octopus)\nnormal  = { id: \"cM\", parents: [\"main\", \"feature\"] };\noctopus = { id: \"cO\", parents: [\"main\", \"a\", \"b\", \"c\"] };\n// cO has four parents — a rare family meeting, not a daily tool"
    },
    {
      "id": 90,
      "level": "intermediate",
      "q": "ours vs theirs in conflicts?",
      "a": "ours and theirs swap meaning between merge and rebase.\nDuring merge, ours is the branch you are on. During rebase, ours is the new base, and theirs is the commit being replayed. That swap surprises people.\nIn the code:\nduring_merge ours is main's version, theirs is feature's. during_rebase ours is the new base (main), theirs is the commit being replayed.\nA common mistake is memorizing 'theirs is always the other branch.' Read the conflict markers for this operation.",
      "code": "// merge: you are on main, bringing feature\nduring_merge = {\n  ours:   \"main's version\",\n  theirs: \"feature's version\"\n};\n\n// rebase: you are replaying YOUR commits onto updated main\nduring_rebase = {\n  ours:   \"the new base (main) — easy to mix up!\",\n  theirs: \"the commit being replayed\"\n};\n// read the markers; do not memorize one mapping forever"
    },
    {
      "id": 91,
      "level": "intermediate",
      "q": "git clean?",
      "a": "git clean deletes untracked files from the working tree. It does not change commits.\nIf those files were never committed, Git cannot restore them. Look first, often with a dry run.\nIn the code:\ndesk has tracked app.js plus untracked debug.log and tmp/. after_clean only has app.js. The album never had the extras, so it cannot restore them.\nA common mistake is clean -fdx and wiping a local .env you still needed.",
      "code": "// clean targets the desk, not the album\ndesk = { \"app.js\": \"tracked\", \"debug.log\": \"untracked\", \"tmp/\": \"untracked dir\" };\nalbum_last = { \"app.js\": \"...\" };\n\nafter_clean = { \"app.js\": \"tracked\" };\n// debug.log and tmp/ are gone from the table\n// the album never had them, so it cannot restore them"
    },
    {
      "id": 92,
      "level": "beginner",
      "q": "How do you rename a branch?",
      "a": "Renaming a branch only changes the sticker text. The commits stay the same.\nIf the old name was on the remote, you publish the new name and delete the old remote name.\nIn the code:\nbefore sticker is loginFix at c12. after is fix-login at c12. online still had loginFix until you publish the new name. c12 did not change.\nA common mistake is renaming locally and leaving the old name on origin, so two names point at the same work.",
      "code": "// same photos, new sticker text\nbefore = { stickers: { loginFix: \"c12\" } };\nafter  = { stickers: { fix-login: \"c12\" } };\n\nonline = { loginFix: \"c12\" };\n// after publishing: online has fix-login, and loginFix can be removed\n// c12 did not change"
    },
    {
      "id": 93,
      "level": "beginner",
      "q": "How do you delete a branch?",
      "a": "Deleting a branch removes the name, not automatically every commit.\nIf main's merge still parents those commits, they stay reachable. If nothing points at them, they may become dangling.\nIn the code:\nstickers had main c10 and login c12. delete stickers.login. reachable_from_main is a walk from c10. c12 may still exist via a merge parent, or dangle.\nA common mistake is deleting a branch before merging, then having no name for that work. reflog may still help.",
      "code": "// removing a name is not shredding the attic\nstickers = { main: \"c10\", login: \"c12\" };\ndelete stickers.login;\n\nreachable_from_main = walk(\"c10\");\n// c12 may still exist if main's merge photo parents include it\n// or it may become dangling if nothing points there"
    },
    {
      "id": 94,
      "level": "intermediate",
      "q": "recover a deleted branch?",
      "a": "You recover a deleted branch by pointing a name at the old tip commit again.\nreflog or a GitHub PR often still lists the sha. Recreating the bookmark does not revive uncommitted files.\nIn the code:\nreflog_hint says c12 was login's tip. github_pr last_sha is c12. stickers.login = c12 restores the name on the same page.\nA common mistake is recovering the branch but not the uncommitted desk files. Those were never in c12.",
      "code": "// the sticker is gone, the photo id may still be known\nreflog_hint = \"c12 was login's tip\";\ngithub_pr   = { branch: \"login\", last_sha: \"c12\" };\n\nstickers.login = \"c12\";   // name restored\n// you recreated the bookmark on the same page"
    },
    {
      "id": 95,
      "level": "intermediate",
      "q": "git config levels?",
      "a": "Git config has three layers: system, global (your user), and local (this repo). The closest wins.\nuser.email in the repo overrides your global email for commits here.\nIn the code:\nsystem editor vi, global user.name Nitin and a mail email, local user.email company email. effective_email is the company one. Photos in this album stamp that email.\nA common mistake is committing with a personal email to a work repo because no local override was set.",
      "code": "// three layers; the closest wins\nconfig = {\n  system: { editor: \"vi\" },\n  global: { \"user.name\": \"Nitin\", \"user.email\": \"you@mail.com\" },\n  local:  { \"user.email\": \"you@company.com\" }  // this repo overrides\n};\neffective_email = \"you@company.com\";\n// photos in this album will stamp the company email"
    },
    {
      "id": 96,
      "level": "beginner",
      "q": "Why do line endings break diffs?",
      "a": "Line endings are extra invisible bytes: LF versus CRLF.\nThe text looks the same to you. Git sees different bytes, so the whole file looks changed.\nIn the code:\nunix_line is hello plus \\n. windows_line is hello plus \\r\\n. diff_looks_like the entire file changed. .gitattributes can say store LF in the album.\nA common mistake is 'fixing' a one-line change and committing 4000 line-ending flips.",
      "code": "// same sentence, two invisible endings\nunix_line    = \"hello\" + \"\\n\";      // LF\nwindows_line = \"hello\" + \"\\r\\n\";   // CRLF\n\ndiff_looks_like = \"the entire file changed\";\n// humans see \"hello\" both times; Git sees different bytes\n// .gitattributes can say: store LF in the album"
    },
    {
      "id": 97,
      "level": "intermediate",
      "q": ".gitattributes?",
      "a": ".gitattributes is a committed rules file for how paths are treated: text vs binary, line endings, generated-file hints.\nIt travels with the project, like a code style guide for Git.\nIn the code:\ntext=auto normalizes text line endings in the album. *.png is binary so Git does not pretend images are text. dist/** is marked generated.\nA common mistake is only setting core.autocrlf on one laptop. Teammates still fight. Put the rule in .gitattributes.",
      "code": "# committed rules for how paths are treated\n# *           text=auto     # normalize text line endings in the album\n# *.png       binary        # do not pretend images are text\n# dist/**     linguist-generated\n# this file is part of the project, like a code style guide"
    },
    {
      "id": 98,
      "level": "advanced",
      "q": "hooks?",
      "a": "Hooks are scripts Git runs at events, such as before a commit.\nA pre-commit hook can stop a snapshot if a secret or lint failure is in the basket. Hooks in .git/hooks are local unless the team installs them for everyone.\nIn the code:\nhooks.pre-commit stops if basket has .env or lint fails. The alarm is on YOUR attic door unless the team installs it for everyone.\nA common mistake is believing a hook you have locally also runs on a teammate's machine. It does not, unless shared.",
      "code": "// a local alarm before a photo is taken\nhooks = {\n  \"pre-commit\": function () {\n    if (basket_has_secret(\".env\")) return \"stop\";\n    if (lint_fails()) return \"stop\";\n    return \"ok\";\n  }\n};\n// this alarm is on YOUR attic door unless the team installs it for everyone"
    },
    {
      "id": 99,
      "level": "intermediate",
      "q": "pre-commit for lint?",
      "a": "A pre-commit lint hook checks the staged files before Git creates a commit.\nIf lint fails, no commit is written. You fix the file, stage again, then commit.\nIn the code:\nbasket has app.js with const x=1. pre_commit runs lint only on basket paths, result missing semicolon. photo_created is false. The album stays unchanged.\nA common mistake is fixing the file but forgetting to add it again, so the next commit still has the old staged bytes.",
      "code": "// the envelope is checked before it becomes a photo\nbasket = { \"app.js\": \"const x=1\" };\n\npre_commit = {\n  run: \"lint only paths in the basket\",\n  result: \"error: missing semicolon\"\n};\nphoto_created = false;   // the album stays unchanged\n// fix the file, put it in the basket again, then the photo can happen"
    },
    {
      "id": 100,
      "level": "advanced",
      "q": "How do you explain Git in an interview?",
      "a": "In an interview, explain Git as a graph of snapshots, not as a command list.\nA commit is a photo with parent arrows. A branch is a sticker. HEAD is you are here. A remote is a nickname for another album. A PR asks to copy a sticker after review. Undo: restore files, reset a sticker, revert with a new photo, reflog as a local camera.\nIn the code:\nmodel.commit is a photo with parent arrows. branch is a sticker. HEAD is you are here. remote is a nickname. pr is please copy my sticker. undo lists restore, reset, revert, reflog.\nA common mistake is reciting git add git commit git push with no model. Interviewers want the graph.",
      "code": "// a one-minute map you can talk through\nmodel = {\n  commit: \"a photo with parent arrows (a graph, not a folder)\",\n  branch: \"a sticker on a photo\",\n  HEAD: \"you are here\",\n  remote: \"a nickname for another album\",\n  pr: \"please copy my sticker into yours after review\",\n  undo: { restore: \"files\", reset: \"sticker\", revert: \"new photo\", reflog: \"local camera\" }\n};"
    }
  ]
};
