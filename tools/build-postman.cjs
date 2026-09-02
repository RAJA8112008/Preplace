"use strict";

const fs = require("fs");
const path = require("path");

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

const notes = [
  {
    title: "The problem before Postman",
    body: story({
      problem:
        "You tested the API only from the React page. A button hid the URL, the method, and the token. When the page failed you did not know if the kitchen was closed or the waiter wrote the order wrong.",
      what:
        "Postman is a separate window for talking to an API. You pick GET or POST, type the URL, add headers, send, and read the status plus JSON. The UI is not in the way.",
      solves:
        "You prove the kitchen works before you blame the dining room. Mobile, web, and a teammate can share the same saved orders (a collection).",
      example:
        "A restaurant counter that is not the dining hall. You walk up, say 'one dosa' (POST /orders), and see 201 plus the plate. If that fails, the waiter (React) is not the first suspect.",
      uses:
        "Hit localhost:3000, a staging URL, or a teammate's ngrok. Save login once, reuse the token. Export the same calls as curl for Slack or CI.",
      watch:
        "Postman is not a browser. CORS will not stop it. A green Postman send does not prove the React app on :5173 can call :3000."
    })
  },
  {
    title: "What Postman is",
    body: story({
      problem:
        "curl flags are easy to mistype. fetch lives inside the page. There was no shared menu of 'here are the real routes'.",
      what:
        "Postman is an HTTP client with a form: method, URL, params, headers, body, then Send. The reply is status, time, size, and the JSON body.",
      solves:
        "One place to try GET /todos, POST /todos, and GET /me with a Bearer token. You can save that as a collection and share it.",
      example:
        "A printed order pad. Line 1 is GET /todos. Line 2 is POST /todos. The kitchen stamp is 200 or 401.",
      uses:
        "Local APIs, interview take-homes, hand-off to QA, generating curl from a working request.",
      watch:
        "Saving a real production token inside a shared collection is a leak. Use environment variables."
    })
  },
  {
    title: "Collections and environments",
    body: story({
      problem:
        "Everyone had a different base URL in their head. Ada used localhost:3000. Bob used the live site. Tokens were pasted into every request by hand.",
      what:
        "A collection is a folder of saved requests. An environment is a box of names: {{baseUrl}}, {{token}}. The same GET {{baseUrl}}/todos works on laptop and staging.",
      solves:
        "Switch Local → Staging without rewriting twenty URLs. One login request can write {{token}} for the rest.",
      example:
        "A recipe card that says 'use the shop on this street'. You change the street (environment). The dishes (requests) stay the same.",
      uses:
        "Local / staging / prod. Team onboarding. Interview: 'here is the collection, try POST /login'.",
      watch:
        "A prod environment with a real key must not be committed. Postman can sync; treat it like .env."
    })
  },
  {
    title: "curl is the same idea",
    body: story({
      problem:
        "A teammate does not have Postman. CI cannot click Send. You needed the same request as text.",
      what:
        "curl is the terminal twin of Postman. Same method, URL, headers, and body. Postman can copy as curl. You can paste curl into Postman.",
      solves:
        "One command in a README or GitHub issue. A health check in a script. The same proof without a GUI.",
      example:
        "A paper order vs a phone call. 'One dosa' is the same dish. curl is the phone call. Postman is the paper pad.",
      uses:
        "README samples, CI, SSH on a server, interviews ('show me the curl').",
      watch:
        "A token in a curl you paste into Slack is still a leak. Prefer {{token}} and a private env."
    })
  },
  {
    title: "Other tools (same job)",
    body: story({
      problem:
        "People fight over the brand. The job is the same: send HTTP and read JSON.",
      what:
        "Insomnia and Hoppscotch are other windows like Postman. Thunder Client and REST Client live inside VS Code. Bruno stores the collection as files in Git. Swagger UI / OpenAPI is a live menu the API itself serves (often /docs).",
      solves:
        "You pick the window you already have. FastAPI /docs is a menu. Thunder Client is one click from the editor. Bruno is a folder you can review in a PR.",
      example:
        "Different counters, same kitchen. Dosa is still POST /orders.",
      uses:
        "VS Code: Thunder Client. Python API: Swagger. Team that wants Git: Bruno. Quick share: curl.",
      watch:
        "Learning twenty tools is not a skill. Method + URL + status + JSON is the skill."
    })
  },
  {
    title: "Auth in the request",
    body: story({
      problem:
        "The UI sent a cookie you never saw. Or the token sat in localStorage and you forgot to copy it. Every protected route looked 'broken'.",
      what:
        "APIs want proof on the request: Authorization: Bearer <jwt>, a cookie, or an API key header. Postman has an Authorization tab that writes that header for you.",
      solves:
        "You can call GET /me the same way the app does, without opening the browser.",
      example:
        "A cinema ticket shown at the door. No ticket → 401. Ticket for hall 2 while you walk into hall 1 → 403.",
      uses:
        "JWT APIs, API keys, Basic auth on old admin tools.",
      watch:
        "401 means 'who are you?'. 403 means 'I know you; you may not do this.' Do not mix them in an interview."
    })
  }
];

