window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA["practice-devops"] = {
  "kind": "practice",
  "notes": [
    {
      "title": "Most asked",
      "body": "After the hands-on labs, open questions tagged Most asked. Those are the interview questions Amazon, Google, Meta, and Microsoft repeat. Same easy comments on the right of the code."
    },
    {
      "title": "How to use this lab",
      "body": "Ship the todo API: Docker, Nginx HTTPS, a pipeline. Comments sit on the right."
    },
    {
      "title": "HTTPS",
      "body": "Certbot or a platform certificate. Redirect 80 to 443. App stays on localhost:3000."
    },
    {
      "title": "Build order",
      "body": "Dockerfile → compose with db → Nginx TLS → GitHub Actions test → deploy."
    }
  ],
  "examples": [
    {
      "title": "Dockerfile for the API",
      "lang": "txt",
      "desc": "Install, copy, listen.",
      "code": "FROM node:22-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --omit=dev\nCOPY . .\nCMD [\"node\", \"server.js\"]"
    },
    {
      "title": "Compose API + Postgres",
      "lang": "txt",
      "desc": "App waits on DATABASE_URL.",
      "code": "services:\n  api:\n    build: .\n    ports: [\"3000:3000\"]\n    environment:\n      DATABASE_URL: postgres://app:app@db:5432/app\n  db:\n    image: postgres:16\n    environment:\n      POSTGRES_PASSWORD: app"
    },
    {
      "title": "Nginx HTTPS",
      "lang": "txt",
      "desc": "TLS in, HTTP to Node.",
      "code": "server {\n  listen 443 ssl;\n  ssl_certificate /etc/letsencrypt/live/ex/fullchain.pem;\n  ssl_certificate_key /etc/letsencrypt/live/ex/privkey.pem;\n  location / { proxy_pass http://127.0.0.1:3000; }\n}"
    },
    {
      "title": "GitHub Actions test",
      "lang": "txt",
      "desc": "npm test on every push.",
      "code": "on: [push]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm ci && npm test"
    },
    {
      "title": "Health for compose",
      "lang": "txt",
      "desc": "depends_on + healthcheck.",
      "code": "healthcheck:\n  test: [\"CMD\", \"curl\", \"-f\", \"http://localhost:3000/health\"]\n  interval: 10s"
    },
    {
      "title": "Secrets stay out of Git",
      "lang": "txt",
      "desc": "Env file not committed.",
      "code": "echo DATABASE_URL=postgres://... >> .env\necho .env >> .gitignore"
    },
    {
      "title": "Redirect HTTP",
      "lang": "txt",
      "desc": "80 → 443.",
      "code": "server { listen 80; return 301 https://$host$request_uri; }"
    },
    {
      "title": "Staging basic auth",
      "lang": "txt",
      "desc": "Keep strangers off a public staging host.",
      "code": "location / {\n  auth_basic \"staging\";\n  auth_basic_user_file /etc/nginx/.htpasswd;\n  proxy_pass http://127.0.0.1:3000;\n}"
    }
  ],
  "questions": [
    {
      "id": 1,
      "level": "beginner",
      "q": "Practice: Dockerize the todo API",
      "a": "FROM node, COPY, CMD node server.js.",
      "code": "FROM node:22-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --omit=dev\nCOPY . .\nCMD [\"node\",\"server.js\"]"
    },
    {
      "id": 2,
      "level": "beginner",
      "q": "Practice: /health",
      "a": "Return 200 { ok: true }.",
      "code": "app.get(\"/health\", function (req, res) {\n  res.json({ ok: true });  // host pings this\n});"
    },
    {
      "id": 3,
      "level": "intermediate",
      "q": "Practice: compose with Postgres",
      "a": "DATABASE_URL uses host db.",
      "code": "DATABASE_URL=postgres://app:app@db:5432/app"
    },
    {
      "id": 4,
      "level": "intermediate",
      "q": "Practice: Nginx TLS for the API",
      "a": "listen 443 ssl; proxy_pass 3000.",
      "code": "location / { proxy_pass http://127.0.0.1:3000; }"
    },
    {
      "id": 5,
      "level": "beginner",
      "q": "Practice: HTTP to HTTPS redirect",
      "a": "return 301 https://$host$request_uri.",
      "code": "server { listen 80; return 301 https://$host$request_uri; }"
    },
    {
      "id": 6,
      "level": "intermediate",
      "q": "Practice: CI that runs tests",
      "a": "GitHub Actions npm test.",
      "code": "- run: npm ci && npm test"
    },
    {
      "id": 7,
      "level": "intermediate",
      "q": "Practice: do not leak .env",
      "a": ".gitignore and no secrets in the image.",
      "code": ".env"
    },
    {
      "id": 8,
      "level": "advanced",
      "q": "Practice: rolling deploy idea",
      "a": "Wait /health, switch Nginx, stop old.",
      "code": "# wait until curl -f https://host/health"
    },
    {
      "id": 9,
      "level": "beginner",
      "q": "Practice: log without passwords",
      "a": "Log user id, not req.body.password.",
      "code": "console.log(\"login\", { userId: user.id });  // never the password"
    },
    {
      "id": 10,
      "level": "intermediate",
      "q": "Practice: staging lock",
      "a": "htpasswd in front of staging.",
      "code": "auth_basic \"staging\";"
    },
    {
      "id": 11,
      "level": "advanced",
      "q": "Practice: image tags",
      "a": "Deploy :gitsha not only :latest.",
      "code": "docker build -t api:$GITHUB_SHA ."
    },
    {
      "id": 12,
      "level": "beginner",
      "q": "Why HTTPS on the todo login?",
      "a": "TLS stops the password sitting in clear text.",
      "code": "listen 443 ssl;"
    },
    {
      "id": 13,
      "level": "intermediate",
      "q": "Practice: multi-stage image",
      "a": "Build with devDeps, run without them.",
      "code": "FROM node:22-alpine AS run\nCOPY --from=build /app /app"
    },
    {
      "id": 14,
      "level": "intermediate",
      "q": "Practice: compose down volumes",
      "a": "-v wipes the database volume.",
      "code": "docker compose down"
    },
    {
      "id": 15,
      "level": "beginner",
      "q": "Practice: pin base images",
      "a": "node:22-alpine not node:latest.",
      "code": "FROM node:22-alpine"
    },
    {
      "id": 16,
      "level": "advanced",
      "q": "Practice: cert renewal",
      "a": "certbot renew + nginx reload.",
      "code": "certbot renew --quiet && nginx -s reload"
    },
    {
      "id": 17,
      "level": "intermediate",
      "q": "Practice: fail CI on lint",
      "a": "npm run lint must exit non-zero.",
      "code": "\"lint\": \"eslint .\""
    },
    {
      "id": 18,
      "level": "beginner",
      "q": "Practice: expose only 443",
      "a": "Do not publish 3000 to the world.",
      "code": "ports: [\"127.0.0.1:3000:3000\"]"
    },
    {
      "id": 19,
      "level": "beginner",
      "q": "CI vs CD?",
      "a": "CI (continuous integration) runs tests on every push. CD (continuous delivery/deploy) ships a passing build to a host. CI without CD still helps. CD without tests is just a fast way to break production.",
      "code": "on: [push]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - run: npm ci && npm test",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 20,
      "level": "beginner",
      "q": "Container vs virtual machine?",
      "a": "A VM virtualizes hardware and runs a full OS. A container shares the host kernel and packages the app + libs. Containers start faster and pack denser. You still need an OS underneath (the host or a VM).",
      "code": "FROM node:22-alpine  # image\n# docker run  →  container (one process, usually)",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 21,
      "level": "beginner",
      "q": "Image vs container?",
      "a": "An image is the recipe (layers, read-only). A container is a running instance of that image. You build an image, you run a container. Many containers can share one image.",
      "code": "docker build -t api:1 .\ndocker run -p 3000:3000 api:1",
      "ask": "Most asked · Amazon · Microsoft"
    },
    {
      "id": 22,
      "level": "intermediate",
      "q": "Blue-green vs rolling deploy?",
      "a": "Blue-green: two full environments, switch traffic at once, easy rollback. Rolling: replace instances a few at a time, needs less hardware, rollback is slower. Both need a health check.",
      "code": "# wait until curl -f https://host/health\n# then point Nginx at the new box",
      "ask": "Most asked · Amazon · Google · Netflix"
    },
    {
      "id": 23,
      "level": "beginner",
      "q": "Why a health check?",
      "a": "A cheap URL that says the process can serve traffic. Load balancers and orchestrators stop sending work to a box that fails /health. It should check the app, not only 'Node is up' if the DB is required.",
      "code": "app.get(\"/health\", async function (req, res) {\n  await db.query(\"SELECT 1\");\n  res.json({ ok: true });\n});",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 24,
      "level": "intermediate",
      "q": "How do you handle secrets in CI?",
      "a": "GitHub Actions secrets / a vault. Inject as env at runtime. Never echo them. Never bake .env into a public image. Rotate if they leaked.",
      "code": "env:\n  DATABASE_URL: ${{ secrets.DATABASE_URL }}",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 25,
      "level": "intermediate",
      "q": "What is Infrastructure as Code?",
      "a": "The server layout lives in Git (Terraform, Bicep, CloudFormation) so you can review and repeat it. Clicking in a console does not scale and cannot be reviewed.",
      "code": "# terraform apply  — the VPC is in Git, not only in the console",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 26,
      "level": "beginner",
      "q": "What is a reverse proxy?",
      "a": "The problem before\nNode sat on the street on port 3000. HTTPS and routing lived in the app. Anyone could knock on the kitchen door.\n\nWhat this is\nNginx (or Caddy, or an ALB) is the front desk. Clients hit 443. The proxy terminates TLS and forwards to Node on 3000.\n\nWhat it solves\nThe world never talks to Node. One public door, hidden app ports, HTTPS in one place.\n\nReal-life example\nA hotel receptionist. You ask for room 12. You do not wander the staff corridors.\n\nUses\nTLS, static files, path routing, load-balance two processes.\n\nWatch out\nLeaving :3000 on 0.0.0.0 in production.",
      "code": "location / { proxy_pass http://127.0.0.1:3000; }",
      "ask": "Most asked · Amazon · Microsoft · Google"
    },
    {
      "id": 27,
      "level": "beginner",
      "q": "Why pin image and action versions?",
      "a": "node:latest and @v1 that floats can change under you. Pin node:22-alpine and a SHA or major version you tested. Reproducible builds are a feature.",
      "code": "FROM node:22-alpine\n# uses: actions/checkout@v4",
      "ask": "Most asked · Amazon · Google"
    },
    {
      "id": 28,
      "level": "intermediate",
      "q": "Logs, metrics, traces — what is each?",
      "a": "Logs are event lines (login failed). Metrics are numbers over time (p95 latency). Traces follow one request across services. You want a request id on all three.",
      "code": "console.log({ reqId, userId, event: \"login_ok\" });",
      "ask": "Most asked · Amazon · Google · Microsoft"
    }
  ]
};
