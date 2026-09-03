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
      "a": "The problem before\nThe factory shipped every weld without a gauge, then spent Friday nights on a laptop copying files into production. Another line tested forever and never loaded the truck. A third auto-deployed main with no tests, so a typo in login became everyone's outage before lunch. Nobody could say which commit was live.\nWhat this is\nCI, continuous integration, runs checks on every push: install, lint, unit tests, maybe a build. CD, continuous delivery or deploy, takes a passing artifact and ships it to a host, often staging then production. CI without CD still catches breaks. CD without tests is a fast conveyor into the dark. The same commit you tested is the one you ship.\nWhat it solves\nYou find breakage at the door, not in the guest book. You stop \"it worked on my machine\" as the release process. Interviewers want the split in one breath and an example pipeline: push, npm test, then deploy only if green.\nReal-life example\nA factory floor. Every batch hits the gauge and the stamp (CI). The truck leaves only with a green card (CD). Skipping the gauge ships cracks. Running the gauge and leaving pallets in the warehouse is safer than the cracks, but customers still wait. The card on the crate matches the batch you measured.\nUses\nGitHub Actions npm ci && npm test on push. Deploy to Render, a VM, or a cluster after the test job. Require reviews on main. Keep artifacts, not \"whatever is on the runner disk now\".\nWatch out\nFlaky CI that people skip with a retry cult. CD from a dirty laptop. Echoing secrets in logs. Deploying :latest you never tested. A pipeline that only runs on your branch. Treating a green lint as proof the API still boots. No rollback when CD succeeds and the app does not.",
      "code": "on: [push]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - run: npm ci && npm test",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 20,
      "level": "beginner",
      "q": "Container vs virtual machine?",
      "a": "The problem before\nThe shop bought a whole cottage for each app: a virtual machine with its own kernel, slow to boot, heavy to copy. Another team thought a container was a tiny VM and expected guest-kernel isolation. They piled privileges on the container and were surprised when it saw too much of the host. Words were used as twins.\nWhat this is\nA VM virtualizes hardware and runs a full operating system. A container shares the host kernel and packages the app plus libraries in an image. Containers start faster and pack denser. You still need an OS underneath: the host, or a VM that then runs the engine. Docker is a common way to build and run those containers.\nWhat it solves\nYou pack many APIs on one box without a full OS each. You carry the same image from a laptop to prod. You can say what is shared (kernel) and what is not (user space files, process tree, usually the network namespace). Isolation is strong enough for many shops, not a hypervisor story.\nReal-life example\nA hotel. A VM is a cottage with its own plumbing and fuse box. A container is a room that shares the building pipes and power. Rooms turn over in minutes. Cottages take a crew. If a room is on fire, you still hope the shared pipes were valved; a cottage fire stays in the cottage more cleanly.\nUses\nDockerize the todo API. Run many services with compose. Use VMs when you need a different kernel, a different OS, or isolation the compliance team named. Cloud VMs often host the container engine.\nWatch out\nPrivileged containers. Assuming VM-level isolation for hostile tenants. Huge images that copy the whole cottage into a room. Running sshd plus nginx plus node in one container like a mini VM. \"We use Docker so we are secure\" without user ids, scans, or a small base. Forgetting the host kernel is shared.",
      "code": "FROM node:22-alpine  # image\n# docker run  →  container (one process, usually)",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 21,
      "level": "beginner",
      "q": "Image vs container?",
      "a": "The problem before\nThe class used image and container as the same word. They edited files inside a running container, killed it, and wondered why the next run was clean. They tagged nothing, then could not say which recipe served traffic. docker ps and docker images were a blur on the whiteboard.\nWhat this is\nAn image is the recipe: stacked read-only layers plus a default command. A container is a running instance of that image with its own writable layer and process. You build an image, you run a container. Many containers can share one image. docker build -t api:1 . then docker run -p 3000:3000 api:1.\nWhat it solves\nRuns become reproducible. You scale copies from one recipe. You explain why \"it works in this container\" is not \"it is baked into the image\" unless you commit, which you should not treat as a workflow. Tags name the recipe you deploy.\nReal-life example\nA factory cookie cutter is the image. Cookies on the belt are containers. Icing one cookie does not change the cutter. If you want chocolate tomorrow, you change the cutter and stamp a new batch. Throwing a decorated cookie back into the steel is how people misuse docker commit.\nUses\nLocal run, compose replicas, Kubernetes pods that pull an image. Pin a tag or digest you tested. Store data in volumes, not in the container writable layer, if it must survive a replace.\nWatch out\ndocker commit as the build system. Mutable containers as the source of truth. Only :latest, which moves. Writing uploads into the container and then recreating it. Two images with the same tag on two hosts. Forgetting that stop and rm lose the writable layer. Confusing a Dockerfile with a running process.",
      "code": "docker build -t api:1 .\ndocker run -p 3000:3000 api:1",
      "ask": "Most asked · Amazon · Microsoft"
    },
    {
      "id": 22,
      "level": "intermediate",
      "q": "Blue-green vs rolling deploy?",
      "a": "The problem before\nThey swapped the live hotel while guests stood in the lift: one box off, one box on, five minutes of 502. Another crew upgraded rooms one by one with no health check, so half the floor returned 500 and nobody rolled back. The words blue-green and rolling were used for a copy-paste on a laptop.\nWhat this is\nBlue-green keeps two full environments. You deploy green, wait until it is healthy, switch traffic at the proxy, and keep blue for a fast rollback. Rolling replaces a few instances at a time behind the same pool. It needs less spare hardware. Rollback is slower because you roll forward again. Both need a health check before you call it done.\nWhat it solves\nYou ship without a long outage. You pick cost versus rollback speed out loud. You name the switch: Nginx, a load balancer, or a service target group. Interviewers want the health wait in the story, not only the colors.\nReal-life example\nA factory with two full lines and a chute you flip is blue-green: one line idle, one live, flip back if the new weld fails. Swapping machines one by one on a single line is rolling: cheaper floor space, mixed versions for a while, harder to undo in one pull of a lever.\nUses\nNginx cutover to a new port or host. Kubernetes rollingUpdate. Canary is a cousin that sends a slice of traffic first. Database migrations must run in a way both versions understand or you cannot overlap.\nWatch out\nA schema that the old box cannot read. No /health, so you switch blind. Sticky sessions that pin guests to a dying instance during a roll. Calling a single-VM copy-paste \"blue-green\". Draining connections too fast. Forgetting to turn off the old box so you pay twice forever.",
      "code": "# wait until curl -f https://host/health\n# then point Nginx at the new box",
      "ask": "Most asked · Amazon · Google · Netflix"
    },
    {
      "id": 23,
      "level": "beginner",
      "q": "Why a health check?",
      "a": "The problem before\nThe load balancer kept sending breakfast tickets to a dark kitchen. The process was \"up\" because Node still accepted a socket, but Postgres was gone and every real route 500ed. Another /health always returned 200 so deploys never waited. A third hid /health behind login, so the balancer decided every box was dead.\nWhat this is\nA health check is a cheap URL that answers whether this process can serve traffic. Orchestrators and load balancers stop sending work to a failing instance. If the app cannot work without the database, the check should touch it, like SELECT 1, with a tight timeout. Liveness and readiness are cousins: restart versus just stop routing.\nWhat it solves\nUnready instances get no guests. Deploys wait until green. You debug \"the box is up\" versus \"the box can take a todo\". Interviews want that split and a one-line handler.\nReal-life example\nA hotel asks \"is the kitchen lighting the pass?\" not only \"is the building still standing?\" A lit lobby with a dark pass still seats no dinners. The host stand that seats people into a dark pass is a load balancer that ignored health.\nUses\nCompose healthcheck, cloud load balancers, Kubernetes liveness and readiness, and your own rolling script that curls /health before flipping Nginx. Keep it fast. Return 200 with a small JSON body.\nWatch out\nA handler that always 200s. A liveness probe that hits a slow database and kills healthy pods. No timeout, so the probe hangs. Auth or a heavy migration on /health. Checking only disk space and ignoring the app. Using the same probe for \"restart me\" and \"wait to send traffic\" when those should differ.",
      "code": "app.get(\"/health\", async function (req, res) {\n  await db.query(\"SELECT 1\");\n  res.json({ ok: true });\n});",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 24,
      "level": "intermediate",
      "q": "How do you handle secrets in CI?",
      "a": "The problem before\nDATABASE_URL lived in the workflow YAML. A step echoed the key \"for debug\". Someone COPY .env into a public image. A screenshot of prod secrets sat in Slack. A fork pull request ran with the same secrets and a stranger printed them. Rotation never happened after the leak.\nWhat this is\nKeep secrets in GitHub Actions secrets or a vault. Inject them as env at runtime on the job or the host. Never echo them. Never bake .env into an image you push to a public registry. Restrict which jobs and which events can read them. If they leaked, rotate, then hunt the copies.\nWhat it solves\nThe repo can be shared; the vault cannot. CI can talk to the database or the registry without writing the password into Git history. You have a story for leak response, not only for storage.\nReal-life example\nA factory safe. The combination is not printed on the shift roster or the newsletter. Night crew receives the code at the door for that shift. If a copy shows up on the break-room fridge, you change the combination and check who still has a photo.\nUses\nDATABASE_URL, deploy SSH keys, npm tokens, Docker hub passwords, cloud roles. Use OIDC to the cloud when you can so you mint short credentials. Mask logs. Pass secrets into docker run -e, not into the Dockerfile.\nWatch out\nPull request CI from forks with write-level secrets. Logging process.env. Secrets inside uploaded artifacts. Long-lived personal tokens as \"the CI user\". The same prod secret in twenty repos. A default password in compose that someone left on a VPS. Thinking .gitignore alone undoes a secret you already pushed.",
      "code": "env:\n  DATABASE_URL: ${{ secrets.DATABASE_URL }}",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 25,
      "level": "intermediate",
      "q": "What is Infrastructure as Code?",
      "a": "The problem before\nSomeone clicked a VPC in the console until it worked. Six months later nobody could redraw it. Staging drifted: extra security groups, a manual DNS tweak. A fire drill could not rebuild the shop. The change that broke login lived only in a human memory and a weekend Slack.\nWhat this is\nInfrastructure as Code means the server layout lives in Git: Terraform, Bicep, CloudFormation, or similar. You review a diff, apply it, and can repeat the factory. The console is for reading and emergencies, not for the only copy of the truth. State records what you already created.\nWhat it solves\nTwo environments can match. A change is a pull request. Disaster recovery is \"apply\" plus data, not \"remember the clicks\". Interviews want why Git beats a wizard, and a word about state locking.\nReal-life example\nHotel blueprints in a numbered drawer, not \"we remember where the pipes went\". A second hotel can be built from the same sheets. A red-pen change on the blueprint is reviewed before the crew opens the wall. A pipe moved by a contractor with no drawing becomes next year's leak.\nUses\nVPC, IAM, DNS, clusters, queues, and the todo API's host. Run plan in CI, apply with approval on main. Keep modules small. Tag resources with the app name so the bill speaks.\nWatch out\nState files committed with secrets. Manual console drift you never import. apply from a laptop using an admin account. Secrets in tfvars that you add to Git. One giant root module nobody dares touch. Destroy from muscle memory. Assuming the file is truth when someone clicked anyway.",
      "code": "# terraform apply  — the VPC is in Git, not only in the console",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 26,
      "level": "beginner",
      "q": "What is a reverse proxy?",
      "a": "The problem before\nNode sat on the street on port 3000. HTTPS certificates and routing lived inside the app. Anyone who found the VPS could knock on the kitchen door and skip the lobby. Express grew homemade TLS, static files, and load balancing until the cook could not cook. Mixed content appeared when the UI was https and the API was the raw port.\nWhat this is\nA reverse proxy sits in front of the app. Nginx, Caddy, or a cloud load balancer is the front desk. Clients hit 443. The proxy terminates TLS and forwards HTTP to Node on 127.0.0.1:3000. It can serve static React files, redirect 80 to 443, and pick among two healthy processes. The world never speaks Node's dialect on the public port.\nWhat it solves\nOne public door, hidden app ports, HTTPS in one place. You scale or replace Node without teaching guests a new port. Cookies and redirects see https because you pass X-Forwarded-Proto. The API stays on localhost where a stranger cannot greet it.\nReal-life example\nA hotel receptionist. You ask for room 12. You do not wander the staff corridors or the kitchen pass. The desk knows who is working today and which lift to use. If a cook is off, the desk stops sending guests that way after a glance at the light on the board.\nUses\nTLS, HTTP to HTTPS, static files, path routing (/ versus /api), and balancing two Node processes. Local compose can still publish 3000 on a laptop; production binds the app to loopback and leaves 443 to the proxy.\nWatch out\nLeaving :3000 on 0.0.0.0 in production. Forgetting X-Forwarded-For and proto, so logs and Secure cookies lie. Buffering large uploads until they die. No timeouts, so a stuck proxy holds a guest forever. A proxy that trusts every Hop-by-hop header. Thinking the proxy replaces app auth.",
      "code": "location / { proxy_pass http://127.0.0.1:3000; }",
      "ask": "Most asked · Amazon · Microsoft · Google"
    },
    {
      "id": 27,
      "level": "beginner",
      "q": "Why pin image and action versions?",
      "a": "The problem before\nnode:latest moved on a Tuesday. The pipeline that was green on Monday pulled a new Node and failed in a way nobody changed. An action pinned to @v1 floated a breaking rewrite. A compose file said postgres:latest and a major jump ate the volume notes. \"It passed CI\" meant \"it passed yesterday's internet\".\nWhat this is\nPin the versions you tested. FROM node:22-alpine, not node:latest. Prefer a digest when you need the bits frozen. Pin GitHub Actions to a major you read, or to a SHA. Reproducible builds are a feature: the same Dockerfile plus lockfile should build the same story next month until you choose to upgrade.\nWhat it solves\nYesterday's image still exists tomorrow. Upgrades become a pull request, not a surprise. You can say what you trust: a lockfile, a tag you follow, a digest you verify. Interviews treat floating latest as a smell.\nReal-life example\nA factory orders the flour bag it tested in March, not \"whatever is on the dock this morning\". When they want a new mill, they schedule a trial batch. The dock still gets deliveries; the line does not change brand because a truck was convenient.\nUses\nBase images, action versions, compose tags, and npm lockfiles. Dependabot or Renovate can open upgrade PRs you actually run. Record the pin in the same commit that tested it. Use alpine or slim on purpose, not as a floating synonym for latest.\nWatch out\nFloating latest in prod. Ignoring bots forever so pins rot. Pinning a moving tag like :22 that still receives surprise rebuilds if you needed a digest. A private base image CI cannot pull. Copying a SHA you never built. Different pins on staging and prod with no note. \"We pin\" while the deploy script pulls latest anyway.",
      "code": "FROM node:22-alpine\n# uses: actions/checkout@v4",
      "ask": "Most asked · Amazon · Google"
    },
    {
      "id": 28,
      "level": "intermediate",
      "q": "Logs, metrics, traces — what is each?",
      "a": "The problem before\nThe outage had three chats. One person pasted a log line. One watched CPU. Nobody could follow one guest through three services. Passwords sat in the log file. Metrics had no request id. A trace tool was installed and sampled nothing, or sampled everything and the bill woke finance.\nWhat this is\nLogs are event lines: login failed, user id, request id. Metrics are numbers over time: p95 latency, error rate, queue depth. Traces follow one request across processes as spans. You stamp the same request id on all three so a guest, a spike, and a path through kitchens can be joined. Structured JSON logs beat poetry.\nWhat it solves\nYou find what happened, how bad, and where the time went. You stop grepping a novel during a page. Interviewers want one sentence each and the glue id. You also know what not to log.\nReal-life example\nA factory incident notebook is logs: what the night crew wrote. The belt speed gauge is metrics: numbers on the wall. A sticker that follows one box down the line is a trace. If the sticker number is also in the notebook and on the wall chart, the morning manager can replay one crate without walking every bay.\nUses\nlogin_ok and login_fail lines, RED metrics (rate, errors, duration), and OpenTelemetry spans through Express to SQL. Dashboards for p95. Alerts on error rate, not on every info line. Keep a request id middleware.\nWatch out\nLogging bodies, cookies, or passwords. High-cardinality labels like user id on every metric name, which explodes the time series. One hundred percent traces in prod without a budget. No correlation id. println debugging as the only log format. Metrics that say \"up\" while traces show every request waiting on one lock.",
      "code": "console.log({ reqId, userId, event: \"login_ok\" });",
      "ask": "Most asked · Amazon · Google · Microsoft"
    }
  ]
};
