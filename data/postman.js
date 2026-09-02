window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA["postman"] = {
  "kind": "practice",
  "notes": [
    {
      "title": "The problem before Postman",
      "body": "The problem before\nYou tested the API only from the React page. A button hid the URL, the method, and the token. When the page failed you did not know if the kitchen was closed or the waiter wrote the order wrong.\n\nWhat this is\nPostman is a separate window for talking to an API. You pick GET or POST, type the URL, add headers, send, and read the status plus JSON. The UI is not in the way.\n\nWhat it solves\nYou prove the kitchen works before you blame the dining room. Mobile, web, and a teammate can share the same saved orders (a collection).\n\nReal-life example\nA restaurant counter that is not the dining hall. You walk up, say 'one dosa' (POST /orders), and see 201 plus the plate. If that fails, the waiter (React) is not the first suspect.\n\nUses\nHit localhost:3000, a staging URL, or a teammate's ngrok. Save login once, reuse the token. Export the same calls as curl for Slack or CI.\n\nWatch out\nPostman is not a browser. CORS will not stop it. A green Postman send does not prove the React app on :5173 can call :3000."
    },
    {
      "title": "What Postman is",
      "body": "The problem before\ncurl flags are easy to mistype. fetch lives inside the page. There was no shared menu of 'here are the real routes'.\n\nWhat this is\nPostman is an HTTP client with a form: method, URL, params, headers, body, then Send. The reply is status, time, size, and the JSON body.\n\nWhat it solves\nOne place to try GET /todos, POST /todos, and GET /me with a Bearer token. You can save that as a collection and share it.\n\nReal-life example\nA printed order pad. Line 1 is GET /todos. Line 2 is POST /todos. The kitchen stamp is 200 or 401.\n\nUses\nLocal APIs, interview take-homes, hand-off to QA, generating curl from a working request.\n\nWatch out\nSaving a real production token inside a shared collection is a leak. Use environment variables."
    },
    {
      "title": "Collections and environments",
      "body": "The problem before\nEveryone had a different base URL in their head. Ada used localhost:3000. Bob used the live site. Tokens were pasted into every request by hand.\n\nWhat this is\nA collection is a folder of saved requests. An environment is a box of names: {{baseUrl}}, {{token}}. The same GET {{baseUrl}}/todos works on laptop and staging.\n\nWhat it solves\nSwitch Local → Staging without rewriting twenty URLs. One login request can write {{token}} for the rest.\n\nReal-life example\nA recipe card that says 'use the shop on this street'. You change the street (environment). The dishes (requests) stay the same.\n\nUses\nLocal / staging / prod. Team onboarding. Interview: 'here is the collection, try POST /login'.\n\nWatch out\nA prod environment with a real key must not be committed. Postman can sync; treat it like .env."
    },
    {
      "title": "curl is the same idea",
      "body": "The problem before\nA teammate does not have Postman. CI cannot click Send. You needed the same request as text.\n\nWhat this is\ncurl is the terminal twin of Postman. Same method, URL, headers, and body. Postman can copy as curl. You can paste curl into Postman.\n\nWhat it solves\nOne command in a README or GitHub issue. A health check in a script. The same proof without a GUI.\n\nReal-life example\nA paper order vs a phone call. 'One dosa' is the same dish. curl is the phone call. Postman is the paper pad.\n\nUses\nREADME samples, CI, SSH on a server, interviews ('show me the curl').\n\nWatch out\nA token in a curl you paste into Slack is still a leak. Prefer {{token}} and a private env."
    },
    {
      "title": "Other tools (same job)",
      "body": "The problem before\nPeople fight over the brand. The job is the same: send HTTP and read JSON.\n\nWhat this is\nInsomnia and Hoppscotch are other windows like Postman. Thunder Client and REST Client live inside VS Code. Bruno stores the collection as files in Git. Swagger UI / OpenAPI is a live menu the API itself serves (often /docs).\n\nWhat it solves\nYou pick the window you already have. FastAPI /docs is a menu. Thunder Client is one click from the editor. Bruno is a folder you can review in a PR.\n\nReal-life example\nDifferent counters, same kitchen. Dosa is still POST /orders.\n\nUses\nVS Code: Thunder Client. Python API: Swagger. Team that wants Git: Bruno. Quick share: curl.\n\nWatch out\nLearning twenty tools is not a skill. Method + URL + status + JSON is the skill."
    },
    {
      "title": "Auth in the request",
      "body": "The problem before\nThe UI sent a cookie you never saw. Or the token sat in localStorage and you forgot to copy it. Every protected route looked 'broken'.\n\nWhat this is\nAPIs want proof on the request: Authorization: Bearer <jwt>, a cookie, or an API key header. Postman has an Authorization tab that writes that header for you.\n\nWhat it solves\nYou can call GET /me the same way the app does, without opening the browser.\n\nReal-life example\nA cinema ticket shown at the door. No ticket → 401. Ticket for hall 2 while you walk into hall 1 → 403.\n\nUses\nJWT APIs, API keys, Basic auth on old admin tools.\n\nWatch out\n401 means 'who are you?'. 403 means 'I know you; you may not do this.' Do not mix them in an interview."
    }
  ],
  "examples": [
    {
      "title": "GET list (Postman or curl)",
      "lang": "txt",
      "desc": "The problem before\nYou did not know if the API was even up.\n\nWhat this is\nGET asks for a resource. No body. The answer is usually 200 plus a JSON array.\n\nWhat it solves\nProve the kitchen is open before you build the list page.\n\nReal-life example\nAsking the clerk 'what todos exist?'\n\nUses\nAny list screen. Health checks.\n\nWatch out\nGET must not create or delete.",
      "code": "# Postman: method GET, URL {{baseUrl}}/todos, Send\n# same request in the terminal:\ncurl http://localhost:3000/todos\n# 200  [{\"id\":1,\"title\":\"Milk\"}]"
    },
    {
      "title": "POST JSON create",
      "lang": "txt",
      "desc": "The problem before\nA form did nothing. Was the body wrong, or the route missing?\n\nWhat this is\nPOST sends a new thing. Content-Type application/json. Body is the object.\n\nWhat it solves\nYou see 201 and the saved row, or 400 with the field that failed.\n\nReal-life example\nOrdering one dosa: POST /orders { \"dish\": \"dosa\" }.\n\nUses\nSignup, create todo, /predict.\n\nWatch out\nA GET that creates is a bug. Empty body with the wrong parser → req.body undefined.",
      "code": "# Postman: POST {{baseUrl}}/todos\n# Headers: Content-Type: application/json\n# Body → raw → JSON:\n# { \"title\": \"Milk\" }\n\ncurl -X POST http://localhost:3000/todos \\\n  -H \"Content-Type: application/json\" \\\n  -d \"{\\\"title\\\":\\\"Milk\\\"}\"\n# 201  {\"id\":2,\"title\":\"Milk\"}"
    },
    {
      "title": "Bearer token (login then /me)",
      "lang": "txt",
      "desc": "The problem before\n/me returned 401 and the React page only said 'error'.\n\nWhat this is\nLogin returns a JWT. The next request sends Authorization: Bearer <token>.\n\nWhat it solves\nYou separate 'login is broken' from 'you forgot the header'.\n\nReal-life example\nShow the cinema ticket at the next door.\n\nUses\nAny protected route.\n\nWatch out\nDo not put the token in the URL. It lands in logs and history.",
      "code": "# 1) POST {{baseUrl}}/login  { \"email\": \"ada@test.com\", \"password\": \"secret\" }\n# Save the token into {{token}} (Tests tab: pm.environment.set(\"token\", json.token))\n\ncurl -X POST http://localhost:3000/login \\\n  -H \"Content-Type: application/json\" \\\n  -d \"{\\\"email\\\":\\\"ada@test.com\\\",\\\"password\\\":\\\"secret\\\"}\"\n\n# 2) GET {{baseUrl}}/me   Authorization: Bearer {{token}}\ncurl http://localhost:3000/me \\\n  -H \"Authorization: Bearer eyJhbGciOi...\"\n# 200  {\"id\":1,\"email\":\"ada@test.com\"}\n# 401  missing or bad token"
    },
    {
      "title": "Environment {{baseUrl}}",
      "lang": "txt",
      "desc": "The problem before\nTwenty requests said localhost. Staging broke every URL.\n\nWhat this is\nOne name {{baseUrl}}. Local env is http://localhost:3000. Staging is https://api.example.com.\n\nWhat it solves\nSwitch the dropdown. The collection stays the same.\n\nReal-life example\nA recipe that says 'use this shop'. Change the shop, not every dish.\n\nUses\nLocal, staging, prod. Team share.\n\nWatch out\nProd tokens in a shared cloud workspace.",
      "code": "# Postman environment\n# baseUrl = http://localhost:3000\n# token   = (empty until login)\n\n# every request:\n# GET {{baseUrl}}/todos\n# Authorization: Bearer {{token}}\n\n# curl with the same idea\nBASE=http://localhost:3000\ncurl \"$BASE/todos\""
    },
    {
      "title": "Query vs path vs body",
      "lang": "txt",
      "desc": "The problem before\nPeople stuffed filters into the body of a GET, or put ids in random query strings.\n\nWhat this is\nPath names the thing (/todos/5). Query filters (?done=true). Body is the payload of POST/PUT/PATCH.\n\nWhat it solves\nThe URL reads like English. Caches and logs stay sane.\n\nReal-life example\nShelf 5 (path), only the red boxes (query), the new label you want printed (body).\n\nUses\nREST list/filter/update.\n\nWatch out\nSecrets in the query string appear in access logs.",
      "code": "# path: which one\ncurl http://localhost:3000/todos/5\n\n# query: filter the list\ncurl \"http://localhost:3000/todos?done=true&limit=10\"\n\n# body: the new fields\ncurl -X PATCH http://localhost:3000/todos/5 \\\n  -H \"Content-Type: application/json\" \\\n  -d \"{\\\"done\\\":true}\""
    },
    {
      "title": "401 vs 403 vs 404",
      "lang": "txt",
      "desc": "The problem before\nEvery failure was 'error'. Interviews want the three doors named.\n\nWhat this is\n401 not logged in. 403 logged in but not allowed. 404 no such thing (or we hide it).\n\nWhat it solves\nYou know whether to send the user to login, hide the button, or show not found.\n\nReal-life example\nNo ticket (401). Ticket for hall 2, you entered hall 1 (403). No such film (404).\n\nUses\nAuth interviews, admin routes.\n\nWatch out\nSome APIs return 404 for other people's ids so you cannot hunt ids.",
      "code": "# no header\ncurl -i http://localhost:3000/me\n# 401 Unauthorized\n\n# valid token, not an admin\ncurl -i http://localhost:3000/admin/users \\\n  -H \"Authorization: Bearer USER_TOKEN\"\n# 403 Forbidden\n\n# id does not exist\ncurl -i http://localhost:3000/todos/9999 \\\n  -H \"Authorization: Bearer USER_TOKEN\"\n# 404 Not Found"
    },
    {
      "title": "Copy as curl from Postman",
      "lang": "txt",
      "desc": "The problem before\nA bug only happened with 'that one header'. Slack needed the exact request.\n\nWhat this is\nPostman → Code → cURL. You get a pasteable command. CI and READMEs use that.\n\nWhat it solves\nSame bytes, no screenshot of twenty fields.\n\nReal-life example\nPhotocopying the order slip for the next shift.\n\nUses\nGitHub issues, CI, onboarding.\n\nWatch out\nThe copy includes your live token unless you used a variable.",
      "code": "# Postman: ... menu → Code → cURL\ncurl --location 'http://localhost:3000/todos' \\\n  --header 'Authorization: Bearer {{token}}'\n\n# Thunder Client and Insomnia have the same 'copy as curl'"
    },
    {
      "title": "OpenAPI / Swagger try-it",
      "lang": "txt",
      "desc": "The problem before\nThe wiki listed routes that no longer exist. Frontend and backend argued about the JSON shape.\n\nWhat this is\nOpenAPI is a machine menu of paths, bodies, and status codes. Swagger UI (often /docs on FastAPI) lets you Try it.\n\nWhat it solves\nThe running app is the menu. Types and 422 errors stay in sync.\n\nReal-life example\nA printed menu that the kitchen updates when a dish dies. Not a stained paper from last year.\n\nUses\nFastAPI /docs, Spring springdoc, Express with swagger-jsdoc.\n\nWatch out\nA public /docs on prod can leak admin routes. Lock it or hide it.",
      "code": "# FastAPI: open http://localhost:8000/docs\n# Click POST /todos → Try it out → Execute\n# that is Postman, generated from the code\n\n# the menu file itself\n# GET http://localhost:8000/openapi.json"
    },
    {
      "title": "VS Code Thunder Client",
      "lang": "txt",
      "desc": "The problem before\nSwitching to a browser app for every API try broke the flow.\n\nWhat this is\nThunder Client (or REST Client .http files) is Postman inside VS Code.\n\nWhat it solves\nSame collection idea, next to the route you just wrote.\n\nReal-life example\nA notepad taped to the kitchen door.\n\nUses\nSolo and small teams. Commit .http files if they have no secrets.\n\nWatch out\nDo not commit a .http file with a real Bearer token.",
      "code": "# file: api.http   (VS Code REST Client)\n### list\nGET http://localhost:3000/todos\n\n### create\nPOST http://localhost:3000/todos\nContent-Type: application/json\n\n{\n  \"title\": \"Milk\"\n}"
    },
    {
      "title": "Newman (Postman in CI)",
      "lang": "txt",
      "desc": "The problem before\nThe collection was green on Ada's laptop and red after deploy. Nobody ran it in CI.\n\nWhat this is\nNewman runs a Postman collection from the terminal. GitHub Actions can fail the PR if a request fails.\n\nWhat it solves\nThe menu is tested on every push, not only when someone remembers.\n\nReal-life example\nA robot waiter that places the same ten orders after every kitchen change.\n\nUses\nSmoke tests: health, login, one CRUD.\n\nWatch out\nDo not point CI at production with a write collection.",
      "code": "# export collection + env from Postman (no real prod keys)\nnpx newman run todos.postman_collection.json \\\n  -e local.postman_environment.json\n\n# GitHub Actions: same command after the API boots"
    }
  ],
  "questions": [
    {
      "id": 1,
      "level": "beginner",
      "q": "What is Postman?",
      "a": "The problem before\nYou only tested through the website. A click hid the URL and the token. You could not tell if the API or the page was wrong.\n\nWhat this is\nPostman is an HTTP client: method, URL, headers, body, Send. You read status and JSON.\n\nWhat it solves\nYou talk to the kitchen without the dining room. Save the orders as a collection.\n\nReal-life example\nA counter window. 'One dosa' is POST /orders. The stamp is 201.\n\nUses\nLocal APIs, take-homes, sharing routes with QA.\n\nWatch out\nPostman skips CORS. Green here does not mean the browser will succeed.",
      "code": "# GET http://localhost:3000/todos  →  Send\n# look at Status 200 and the JSON body",
      "lang": "txt",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 2,
      "level": "beginner",
      "q": "Postman vs curl?",
      "a": "The problem before\nOne person only knew the GUI. CI and a server SSH session have no Postman.\n\nWhat this is\nSame HTTP. Postman is the form. curl is the command. You can convert both ways.\n\nWhat it solves\nShare a one-liner in a README. Click when you are exploring.\n\nReal-life example\nPaper pad vs phone call. Same 'one dosa'.\n\nUses\nExplore in Postman. Paste curl in GitHub issues and scripts.\n\nWatch out\nA copied curl often includes a live token.",
      "code": "curl -X POST http://localhost:3000/todos \\\n  -H \"Content-Type: application/json\" \\\n  -d \"{\\\"title\\\":\\\"Milk\\\"}\"",
      "lang": "txt",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 3,
      "level": "beginner",
      "q": "Why does it work in Postman but fail in the browser?",
      "a": "The problem before\nPOST /todos was 201 in Postman. React on :5173 showed a CORS error. People 'fixed' it by turning CORS off in production.\n\nWhat this is\nPostman is not a browser. CORS is a browser rule. curl and Postman do not apply it.\n\nWhat it solves\nYou learn the kitchen is fine. The dining room origin needs Allow-Origin, or Nginx must make /api same-origin.\n\nReal-life example\nA phone order (Postman) vs a student from another school at the canteen gate (browser).\n\nUses\nEvery localhost:5173 → :3000 bug.\n\nWatch out\norigin: * plus cookies is invalid. Do not disable CORS in production.",
      "code": "# Postman 201 — not a browser\n# Browser console: blocked by CORS\n# fix on the SERVER, not in Postman\n# Access-Control-Allow-Origin: http://localhost:5173",
      "lang": "txt",
      "ask": "Most asked · Amazon · Google · Microsoft · Meta"
    },
    {
      "id": 4,
      "level": "beginner",
      "q": "What is a Postman collection?",
      "a": "The problem before\nRoutes lived in chat. New hires guessed URLs. QA had a different list than backend.\n\nWhat this is\nA collection is a saved folder of requests: login, list, create, delete.\n\nWhat it solves\nOne shared menu. Export JSON. Import on another laptop. Run with Newman.\n\nReal-life example\nA binder of order slips for the shop.\n\nUses\nOnboarding, interviews, smoke tests.\n\nWatch out\nA collection with hardcoded prod tokens.",
      "code": "# Collection: Todos\n#   POST {{baseUrl}}/login\n#   GET  {{baseUrl}}/todos\n#   POST {{baseUrl}}/todos\n#   PATCH {{baseUrl}}/todos/:id",
      "lang": "txt",
      "ask": "Most asked · Microsoft · Amazon"
    },
    {
      "id": 5,
      "level": "beginner",
      "q": "What is a Postman environment?",
      "a": "The problem before\nbase URL and tokens were typed twenty times. Staging needed a search-replace.\n\nWhat this is\nAn environment is a set of variables: {{baseUrl}}, {{token}}. You switch Local / Staging.\n\nWhat it solves\nSame collection, different shop.\n\nReal-life example\nA recipe that says 'this street'. Change the street.\n\nUses\nlocal, staging, prod (careful).\n\nWatch out\nDo not commit a prod environment file.",
      "code": "# Local\n#   baseUrl = http://localhost:3000\n# Staging\n#   baseUrl = https://api-staging.example.com\n# GET {{baseUrl}}/todos",
      "lang": "txt",
      "ask": "Most asked · Amazon · Microsoft"
    },
    {
      "id": 6,
      "level": "beginner",
      "q": "GET vs POST vs PUT vs PATCH vs DELETE?",
      "a": "The problem before\nTeams invented /getTodos and /saveTodoNow. Caches and browsers could not guess safety.\n\nWhat this is\nGET read. POST create. PUT replace. PATCH change some fields. DELETE remove.\n\nWhat it solves\nOne shared menu. GET should not write.\n\nReal-life example\nMenu verbs: look, order, replace the plate, add chutney, cancel.\n\nUses\nREST interviews at every company.\n\nWatch out\nGET that deletes. PUT that only patches one field without saying so.",
      "code": "GET    {{baseUrl}}/todos\nPOST   {{baseUrl}}/todos\nGET    {{baseUrl}}/todos/5\nPATCH  {{baseUrl}}/todos/5\nDELETE {{baseUrl}}/todos/5",
      "lang": "txt",
      "ask": "Most asked · Amazon · Google · Microsoft · Meta"
    },
    {
      "id": 7,
      "level": "beginner",
      "q": "What headers do you send?",
      "a": "The problem before\nJSON arrived as a string, or the server ignored the body, or auth 'did not work'.\n\nWhat this is\nHeaders are labels on the envelope. Content-Type says the body is JSON. Authorization carries the ticket. Accept says you want JSON back.\n\nWhat it solves\nThe parser and the auth check see what you meant.\n\nReal-life example\nA parcel sticker: 'fragile' and 'from Ada'.\n\nUses\nEvery JSON API. File upload uses multipart instead.\n\nWatch out\nWrong Content-Type → empty req.body in Express.",
      "code": "Content-Type: application/json\nAuthorization: Bearer {{token}}\nAccept: application/json",
      "lang": "txt",
      "ask": "Most asked · Amazon · Google"
    },
    {
      "id": 8,
      "level": "beginner",
      "q": "What is Authorization: Bearer?",
      "a": "The problem before\nCookie login in the browser did not exist in Postman. Protected routes were 401.\n\nWhat this is\nBearer means 'here is a token'. Usually a JWT from POST /login. The server checks the stamp.\n\nWhat it solves\nPostman can call /me the same way the app does.\n\nReal-life example\nShow the cinema ticket. The word Bearer is 'this is a ticket'.\n\nUses\nSPAs, mobile, most modern APIs.\n\nWatch out\nToken in the URL or in a screenshot.",
      "code": "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...\n# Postman → Authorization → Type Bearer Token → {{token}}",
      "lang": "txt",
      "ask": "Most asked · Amazon · Microsoft · Google"
    },
    {
      "id": 9,
      "level": "beginner",
      "q": "401 vs 403?",
      "a": "The problem before\nBoth looked like 'not allowed'. Frontend showed the same toast.\n\nWhat this is\n401: we do not know who you are (no or bad token). 403: we know you; this door is closed (not admin).\n\nWhat it solves\n401 → send to login. 403 → hide the button or show 'no access'.\n\nReal-life example\nNo ticket vs ticket for the wrong hall.\n\nUses\nEvery auth interview.\n\nWatch out\nReturning 401 for a logged-in user who is not admin. That logs them out for no reason.",
      "code": "# no token     → 401\n# user token   → 403 on /admin\n# admin token  → 200",
      "lang": "txt",
      "ask": "Most asked · Amazon · Google · Microsoft · Meta"
    },
    {
      "id": 10,
      "level": "beginner",
      "q": "What is a query parameter?",
      "a": "The problem before\nPeople made /todosDone and /todosPending as separate routes.\n\nWhat this is\nThe part after ?: ?done=true&limit=10. Same path, extra filters.\n\nWhat it solves\nOne list route. The clerk filters the binder.\n\nReal-life example\n'Show red shirts, only 10' — same aisle, extra words.\n\nUses\nSearch, pagination, filters.\n\nWatch out\nPasswords in the query string.",
      "code": "GET {{baseUrl}}/todos?done=true&limit=10\ncurl \"http://localhost:3000/todos?done=true&limit=10\"",
      "lang": "txt",
      "ask": "Most asked · Amazon · Google"
    },
    {
      "id": 11,
      "level": "beginner",
      "q": "JSON body vs form-data?",
      "a": "The problem before\nAn HTML form sent fields. fetch sent JSON. The server parser expected the other one. req.body was empty.\n\nWhat this is\nraw JSON is { \"title\": \"Milk\" } with Content-Type application/json. form-data is fields and files (multipart).\n\nWhat it solves\nMatch the parser: express.json() vs multer / urlencoded.\n\nReal-life example\nA sealed lunch box (JSON) vs a tray of labeled bowls plus a photo (form-data).\n\nUses\nJSON for APIs. form-data when a file rides along.\n\nWatch out\nSending JSON with a form-data parser, or the other way around.",
      "code": "# JSON (usual API)\nContent-Type: application/json\n{ \"title\": \"Milk\" }\n\n# file upload\n# Body → form-data → file = photo.png",
      "lang": "txt",
      "ask": "Most asked · Amazon · Microsoft"
    },
    {
      "id": 12,
      "level": "beginner",
      "q": "How do you test login in Postman?",
      "a": "The problem before\nYou pasted a token by hand every ten minutes. It expired. You thought the API died.\n\nWhat this is\nPOST /login with email and password. In Tests, save json.token into {{token}}. Later requests use Bearer {{token}}.\n\nWhat it solves\nOne click login, then the whole collection works.\n\nReal-life example\nGet a day pass at the gate, stamp the next doors.\n\nUses\nAny JWT API.\n\nWatch out\nSaving the password in a shared collection.",
      "code": "# Tests tab on POST /login\n# const json = pm.response.json();\n# pm.environment.set(\"token\", json.token);",
      "lang": "txt",
      "ask": "Most asked · Amazon · Microsoft · Google"
    },
    {
      "id": 13,
      "level": "intermediate",
      "q": "What is a Postman test script?",
      "a": "The problem before\nA 200 with { \"ok\": false } looked green. Humans blinked.\n\nWhat this is\nA tiny script after the response: status is 201, body has id. Red if the kitchen lied.\n\nWhat it solves\nCollections become checks, not only clicks. Newman can fail CI.\n\nReal-life example\nA clerk who counts the plates, not only hears 'ready'.\n\nUses\nSmoke tests, interview take-homes.\n\nWatch out\nAsserting the whole body when only id matters. Brittle tests.",
      "code": "pm.test(\"creates a todo\", function () {\n  pm.response.to.have.status(201);\n  pm.expect(pm.response.json().id).to.be.ok;\n});",
      "lang": "txt",
      "ask": "Most asked · Microsoft · Amazon"
    },
    {
      "id": 14,
      "level": "intermediate",
      "q": "What is Newman?",
      "a": "The problem before\nThe collection was a local habit. Deploy broke /login and nobody knew until a user called.\n\nWhat this is\nNewman is Postman without the window. It runs the collection in a terminal or GitHub Action.\n\nWhat it solves\nThe same orders run on every PR.\n\nReal-life example\nA robot waiter after every kitchen change.\n\nUses\nCI smoke tests.\n\nWatch out\nPointing Newman at production with DELETE requests.",
      "code": "npx newman run todos.postman_collection.json -e local.json",
      "lang": "txt",
      "ask": "Most asked · Amazon · Microsoft"
    },
    {
      "id": 15,
      "level": "beginner",
      "q": "Thunder Client vs Postman?",
      "a": "The problem before\nAlt-tab to a heavy app for one GET.\n\nWhat this is\nThunder Client is Postman inside VS Code. Same method, URL, headers. REST Client uses a .http file.\n\nWhat it solves\nTry the route next to the code you just wrote.\n\nReal-life example\nA notepad on the kitchen door.\n\nUses\nSolo, small teams, commit .http without secrets.\n\nWatch out\nA committed Bearer token.",
      "code": "### GET list\nGET http://localhost:3000/todos",
      "lang": "txt",
      "ask": "Most asked · Microsoft"
    },
    {
      "id": 16,
      "level": "beginner",
      "q": "What is Insomnia / Hoppscotch / Bruno?",
      "a": "The problem before\nPeople thought Postman was the only HTTP client.\n\nWhat this is\nInsomnia and Hoppscotch are other GUIs. Bruno keeps the collection as files you can Git. Hoppscotch runs in the browser.\n\nWhat it solves\nSame job: send HTTP. Pick the window you will actually use.\n\nReal-life example\nDifferent counters, same dosa.\n\nUses\nBruno when you want the collection in the PR. Hoppscotch for a quick try.\n\nWatch out\nBrand wars. Interviewers want method + status, not a logo.",
      "code": "# Bruno / Git-friendly folder\n# collections/todos/get-list.bru\n# meta { GET /todos }",
      "lang": "txt",
      "ask": "Most asked · Amazon · Google"
    },
    {
      "id": 17,
      "level": "beginner",
      "q": "What is Swagger / OpenAPI?",
      "a": "The problem before\nThe wiki listed dead routes. Types drifted. Frontend sent the old field name.\n\nWhat this is\nOpenAPI is a spec of paths, bodies, and codes. Swagger UI is the clickable menu. FastAPI builds both from your functions.\n\nWhat it solves\nThe running app is the menu. Try it without Postman.\n\nReal-life example\nA menu the kitchen reprints when a dish dies.\n\nUses\nFastAPI /docs, Spring, any public API catalog.\n\nWatch out\nPublic /docs leaking admin routes.",
      "code": "# FastAPI\n# http://localhost:8000/docs      Swagger UI\n# http://localhost:8000/redoc\n# http://localhost:8000/openapi.json",
      "lang": "txt",
      "ask": "Most asked · Amazon · Google · Microsoft · Uber"
    },
    {
      "id": 18,
      "level": "beginner",
      "q": "How do you debug a failing API?",
      "a": "The problem before\nPeople refreshed the React page. The real error was a 400 in the Network tab they never opened.\n\nWhat this is\nRepeat the call in Postman or curl. Read status, then body, then headers. Change one thing: URL, method, header, body.\n\nWhat it solves\nYou name the broken layer: DNS, TLS, 401, 422, or the UI.\n\nReal-life example\nA mechanic who checks the engine before replacing the steering wheel.\n\nUses\nEvery 'it does not work' ticket.\n\nWatch out\nChanging five things at once. You will not know what fixed it.",
      "code": "curl -i http://localhost:3000/todos\n# 1) did it connect?\n# 2) status?\n# 3) body message?\n# 4) then open DevTools → Network on the page",
      "lang": "txt",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 19,
      "level": "beginner",
      "q": "Postman vs browser Network tab?",
      "a": "The problem before\nYou needed cookies the page already had, or you needed a clean request with no cookies.\n\nWhat this is\nNetwork tab is what the page really sent (cookies, CORS, origin). Postman is a clean envelope you build.\n\nWhat it solves\nUse Network to copy the failing call. Use Postman to change one header and retry.\n\nReal-life example\nSecurity camera (Network) vs a practice order at the counter (Postman).\n\nUses\nCORS, cookie auth, CSRF.\n\nWatch out\nCookie login that works in the browser and 401s in Postman — you forgot the cookie or CSRF header.",
      "code": "# Chrome DevTools → Network → the red call → Copy as cURL\n# paste in a terminal or Import into Postman",
      "lang": "txt",
      "ask": "Most asked · Google · Meta · Amazon"
    },
    {
      "id": 20,
      "level": "intermediate",
      "q": "How do you share an API with a teammate?",
      "a": "The problem before\nSlack had screenshots of URLs. Tokens expired. Staging changed.\n\nWhat this is\nShare a collection plus a Local env without secrets. Or commit .http / Bruno files. Or point them at /docs.\n\nWhat it solves\nThey import and hit Send. No archaeology.\n\nReal-life example\nHanding over the order binder and the street name, not your house keys.\n\nUses\nPR description, QA, interviews.\n\nWatch out\nExport with 'include tokens'.",
      "code": "# Export Collection (no prod env)\n# or commit api.http\n# or send https://staging.example.com/docs",
      "lang": "txt",
      "ask": "Most asked · Microsoft · Amazon"
    },
    {
      "id": 21,
      "level": "beginner",
      "q": "What status codes should you know?",
      "a": "The problem before\nEverything was 200 with an error inside, or everything was 500.\n\nWhat this is\n200 ok, 201 created, 204 no body, 400 bad input, 401 login, 403 forbidden, 404 missing, 409 conflict, 422 validation, 429 rate limit, 500 server bug.\n\nWhat it solves\nThe UI and Postman tests can branch on the stamp, not on English in the body.\n\nReal-life example\nKitchen stamps: ready, we need a name, closed, too many orders.\n\nUses\nEvery backend and frontend interview.\n\nWatch out\n200 for a create. 500 for a missing field (that is 400/422).",
      "code": "# 201 create     400 bad JSON\n# 401 no token   403 not admin\n# 404 missing    429 slow down\n# 500 our bug",
      "lang": "txt",
      "ask": "Most asked · Amazon · Google · Microsoft · Meta"
    },
    {
      "id": 22,
      "level": "intermediate",
      "q": "What is idempotent? Why does PUT vs POST matter?",
      "a": "The problem before\nA retry of POST /orders created two dosas. The user clicked twice on a slow network.\n\nWhat this is\nIdempotent means doing it again does not change the result. GET, PUT, DELETE should be. POST create usually is not.\n\nWhat it solves\nRetries are safe on PUT /todos/5. POST needs an Idempotency-Key or a unique constraint.\n\nReal-life example\nTelling the clerk 'shelf 5 is Milk' twice vs 'add a Milk' twice.\n\nUses\nPayments, order create, interview system design.\n\nWatch out\nA GET that is not idempotent because it deletes.",
      "code": "# retry is safe\nPUT {{baseUrl}}/todos/5\n{ \"title\": \"Milk\", \"done\": true }\n\n# retry may double\nPOST {{baseUrl}}/orders\n{ \"dish\": \"dosa\" }",
      "lang": "txt",
      "ask": "Most asked · Amazon · Uber · Google"
    },
    {
      "id": 23,
      "level": "beginner",
      "q": "How do you send a file?",
      "a": "The problem before\nJSON cannot hold a photo well. People base64'd a 10MB image into a field and the server died.\n\nWhat this is\nform-data with a file key. Content-Type becomes multipart/form-data. curl uses -F.\n\nWhat it solves\nThe photo is a part. Title can be another part.\n\nReal-life example\nA tray: a card that says Milk, plus the photo clipped on.\n\nUses\nAvatars, CSV import.\n\nWatch out\nForgetting file size limits (Nginx client_max_body_size).",
      "code": "curl -X POST http://localhost:3000/avatar \\\n  -H \"Authorization: Bearer {{token}}\" \\\n  -F \"file=@./me.png\" \\\n  -F \"title=Ada\"",
      "lang": "txt",
      "ask": "Most asked · Amazon · Microsoft"
    },
    {
      "id": 24,
      "level": "intermediate",
      "q": "What is a mock server?",
      "a": "The problem before\nFrontend was blocked until backend finished /todos.\n\nWhat this is\nA fake API that returns the agreed JSON. Postman Mock, MSW, or a tiny Express stub.\n\nWhat it solves\nThe UI can be built against the contract. Swap the baseUrl later.\n\nReal-life example\nA cardboard kitchen that serves plastic dosas so the waiters can practice.\n\nUses\nParallel work, demos, tests.\n\nWatch out\nShipping the mock URL to production.",
      "code": "# Postman Mock: same collection, fake 200\n# GET {{mockUrl}}/todos → [{ \"id\": 1, \"title\": \"Milk\" }]",
      "lang": "txt",
      "ask": "Most asked · Amazon · Google"
    },
    {
      "id": 25,
      "level": "beginner",
      "q": "How do companies ask this in interviews?",
      "a": "The problem before\nCandidates said 'I use Postman' and could not name a status code or why CORS failed.\n\nWhat this is\nThey want the story: I hit the API without the UI. I read 401 vs 403. I know Postman is not a browser. I can write the curl.\n\nWhat it solves\nYou sound like you have shipped a route, not only imported a collection.\n\nReal-life example\nA cook who can plate a dosa without the restaurant app.\n\nUses\nAmazon, Google, Microsoft, every backend/frontend screen.\n\nWatch out\nListing tool names. Say method, URL, status, and one bug you found.",
      "code": "# say this\n# \"I reproduce in curl: curl -i localhost:3000/me\n#  401 meant I forgot Bearer. CORS is a browser-only gate.\"",
      "lang": "txt",
      "ask": "Most asked · Amazon · Google · Microsoft · Meta · Adobe"
    }
  ]
};
