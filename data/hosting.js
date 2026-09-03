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
      "body": "Deploy means other people can open your app on the internet. On your laptop only you can. Platforms such as Vercel, Render, Netlify, and Railway watch a GitHub repo, run npm run build, and give you an HTTPS URL. You do not start by renting a raw VM. You start by connecting Git."
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
      "body": "Vercel is built for frontend and Next.js. Every pull request gets a preview URL. Static files go to a CDN. API routes and server components become serverless functions. You set environment variables in the dashboard. There is no long-lived Express process unless you use a different host for that API. Cold starts exist on functions."
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
      "body": "Render runs a real process — closer to a VPS than Vercel. A Web Service can be npm start on port 10000 (Render sets PORT). You can add a managed Postgres and Redis. Background Workers run queues. Free web services spin down after idle time; the first request is slow. Paid services stay up."
    },
    {
      "title": "Netlify and Cloudflare Pages",
      "body": "Netlify is like Vercel for static sites and JAMstack functions. Cloudflare Pages puts static assets on Cloudflare's edge. Both connect to Git. Use them for marketing sites and SPAs. A long-running WebSocket server does not belong here; use Render, a VPS, or a dedicated socket host."
    },
    {
      "title": "Railway, Fly.io, and a VPS",
      "body": "Railway is Git-to-container with add-on databases — similar to Render. Fly.io runs your image close to users. A VPS (DigitalOcean, Lightsail, EC2) means you install Nginx, Node, and TLS yourself. Platforms are faster to start. A VPS teaches Nginx and costs less at a predictable size."
    },
    {
      "title": "Environment variables",
      "flow": [
        "Dashboard secret",
        "Build or runtime env",
        "process.env.DATABASE_URL"
      ],
      "body": "Never put DATABASE_URL or API keys in the repo. Set them in Vercel / Render / Netlify env settings. Remember: Vercel has Production, Preview, and Development scopes. A key that exists only in Production will be missing on a preview deploy. Restart or redeploy after you change env vars."
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
      "body": "A common student setup: Vite/React on Vercel, Express on Render, Postgres on Render. You must set CORS on the API and use the real HTTPS origin. Cookies need SameSite and a shared parent domain or you use tokens. This split is normal and interviewers understand it."
    },
    {
      "title": "Build versus start",
      "body": "Build is npm run build — it creates files (dist or .next). Start is npm start — it runs the server. Vercel mostly cares about build output. Render needs both a build command and a start command for a Node API. If start binds to a hardcoded 3000 instead of process.env.PORT, Render health checks fail."
    },
    {
      "title": "Custom domains and TLS",
      "body": "Add example.com in the dashboard. Point DNS (A or CNAME) where the docs say. The platform issues a certificate. Preview URLs stay on *.vercel.app or *.onrender.com. Do not commit those as the only production URL if you have a real domain."
    },
    {
      "title": "What to say in an interview",
      "body": "Name where the UI lives, where the API lives, where the database lives, and how secrets are injected. Say 'preview deploy on every PR' if you use Vercel. Say 'process spun down on the free tier' if you use Render free. That honesty scores higher than 'I used the cloud'."
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
