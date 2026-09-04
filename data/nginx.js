window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA["nginx"] = {
  "kind": "design",
  "notes": [
    {
      "title": "What Nginx is",
      "layers": [
        [
          {
            "label": "Internet",
            "tone": "edge"
          }
        ],
        [
          {
            "label": "Nginx",
            "tone": "stateless"
          }
        ],
        [
          {
            "label": "Node :3000"
          },
          {
            "label": "Static files",
            "tone": "store"
          }
        ]
      ],
      "flow": [
        "Browser",
        "Nginx :80/:443",
        "Proxy or file",
        "Response"
      ],
      "body": "The problem before\nEach app was its own front door. Visitors had to hit localhost:3000. HTTPS, photos, and two apps on one domain all sat inside Node — a job Node is poor at.\n\nWhat this is\nNginx is a specialist front door: a web server and reverse proxy. It accepts 80/443 from the internet, can send HTML and images from disk, and can walk /api to your Node, Python, or Java app on localhost.\n\nWhat it solves\nThe world only talks to Nginx. Your code stays on 127.0.0.1:3000. One domain can host the React build and the API.\n\nReal-life example\nA mall has one main gate and many shops inside. Nginx is the gate. Express is one shop. Guests do not wander the service corridors.\n\nUses\nStatic sites, HTTPS, reverse proxy, load-balance two Node processes, send / to React and /api to FastAPI.\n\nWatch out\nPublishing Express :3000 on 0.0.0.0 without a proxy."
    },
    {
      "title": "Reverse proxy",
      "flow": [
        "Client",
        "Nginx",
        "proxy_pass http://127.0.0.1:3000",
        "App"
      ],
      "body": "The problem before\nYour app sat on the street: port 3000 open. Visitors needed that ugly port. HTTPS was hard. Two apps could not share one website name. Anyone could knock on the kitchen door.\n\nWhat this is\nA reverse proxy is a front desk the client did not pick. It takes the browser request and opens a second request to an internal server. The browser only talks to Nginx.\n\nWhat it solves\nGuests stay in the lobby (443). The desk walks them to room 12 (127.0.0.1:3000). You hide ports, add HTTPS, serve photos, and put two apps behind one name.\n\nReal-life example\nA hotel receptionist. You ask for room 12. You do not wander the staff corridors. Nginx is the receptionist. Express is room 12. proxy_pass is 'please take this guest to room 12'.\n\nUses\nHide :3000, terminate TLS, /api to Node and / to React, buffer slow clients, one domain for many apps.\n\nWatch out\nThe app sees Nginx as the client unless you forward X-Forwarded-For. Do not leave :3000 public."
    },
    {
      "title": "Static files versus the app",
      "body": "Let Nginx send /assets/*.js and images from a folder. Let the app handle /api. Static files do not need Node. try_files $uri /index.html is the usual single-page-app rule: if the file is missing, return index.html so React Router can run."
    },
    {
      "title": "TLS (HTTPS)",
      "flow": [
        "Client HTTPS",
        "Nginx certificate",
        "HTTP to app on localhost"
      ],
      "body": "Nginx terminates TLS: the certificate lives on Nginx. The app behind it can speak plain HTTP on 127.0.0.1. Let's Encrypt (certbot) issues free certificates. Redirect port 80 to 443 so users always get HTTPS."
    },
    {
      "title": "Load balancing",
      "layers": [
        [
          {
            "label": "Nginx upstream"
          }
        ],
        [
          {
            "label": "App :3001"
          },
          {
            "label": "App :3002"
          },
          {
            "label": "App :3003"
          }
        ]
      ],
      "flow": [
        "Request",
        "upstream pick",
        "Healthy app"
      ],
      "body": "An upstream block lists several app processes. Nginx picks one (round-robin by default). If a server fails the health idea (max_fails), it is skipped. This is how you run more than one Node process without Kubernetes."
    },
    {
      "title": "Headers the app must see",
      "body": "The app thinks the client is Nginx unless you pass the original IP and scheme. Set X-Forwarded-For, X-Forwarded-Proto, and Host. Express trust proxy must be on so secure cookies and logs are correct. Without this, rate limits see one IP (Nginx) and HTTPS apps think they are on HTTP."
    },
    {
      "title": "gzip, buffering, limits",
      "body": "gzip compresses text responses. client_max_body_size stops huge uploads. proxy_read_timeout stops a hung app from holding a worker forever. These knobs are why Nginx is used even when the app could listen on 443 itself."
    },
    {
      "title": "Common layouts",
      "body": "Laptop: Vite on 5173, no Nginx. VPS: Nginx → Node. Docker Compose: nginx container → api container. Kubernetes: Ingress is often Nginx. Vercel and Render hide this box; on a VPS you own it."
    }
  ],
  "examples": [
    {
      "title": "Proxy /api to Node",
      "lang": "nginx",
      "layers": [
        [
          {
            "label": "Browser"
          }
        ],
        [
          {
            "label": "Nginx :443",
            "tone": "edge"
          }
        ],
        [
          {
            "label": "Express :3000",
            "tone": "stateless"
          }
        ]
      ],
      "flow": [
        "GET /api/users",
        "Nginx",
        "127.0.0.1:3000",
        "JSON"
      ],
      "desc": "Definition. /api is forwarded. Everything else can be static files.\n\nHow it works. location /api/ { proxy_pass http://127.0.0.1:3000; } plus forwarded headers.\n\nOperational risk. Forgetting the trailing slash and doubling /api/api.",
      "code": "server {\n  listen 80;\n  server_name example.com;\n\n  location /api/ {\n    proxy_pass http://127.0.0.1:3000;\n    proxy_set_header Host $host;\n    proxy_set_header X-Real-IP $remote_addr;\n    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n    proxy_set_header X-Forwarded-Proto $scheme;\n  }\n}"
    },
    {
      "title": "Serve a React build",
      "lang": "nginx",
      "flow": [
        "GET /app/settings",
        "try_files",
        "index.html",
        "React router"
      ],
      "desc": "Definition. After npm run build, Nginx serves the dist folder.\n\nHow it works. try_files $uri $uri/ /index.html returns the SPA shell for client routes.\n\nOperational risk. Caching index.html for a year so users keep a dead app shell.",
      "code": "server {\n  listen 80;\n  root /var/www/app/dist;\n  index index.html;\n\n  location / {\n    try_files $uri $uri/ /index.html;\n  }\n}"
    },
    {
      "title": "Two Node processes",
      "lang": "nginx",
      "flow": [
        "Request",
        "upstream",
        "app1 or app2"
      ],
      "desc": "Definition. upstream names a pool. proxy_pass http://app; picks a member.\n\nHow it works. Round-robin by default. Add more listen ports or PM2 instances.\n\nOperational risk. Sticky sessions in the app when the next request hits the other process.",
      "code": "upstream app {\n  server 127.0.0.1:3001;\n  server 127.0.0.1:3002;\n}\n\nserver {\n  listen 80;\n  location / {\n    proxy_pass http://app;\n  }\n}"
    },
    {
      "title": "Force HTTPS",
      "lang": "nginx",
      "desc": "Definition. Port 80 only redirects. Port 443 serves the site with a certificate.\n\nHow it works. return 301 https://$host$request_uri;\n\nOperational risk. A redirect loop if the app also redirects and X-Forwarded-Proto is missing.",
      "code": "server {\n  listen 80;\n  server_name example.com;\n  return 301 https://$host$request_uri;\n}"
    }
  ],
  "questions": [
    {
      "id": 1,
      "level": "beginner",
      "q": "What is Nginx?",
      "a": "The problem before\nEach app was its own front door. TLS, static files, and routing all sat inside Node.\n\nWhat this is\nNginx is a web server and reverse proxy that sits in front of your app.\n\nWhat it solves\nIt accepts 80/443, serves files or proxy_pass to Node. Your code stays on localhost.\n\nReal-life example\nA mall gate. Many shops inside. Guests only use the gate.\n\nUses\nStatic sites, HTTPS, reverse proxy, load-balance two Node processes.\n\nWatch out\nPublishing Express :3000 on 0.0.0.0 without a proxy."
    },
    {
      "id": 2,
      "level": "beginner",
      "q": "What is a reverse proxy?",
      "a": "The problem before\nYour Node or FastAPI app sat on the street: port 3000 open to the whole internet. Visitors had to know that ugly port. HTTPS was hard. Two apps could not share one website name.\n\nWhat this is\nA reverse proxy is a front desk the client does not pick. It forwards to internal services. The browser only talks to Nginx.\n\nWhat it solves\nGuests stay in the lobby (443). The desk walks the request to the kitchen (127.0.0.1:3000). You hide ports, add HTTPS, and put two apps behind one domain.\n\nReal-life example\nA hotel: you ask the receptionist for room 12. You do not wander the staff corridors. Nginx is the receptionist. Express is room 12.\n\nUses\nHide app ports, add HTTPS, serve photos from disk, send /api to Node and / to React, put two apps behind one name.\n\nWhat happens\nBrowser → Nginx → 127.0.0.1:3000. proxy_pass is the line that sends the guest onward.\n\nWatch out\nThe app sees Nginx as the client unless you forward X-Forwarded-For. Do not leave :3000 public.",
      "flow": [
        "Browser",
        "Nginx",
        "App"
      ]
    },
    {
      "id": 3,
      "level": "beginner",
      "q": "Why not expose port 3000?",
      "a": "The problem before\nAnyone on the internet could knock on Node's kitchen door (:3000), skip HTTPS, and poke debug routes.\n\nWhat this is\nPort 3000 is a staff corridor. The public door should be 80/443 on Nginx.\n\nWhat it solves\nThe firewall only opens the lobby. Node listens on 127.0.0.1. Guests never learn the kitchen number.\n\nReal-life example\nA restaurant: diners use the front door. They do not walk into the kitchen through the alley.\n\nUses\nEvery production Node, FastAPI, or Django app behind Nginx or a cloud load balancer.\n\nWatch out\nA debug server left on 0.0.0.0:3000 in production."
    },
    {
      "id": 4,
      "level": "beginner",
      "q": "What is server_name?",
      "a": "Definition. The hostnames this server block answers, such as api.example.com.\n\nHow it works. Nginx picks the matching server block from the Host header.\n\nOperational risk. Two default servers and the wrong site appearing."
    },
    {
      "id": 5,
      "level": "beginner",
      "q": "What is location?",
      "a": "Definition. A location block matches a URL prefix or regex and decides what to do.\n\nHow it works. location /api/ proxies. location / serves files.\n\nOperational risk. A greedy location / catching /api before the API block."
    },
    {
      "id": 6,
      "level": "intermediate",
      "q": "What does proxy_pass do?",
      "a": "Definition. It forwards the request to another HTTP server.\n\nHow it works. URI joining depends on a trailing slash. Test /api and /api/.\n\nOperational risk. Double prefixes or stripped prefixes you did not expect."
    },
    {
      "id": 7,
      "level": "intermediate",
      "q": "How do you serve a React Router app?",
      "a": "Definition. Unknown paths must return index.html.\n\nHow it works. try_files $uri $uri/ /index.html;\n\nOperational risk. Nginx 404 on /settings so the SPA never loads."
    },
    {
      "id": 8,
      "level": "intermediate",
      "q": "How does Nginx terminate TLS?",
      "a": "Definition. The certificate is installed on Nginx. The browser speaks HTTPS only to Nginx.\n\nHow it works. listen 443 ssl; ssl_certificate ...; the app stays on HTTP localhost.\n\nOperational risk. Expired certificates with no renew cron."
    },
    {
      "id": 9,
      "level": "intermediate",
      "q": "What headers must you forward?",
      "a": "Definition. Host, X-Real-IP, X-Forwarded-For, X-Forwarded-Proto.\n\nHow it works. Express app.set('trust proxy', 1) so req.ip and secure cookies work.\n\nOperational risk. Secure cookies never set because the app thinks HTTP."
    },
    {
      "id": 10,
      "level": "intermediate",
      "q": "How do you load-balance two Node processes?",
      "a": "Definition. upstream { server ...; server ...; } then proxy_pass http://thatname;\n\nHow it works. Round-robin unless you set least_conn or ip_hash.\n\nOperational risk. ip_hash plus one dead process pins users to a corpse."
    },
    {
      "id": 11,
      "level": "beginner",
      "q": "What is the difference between Apache and Nginx?",
      "a": "Definition. Both are web servers. Nginx is event-driven and very common as a reverse proxy today.\n\nHow it works. Same job: files, TLS, proxy.\n\nOperational risk. Running both on port 80."
    },
    {
      "id": 12,
      "level": "intermediate",
      "q": "What is gzip in Nginx?",
      "a": "Definition. Nginx compresses text responses so they download smaller.\n\nHow it works. gzip on; gzip_types text/css application/json ...\n\nOperational risk. Compressing already-compressed images wastes CPU."
    },
    {
      "id": 13,
      "level": "intermediate",
      "q": "What is client_max_body_size?",
      "a": "Definition. The largest upload Nginx will accept.\n\nHow it works. Default is often 1m. File uploads need a higher value.\n\nOperational risk. A 413 that looks like an app bug."
    },
    {
      "id": 14,
      "level": "advanced",
      "q": "What is buffering?",
      "a": "Definition. Nginx can read the full request or response before sending it on.\n\nHow it works. Helps slow clients. Hurts SSE or big streaming unless you disable proxy_buffering.\n\nOperational risk. Chat streams that wait until the buffer fills."
    },
    {
      "id": 15,
      "level": "beginner",
      "q": "How do you reload config safely?",
      "a": "Definition. nginx -t tests the file. nginx -s reload applies it without dropping good connections the hard way.\n\nHow it works. Always test first.\n\nOperational risk. Restart instead of reload during peak."
    },
    {
      "id": 16,
      "level": "intermediate",
      "q": "Where do you put config on Ubuntu?",
      "a": "Definition. /etc/nginx/nginx.conf and files in sites-available linked into sites-enabled.\n\nHow it works. One file per site.\n\nOperational risk. Editing a file that is not enabled and wondering why nothing changed."
    },
    {
      "id": 17,
      "level": "advanced",
      "q": "How does Nginx fit with Docker?",
      "a": "Definition. An nginx container publishes 80/443 and proxy_pass to the api service name on the Docker network.\n\nHow it works. proxy_pass http://api:3000; using Compose DNS.\n\nOperational risk. proxy_pass to localhost inside the nginx container — that is the nginx container, not the host."
    },
    {
      "id": 18,
      "level": "beginner",
      "q": "Do Vercel and Render use Nginx?",
      "a": "Definition. You do not write Nginx on Vercel. You may still meet Nginx on a VPS, a VM, or Kubernetes Ingress.\n\nHow it works. Managed platforms run a proxy for you.\n\nOperational risk. Assuming every job is 'just Vercel' and never learning the VPS path."
    },
    {
      "id": 19,
      "level": "intermediate",
      "q": "What is a 502 Bad Gateway?",
      "a": "Definition. Nginx reached the app and the app did not give a valid response — often the app is down.\n\nHow it works. Check that Node is listening on the proxy_pass port.\n\nOperational risk. Restarting Nginx when the app crashed."
    },
    {
      "id": 20,
      "level": "intermediate",
      "q": "What is a 504 Gateway Timeout?",
      "a": "Definition. The app was too slow. Nginx gave up (proxy_read_timeout).\n\nHow it works. Raise timeout only after you fix the slow query.\n\nOperational risk. Hiding a 30-second SQL query by setting timeout 300."
    },
    {
      "id": 21,
      "level": "advanced",
      "q": "How do you rate-limit in Nginx?",
      "a": "Definition. limit_req_zone and limit_req use a key such as $binary_remote_addr.\n\nHow it works. Burst then 429 or delay.\n\nOperational risk. NAT offices sharing one IP."
    },
    {
      "id": 22,
      "level": "beginner",
      "q": "What is root versus alias?",
      "a": "Definition. root appends the full URI to the folder. alias replaces the location prefix.\n\nHow it works. Get this wrong and files 404.\n\nOperational risk. Serving the whole disk by a sloppy alias."
    },
    {
      "id": 23,
      "level": "intermediate",
      "q": "How do you hide Nginx version?",
      "a": "Definition. server_tokens off; stops the version in error pages and headers.\n\nHow it works. Slightly less information for scanners.\n\nOperational risk. Thinking this is your only security control."
    },
    {
      "id": 24,
      "level": "advanced",
      "q": "How do you do blue-green with Nginx?",
      "a": "Definition. Two upstreams (blue, green). Switch proxy_pass after the new color is healthy.\n\nHow it works. Reload Nginx to flip.\n\nOperational risk. Switching before health checks pass."
    },
    {
      "id": 25,
      "level": "beginner",
      "q": "What logs should you read?",
      "a": "Definition. access.log is every request. error.log is failures and config problems.\n\nHow it works. Status, time, and upstream address tell you if Nginx or the app failed.\n\nOperational risk. Only reading the Node console on a VPS."
    },
    {
      "id": 26,
      "level": "intermediate",
      "q": "How do you add WebSockets?",
      "a": "Definition. Upgrade the connection: proxy_http_version 1.1; Upgrade and Connection headers.\n\nHow it works. Chat and Vite HMR need this.\n\nOperational risk. 400 on WS because Upgrade was not forwarded."
    },
    {
      "id": 27,
      "level": "beginner",
      "q": "What is PM2 next to Nginx?",
      "a": "Definition. PM2 keeps Node processes alive. Nginx is the public HTTP door.\n\nHow it works. PM2 starts app.js on 3000. Nginx proxies to 3000.\n\nOperational risk. Using only PM2 expose 3000 to the world."
    },
    {
      "id": 28,
      "level": "advanced",
      "q": "How is Kubernetes Ingress related?",
      "a": "Definition. Many clusters use an Nginx Ingress Controller. The ideas are the same: host, path, TLS, backend service.\n\nHow it works. Ingress YAML instead of a server block.\n\nOperational risk. Learning only kubectl and never the HTTP path."
    }
  ]
};
