window.PREP_CAREERS = [
  {
    id: "frontend",
    title: "Frontend Developer",
    icon: "🖥️",
    blurb: "Build what people see and click: websites and web apps.",
    builds: "Landing pages, React apps, forms, dashboards.",
    time: "4–7 months",
    steps: [
      { topic: "htmlcss", learn: "HTML & CSS", why: "This is the page itself: text, layout, colors, mobile view." },
      { topic: "javascript", learn: "JavaScript", why: "Makes the page do things: clicks, lists, talking to a server." },
      { topic: "git", learn: "Git & GitHub", why: "Save your work and share it. Every job asks for this." },
      { topic: "react", learn: "React", why: "The common way to build real frontend apps in jobs." },
      { topic: "typescript", learn: "TypeScript", why: "JavaScript with types. Helps you make fewer mistakes." }
    ],
    extra: [
      "Browser DevTools (inspect, console, network)",
      "Responsive design (phone and laptop)",
      "Accessibility: labels, keyboard, contrast",
      "One project: a personal site + a small React app"
    ]
  },
  {
    id: "backend",
    title: "Backend Developer",
    icon: "🛠️",
    blurb: "Build the server, APIs, and database behind the app.",
    builds: "Login APIs, databases, admin tools, background jobs.",
    time: "5–8 months",
    steps: [
      { topic: "javascript", learn: "JavaScript", why: "Same language you will use in Node.js." },
      { topic: "git", learn: "Git & GitHub", why: "Work with a team and keep history." },
      { topic: "nodeexpress", learn: "Node.js & Express", why: "Create APIs: GET, POST, login, errors." },
      { topic: "sql", learn: "SQL & Databases", why: "Store users and data in tables. Most companies use SQL." },
      { topic: "mongodb", learn: "MongoDB", why: "A document database. Useful, and common in Node jobs." },
      { topic: "linux", learn: "Linux", why: "Servers run Linux. You need the terminal." },
      { topic: "docker", learn: "Docker", why: "Run the app the same way on every computer." }
    ],
    extra: [
      "HTTP status codes (200, 400, 401, 404, 500)",
      "Never put passwords in Git",
      "One project: a notes or todo API with login"
    ]
  },
  {
    id: "mern",
    title: "MERN Stack Developer",
    icon: "🟢",
    blurb: "MongoDB + Express + React + Node. One path for full web apps.",
    builds: "A complete app: React screen + Node API + MongoDB.",
    time: "6–9 months",
    steps: [
      { topic: "htmlcss", learn: "HTML & CSS", why: "You still need a real page, even in React." },
      { topic: "javascript", learn: "JavaScript", why: "Used in both React and Node. Learn this well." },
      { topic: "git", learn: "Git & GitHub", why: "Save frontend and backend in one repo." },
      { topic: "react", learn: "React", why: "The 'MERN' R. Build the user interface." },
      { topic: "nodeexpress", learn: "Node.js & Express", why: "The 'E' and 'N'. Build the API." },
      { topic: "mongodb", learn: "MongoDB", why: "The 'M'. Save users, posts, and lists." },
      { topic: "fullstack", learn: "Full Stack glue", why: "Connect React to Express: fetch, login, errors." }
    ],
    extra: [
      "Put frontend and backend in one project (or two folders)",
      "Learn CORS and why localhost:5173 cannot call :3000 without a proxy",
      "One project: blog or task app with signup"
    ]
  },
  {
    id: "fullstack",
    title: "Full Stack Developer",
    icon: "🧩",
    blurb: "Frontend + backend + a little deploy. You can ship a feature alone.",
    builds: "Whole products: UI, API, database, and a live URL.",
    time: "8–12 months",
    steps: [
      { topic: "htmlcss", learn: "HTML & CSS", why: "Start with the page." },
      { topic: "javascript", learn: "JavaScript", why: "Language for both sides of the stack." },
      { topic: "git", learn: "Git & GitHub", why: "Daily tool for every developer." },
      { topic: "react", learn: "React", why: "Frontend of most full stack job posts." },
      { topic: "typescript", learn: "TypeScript", why: "Used in serious full stack teams." },
      { topic: "nodeexpress", learn: "Node.js & Express", why: "Your API server." },
      { topic: "sql", learn: "SQL", why: "Main database in most companies." },
      { topic: "mongodb", learn: "MongoDB", why: "Know both SQL and a document store." },
      { topic: "fullstack", learn: "Full Stack", why: "Auth, REST, deploy ideas, end-to-end thinking." },
      { topic: "linux", learn: "Linux", why: "You will SSH or use a terminal on a server." },
      { topic: "docker", learn: "Docker", why: "Package the app for deploy." },
      { topic: "aws", learn: "AWS basics", why: "A common place to host the app." }
    ],
    extra: [
      "Build 2–3 full projects (not only tutorials)",
      "Learn to read errors from the browser Network tab and the server log",
      "Know the difference: frontend validation vs server validation"
    ]
  },
  {
    id: "ml",
    title: "ML Developer",
    icon: "🧠",
    blurb: "Teach computers from data: predictions, models, and Python.",
    builds: "Predict house price, classify email, simple recommenders.",
    time: "8–12 months",
    steps: [
      { topic: "python", learn: "Python", why: "The main language for machine learning." },
      { topic: "sql", learn: "SQL", why: "Most real data lives in tables. You must load it." },
      { topic: "machinelearning", learn: "Machine Learning", why: "Train, test, and judge a model without magic." },
      { topic: "git", learn: "Git & GitHub", why: "Save notebooks and scripts like any other code." },
      { topic: "linux", learn: "Linux", why: "Training often happens on a Linux machine." },
      { topic: "docker", learn: "Docker", why: "Share an environment so the model runs the same place." }
    ],
    extra: [
      "School math refresh: averages, graphs, a little probability",
      "Libraries you will meet: NumPy, pandas, scikit-learn",
      "One project: predict a number, one project: yes/no classification",
      "Later: neural nets (PyTorch or TensorFlow) after the basics"
    ]
  },
  {
    id: "devops",
    title: "DevOps Engineer",
    icon: "🔁",
    blurb: "Help code go from your laptop to production safely.",
    builds: "Pipelines, servers, containers, alerts.",
    time: "6–10 months",
    steps: [
      { topic: "linux", learn: "Linux", why: "You live in the terminal." },
      { topic: "git", learn: "Git & GitHub", why: "CI starts when you push code." },
      { topic: "docker", learn: "Docker", why: "The usual way to package an app." },
      { topic: "devops", learn: "DevOps / CI-CD", why: "Tests, builds, and deploys on every change." },
      { topic: "kubernetes", learn: "Kubernetes", why: "Run many containers in a cluster." },
      { topic: "aws", learn: "AWS", why: "Where those clusters and pipelines often live." }
    ],
    extra: [
      "Learn to read logs before you restart things",
      "Never store cloud keys in Git",
      "One project: GitHub Actions that tests and builds a Docker image"
    ]
  },
  {
    id: "cloud",
    title: "Cloud / AWS Developer",
    icon: "☁️",
    blurb: "Put apps on AWS: servers, files, databases, and access rules.",
    builds: "A site on S3 + CloudFront, or an API on EC2 / Lambda.",
    time: "5–8 months",
    steps: [
      { topic: "linux", learn: "Linux", why: "EC2 is a Linux computer." },
      { topic: "git", learn: "Git & GitHub", why: "You still ship code the normal way." },
      { topic: "javascript", learn: "JavaScript", why: "Useful for Lambda and many APIs." },
      { topic: "nodeexpress", learn: "Node.js & Express", why: "A simple app you can host." },
      { topic: "docker", learn: "Docker", why: "Same image on your PC and on AWS." },
      { topic: "aws", learn: "AWS", why: "EC2, S3, IAM, VPC, RDS — the core map." },
      { topic: "devops", learn: "DevOps", why: "Deploy with a pipeline, not only the console." }
    ],
    extra: [
      "Create a free-tier AWS account and turn on billing alarms",
      "Learn IAM first: who can do what",
      "One project: static site on S3, one project: API on EC2"
    ]
  },
  {
    id: "data",
    title: "Data Analyst",
    icon: "📊",
    blurb: "Turn tables into answers: SQL, a little Python, clear charts.",
    builds: "Reports, dashboards, 'why did sales drop?' notes.",
    time: "4–7 months",
    steps: [
      { topic: "sql", learn: "SQL", why: "Your main tool. Learn SELECT well." },
      { topic: "python", learn: "Python", why: "Clean files, quick charts, pandas later." },
      { topic: "machinelearning", learn: "ML basics", why: "Enough to know average vs a model. Not all of ML." },
      { topic: "git", learn: "Git", why: "Save your queries and notebooks." }
    ],
    extra: [
      "Excel or Google Sheets is still useful",
      "Learn to explain a number in one sentence",
      "One project: analyze a public CSV (sales, movies, or cricket)"
    ]
  },
  {
    id: "sde",
    title: "SDE / FAANG Interview",
    icon: "💼",
    blurb: "The DSA path MAANG and FAANG companies ask: arrays first, then graphs and DP.",
    builds: "You can explain brute → better → best, with time and space, for the most asked problems.",
    time: "3–6 months of daily practice",
    steps: [
      { topic: "dsa-arrays", learn: "Arrays", why: "Most first-round questions. Two pointers, prefix sums, hashing." },
      { topic: "dsa-strings", learn: "Strings", why: "Anagrams, sliding windows, and palindromes show up in every company." },
      { topic: "dsa-linkedlist", learn: "Linked List", why: "Reverse, cycle, and merge are warm-up questions at Amazon and Meta." },
      { topic: "dsa-stackheap", learn: "Stack, Queue & Heap", why: "Next greater, top-K, and sliding window max." },
      { topic: "dsa-tree", learn: "Trees", why: "DFS/BFS on binary trees. Google and Apple ask these a lot." },
      { topic: "dsa-graph", learn: "Graphs", why: "Islands, course schedule, and BFS shortest path." },
      { topic: "dsa-dp", learn: "Dynamic Programming", why: "The harder onsite round. Learn the pattern, not 200 random problems." }
    ],
    extra: [
      "Speak Big-O out loud before you code",
      "Always start with a brute idea, then improve it",
      "Practice on a whiteboard or empty file, not only LeetCode hints",
      "Do 1–2 problems a day. Re-solve old ones after a week",
      "Know one language well (JavaScript here; Java or Python is also fine in interviews)"
    ]
  }
];
