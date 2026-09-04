window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA["hosting"] = {
  "kind": "design",
  "notes": [
    {
      "title": "What 'deploy' means",
      "layers": [
        [
          {
            "label": "GitHub"
          }
        ],
        [
          {
            "label": "Vercel / Render / Netlify",
            "tone": "edge"
          }
        ],
        [
          {
            "label": "Live HTTPS URL"
          }
        ]
      ],
      "flow": [
        "Push",
        "Build",
        "CDN or VM",
        "https://your.app"
      ],
      "body": "The problem before\nThe app runs only on your laptop. A friend cannot open it. An interviewer cannot click a link. You think the next step is renting a raw Linux box.\n\nWhat this is\nDeploy means other people can open your app on the internet. Platforms such as Vercel, Render, Netlify, and Railway watch a GitHub repo, run npm run build, and give you an HTTPS URL. You start by connecting Git, not by renting a VM.\n\nWhat it solves\nA git push becomes a live URL. Reviewers and interviewers click that URL. You skip sysadmin work until you actually need a VPS.\n\nReal-life example\nA project on a USB stick is only yours. Pinning it on the school notice board is deploy: anyone in the corridor can read it. The host reprints the board when you update the file in Git.\n\nUses\nAny portfolio app. Interview opener: \"I push to GitHub, the host builds, I get https.\"\n\nWatch out\nCalling localhost a deploy. Renting EC2 before you have a URL. Forgetting that the platform must see the repo."
    },
    {
      "title": "Vercel",
      "layers": [
        [
          {
            "label": "Browser"
          }
        ],
        [
          {
            "label": "Vercel Edge / CDN",
            "tone": "edge"
          }
        ],
        [
          {
            "label": "Static + Serverless functions"
          }
        ]
      ],
      "flow": [
        "git push",
        "Vercel build",
        "Preview URL",
        "Production domain"
      ],
      "body": "The problem before\nYou want a frontend live, but you do not want to run Nginx. Pull requests have no URL. You try to keep a long-lived Express process on a frontend host.\n\nWhat this is\nVercel is built for frontend and Next.js. Every pull request gets a preview URL. Static files go to a CDN; API routes become serverless functions. You set environment variables in the dashboard.\n\nWhat it solves\nGit push becomes a preview and a production domain. Static files are fast at the edge. You do not babysit a VM for a React or Next app.\n\nReal-life example\nA classroom printer that reprints the poster for every draft. Each PR is a new poster on the wall. The final copy hangs on the main board. There is no clerk sitting at a desk all night unless you add functions.\n\nUses\nVite/React, Next.js, marketing sites. Interview: \"preview URL on every PR.\"\n\nWatch out\nNo long-lived Express unless you host that API elsewhere. Cold starts on functions. A key that exists only in Production will be missing on a preview deploy."
    },
    {
      "title": "Render",
      "layers": [
        [
          {
            "label": "Browser"
          }
        ],
        [
          {
            "label": "Render load balancer",
            "tone": "edge"
          }
        ],
        [
          {
            "label": "Web service (Node)",
            "tone": "stateless"
          },
          {
            "label": "Postgres",
            "tone": "store"
          },
          {
            "label": "Redis",
            "tone": "store"
          }
        ]
      ],
      "flow": [
        "Push",
        "Docker or build command",
        "Always-on process",
        "Health check"
      ],
      "body": "The problem before\nVercel will not keep your Express process awake. You need Postgres and Redis next to a Node server. Free hosting that sleeps surprises your live demo.\n\nWhat this is\nRender runs a real process — closer to a VPS than Vercel. A Web Service can be npm start on the port Render sets (PORT). You can add managed Postgres and Redis. Background Workers run queues.\n\nWhat it solves\nAn always-on API with a database in one dashboard. You get a health check and a public URL. Paid services stay up; free ones spin down after idle time.\n\nReal-life example\nA shop that keeps the shutter open all day (paid) versus a stall that packs up after lunch (free). The first customer after lunch waits while you unlock. Health check is the manager peeking if the lights are on.\n\nUses\nExpress APIs, workers, Postgres, Redis. Interview: \"process, not only serverless.\"\n\nWatch out\nFree web services sleep; the first request is slow. Listen on process.env.PORT, not hardcoded 3000. Health checks fail if you bind the wrong port."
    },
    {
      "title": "Netlify and Cloudflare Pages",
      "body": "The problem before\nYou have a static site or SPA and you overpay for a VM. Client routes 404 on refresh. You try to run a WebSocket server on a static host.\n\nWhat this is\nNetlify is like Vercel for static sites and JAMstack functions. Cloudflare Pages puts static assets on Cloudflare's edge. Both connect to Git. Use them for marketing sites and SPAs.\n\nWhat it solves\nA fast CDN URL from a git push. Optional functions for small APIs. SPA redirects send /login back to index.html so refresh does not 404.\n\nReal-life example\nA printed brochure on every street corner (CDN). The brochure cannot run a phone switchboard. A live chat desk needs a real shop — Render or a VPS.\n\nUses\nDocs, portfolios, SPAs. Interview: \"static on the edge.\"\n\nWatch out\nA long-running WebSocket server does not belong here. Missing SPA redirect → refresh 404. Expecting a Node process to stay running."
    },
    {
      "title": "Railway, Fly.io, and a VPS",
      "body": "The problem before\nPlatforms feel like magic and you cannot explain them. Or you jump to a VPS and drown in Nginx on week one. You cannot name when you would leave the platform.\n\nWhat this is\nRailway is Git-to-container with add-on databases — similar to Render. Fly.io runs your image close to users. A VPS (DigitalOcean, Lightsail, EC2) means you install Nginx, Node, and TLS yourself.\n\nWhat it solves\nPlatforms are faster to start. A VPS teaches Nginx and costs less at a predictable size. Fly puts the box nearer to the student in another city.\n\nReal-life example\nA managed canteen (Railway/Render) versus renting the kitchen and buying your own stove (VPS). Fly is opening a stall in the next neighbourhood so the dosa is still hot.\n\nUses\nWhen you outgrow hobby hosts, need a region, or want to learn Nginx. Interview: \"I started on a platform; I know what a VPS would add.\"\n\nWatch out\nCopying .env into a Docker image. No firewall on a VPS. Leaving a database publicly open."
    },
    {
      "title": "Environment variables",
      "flow": [
        "Dashboard secret",
        "Build or runtime env",
        "process.env.DATABASE_URL"
      ],
      "body": "The problem before\nDATABASE_URL sits in the repo. Preview deploys miss the key that exists only in Production. You change a secret and wonder why the old one still runs.\n\nWhat this is\nNever put DATABASE_URL or API keys in the repo. Set them in Vercel / Render / Netlify env settings. Vercel has Production, Preview, and Development scopes. Restart or redeploy after you change env vars.\n\nWhat it solves\nSecrets stay out of Git. Each environment can have its own database. The running process reads process.env at boot.\n\nReal-life example\nThe shop safe combination is not written on the menu. The manager whispers it to the morning shift. A trainee shift (preview) does not get the production safe unless you hand them a separate key.\n\nUses\nEvery hosted app. Interview: \"secrets in the dashboard, never in Git.\"\n\nWatch out\nA private key with NEXT_PUBLIC_ or VITE_. Preview missing Production-only vars. Forgetting to redeploy after a change."
    },
    {
      "title": "Frontend on Vercel, API on Render",
      "layers": [
        [
          {
            "label": "React on Vercel",
            "tone": "edge"
          }
        ],
        [
          {
            "label": "API on Render",
            "tone": "stateless"
          }
        ],
        [
          {
            "label": "Postgres + Redis",
            "tone": "store"
          }
        ]
      ],
      "flow": [
        "Browser",
        "Vercel static",
        "fetch api.example.com",
        "Render",
        "DB"
      ],
      "body": "The problem before\nOne host cannot do both jobs well. Cookies and CORS break after you leave localhost. You think split hosting is wrong architecture.\n\nWhat this is\nA common student setup: Vite/React on Vercel, Express on Render, Postgres on Render. You must set CORS on the API and use the real HTTPS origin. Cookies need SameSite and a shared parent domain, or you use tokens.\n\nWhat it solves\nThe UI is fast on a CDN. The API is an always-on process with a database. Interviewers understand this split.\n\nReal-life example\nThe shop window display (Vercel) and the back-office till (Render). The window must know the till's address. The till must let in that window, not every stranger on the street (CORS).\n\nUses\nMERN and Vite portfolios. Interview: \"UI here, API there, DB there.\"\n\nWatch out\nCORS origin left as localhost. Mixed content (HTTPS page calling HTTP API). origin: '*' with cookies."
    },
    {
      "title": "Build versus start",
      "body": "The problem before\nYou run vite in production. Render returns 502 because you listen on 3000. You cannot say what npm run build actually produces.\n\nWhat this is\nBuild is npm run build — it creates files (dist or .next). Start is npm start — it runs the server. Vercel mostly cares about build output. Render needs both a build command and a start command for a Node API.\n\nWhat it solves\nStatic hosts get a folder to ship. Process hosts get a command that binds the platform port. You stop mixing the homework compile with the shop opening hours.\n\nReal-life example\nBaking the biscuits (build) versus opening the counter (start). Vercel mostly wants the biscuits in a box. Render wants the baker standing at the counter on the door they chose.\n\nUses\nRender web services, any Node API. Interview: \"build artifacts vs start process.\"\n\nWatch out\nstart: vite in production. listen(3000) instead of process.env.PORT. Building the wrong folder in a monorepo."
    },
    {
      "title": "Custom domains and TLS",
      "body": "The problem before\nYour live URL is a random *.vercel.app. DNS points at an old IP. You commit the preview URL as the only production address.\n\nWhat this is\nAdd example.com in the dashboard. Point DNS (A or CNAME) where the docs say. The platform issues a certificate. Preview URLs stay on *.vercel.app or *.onrender.com.\n\nWhat it solves\nA name people can remember. HTTPS without running certbot. Previews stay separate from the real domain.\n\nReal-life example\nThe shop's printed street address versus a temporary stall number at the fair. Customers should get the street name. The stall number is for the inspector during a PR.\n\nUses\nAny public product. Interview: \"custom domain + managed TLS.\"\n\nWatch out\nAn A record to an old IP after you switched hosts. Huge TTL so a change takes a day. Using only the platform subdomain in the README when you have a real domain."
    },
    {
      "title": "What to say in an interview",
      "body": "The problem before\nYou say \"I used the cloud\" and cannot name where the UI, API, and database live. You hide free-tier sleep. The interviewer cannot picture the system.\n\nWhat this is\nName where the UI lives, where the API lives, where the database lives, and how secrets are injected. Say \"preview deploy on every PR\" if you use Vercel. Say \"process spun down on the free tier\" if you use Render free.\n\nWhat it solves\nHonesty scores higher than fog. They can follow the arrows. You sound like you shipped, not like you copied a logo.\n\nReal-life example\nA shop tour: window, till, storeroom, and who holds the safe key. You do not say \"we have a mall.\" You point at each room.\n\nUses\nEvery hosting question. Portfolio README in one sentence.\n\nWatch out\nVague \"AWS/cloud.\" Hiding cold starts. A localhost-only project with no URL."
    }
  ],
  "examples": [
    {
      "title": "Vercel: React or Next from GitHub",
      "lang": "flow",
      "layers": [
        [
          {
            "label": "GitHub"
          }
        ],
        [
          {
            "label": "Vercel build",
            "tone": "edge"
          }
        ],
        [
          {
            "label": "CDN + functions"
          }
        ]
      ],
      "flow": [
        "Import repo",
        "Framework preset",
        "Build",
        "Preview URL"
      ],
      "desc": "Definition. Connect the repo. Vercel detects Vite or Next, runs the build, and hosts the output.\n\nHow it works. Each branch or PR gets a URL. Production tracks main.\n\nOperational risk. A NEXT_PUBLIC_ secret that actually needed to stay server-only.",
      "code": "// next.config or Vite — public env must be prefixed\n// Next: NEXT_PUBLIC_API_URL=https://api.example.com\n// Vite: VITE_API_URL=https://api.example.com\n\nconst api = import.meta.env.VITE_API_URL;\nfetch(api + \"/health\");"
    },
    {
      "title": "Render: Express web service",
      "lang": "js",
      "layers": [
        [
          {
            "label": "Render"
          }
        ],
        [
          {
            "label": "Node process",
            "tone": "stateless"
          }
        ],
        [
          {
            "label": "Postgres",
            "tone": "store"
          }
        ]
      ],
      "flow": [
        "Build npm install",
        "Start npm start",
        "PORT from env",
        "Health /"
      ],
      "desc": "Definition. Render starts a long-lived Node process.\n\nHow it works. Listen on process.env.PORT. Add a health route. Attach DATABASE_URL from a Render Postgres.\n\nOperational risk. listen(3000) instead of process.env.PORT.",
      "code": "const port = process.env.PORT || 3000;\napp.get(\"/health\", (_req, res) => res.json({ ok: true }));\napp.listen(port, () => console.log(\"up\", port));"
    },
    {
      "title": "Split frontend and API",
      "lang": "flow",
      "layers": [
        [
          {
            "label": "Vercel UI",
            "tone": "edge"
          }
        ],
        [
          {
            "label": "Render API",
            "tone": "stateless"
          }
        ]
      ],
      "flow": [
        "User",
        "static app",
        "HTTPS fetch",
        "API CORS allow"
      ],
      "desc": "Definition. Two hosts, one product.\n\nHow it works. Set CORS origin to the Vercel domain. Put the API URL in VITE_API_URL.\n\nOperational risk. CORS origin localhost left in production.",
      "code": "app.use(cors({\n  origin: process.env.WEB_ORIGIN, // https://app.vercel.app\n  credentials: true\n}));"
    },
    {
      "title": "Netlify static + redirects",
      "lang": "flow",
      "flow": [
        "Build dist",
        "Publish folder",
        "SPA redirect /* → /index.html"
      ],
      "desc": "Definition. Netlify hosts the folder. A _redirects or netlify.toml file sends client routes to index.html.\n\nHow it works. Same idea as Nginx try_files.\n\nOperational risk. Refresh on /login 404s because the redirect rule is missing.",
      "code": "# public/_redirects\n/*    /index.html   200"
    },
    {
      "title": "Render Redis + API",
      "lang": "js",
      "flow": [
        "API boot",
        "REDIS_URL",
        "connect",
        "GET/SET"
      ],
      "desc": "Definition. Create a Redis instance on Render. Copy the internal URL into the web service env.\n\nHow it works. Same ioredis code as local; only the URL changes.\n\nOperational risk. Using the external Redis URL from inside the same region when the internal URL is faster and private.",
      "code": "const Redis = require(\"ioredis\");\nconst redis = new Redis(process.env.REDIS_URL);"
    },
    {
      "title": "Vercel serverless function",
      "lang": "js",
      "desc": "Definition. A file in /api becomes an HTTPS function.\n\nHow it works. Export a handler. No long-lived memory between invokes (treat each call as new).\n\nOperational risk. Writing to the local disk and expecting the file to be there next time.",
      "code": "// api/hello.js  (Vercel)\nexport default function handler(req, res) {\n  res.status(200).json({ ok: true, at: Date.now() });\n}"
    },
    {
      "title": "Free Render spin-down",
      "lang": "flow",
      "flow": [
        "Idle 15 min",
        "Sleep",
        "Next request",
        "Cold boot 30–60s"
      ],
      "desc": "Definition. Free web services stop when idle.\n\nHow it works. The next visitor waits for a new process.\n\nOperational risk. A demo that looks 'down' in an interview because nobody hit it for an hour. Mention the free-tier sleep, or use a paid instance."
    },
    {
      "title": "Custom domain",
      "lang": "flow",
      "flow": [
        "Add domain",
        "CNAME to platform",
        "Certificate issued",
        "HTTPS works"
      ],
      "desc": "Definition. Your name, their servers.\n\nHow it works. Follow the exact DNS record the dashboard shows. Wait for TLS.\n\nOperational risk. An A record to an old IP after you switched hosts."
    }
  ],
  "questions": [
    {
      "id": 1,
      "level": "beginner",
      "q": "What is Vercel?",
      "a": "Definition. Vercel is a hosting platform for frontends and Next.js. Git push becomes a live HTTPS URL.\n\nHow it works. Build on their servers, static on a CDN, functions for server code.\n\nOperational risk. Running a 24/7 WebSocket server only on Vercel hobby functions."
    },
    {
      "id": 2,
      "level": "beginner",
      "q": "What is Render?",
      "a": "Definition. Render hosts web services, workers, Postgres, and Redis from Git.\n\nHow it works. A long-lived process (or Docker image) plus a public URL.\n\nOperational risk. Free tier sleep that surprises a live demo."
    },
    {
      "id": 3,
      "level": "beginner",
      "q": "What is the difference between Vercel and Render?",
      "a": "Definition. Vercel is edge/static/serverless-first. Render is process-first, like a managed VPS.\n\nHow it works. Next.js UI → Vercel. Always-on Express + Postgres → Render.\n\nOperational risk. Forcing Express onto Vercel serverless without changing how you store uploads."
    },
    {
      "id": 4,
      "level": "beginner",
      "q": "What is Netlify?",
      "a": "Definition. Netlify hosts static sites and functions, similar to Vercel for JAMstack.\n\nHow it works. Git connect, build, CDN, optional redirects.\n\nOperational risk. No SPA redirect, so client routes 404."
    },
    {
      "id": 5,
      "level": "beginner",
      "q": "What is a preview deployment?",
      "a": "Definition. A unique URL for a pull request or branch.\n\nHow it works. Reviewers click the URL instead of pulling the branch.\n\nOperational risk. Preview talking to the production database."
    },
    {
      "id": 6,
      "level": "beginner",
      "q": "Where do secrets go?",
      "a": "Definition. In the platform environment variables, never in Git.\n\nHow it works. process.env.SECRET at runtime. NEXT_PUBLIC_ / VITE_ for values the browser may see.\n\nOperational risk. A private key with a NEXT_PUBLIC_ prefix."
    },
    {
      "id": 7,
      "level": "intermediate",
      "q": "Why must Render listen on process.env.PORT?",
      "a": "Definition. The platform picks the port and health-checks it.\n\nHow it works. const port = process.env.PORT || 3000.\n\nOperational risk. Hardcoded 3000 → deploy 'live' but 502."
    },
    {
      "id": 8,
      "level": "intermediate",
      "q": "What is a cold start?",
      "a": "Definition. The first request after idle must boot a function or a slept service.\n\nHow it works. Vercel functions and free Render both can be cold.\n\nOperational risk. A 10-second first paint you did not mention in a demo."
    },
    {
      "id": 9,
      "level": "intermediate",
      "q": "How do you connect React on Vercel to an API on Render?",
      "a": "Definition. The browser calls the Render HTTPS URL. CORS must allow the Vercel origin.\n\nHow it works. VITE_API_URL and cors({ origin: WEB_ORIGIN }).\n\nOperational risk. Mixed content (HTTPS page calling HTTP API)."
    },
    {
      "id": 10,
      "level": "intermediate",
      "q": "Build command versus start command?",
      "a": "Definition. Build creates artifacts. Start runs the server.\n\nHow it works. Vercel: mostly build. Render web service: both.\n\nOperational risk. start: vite (dev server) in production."
    },
    {
      "id": 11,
      "level": "beginner",
      "q": "What is Railway?",
      "a": "Definition. Another Git-to-container host with plugins for Postgres and Redis.\n\nHow it works. Similar mental model to Render.\n\nOperational risk. Leaving a database publicly open."
    },
    {
      "id": 12,
      "level": "beginner",
      "q": "What is Cloudflare Pages?",
      "a": "Definition. Static hosting on Cloudflare's edge, usually free and fast for files.\n\nHow it works. Git integration or wrangler upload.\n\nOperational risk. Expecting a Node process to stay running there."
    },
    {
      "id": 13,
      "level": "intermediate",
      "q": "When do you still need a VPS and Nginx?",
      "a": "Definition. When you need a long-lived custom process, special ports, or cheaper predictable VMs.\n\nHow it works. Ubuntu + Nginx + Node + certbot, or Docker Compose.\n\nOperational risk. No backups and no firewall."
    },
    {
      "id": 14,
      "level": "intermediate",
      "q": "What does NEXT_PUBLIC_ mean?",
      "a": "Definition. Next.js inlines that variable into the browser bundle.\n\nHow it works. Anyone can read it in DevTools.\n\nOperational risk. Database passwords in NEXT_PUBLIC_."
    },
    {
      "id": 15,
      "level": "advanced",
      "q": "How do serverless functions differ from a Render web service?",
      "a": "Definition. Functions start per request (or burst) and have time and size limits. A web service is one process that stays up.\n\nHow it works. No in-memory job queue across invokes on functions.\n\nOperational risk. setInterval inside a function that dies when the invoke ends."
    },
    {
      "id": 16,
      "level": "beginner",
      "q": "What is a custom domain?",
      "a": "Definition. Your name (preplace.dev) pointed at the platform.\n\nHow it works. DNS CNAME or A, then a managed certificate.\n\nOperational risk. TTL so high that a host change takes a day."
    },
    {
      "id": 17,
      "level": "intermediate",
      "q": "How do you run migrations on Render?",
      "a": "Definition. A release command or a one-off job that runs npm run migrate before or after deploy.\n\nHow it works. Migrations must be backward compatible if old and new code overlap.\n\nOperational risk. A migrate that drops a column the old process still reads."
    },
    {
      "id": 18,
      "level": "intermediate",
      "q": "What is a Render background worker?",
      "a": "Definition. A process that does not take HTTP; it consumes a queue.\n\nHow it works. Same repo, different start command.\n\nOperational risk. Doing heavy work inside the web request instead."
    },
    {
      "id": 19,
      "level": "beginner",
      "q": "How do you see why a deploy failed?",
      "a": "Definition. Open the platform build log. The error is usually npm, env, or PORT.\n\nHow it works. Fix, push, watch the new build.\n\nOperational risk. Only testing on localhost after a red deploy."
    },
    {
      "id": 20,
      "level": "advanced",
      "q": "How do you keep preview deploys from touching prod data?",
      "a": "Definition. Separate DATABASE_URL and Redis for preview, or a shared staging database.\n\nHow it works. Vercel Preview env group. Render PR instances if you use them.\n\nOperational risk. One Mongo URI for every branch."
    },
    {
      "id": 21,
      "level": "intermediate",
      "q": "Can you use Redis on Vercel?",
      "a": "Definition. Yes, via a hosted Redis (Upstash is common) because functions cannot keep a local Redis.\n\nHow it works. REDIS_URL in env. Short-lived connections.\n\nOperational risk. A local Redis on your laptop that preview functions cannot reach."
    },
    {
      "id": 22,
      "level": "beginner",
      "q": "What is a monorepo deploy?",
      "a": "Definition. One Git repo with apps/web and apps/api. Each platform root directory points at a folder.\n\nHow it works. Vercel Root Directory = apps/web. Render Root Directory = apps/api.\n\nOperational risk. Building the wrong folder."
    },
    {
      "id": 23,
      "level": "intermediate",
      "q": "What is ISR or static regeneration on Vercel?",
      "a": "Definition. Next.js can reuse a static page and refresh it in the background.\n\nHow it works. Good for marketing pages. Not for per-user inboxes.\n\nOperational risk. Caching a personalized page as static."
    },
    {
      "id": 24,
      "level": "beginner",
      "q": "What should you put in a portfolio README about hosting?",
      "a": "Definition. Live URL, repo, and one sentence: UI on Vercel, API on Render, data on Postgres, cache on Redis.\n\nHow it works. Interviewers click the URL first.\n\nOperational risk. A localhost-only project with no URL."
    },
    {
      "id": 25,
      "level": "advanced",
      "q": "How do you roll back?",
      "a": "Definition. Platforms keep old deployments. Instant rollback points production at a previous build.\n\nHow it works. Click rollback or redeploy a git SHA.\n\nOperational risk. A forward-only database migration that the old build cannot run."
    },
    {
      "id": 26,
      "level": "intermediate",
      "q": "Why does CORS appear after you deploy?",
      "a": "Definition. The UI origin changed from localhost:5173 to https://app.vercel.app.\n\nHow it works. Allow that origin on the API.\n\nOperational risk. origin: '*' with cookies."
    },
    {
      "id": 27,
      "level": "beginner",
      "q": "What is a health check on Render?",
      "a": "Definition. Render GETs a path to decide if the service is up.\n\nHow it works. /health returns 200 quickly without a heavy DB join.\n\nOperational risk. Health = migrate + warm every cache."
    },
    {
      "id": 28,
      "level": "intermediate",
      "q": "Docker on Render versus build command?",
      "a": "Definition. You can give a Dockerfile or let Render run install + start.\n\nHow it works. Docker matches production closer to your laptop Compose.\n\nOperational risk. A Dockerfile that still listens on 3000 only."
    },
    {
      "id": 29,
      "level": "beginner",
      "q": "What is Fly.io in one sentence?",
      "a": "Definition. You ship a container and Fly runs it in regions you pick.\n\nHow it works. Closer to users than one US VM.\n\nOperational risk. One region still dies if you never add a second."
    },
    {
      "id": 30,
      "level": "advanced",
      "q": "How would you move from Render to a VPS later?",
      "a": "Definition. Same Node app, you add Nginx, TLS, systemd or Docker, and managed Postgres/Redis or install them.\n\nHow it works. DNS switches when Nginx is healthy.\n\nOperational risk. Copying .env into the image."
    }
  ]
};