const examples = [
  {
    title: "GET list (Postman or curl)",
    lang: "txt",
    desc: story({
      problem: "You did not know if the API was even up.",
      what: "GET asks for a resource. No body. The answer is usually 200 plus a JSON array.",
      solves: "Prove the kitchen is open before you build the list page.",
      example: "Asking the clerk 'what todos exist?'",
      uses: "Any list screen. Health checks.",
      watch: "GET must not create or delete."
    }),
    code: `# Postman: method GET, URL {{baseUrl}}/todos, Send
# same request in the terminal:
curl http://localhost:3000/todos
# 200  [{"id":1,"title":"Milk"}]`
  },
  {
    title: "POST JSON create",
    lang: "txt",
    desc: story({
      problem: "A form did nothing. Was the body wrong, or the route missing?",
      what: "POST sends a new thing. Content-Type application/json. Body is the object.",
      solves: "You see 201 and the saved row, or 400 with the field that failed.",
      example: "Ordering one dosa: POST /orders { \"dish\": \"dosa\" }.",
      uses: "Signup, create todo, /predict.",
      watch: "A GET that creates is a bug. Empty body with the wrong parser → req.body undefined."
    }),
    code: `# Postman: POST {{baseUrl}}/todos
# Headers: Content-Type: application/json
# Body → raw → JSON:
# { "title": "Milk" }

curl -X POST http://localhost:3000/todos \\
  -H "Content-Type: application/json" \\
  -d "{\\"title\\":\\"Milk\\"}"
# 201  {"id":2,"title":"Milk"}`
  },
  {
    title: "Bearer token (login then /me)",
    lang: "txt",
    desc: story({
      problem: "/me returned 401 and the React page only said 'error'.",
      what: "Login returns a JWT. The next request sends Authorization: Bearer <token>.",
      solves: "You separate 'login is broken' from 'you forgot the header'.",
      example: "Show the cinema ticket at the next door.",
      uses: "Any protected route.",
      watch: "Do not put the token in the URL. It lands in logs and history."
    }),
    code: `# 1) POST {{baseUrl}}/login  { "email": "ada@test.com", "password": "secret" }
# Save the token into {{token}} (Tests tab: pm.environment.set("token", json.token))

curl -X POST http://localhost:3000/login \\
  -H "Content-Type: application/json" \\
  -d "{\\"email\\":\\"ada@test.com\\",\\"password\\":\\"secret\\"}"

# 2) GET {{baseUrl}}/me   Authorization: Bearer {{token}}
curl http://localhost:3000/me \\
  -H "Authorization: Bearer eyJhbGciOi..."
# 200  {"id":1,"email":"ada@test.com"}
# 401  missing or bad token`
  },
  {
    title: "Environment {{baseUrl}}",
    lang: "txt",
    desc: story({
      problem: "Twenty requests said localhost. Staging broke every URL.",
      what: "One name {{baseUrl}}. Local env is http://localhost:3000. Staging is https://api.example.com.",
      solves: "Switch the dropdown. The collection stays the same.",
      example: "A recipe that says 'use this shop'. Change the shop, not every dish.",
      uses: "Local, staging, prod. Team share.",
      watch: "Prod tokens in a shared cloud workspace."
    }),
    code: `# Postman environment
# baseUrl = http://localhost:3000
# token   = (empty until login)

# every request:
# GET {{baseUrl}}/todos
# Authorization: Bearer {{token}}

# curl with the same idea
BASE=http://localhost:3000
curl "$BASE/todos"`
  },
  {
    title: "Query vs path vs body",
    lang: "txt",
    desc: story({
      problem: "People stuffed filters into the body of a GET, or put ids in random query strings.",
      what: "Path names the thing (/todos/5). Query filters (?done=true). Body is the payload of POST/PUT/PATCH.",
      solves: "The URL reads like English. Caches and logs stay sane.",
      example: "Shelf 5 (path), only the red boxes (query), the new label you want printed (body).",
      uses: "REST list/filter/update.",
      watch: "Secrets in the query string appear in access logs."
    }),
    code: `# path: which one
curl http://localhost:3000/todos/5

# query: filter the list
curl "http://localhost:3000/todos?done=true&limit=10"

# body: the new fields
curl -X PATCH http://localhost:3000/todos/5 \\
  -H "Content-Type: application/json" \\
  -d "{\\"done\\":true}"`
  },
  {
    title: "401 vs 403 vs 404",
    lang: "txt",
    desc: story({
      problem: "Every failure was 'error'. Interviews want the three doors named.",
      what: "401 not logged in. 403 logged in but not allowed. 404 no such thing (or we hide it).",
      solves: "You know whether to send the user to login, hide the button, or show not found.",
      example: "No ticket (401). Ticket for hall 2, you entered hall 1 (403). No such film (404).",
      uses: "Auth interviews, admin routes.",
      watch: "Some APIs return 404 for other people's ids so you cannot hunt ids."
    }),
    code: `# no header
curl -i http://localhost:3000/me
# 401 Unauthorized

# valid token, not an admin
curl -i http://localhost:3000/admin/users \\
  -H "Authorization: Bearer USER_TOKEN"
# 403 Forbidden

# id does not exist
curl -i http://localhost:3000/todos/9999 \\
  -H "Authorization: Bearer USER_TOKEN"
# 404 Not Found`
  },
  {
    title: "Copy as curl from Postman",
    lang: "txt",
    desc: story({
      problem: "A bug only happened with 'that one header'. Slack needed the exact request.",
      what: "Postman → Code → cURL. You get a pasteable command. CI and READMEs use that.",
      solves: "Same bytes, no screenshot of twenty fields.",
      example: "Photocopying the order slip for the next shift.",
      uses: "GitHub issues, CI, onboarding.",
      watch: "The copy includes your live token unless you used a variable."
    }),
    code: `# Postman: ... menu → Code → cURL
curl --location 'http://localhost:3000/todos' \\
  --header 'Authorization: Bearer {{token}}'

# Thunder Client and Insomnia have the same 'copy as curl'`
  },
  {
    title: "OpenAPI / Swagger try-it",
    lang: "txt",
    desc: story({
      problem:
        "The wiki listed routes that no longer exist. Frontend and backend argued about the JSON shape.",
      what:
        "OpenAPI is a machine menu of paths, bodies, and status codes. Swagger UI (often /docs on FastAPI) lets you Try it.",
      solves:
        "The running app is the menu. Types and 422 errors stay in sync.",
      example:
        "A printed menu that the kitchen updates when a dish dies. Not a stained paper from last year.",
      uses:
        "FastAPI /docs, Spring springdoc, Express with swagger-jsdoc.",
      watch:
        "A public /docs on prod can leak admin routes. Lock it or hide it."
    }),
    code: `# FastAPI: open http://localhost:8000/docs
# Click POST /todos → Try it out → Execute
# that is Postman, generated from the code

# the menu file itself
# GET http://localhost:8000/openapi.json`
  },
  {
    title: "VS Code Thunder Client",
    lang: "txt",
    desc: story({
      problem: "Switching to a browser app for every API try broke the flow.",
      what: "Thunder Client (or REST Client .http files) is Postman inside VS Code.",
      solves: "Same collection idea, next to the route you just wrote.",
      example: "A notepad taped to the kitchen door.",
      uses: "Solo and small teams. Commit .http files if they have no secrets.",
      watch: "Do not commit a .http file with a real Bearer token."
    }),
    code: `# file: api.http   (VS Code REST Client)
### list
GET http://localhost:3000/todos

### create
POST http://localhost:3000/todos
Content-Type: application/json

{
  "title": "Milk"
}`
  },
  {
    title: "Newman (Postman in CI)",
    lang: "txt",
    desc: story({
      problem: "The collection was green on Ada's laptop and red after deploy. Nobody ran it in CI.",
      what: "Newman runs a Postman collection from the terminal. GitHub Actions can fail the PR if a request fails.",
      solves: "The menu is tested on every push, not only when someone remembers.",
      example: "A robot waiter that places the same ten orders after every kitchen change.",
      uses: "Smoke tests: health, login, one CRUD.",
      watch: "Do not point CI at production with a write collection."
    }),
    code: `# export collection + env from Postman (no real prod keys)
npx newman run todos.postman_collection.json \\
  -e local.postman_environment.json

# GitHub Actions: same command after the API boots`
  }
];

const Q = (id, level, q, a, code, ask) => ({
  id,
  level,
  q,
  a: story(a),
  code,
  lang: "txt",
  ask
});

const questions = [
  Q(
    1,
    "beginner",
    "What is Postman?",
    {
      problem:
        "You only tested through the website. A click hid the URL and the token. You could not tell if the API or the page was wrong.",
      what:
        "Postman is an HTTP client: method, URL, headers, body, Send. You read status and JSON.",
      solves:
        "You talk to the kitchen without the dining room. Save the orders as a collection.",
      example:
        "A counter window. 'One dosa' is POST /orders. The stamp is 201.",
      uses:
        "Local APIs, take-homes, sharing routes with QA.",
      watch:
        "Postman skips CORS. Green here does not mean the browser will succeed."
    },
    `# GET http://localhost:3000/todos  →  Send
# look at Status 200 and the JSON body`,
    "Most asked · Amazon · Google · Microsoft"
  ),
  Q(
    2,
    "beginner",
    "Postman vs curl?",
    {
      problem:
        "One person only knew the GUI. CI and a server SSH session have no Postman.",
      what:
        "Same HTTP. Postman is the form. curl is the command. You can convert both ways.",
      solves:
        "Share a one-liner in a README. Click when you are exploring.",
      example:
        "Paper pad vs phone call. Same 'one dosa'.",
      uses:
        "Explore in Postman. Paste curl in GitHub issues and scripts.",
      watch:
        "A copied curl often includes a live token."
    },
    `curl -X POST http://localhost:3000/todos \\
  -H "Content-Type: application/json" \\
  -d "{\\"title\\":\\"Milk\\"}"`,
    "Most asked · Amazon · Google · Microsoft"
  ),
  Q(
    3,
    "beginner",
    "Why does it work in Postman but fail in the browser?",
    {
      problem:
        "POST /todos was 201 in Postman. React on :5173 showed a CORS error. People 'fixed' it by turning CORS off in production.",
      what:
        "Postman is not a browser. CORS is a browser rule. curl and Postman do not apply it.",
      solves:
        "You learn the kitchen is fine. The dining room origin needs Allow-Origin, or Nginx must make /api same-origin.",
      example:
        "A phone order (Postman) vs a student from another school at the canteen gate (browser).",
      uses:
        "Every localhost:5173 → :3000 bug.",
      watch:
        "origin: * plus cookies is invalid. Do not disable CORS in production."
    },
    `# Postman 201 — not a browser
# Browser console: blocked by CORS
# fix on the SERVER, not in Postman
# Access-Control-Allow-Origin: http://localhost:5173`,
    "Most asked · Amazon · Google · Microsoft · Meta"
  ),
  Q(
    4,
    "beginner",
    "What is a Postman collection?",
    {
      problem:
        "Routes lived in chat. New hires guessed URLs. QA had a different list than backend.",
      what:
        "A collection is a saved folder of requests: login, list, create, delete.",
      solves:
        "One shared menu. Export JSON. Import on another laptop. Run with Newman.",
      example:
        "A binder of order slips for the shop.",
      uses:
        "Onboarding, interviews, smoke tests.",
      watch:
        "A collection with hardcoded prod tokens."
    },
    `# Collection: Todos
#   POST {{baseUrl}}/login
#   GET  {{baseUrl}}/todos
#   POST {{baseUrl}}/todos
#   PATCH {{baseUrl}}/todos/:id`,
    "Most asked · Microsoft · Amazon"
  ),
  Q(
    5,
    "beginner",
    "What is a Postman environment?",
    {
      problem:
        "base URL and tokens were typed twenty times. Staging needed a search-replace.",
      what:
        "An environment is a set of variables: {{baseUrl}}, {{token}}. You switch Local / Staging.",
      solves:
        "Same collection, different shop.",
      example:
        "A recipe that says 'this street'. Change the street.",
      uses:
        "local, staging, prod (careful).",
      watch:
        "Do not commit a prod environment file."
    },
    `# Local
#   baseUrl = http://localhost:3000
# Staging
#   baseUrl = https://api-staging.example.com
# GET {{baseUrl}}/todos`,
    "Most asked · Amazon · Microsoft"
  ),
  Q(
    6,
    "beginner",
    "GET vs POST vs PUT vs PATCH vs DELETE?",
    {
      problem:
        "Teams invented /getTodos and /saveTodoNow. Caches and browsers could not guess safety.",
      what:
        "GET read. POST create. PUT replace. PATCH change some fields. DELETE remove.",
      solves:
        "One shared menu. GET should not write.",
      example:
        "Menu verbs: look, order, replace the plate, add chutney, cancel.",
      uses:
        "REST interviews at every company.",
      watch:
        "GET that deletes. PUT that only patches one field without saying so."
    },
    `GET    {{baseUrl}}/todos
POST   {{baseUrl}}/todos
GET    {{baseUrl}}/todos/5
PATCH  {{baseUrl}}/todos/5
DELETE {{baseUrl}}/todos/5`,
    "Most asked · Amazon · Google · Microsoft · Meta"
  ),
  Q(
    7,
    "beginner",
    "What headers do you send?",
    {
      problem:
        "JSON arrived as a string, or the server ignored the body, or auth 'did not work'.",
      what:
        "Headers are labels on the envelope. Content-Type says the body is JSON. Authorization carries the ticket. Accept says you want JSON back.",
      solves:
        "The parser and the auth check see what you meant.",
      example:
        "A parcel sticker: 'fragile' and 'from Ada'.",
      uses:
        "Every JSON API. File upload uses multipart instead.",
      watch:
        "Wrong Content-Type → empty req.body in Express."
    },
    `Content-Type: application/json
Authorization: Bearer {{token}}
Accept: application/json`,
    "Most asked · Amazon · Google"
  ),
  Q(
    8,
    "beginner",
    "What is Authorization: Bearer?",
    {
      problem:
        "Cookie login in the browser did not exist in Postman. Protected routes were 401.",
      what:
        "Bearer means 'here is a token'. Usually a JWT from POST /login. The server checks the stamp.",
      solves:
        "Postman can call /me the same way the app does.",
      example:
        "Show the cinema ticket. The word Bearer is 'this is a ticket'.",
      uses:
        "SPAs, mobile, most modern APIs.",
      watch:
        "Token in the URL or in a screenshot."
    },
    `Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
# Postman → Authorization → Type Bearer Token → {{token}}`,
    "Most asked · Amazon · Microsoft · Google"
  ),
  Q(
    9,
    "beginner",
    "401 vs 403?",
    {
      problem:
        "Both looked like 'not allowed'. Frontend showed the same toast.",
      what:
        "401: we do not know who you are (no or bad token). 403: we know you; this door is closed (not admin).",
      solves:
        "401 → send to login. 403 → hide the button or show 'no access'.",
      example:
        "No ticket vs ticket for the wrong hall.",
      uses:
        "Every auth interview.",
      watch:
        "Returning 401 for a logged-in user who is not admin. That logs them out for no reason."
    },
    `# no token     → 401
# user token   → 403 on /admin
# admin token  → 200`,
    "Most asked · Amazon · Google · Microsoft · Meta"
  ),
  Q(
    10,
    "beginner",
    "What is a query parameter?",
    {
      problem:
        "People made /todosDone and /todosPending as separate routes.",
      what:
        "The part after ?: ?done=true&limit=10. Same path, extra filters.",
      solves:
        "One list route. The clerk filters the binder.",
      example:
        "'Show red shirts, only 10' — same aisle, extra words.",
      uses:
        "Search, pagination, filters.",
      watch:
        "Passwords in the query string."
    },
    `GET {{baseUrl}}/todos?done=true&limit=10
curl "http://localhost:3000/todos?done=true&limit=10"`,
    "Most asked · Amazon · Google"
  ),
  Q(
    11,
    "beginner",
    "JSON body vs form-data?",
    {
      problem:
        "An HTML form sent fields. fetch sent JSON. The server parser expected the other one. req.body was empty.",
      what:
        "raw JSON is { \"title\": \"Milk\" } with Content-Type application/json. form-data is fields and files (multipart).",
      solves:
        "Match the parser: express.json() vs multer / urlencoded.",
      example:
        "A sealed lunch box (JSON) vs a tray of labeled bowls plus a photo (form-data).",
      uses:
        "JSON for APIs. form-data when a file rides along.",
      watch:
        "Sending JSON with a form-data parser, or the other way around."
    },
    `# JSON (usual API)
Content-Type: application/json
{ "title": "Milk" }

# file upload
# Body → form-data → file = photo.png`,
    "Most asked · Amazon · Microsoft"
  ),
  Q(
    12,
    "beginner",
    "How do you test login in Postman?",
    {
      problem:
        "You pasted a token by hand every ten minutes. It expired. You thought the API died.",
      what:
        "POST /login with email and password. In Tests, save json.token into {{token}}. Later requests use Bearer {{token}}.",
      solves:
        "One click login, then the whole collection works.",
      example:
        "Get a day pass at the gate, stamp the next doors.",
      uses:
        "Any JWT API.",
      watch:
        "Saving the password in a shared collection."
    },
    `# Tests tab on POST /login
# const json = pm.response.json();
# pm.environment.set("token", json.token);`,
    "Most asked · Amazon · Microsoft · Google"
  ),
  Q(
    13,
    "intermediate",
    "What is a Postman test script?",
    {
      problem:
        "A 200 with { \"ok\": false } looked green. Humans blinked.",
      what:
        "A tiny script after the response: status is 201, body has id. Red if the kitchen lied.",
      solves:
        "Collections become checks, not only clicks. Newman can fail CI.",
      example:
        "A clerk who counts the plates, not only hears 'ready'.",
      uses:
        "Smoke tests, interview take-homes.",
      watch:
        "Asserting the whole body when only id matters. Brittle tests."
    },
    `pm.test("creates a todo", function () {
  pm.response.to.have.status(201);
  pm.expect(pm.response.json().id).to.be.ok;
});`,
    "Most asked · Microsoft · Amazon"
  ),
  Q(
    14,
    "intermediate",
    "What is Newman?",
    {
      problem:
        "The collection was a local habit. Deploy broke /login and nobody knew until a user called.",
      what:
        "Newman is Postman without the window. It runs the collection in a terminal or GitHub Action.",
      solves:
        "The same orders run on every PR.",
      example:
        "A robot waiter after every kitchen change.",
      uses:
        "CI smoke tests.",
      watch:
        "Pointing Newman at production with DELETE requests."
    },
    `npx newman run todos.postman_collection.json -e local.json`,
    "Most asked · Amazon · Microsoft"
  ),
  Q(
    15,
    "beginner",
    "Thunder Client vs Postman?",
    {
      problem:
        "Alt-tab to a heavy app for one GET.",
      what:
        "Thunder Client is Postman inside VS Code. Same method, URL, headers. REST Client uses a .http file.",
      solves:
        "Try the route next to the code you just wrote.",
      example:
        "A notepad on the kitchen door.",
      uses:
        "Solo, small teams, commit .http without secrets.",
      watch:
        "A committed Bearer token."
    },
    `### GET list
GET http://localhost:3000/todos`,
    "Most asked · Microsoft"
  ),
  Q(
    16,
    "beginner",
    "What is Insomnia / Hoppscotch / Bruno?",
    {
      problem:
        "People thought Postman was the only HTTP client.",
      what:
        "Insomnia and Hoppscotch are other GUIs. Bruno keeps the collection as files you can Git. Hoppscotch runs in the browser.",
      solves:
        "Same job: send HTTP. Pick the window you will actually use.",
      example:
        "Different counters, same dosa.",
      uses:
        "Bruno when you want the collection in the PR. Hoppscotch for a quick try.",
      watch:
        "Brand wars. Interviewers want method + status, not a logo."
    },
    `# Bruno / Git-friendly folder
# collections/todos/get-list.bru
# meta { GET /todos }`,
    "Most asked · Amazon · Google"
  ),
  Q(
    17,
    "beginner",
    "What is Swagger / OpenAPI?",
    {
      problem:
        "The wiki listed dead routes. Types drifted. Frontend sent the old field name.",
      what:
        "OpenAPI is a spec of paths, bodies, and codes. Swagger UI is the clickable menu. FastAPI builds both from your functions.",
      solves:
        "The running app is the menu. Try it without Postman.",
      example:
        "A menu the kitchen reprints when a dish dies.",
      uses:
        "FastAPI /docs, Spring, any public API catalog.",
      watch:
        "Public /docs leaking admin routes."
    },
    `# FastAPI
# http://localhost:8000/docs      Swagger UI
# http://localhost:8000/redoc
# http://localhost:8000/openapi.json`,
    "Most asked · Amazon · Google · Microsoft · Uber"
  ),
  Q(
    18,
    "beginner",
    "How do you debug a failing API?",
    {
      problem:
        "People refreshed the React page. The real error was a 400 in the Network tab they never opened.",
      what:
        "Repeat the call in Postman or curl. Read status, then body, then headers. Change one thing: URL, method, header, body.",
      solves:
        "You name the broken layer: DNS, TLS, 401, 422, or the UI.",
      example:
        "A mechanic who checks the engine before replacing the steering wheel.",
      uses:
        "Every 'it does not work' ticket.",
      watch:
        "Changing five things at once. You will not know what fixed it."
    },
    `curl -i http://localhost:3000/todos
# 1) did it connect?
# 2) status?
# 3) body message?
# 4) then open DevTools → Network on the page`,
    "Most asked · Amazon · Google · Microsoft"
  ),
  Q(
    19,
    "beginner",
    "Postman vs browser Network tab?",
    {
      problem:
        "You needed cookies the page already had, or you needed a clean request with no cookies.",
      what:
        "Network tab is what the page really sent (cookies, CORS, origin). Postman is a clean envelope you build.",
      solves:
        "Use Network to copy the failing call. Use Postman to change one header and retry.",
      example:
        "Security camera (Network) vs a practice order at the counter (Postman).",
      uses:
        "CORS, cookie auth, CSRF.",
      watch:
        "Cookie login that works in the browser and 401s in Postman — you forgot the cookie or CSRF header."
    },
    `# Chrome DevTools → Network → the red call → Copy as cURL
# paste in a terminal or Import into Postman`,
    "Most asked · Google · Meta · Amazon"
  ),
  Q(
    20,
    "intermediate",
    "How do you share an API with a teammate?",
    {
      problem:
        "Slack had screenshots of URLs. Tokens expired. Staging changed.",
      what:
        "Share a collection plus a Local env without secrets. Or commit .http / Bruno files. Or point them at /docs.",
      solves:
        "They import and hit Send. No archaeology.",
      example:
        "Handing over the order binder and the street name, not your house keys.",
      uses:
        "PR description, QA, interviews.",
      watch:
        "Export with 'include tokens'."
    },
    `# Export Collection (no prod env)
# or commit api.http
# or send https://staging.example.com/docs`,
    "Most asked · Microsoft · Amazon"
  ),
  Q(
    21,
    "beginner",
    "What status codes should you know?",
    {
      problem:
        "Everything was 200 with an error inside, or everything was 500.",
      what:
        "200 ok, 201 created, 204 no body, 400 bad input, 401 login, 403 forbidden, 404 missing, 409 conflict, 422 validation, 429 rate limit, 500 server bug.",
      solves:
        "The UI and Postman tests can branch on the stamp, not on English in the body.",
      example:
        "Kitchen stamps: ready, we need a name, closed, too many orders.",
      uses:
        "Every backend and frontend interview.",
      watch:
        "200 for a create. 500 for a missing field (that is 400/422)."
    },
    `# 201 create     400 bad JSON
# 401 no token   403 not admin
# 404 missing    429 slow down
# 500 our bug`,
    "Most asked · Amazon · Google · Microsoft · Meta"
  ),
  Q(
    22,
    "intermediate",
    "What is idempotent? Why does PUT vs POST matter?",
    {
      problem:
        "A retry of POST /orders created two dosas. The user clicked twice on a slow network.",
      what:
        "Idempotent means doing it again does not change the result. GET, PUT, DELETE should be. POST create usually is not.",
      solves:
        "Retries are safe on PUT /todos/5. POST needs an Idempotency-Key or a unique constraint.",
      example:
        "Telling the clerk 'shelf 5 is Milk' twice vs 'add a Milk' twice.",
      uses:
        "Payments, order create, interview system design.",
      watch:
        "A GET that is not idempotent because it deletes."
    },
    `# retry is safe
PUT {{baseUrl}}/todos/5
{ "title": "Milk", "done": true }

# retry may double
POST {{baseUrl}}/orders
{ "dish": "dosa" }`,
    "Most asked · Amazon · Uber · Google"
  ),
  Q(
    23,
    "beginner",
    "How do you send a file?",
    {
      problem:
        "JSON cannot hold a photo well. People base64'd a 10MB image into a field and the server died.",
      what:
        "form-data with a file key. Content-Type becomes multipart/form-data. curl uses -F.",
      solves:
        "The photo is a part. Title can be another part.",
      example:
        "A tray: a card that says Milk, plus the photo clipped on.",
      uses:
        "Avatars, CSV import.",
      watch:
        "Forgetting file size limits (Nginx client_max_body_size)."
    },
    `curl -X POST http://localhost:3000/avatar \\
  -H "Authorization: Bearer {{token}}" \\
  -F "file=@./me.png" \\
  -F "title=Ada"`,
    "Most asked · Amazon · Microsoft"
  ),
  Q(
    24,
    "intermediate",
    "What is a mock server?",
    {
      problem:
        "Frontend was blocked until backend finished /todos.",
      what:
        "A fake API that returns the agreed JSON. Postman Mock, MSW, or a tiny Express stub.",
      solves:
        "The UI can be built against the contract. Swap the baseUrl later.",
      example:
        "A cardboard kitchen that serves plastic dosas so the waiters can practice.",
      uses:
        "Parallel work, demos, tests.",
      watch:
        "Shipping the mock URL to production."
    },
    `# Postman Mock: same collection, fake 200
# GET {{mockUrl}}/todos → [{ "id": 1, "title": "Milk" }]`,
    "Most asked · Amazon · Google"
  ),
  Q(
    25,
    "beginner",
    "How do companies ask this in interviews?",
    {
      problem:
        "Candidates said 'I use Postman' and could not name a status code or why CORS failed.",
      what:
        "They want the story: I hit the API without the UI. I read 401 vs 403. I know Postman is not a browser. I can write the curl.",
      solves:
        "You sound like you have shipped a route, not only imported a collection.",
      example:
        "A cook who can plate a dosa without the restaurant app.",
      uses:
        "Amazon, Google, Microsoft, every backend/frontend screen.",
      watch:
        "Listing tool names. Say method, URL, status, and one bug you found."
    },
    `# say this
# "I reproduce in curl: curl -i localhost:3000/me
#  401 meant I forgot Bearer. CORS is a browser-only gate."`,
    "Most asked · Amazon · Google · Microsoft · Meta · Adobe"
  )
];

const data = {
  kind: "practice",
  notes,
  examples,
  questions
};

const out = path.join(__dirname, "..", "data", "postman.js");
const body =
  "window.PREP_DATA = window.PREP_DATA || {};\n" +
  'window.PREP_DATA["postman"] = ' +
  JSON.stringify(data, null, 2) +
  ";\n";
fs.writeFileSync(out, body);
console.log("wrote", out, "notes", notes.length, "examples", examples.length, "questions", questions.length);
