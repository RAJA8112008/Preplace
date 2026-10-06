"use strict";

const fs = require("fs");
const path = require("path");

const story = (a) => {
  const keys = ["problem", "what", "solves", "example", "uses", "watch"];
  for (const k of keys) {
    const text = String(a[k] ?? "");
    const n = text.trim().split(/\s+/).filter(Boolean).length;
    if (n < 50) {
      throw new Error(`story() "${k}" has ${n} words (need >= 50): ${text}`);
    }
  }
  return [
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
};

const notes = [
  {
    title: "The problem before Postman",
    body: story({
      problem:
        "You tested the API only from the React page. A button hid the URL, the method, and the token behind a click. When the page failed you did not know if the kitchen was closed or the waiter wrote the order wrong. Refreshing the dining room told you nothing about the stove. Guests saw a spinner while the real order never left the table.",
      what:
        "Postman is a desktop HTTP client, a separate window for talking to an API without the dining room in the way. You pick GET or POST, type the URL, add headers and a JSON body, press Send, and read the status plus the JSON. Unlike the browser, it does not apply CORS. Unlike curl, you get a form instead of flags. Save those orders as a collection and reuse them.",
      solves:
        "You prove the kitchen works before you blame the dining room. Mobile, web, and a teammate can share the same saved orders in a collection, so nobody guesses the route from a screenshot. If POST /orders returns 201 in Postman, the stove is open. If React still fails, the waiter wrote the slip wrong or CORS blocked the canteen gate.",
      example:
        "Think of a restaurant counter that is not the dining hall. You walk up, say one dosa (POST /orders), and see 201 plus the plate. If that fails, the waiter (React) is not the first suspect. The clerk stamps the slip at the window while guests at tables never see the stove. That counter is Postman: same kitchen, no dining-room noise.",
      uses:
        "Hit localhost:3000, a staging URL, or a teammate's ngrok from the same counter window. Save login once, reuse the token on later slips. Export the same calls as curl for Slack or CI when there is no GUI. Use it on take-homes, QA hand-off, and any night the dining room spinner hides whether the kitchen even received the order.",
      watch:
        "Postman is not a browser. CORS will not stop it, so a green Send does not prove the React app on :5173 can call :3000. Cookies the page already has are missing unless you add them. A production token saved in a shared collection is a leak, like leaving the day pass on the public counter."
    })
  },
  {
    title: "What Postman is",
    body: story({
      problem:
        "curl flags are easy to mistype on a tired night. fetch lives inside the page, so the dining room wraps every order. There was no shared menu of here are the real routes, only chat screenshots and guesses. A teammate could not replay the same slip. Interviews asked for the HTTP, and people pointed at a button instead of method, URL, headers, and body.",
      what:
        "Postman is an HTTP client with a form: method, URL, query params, headers, and body, then Send. The reply pane shows status, time, size, and the JSON body. That is the same envelope curl builds with flags and the browser hides behind a click. You can save the slip in a collection, switch streets with an environment, or copy the working request as curl when a script needs the phone-call version.",
      solves:
        "One counter to try GET /todos, POST /todos, and GET /me with a Bearer token. You save that pad as a collection and share the menu instead of a screenshot. When the stamp is 201, the kitchen accepted the dish. When it is 401, the ticket is missing. The dining room is out of the argument until the stove itself is proven.",
      example:
        "A printed order pad at the restaurant counter. Line 1 is GET /todos. Line 2 is POST /todos. The kitchen stamp is 200 or 401, not a spinner on a guest table. The clerk reads the method and the dish name out loud, then slides the stamped slip back. Nobody needs the dining-room app to learn whether the stove still serves that plate.",
      uses:
        "Local APIs on localhost, interview take-homes, hand-off to QA, and generating curl from a working request. Use the same pad when a teammate's ngrok street changes, or when you must show an interviewer the exact method, URL, headers, and JSON without opening React. Export the collection when the next shift needs the same orders.",
      watch:
        "Saving a real production token inside a shared collection is a leak, like pinning the day pass to the public menu. Put secrets in environment variables, not in the URL path. Remember the counter skips CORS, so a green reply here is not a green React page. Do not treat the GUI as a different protocol than curl."
    })
  },
  {
    title: "Collections and environments",
    body: story({
      problem:
        "Everyone had a different base URL in their head. Ada used localhost:3000. Bob used the live site. Tokens were pasted into every request by hand and expired at odd hours. A new hire guessed routes from Slack. Staging broke twenty slips the morning someone changed the street and nobody updated the pad.",
      what:
        "A collection is a folder of saved HTTP requests: method, URL, headers, and body kept as reusable slips. An environment is a box of names such as {{baseUrl}} and {{token}}. The same GET {{baseUrl}}/todos works on the laptop kitchen and on staging because only the street changes. Postman fills the braces before Send, the way a clerk stamps the shop address on an otherwise identical order pad.",
      solves:
        "Switch Local to Staging without rewriting twenty URLs. One login request can write {{token}} for the rest of the pad, so later doors see the day pass. Onboarding becomes import the collection, pick the street, press Send. Interviews get a shared menu instead of a scavenger hunt through chat. The kitchen address lives in one box, not in twenty half-remembered tabs.",
      example:
        "A recipe card that says use the shop on this street. You change the street (the environment) when the truck moves to staging. The dishes (the requests) stay the same: one dosa is still POST /orders. The clerk does not rewrite every line of the pad. Guests in the dining room never see which alley the kitchen door faces tonight.",
      uses:
        "Keep Local, staging, and a careful prod box. Hand a new teammate the collection on day one. In an interview, say here is the collection, try POST /login, then GET /me. Run the same pad in Newman after deploy. Anytime the street changes and the dishes must not, put the address in {{baseUrl}} instead of twenty hardcoded hosts.",
      watch:
        "A prod environment with a real key must not be committed or synced like a public menu. Postman cloud sync is convenient; treat the file like .env, not like README samples. Never export include tokens for Slack. A collection that hardcodes https://api.prod with a live Bearer is a leaked day pass sitting on the counter."
    })
  },
  {
    title: "curl is the same idea",
    body: story({
      problem:
        "A teammate does not have Postman installed. CI cannot click Send on a desktop window. You needed the same request as text that a README, a GitHub issue, or an SSH session could run. Screenshots of twenty fields did not paste. The kitchen order existed only as a GUI click, so the next shift could not replay the plate.",
      what:
        "curl is the terminal twin of Postman, the phone-call version of the same HTTP envelope. Same method, URL, headers, and body; only the window changes. Postman can copy as curl. You can paste a curl line back into Postman and recover the form. Neither tool is a browser: both skip CORS and both speak raw HTTP to the kitchen, not to the dining-room JavaScript.",
      solves:
        "One command in a README or GitHub issue proves the stove. A health check in a script hits the same path after deploy. You keep the collection for exploring and the curl for machines that have no GUI. The proof is the bytes on the wire, not the brand of the counter. Interviews often ask you to write the curl, not to describe the Send button.",
      example:
        "A paper order pad versus a phone call to the same kitchen. One dosa is the same dish either way. curl is the phone call: you speak method, URL, and the ticket out loud. Postman is the paper pad you fill at the counter window. The stove does not care which clerk wrote the slip. The stamp is still 201 or 401.",
      uses:
        "README samples, CI smoke checks, SSH on a server that has no desktop, and interviews that say show me the curl. Copy a failing Postman call as curl into a ticket so the next cook can replay it. Use curl when you already have a shell and do not want to open another window just to learn if the kitchen is awake.",
      watch:
        "A token in a curl you paste into Slack is still a leak, same as pinning the day pass to the public menu. Prefer {{token}} in Postman and a private environment file. Redact Authorization before the issue goes public. Remember curl, like Postman, is not the browser: a green terminal line does not prove React on :5173 can pass the canteen gate."
    })
  },
  {
    title: "Other tools (same job)",
    body: story({
      problem:
        "People fight over the brand on the counter while the kitchen waits. The job is the same: send HTTP and read JSON. Teams delayed a take-home because someone refused to install Postman. Others learned five GUIs and still could not name GET versus POST. The dining room never cared which window took the order, only whether the plate came back.",
      what:
        "Insomnia and Hoppscotch are other HTTP-client windows like Postman: method, URL, headers, body, Send. Thunder Client and REST Client live inside VS Code so the pad sits next to the route. Bruno stores the collection as files in Git. Swagger UI / OpenAPI is a live menu the API itself serves, often at /docs. curl remains the phone call when there is no GUI at all.",
      solves:
        "You pick the window you already have. FastAPI /docs is a menu the kitchen prints from code. Thunder Client is one click from the editor. Bruno is a folder you can review in a PR. Hoppscotch runs in a browser tab. The skill transfers because every tool still builds the same envelope: method, URL, headers, body, then a status stamp.",
      example:
        "Different counters on the same street, same kitchen in the back. Dosa is still POST /orders whether you stand at Postman's window, Thunder Client's notepad on the kitchen door, or shout curl down the phone. The clerk stamps 201 or 401 on the slip. Guests in the dining room eat the same plate. Nobody rewrites the recipe because the counter painted a new logo.",
      uses:
        "VS Code: Thunder Client or a .http file. Python API: Swagger at /docs. A team that wants Git history: Bruno. Quick share with no install: curl in the README. Use Postman when the collection and environments already live there. Interviews care that you can send the order, not that you memorized every competing counter's keyboard shortcut.",
      watch:
        "Learning twenty tools is not a skill. Method plus URL plus status plus JSON is the skill. Do not spend the interview naming logos. A public /docs can leak admin routes. A committed .http file with a live Bearer is still a leaked day pass. Pick one counter and learn the envelope deeply."
    })
  },
  {
    title: "Auth in the request",
    body: story({
      problem:
        "The UI sent a cookie you never saw. Or the token sat in localStorage and you forgot to copy it onto the next slip. Every protected route looked broken, as if the kitchen had closed, when the waiter simply forgot the ticket. Postman sent a clean envelope with no proof, and /me stamped 401 while the dining room still looked logged in.",
      what:
        "APIs want proof on the HTTP request itself: Authorization Bearer plus a JWT, a Cookie header, or an API key. Postman has an Authorization tab that writes that header for you, the same way curl uses -H. This is not a browser session; you must attach the ticket to each slip. Collections can store {{token}} after login so later requests reuse the day pass without pasting secrets into the URL.",
      solves:
        "You can call GET /me the same way the app does, without opening the dining-room browser. If Postman is 200 with the header and 401 without it, the kitchen's door policy is clear. You separate a missing ticket from a wrong hall, and you stop blaming React for a header the page never copied. QA can replay the protected pad from the collection.",
      example:
        "A cinema ticket shown at the kitchen door, not a smile at the dining table. No ticket means 401: the clerk does not know you. A ticket for hall 2 while you walk into hall 1 means 403: they know you, that door is closed. The stamp lives on the envelope. Leaving the ticket in your coat (localStorage) does not help the counter window unless you pin it on the slip.",
      uses:
        "JWT APIs after POST /login, API keys on third-party kitchens, Basic auth on old admin tools, and cookie sessions you must copy from DevTools. Use the Authorization tab or a raw header. Save the token into the environment so the rest of the collection can say Bearer {{token}}. Interviewers want you to attach the ticket on the request, not in the query string.",
      watch:
        "401 means who are you. 403 means I know you; you may not do this. Do not mix them in an interview or the dining room will log people out for a missing admin role. Never put the token in the URL. A screenshot of Authorization with a live JWT is a leaked day pass. Postman will not send the browser's cookies unless you add them."
    })
  }
];

const examples = [
  {
    title: "GET list (Postman or curl)",
    lang: "txt",
    desc: story({
      problem:
        "You did not know if the API was even up. The React list page spun, and the waiter blamed the kitchen without walking to the counter. A missing server, a wrong port, and an empty table all looked like the same dining-room error. Nobody had typed GET against the real URL. Screenshots of a blank card did not prove whether the stove had a plate.",
      what:
        "GET is the HTTP method that asks for a resource. You set the method, type the URL, add headers if needed, and send with an empty body. Postman and curl both do this; the browser hides it behind a page load. The answer is usually 200 plus a JSON array or object. This is the simplest counter order: look at the shelf, do not cook a new dish, do not throw one away.",
      solves:
        "Prove the kitchen is open before you build the list page. If GET /todos returns 200 and rows, the stove has plates. If it connection-refuses, the dining room spinner was never the bug. You learn the shape of the JSON at the counter, then teach the waiter. Health checks and interview take-homes start with this same look-don't-write slip.",
      example:
        "Asking the clerk at the restaurant counter what todos exist, the way you ask what dosas are left on the shelf. You do not hand over a new recipe. You do not cancel anyone's plate. The clerk reads the binder and stamps 200, or says the kitchen is dark. Guests at tables never need to know you walked to the window first.",
      uses:
        "Any list screen, a health check after deploy, and the first request in a new collection. Hit localhost or staging with GET before you debug React. Interviewers often start with show me the list call. Newman can run the same GET as a smoke test. Copy as curl when a teammate has no Postman and still needs to see the shelf.",
      watch:
        "GET must not create or delete. A GET that inserts a row or wipes a todo is a kitchen that cooks when you only asked to look. Do not put secrets in the query string; they land in access logs. A 200 with an empty array is success, not a down stove. CORS may still block the dining room even when this counter GET is green."
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
      problem:
        "A form did nothing. Was the body wrong, or the route missing, or the waiter never left the table? The dining room showed a toast while the kitchen never received a dish name. People refreshed React instead of walking to the counter with a real POST. You could not tell a 404 route from a 400 validation stamp without seeing the envelope.",
      what:
        "POST is the HTTP method that sends a new thing to the kitchen. In Postman you pick POST, type the URL, set Content-Type application/json, and put the object in the raw body. curl does the same with -X POST, -H, and -d. Unlike GET, this slip carries a payload. The browser's fetch hides those four pieces; the counter window lays them out so you can change one field and resend.",
      solves:
        "You see 201 and the saved row, or 400 with the field that failed, before you blame the dining-room form. If the counter stamp is 201, the stove accepted the dosa. If it is 404, the route is wrong. If req.body is empty, the parser never saw JSON. The waiter can be taught the working envelope instead of guessing which kitchen door to knock.",
      example:
        "Ordering one dosa at the restaurant counter: POST /orders with a JSON body that says the dish is dosa. The clerk stamps 201 and hands back the plate id. You did not ask the dining room to invent the order. If the slip lacks a dish name, the kitchen stamps 400 instead of cooking air. Same envelope in curl when the phone is easier than the pad.",
      uses:
        "Signup, create todo, /predict, checkout, and any take-home that says add a row. Use Postman to prove the body shape, then copy as curl into the README. Newman can POST a smoke todo after deploy. Interviews want you to name method, Content-Type, and the 201 stamp, not only the React submit handler.",
      watch:
        "A GET that creates is a bug: looking at the shelf should not cook a dosa. Empty body with the wrong parser leaves req.body undefined, as if the clerk opened a sealed box labeled soup and found no bowl. Do not send form-data when express.json() is listening. Confirm 201, not a 200 that hid an error string inside."
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
      problem:
        "/me returned 401 and the React page only said error. The dining room hid whether login failed, the token expired, or the waiter forgot to pin the ticket on the next slip. People pasted a JWT into localStorage and never copied it into Postman. Every protected door looked closed. You could not tell a bad password from a missing Authorization header.",
      what:
        "Login is a POST that returns a JWT in JSON. The next HTTP request must send Authorization Bearer plus that token in a header, not in the URL. Postman's Authorization tab writes the header; curl uses -H. Collections save the token into {{token}} after the login Tests script so later slips reuse the day pass. This is the same envelope the browser builds after fetch, laid out on the counter.",
      solves:
        "You separate login is broken from you forgot the header. If POST /login is 200 and GET /me without the header is 401, the kitchen's door policy is clear. If both fail, the stove rejected the password. The dining room toast stops being the only clue. QA can replay login then /me from the shared pad without opening React.",
      example:
        "Show the cinema ticket at the next kitchen door. First you buy the day pass at POST /login. Then GET /me is the clerk asking to see the ticket on the envelope. No ticket, 401. Ticket in your coat pocket (localStorage) does not help the counter unless you pin it on the slip. The dining room may still look logged in while Postman walks up empty-handed.",
      uses:
        "Any protected route: /me, admin lists, checkout, take-home authed CRUD. Save {{token}} once and reuse Bearer on the collection. Interviewers want the two-step story: login body, then Authorization header. Newman can fail the PR if /me is 401 after a supposed login. Copy as curl when Slack needs the exact ticket header.",
      watch:
        "Do not put the token in the URL. It lands in access logs, browser history, and shared screenshots. A copied curl with a live JWT is a leaked day pass on the public menu. 401 is missing or bad proof; 403 is the wrong hall. Postman will not inherit the browser cookie jar unless you add those headers yourself."
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
      problem:
        "Twenty requests said localhost. Staging broke every URL the morning the truck moved. People search-replaced hosts and missed one slip. Tokens were pasted per request and expired at odd hours. A new hire imported the collection and hit the laptop kitchen while thinking they were on staging. The dining room had its own base URL in a .env nobody matched to the pad.",
      what:
        "An environment is a box of names the HTTP client substitutes before Send. {{baseUrl}} is the street: Local is http://localhost:3000, Staging is https://api.example.com. {{token}} is the day pass filled after login. The collection keeps method, path, headers, and body. Postman (and curl with a BASE shell variable) points the same dishes at a new shop without rewriting the pad. The browser's VITE_API_URL is the dining-room twin of this box.",
      solves:
        "Switch the dropdown. The collection stays the same. Onboarding is pick Local and press Send. Interviews get one pad that works on the laptop kitchen. Newman takes -e local.json so CI uses the CI street. You stop hunting twenty hardcoded hosts when the alley changes. Login writes {{token}} once; later doors reuse the ticket.",
      example:
        "A recipe card that says use this shop. You change the shop (the environment), not every dish on the pad. One dosa is still POST /orders. The clerk stamps the current street on the slip. Guests in the dining room never see which alley the kitchen door faces. Staging and laptop kitchens cook the same menu from different addresses.",
      uses:
        "Local, staging, and a locked-down prod box. Team share of the collection plus a secret-free Local env. Interview take-homes that say import this and hit login. CI with Newman and an env file. Anytime the street changes and the dishes must not, put the host in {{baseUrl}} instead of twenty tabs.",
      watch:
        "Prod tokens in a shared cloud workspace are a leaked day pass on the public menu. Do not export include secrets. Never commit a prod environment file. A collection that still hardcodes localhost in some slips will surprise you when the dropdown says Staging. Treat Postman sync like .env, not like a README."
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
      problem:
        "People stuffed filters into the body of a GET, or put ids in random query strings, or posted a new dish with the id only in a header. The dining room and the kitchen argued about where the order lived. Caches could not guess safety. Interviews asked path versus query versus body and candidates waved at fetch. Screenshots hid which piece of the envelope held the number 5.",
      what:
        "The path names the thing (/todos/5). The query string after ? filters the list (?done=true&limit=10). The body is the payload of POST, PUT, or PATCH, usually JSON with Content-Type set. Postman has separate tabs for Params, path variables, and Body. curl puts path in the URL, query in the quotes, and body in -d. The browser mixes them inside fetch. GET should not carry a write body.",
      solves:
        "The URL reads like English. Caches and access logs stay sane because look-up keys sit in the path and filters sit in the query. The kitchen parser knows where to find the new label. You debug one piece at a time at the counter: wrong id, wrong filter, or wrong JSON. The waiter stops inventing /todosDone as a second door.",
      example:
        "Shelf 5 is the path: which rack. Only the red boxes is the query: filter the shelf. The new label you want printed is the body of a PATCH. You do not whisper the new label while only asking to look. The restaurant clerk reads the aisle number, the color filter, and the sticker separately. Guests never see you rearrange those three parts of the slip.",
      uses:
        "REST list, filter, pagination, and update at the restaurant counter. Teaching a take-home the difference between GET /todos/5 and GET /todos?done=true. Interview system-design sketches of the same shelf. OpenAPI menus that document path params versus query versus schema. Newman checks that filter queries do not accidentally POST. Use the Params tab before you invent a second kitchen door.",
      watch:
        "Secrets in the query string appear in access logs, proxies, and Referer headers, like shouting the day pass across the dining room. Do not put a JWT after ?. A GET body is ignored by many stacks and surprises others. Path ids that leak other people's rows may be answered with 404 on purpose. Keep writes in POST, PUT, or PATCH bodies."
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
      problem:
        "Every failure was the word error on the dining-room toast. Interviews want the three doors named, and candidates said the API broke. A missing token, a user hitting /admin, and a leftover id all looked identical in React. Nobody read the status stamp at the counter. QA filed one ticket for three different kitchen policies.",
      what:
        "These are HTTP status stamps on the reply, visible in Postman and curl -i before any React toast. 401 means not logged in: no or bad ticket. 403 means logged in but not allowed: wrong hall. 404 means no such thing, or the kitchen hides the row on purpose. The method, URL, and Authorization header decide which door you knocked. The browser Network tab shows the same stamps; the dining room often swallows them.",
      solves:
        "You know whether to send the user to login, hide the button, or show not found. If Postman is 401, pin the ticket. If it is 403, stop retrying login. If it is 404, the id or route is wrong. The waiter can branch on the stamp instead of one generic error. Interviews hear that you read the door, not only the spinner.",
      example:
        "No cinema ticket at the kitchen door is 401. A ticket for hall 2 while you entered hall 1 is 403. No such film on the board is 404. The clerk stamps the envelope, not the dining-room smile. You can walk these three doors in Postman by dropping the header, using a user token on /admin, then asking for /todos/9999.",
      uses:
        "Auth interviews, admin routes, take-home CRUD, and any night the toast says error. Teach frontend to map 401 to login and 403 to hide. Newman can assert each stamp. Copy as curl -i when a ticket needs the raw status line. Swagger menus list these codes next to each path.",
      watch:
        "Some APIs return 404 for other people's ids so you cannot hunt ids, like a clerk who says no such table instead of that table is reserved. Returning 401 for a logged-in non-admin logs them out for no reason. Do not collapse all three into 500. A green Postman 200 on /me does not mean the dining room sent the same ticket."
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
      problem:
        "A bug only happened with that one header. Slack needed the exact request, not a screenshot of twenty fields. The next cook could not replay the plate. CI had no desktop window to click Send. A teammate without Postman guessed the URL. The dining room Network tab had the call, but nobody copied it as text the kitchen could hear.",
      what:
        "Postman can export the current HTTP envelope as curl: method, URL, headers, and body as a pasteable command. Code view, then cURL. Thunder Client and Insomnia offer the same photocopy. You can import curl back into Postman and recover the form. That command is the phone-call twin of the counter pad, still not a browser, still skipping CORS, still the same bytes toward the kitchen.",
      solves:
        "Same bytes, no screenshot of twenty fields. A GitHub issue can replay the failing slip. CI can run the command after the API boots. Onboarding becomes paste this, not install this GUI first. You prove the stove with text a shell understands. Interviews often ask you to write that curl, which is just the pad spoken aloud.",
      example:
        "Photocopying the restaurant order slip for the next shift. The clerk copies method, dish, and ticket onto a phone script. The next cook calls the same kitchen and gets the same stamp. Guests in the dining room never see the photocopy. If the slip still has the live day pass written in ink, you handed the next street the keys.",
      uses:
        "GitHub issues, README samples, CI smoke lines, SSH on a box with no GUI, and onboarding a teammate who only has a terminal. Import the curl into Postman when you want the form back. Newman is another way to replay the whole pad. Use Copy as curl whenever Slack starts collecting screenshots of headers.",
      watch:
        "The copy includes your live token unless you used a variable like {{token}}. Pasting that curl into a public issue is pinning the day pass to the menu. Redact Authorization. Remember the command still is not the browser: green curl does not prove React passed CORS. Do not commit the exported line with a real JWT."
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
        "The wiki listed routes that no longer exist. Frontend and backend argued about the JSON shape while the dining room sent the old field name. Chat had screenshots of last year's pad. A take-home had no collection. People opened Postman and guessed paths. The kitchen had already changed the dish and nobody reprinted the menu.",
      what:
        "OpenAPI is a machine-readable menu of paths, methods, bodies, and status codes. Swagger UI, often /docs on FastAPI, is a clickable counter generated from that menu: pick an operation, fill the body, Try it. That Try-it is Postman born from the code, still HTTP method plus URL plus headers plus JSON, still not the dining-room React app. curl and collections remain useful; /docs is the kitchen printing tonight's card.",
      solves:
        "The running app is the menu. Types and 422 stamps stay in sync with the functions. Frontend stops arguing about a field the stove no longer cooks. You can Try it without exporting a collection first. Interviews like that you can read /docs, then replay the same envelope in Postman or curl when you need environments and tests.",
      example:
        "A printed restaurant menu that the kitchen updates when a dish dies, not a stained paper from last year taped above the dining room. Guests (and waiters) read tonight's card. Try it is walking to the counter and ordering from that card. The stamp is still 200 or 422. Last year's wiki is the stained paper nobody should cook from.",
      uses:
        "FastAPI /docs and /redoc, Spring springdoc, Express with swagger-jsdoc, and any public API catalog. Point a teammate at /docs instead of Slack screenshots of last year's pad. Import OpenAPI into Postman when you want a collection. Use Try it for a quick proof at the kitchen's own counter, then save the working call as curl for CI and the next shift.",
      watch:
        "A public /docs on prod can leak admin routes, like posting the staff menu on the sidewalk. Lock it, hide it, or split public and private specs. Try it in the browser may still hit CORS and cookies differently than Postman. A generated menu is only as true as the annotations; a stale decorator is last year's paper again."
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
      problem:
        "Switching to a heavy browser app for every API try broke the flow. You wrote a route, alt-tabbed to Postman, lost the file, and forgot the header. The dining room was even farther. A small team wanted the pad next to the code review. Screenshots of the GUI did not belong in the PR. curl lived in a README nobody updated.",
      what:
        "Thunder Client is an HTTP client inside VS Code: method, URL, headers, body, Send, same envelope as Postman. REST Client uses a .http file you can read as text. Both skip the dining-room React page and skip CORS the way curl does. You still pick GET or POST, still read status and JSON. Collections or folders group the slips. Environments can hold {{baseUrl}} beside the route you just typed.",
      solves:
        "Same collection idea, next to the route you just wrote. The counter window is a notepad on the kitchen door, not another building. A PR can review the .http file. You try the path without leaving the editor. Interviews still hear method, URL, and status; the logo on the notepad does not matter. curl remains the photocopy when CI has no VS Code.",
      example:
        "A notepad taped to the restaurant kitchen door. The cook writes GET /todos, then POST /todos with a JSON dish, and walks one step to the pass. Guests in the dining room never see the pad. The stamp is still 200 or 201. Nobody runs across the street to a branded counter just to ask if the stove has milk.",
      uses:
        "Solo work, small teams, and take-homes where installing Postman feels heavy. Commit .http files if they have no secrets so the next shift can replay the pad. Use Thunder Client when you already live in VS Code. Export or rewrite as curl for GitHub Actions. Import into Postman later if QA wants the full GUI collection.",
      watch:
        "Do not commit a .http file with a real Bearer token. That is pinning the day pass to the kitchen door where Git history keeps a copy. Use variables or a gitignored env. Thunder Client is still not a browser: green Send does not prove React passed CORS. Keep production hosts out of the shared notepad."
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
      problem:
        "The collection was green on Ada's laptop and red after deploy. Nobody ran it in CI. Guests found the broken login first. The dining room looked fine in staging screenshots. A human had to click Send on twenty slips after every kitchen change. The pad existed, but only as a habit, not as a gate. curl one-liners in the README drifted from the real collection.",
      what:
        "Newman is Postman without the window: a CLI that runs the collection's HTTP requests, tests, and environments. Same method, URL, headers, and body as the counter pad, spoken as a terminal command. GitHub Actions can fail the PR if a request or pm.test fails. It is closer to curl-in-a-loop than to a browser. You export the collection and a secret-free env, then newman run after the API boots.",
      solves:
        "The menu is tested on every push, not only when someone remembers to walk to the counter. Login, list, and one create become a smoke gate. You catch a 401 or a missing route before guests sit down. The same pad Ada clicks locally is the pad CI speaks. Interviews like that you can turn a collection into a check, not only a demo.",
      example:
        "A robot waiter that places the same ten orders after every kitchen change. The stove must stamp 200 on health, 200 on login, 201 on one dosa. If a dish dies, the robot fails the shift before guests arrive. The dining room is not involved. Nobody relies on Ada remembering to click Send at midnight after a deploy.",
      uses:
        "Smoke tests: health, login, one CRUD, and a forbidden admin door. Run after docker compose up in CI. Reuse the team's Postman collection instead of rewriting curl by hand. Take-homes that want a green pipeline. Local newman run before you push. Export often so the robot's pad matches the human counter.",
      watch:
        "Do not point CI at production with a write collection. A robot that POST and DELETE on the live kitchen will cook and throw real plates. Keep prod keys out of the env file. Tests that assert the entire JSON body go brittle. Newman still skips CORS, so a green pipeline does not prove the dining room on :5173 can call the stove."
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
        "You only tested through the website. A click hid the URL and the token behind the waiter. You could not tell if the API or the page was wrong. Refreshing the dining room spun while the kitchen never saw a slip. Interviews asked what Postman is, and people said it is for testing without naming method, URL, headers, or body.",
      what:
        "Postman is a desktop HTTP client: you pick the method, type the URL, add headers and a JSON body, press Send, and read status plus JSON. That is the same envelope curl builds with flags and the browser hides behind fetch. You can save slips as a collection and switch streets with an environment. It is not the dining-room React app and it is not a browser, so CORS does not apply.",
      solves:
        "You talk to the kitchen without the dining room. If the counter stamp is 201, the stove accepted the dish. If React still fails, the waiter or the canteen gate is next. Save the orders as a collection so QA and a teammate replay the same pad. You stop guessing routes from screenshots and start showing the envelope.",
      example:
        "A restaurant counter window, not a guest table. One dosa is POST /orders. The clerk stamps 201 and slides the plate id back. Guests in the dining room never see the stove. If that window fails, you do not first blame the waiter. curl is the same order spoken by phone. The browser is the student at the canteen gate, a different rule.",
      uses:
        "Local APIs on localhost, interview take-homes, sharing routes with QA, and exporting curl for CI. Use the counter whenever a dining-room spinner hides the real stamp. Hand a collection to a new hire. Replay /login then /me with a Bearer token. Prove the kitchen before you rewrite the form. Keep the same pad for staging once {{baseUrl}} is the street.",
      watch:
        "Postman skips CORS. Green here does not mean the React app on :5173 can call :3000. Cookies the page has are missing unless you add them. A production token in a shared collection is a leaked day pass. Do not tell an interviewer Postman is magic; say method, URL, headers, body, and the status stamp."
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
        "One person only knew the GUI. CI and a server SSH session have no Postman window to click Send. A teammate asked for the request as text and got a screenshot of twenty fields. The kitchen order lived only as a desktop habit. Interviews said show me the curl and the candidate described a button. README samples drifted from the real pad.",
      what:
        "Both are HTTP clients for the same envelope: method, URL, headers, and body. Postman is the form at the counter. curl is the command, the phone-call twin. Postman copies as curl; you can paste curl back into Postman. Neither is a browser, so neither applies CORS. Collections and environments are the pad and the street; curl uses flags and a BASE variable for the same idea.",
      solves:
        "Share a one-liner in a README or GitHub issue. Click when you are exploring headers and JSON. Machines that have only a shell can still prove the stove. You stop treating the brand as the protocol. The proof is the bytes, so CI, SSH, and the GUI can replay one dish. Interviews hear that you can write the phone script, not only press Send.",
      example:
        "A paper order pad versus a phone call to the same restaurant kitchen. One dosa is the same dish. Postman is the pad you fill at the window. curl is you speaking method, URL, and the ticket aloud. The clerk stamps 201 either way. Guests in the dining room eat the same plate. The stove does not care which clerk wrote the slip.",
      uses:
        "Explore in Postman, then paste curl in GitHub issues, README samples, and CI scripts. Use curl over SSH when the box has no desktop. Import a teammate's curl to recover the form. Newman runs the whole collection when one line is not enough. Interviews often want the curl written on the whiteboard.",
      watch:
        "A copied curl often includes a live token, a day pass inked on the photocopy. Redact Authorization before Slack or a public issue. Prefer {{token}} in Postman and a private env. Green curl still skips CORS, so the dining room may fail. Do not argue brands; name the envelope and the stamp."
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
        "POST /todos was 201 in Postman. React on :5173 showed a CORS error. People fixed it by turning CORS off in production, like leaving the canteen gate open all night. The dining room hid a preflight the counter never ran. Teams blamed fetch, then blamed Postman, then shipped Access-Control-Allow-Origin star with credentials and wondered why the browser still said no.",
      what:
        "Postman is an HTTP client, not a browser. You still send method, URL, headers, and body, but the window is a counter, not a guest page. CORS is a browser rule about one origin calling another. curl and Postman do not apply it, so they walk to the kitchen without the canteen gate. The Network tab on :5173 shows Origin and preflight; Postman's green Send never will. Same kitchen, different door policy.",
      solves:
        "You learn the kitchen is fine when the counter stamps 201. The dining room origin needs Allow-Origin, or Nginx must make /api same-origin so the waiter never crosses the street. You stop disabling CORS in production. Debug splits cleanly: stove first at the counter, then the gate. Interviews hear that you did not treat a GUI success as a browser success.",
      example:
        "A phone order to the kitchen (Postman or curl) versus a student from another school at the canteen gate (the browser on :5173 calling :3000). The stove will cook for the phone. The gate may still say that school is not on the list. Guests at tables only see the gate. The clerk at the counter never hears the argument about origins.",
      uses:
        "Every localhost:5173 to :3000 bug, every Vite-plus-Express take-home, and any SPA on another host than the API. Reproduce in Postman to prove the stove, then fix CORS or a proxy on the server. Copy the failing browser call as curl to see headers. Explain this split in frontend and backend interviews.",
      watch:
        "origin star plus cookies is invalid; the browser will refuse. Do not disable CORS in production to make a demo green. A green Postman send is not a green React page. Credentials need a specific Allow-Origin and Allow-Credentials true. Fix the kitchen's gate or the proxy, not a random Postman setting."
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
        "Routes lived in chat. New hires guessed URLs. QA had a different list than backend. Screenshots of the dining room hid method and headers. Each laptop had a private pad of localhost links. Staging broke because nobody exported the real menu. Interviews asked how the team shares an API and people said we Slack the path.",
      what:
        "A collection is a saved folder of HTTP requests in Postman: method, URL, headers, and body for login, list, create, delete. Each slip is a counter order you can Send again. Environments fill {{baseUrl}} and {{token}} so the same pad works on another street. You can export JSON, import on another laptop, or run the folder with Newman. curl files and Bruno folders are the same idea in text.",
      solves:
        "One shared menu. Export JSON. Import on another laptop. Run with Newman after deploy. Onboarding becomes open the binder, pick Local, press Send. QA and backend argue less about which door exists. You explore in the GUI, then photocopy as curl when a script needs the phone call. The kitchen address lives in the env, not in twenty chats.",
      example:
        "A binder of restaurant order slips for the shop. Page one is POST /login. Page two is GET /todos. The clerk walks the same pad every morning. Change the street with an environment card in the front. Guests in the dining room never flip the binder. A robot waiter (Newman) can read the same slips after the kitchen moves.",
      uses:
        "Onboarding, interview take-homes, QA hand-off, and CI smoke tests after the kitchen moves. Share the collection without secrets so nobody photocopies a day pass. Point a candidate at POST /login then GET /me. Keep the pad next to OpenAPI /docs when you have both. Export often so the binder matches the stove. Use Newman when a robot waiter should read the same slips.",
      watch:
        "A collection with hardcoded prod tokens is a leaked day pass in the binder. Do not export include secrets into Slack or Git. Some slips still hardcoding localhost will ignore the environment dropdown. Newman pointed at production with DELETE is a robot throwing real plates. Treat synced collections like .env."
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
        "Base URL and tokens were typed twenty times. Staging needed a search-replace across the pad. A mistyped host looked like a down kitchen. New hires imported requests that still said localhost while they thought they were on the live street. The dining room had VITE_API_URL and nobody matched it to Postman. Expired tokens sat pasted in headers.",
      what:
        "An environment is a set of variables an HTTP client substitutes before Send: {{baseUrl}} for the street, {{token}} for the day pass. You switch Local and Staging from a dropdown. The collection keeps method, path, headers, and body. Postman fills the braces; curl uses a BASE shell variable for the same trick. The browser's env file is the dining-room twin. Login Tests can write {{token}} so later slips reuse the ticket.",
      solves:
        "Same collection, different shop. Switch the street without rewriting twenty URLs. Onboarding is pick Local. CI passes a staging env file to Newman. Interviews see one pad that works on a laptop kitchen. You stop hunt-and-peck replacing hosts. The day pass lives in one box instead of twenty headers that expire at odd hours.",
      example:
        "A recipe card that says this street. You change the street when the truck moves to staging. The dishes stay: one dosa is still POST /orders. The clerk stamps the current alley on every slip. Guests in the dining room never see which door the kitchen uses tonight. Laptop and staging shops cook from the same binder.",
      uses:
        "Local, staging, and a careful prod box at the restaurant street list. Team share of a secret-free Local env with the collection. Interview take-homes that say import this and pick Local. Newman -e local.json in CI after the stove boots. Anytime the host changes and the dishes must not, put the address in {{baseUrl}} instead of twenty hardcoded tabs.",
      watch:
        "Do not commit a prod environment file or sync live keys to a public workspace. That is leaving the shop keys in the recipe box on the public counter. Export without include tokens. A slip that still hardcodes http://localhost:3000 will ignore the dropdown and hit the laptop kitchen by surprise. Treat the env like .env, not like a README sample."
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
        "Teams invented /getTodos and /saveTodoNow. Caches and browsers could not guess safety. A prefetch could cook a dish. Interviews asked the verbs and candidates listed React handlers. The dining room hid whether a click was GET or POST. Postman collections became a junk drawer of custom paths. Logs could not tell a look from a write.",
      what:
        "These are HTTP methods on the request, the verb on the counter slip. GET reads. POST creates. PUT replaces the whole plate. PATCH changes some fields. DELETE removes. In Postman you pick the verb, then URL, headers, and body. curl uses -X. The browser's fetch hides the verb behind a button. GET should carry no write body. Collections group these five slips for one resource. OpenAPI lists the same verbs on each path.",
      solves:
        "One shared menu so every waiter and every cook agree. GET should not write, so caches and retries stay safe. You can try each verb at the counter and read the stamp before teaching React. Interviews hear a clean REST story. Newman can assert GET stays 200 without creating rows. The kitchen logs become readable: look, order, replace, tweak, cancel.",
      example:
        "Restaurant menu verbs at the counter: look at the shelf (GET), order a new dosa (POST), replace the whole plate (PUT), add chutney (PATCH), cancel the ticket (DELETE). The clerk does not cook when you only asked to look. Guests in the dining room click buttons; you still name the verb on the slip. The stamp tells you if the stove agreed.",
      uses:
        "REST interviews at every company, take-home CRUD, and teaching a collection the five doors for /todos. Map each React button to a verb before you debug. Swagger /docs shows the same list. Copy as curl with the right -X when Slack needs the exact slip. Smoke-test GET and one POST in CI, not a random /saveNow.",
      watch:
        "GET that deletes is a kitchen that throws the plate when you only asked to look. PUT that only patches one field without saying so surprises the next cook who sent a full plate. POST retries can double a dosa. Do not invent /getTodos. A green Postman GET still does not prove the dining room passed CORS."
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
        "JSON arrived as a string, or the server ignored the body, or auth did not work. The dining room toast said error. People pasted a token into the URL. Express left req.body undefined because the envelope had no Content-Type. Interviews asked which headers you send and candidates named CSS. Postman had a Headers tab nobody opened.",
      what:
        "Headers are labels on the HTTP envelope, next to method, URL, and body. Content-Type says the body is JSON (application/json). Authorization carries the Bearer ticket. Accept says you want JSON back. Postman's Headers and Authorization tabs write them; curl uses -H. The browser's fetch sets some automatically and hides others. Collections can reuse {{token}} on the Authorization line. This is still not CORS; these labels ride with every counter slip.",
      solves:
        "The parser and the auth check see what you meant. A correct Content-Type fills req.body. A correct Bearer opens /me. You debug one label at a time at the counter instead of rewriting React. Interviews hear envelope, not magic. QA can copy the working headers as curl. The kitchen stops treating your JSON as an empty box.",
      example:
        "A parcel sticker on the restaurant takeaway box: fragile and from Ada. Content-Type tells the clerk the box is a sealed lunch (JSON), not a tray of bowls (form-data). Authorization is the cinema ticket taped on the lid. Accept is please stamp the reply in JSON. Guests never see the stickers. Wrong stickers mean the kitchen opens the wrong kind of box.",
      uses:
        "Every JSON API, login then /me, file upload (multipart instead of JSON), and take-homes that mysteriously drop the body. Set headers in Postman before you blame the route. Teach frontend the same labels in fetch. Newman can assert Content-Type on the reply. Copy as curl -H when a ticket needs the exact envelope.",
      watch:
        "Wrong Content-Type leaves req.body undefined in Express, as if the clerk opened a soup box and found no bowl. A token in the URL is not a header and lands in logs. Missing Accept can still work, but missing Authorization is 401. Postman may keep an old header you forgot. Multipart plus express.json() will not parse a file."
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
        "Cookie login in the browser did not exist in Postman. Protected routes were 401 while the dining room still looked signed in. People forgot that a counter window has no cookie jar unless you fill it. The token sat in localStorage. Interviews asked what Bearer means and candidates said it is security. Every /me looked like a down kitchen.",
      what:
        "Authorization Bearer means here is a token on this HTTP request, usually a JWT from POST /login. You put it in a header, not in the URL. Postman's Authorization tab writes Authorization: Bearer {{token}}; curl uses -H. The server checks the stamp, then answers /me. This is the same envelope the SPA's fetch builds after login. Collections save the token after a Tests script.",
      solves:
        "Postman can call /me the same way the app does, without opening the dining room. If the header is present and the stamp is 200, the kitchen knows you. If you drop the header and see 401, the door policy is proven. You separate a bad login from a forgotten ticket. QA replays the protected pad from the collection.",
      example:
        "Show the cinema ticket at the kitchen door. The word Bearer is this is a ticket, not a password shouted across the dining room. First you buy the day pass at POST /login. Then you pin it on every later slip. Leaving the ticket in your coat (localStorage) does not help the counter clerk. No ticket, 401. Wrong hall, 403.",
      uses:
        "SPAs, mobile apps, and most modern APIs that mint a JWT. Login then list then create in one collection. Interview take-homes with a protected CRUD. Newman asserting /me is 200 after login. API keys sometimes use a different header; same idea: proof on the envelope, not in the query string.",
      watch:
        "Token in the URL or in a screenshot is a leaked day pass. Do not commit Bearer eyJ... to Git. 401 is who are you; 403 is you may not enter this hall. Postman will not send the browser's cookies automatically. A copied curl often includes the live JWT — redact it before Slack."
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
        "Both looked like not allowed. Frontend showed the same toast. A missing header and a user hitting /admin sent people back to the login form. Interviews asked 401 versus 403 and candidates said unauthorized. The dining room hid the status stamp. QA filed one bug for two kitchen doors. Postman users never read the reply line.",
      what:
        "These are HTTP status stamps on the reply you read in Postman or curl -i. 401 means we do not know who you are: no token, bad token, expired ticket. 403 means we know you; this door is closed: not an admin, wrong hall. The stamp is about the ticket, not JSON shape. The browser Network tab shows the same numbers; React often swallows them into error.",
      solves:
        "401 sends the user to login so they can buy a new day pass. 403 hides the button or shows no access without logging them out. You debug at the counter: drop the header and expect 401; use a user token on /admin and expect 403. Interviews hear two doors, not one toast. The waiter stops bouncing honest users to the login page.",
      example:
        "No cinema ticket at the kitchen door is 401. A ticket for hall 2 while you walk into hall 1 is 403. The clerk knows the difference. Guests in the dining room only hear you cannot sit here. You can walk both doors in Postman in two Sends. curl -i prints the stamp in the first line so nobody has to guess.",
      uses:
        "Every auth interview, admin routes, take-home RBAC, and mapping frontend toasts to the right next step at the restaurant door. Newman can assert both stamps. Teach QA to read the counter status before filing one error bug. OpenAPI lists 401 and 403 on protected paths. Copy as curl -i when a ticket needs the raw door line.",
      watch:
        "Returning 401 for a logged-in user who is not admin logs them out for no reason, like confiscating a valid ticket because the hall was wrong. Do not collapse both into 500. Some APIs use 404 to hide other people's rows; that is a third door. Green Postman with a token still does not prove the dining room sent one."
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
        "People made /todosDone and /todosPending as separate routes. The dining room needed a new door for every filter. Interviews asked what a query parameter is and candidates pointed at the JSON body. GET grew a body. Secrets leaked into URLs. Collections listed ten paths that were really one shelf with extra words after the question mark.",
      what:
        "A query parameter is the part of the URL after ?, such as ?done=true&limit=10. Same path, extra filters. In Postman the Params tab builds that string; you still pick GET, still add headers, still skip a write body. curl quotes the URL so the shell does not eat the ampersands. The browser puts search on the address bar. Path names the resource; query narrows the list; body is for POST and friends.",
      solves:
        "One list route. The clerk filters the binder instead of opening a second kitchen door. Pagination and search stay on GET /todos. Caches can key on the full URL. You try done=true at the counter before teaching React. Interviews hear path versus query versus body. Newman can assert the filtered list without a new path.",
      example:
        "Show red shirts, only ten — same aisle, extra words to the clerk. The aisle is /shirts. The words after ? are color and limit. You do not walk to a second shop called /redShirts. You do not hide the color in a GET body. Guests in the dining room click chips; the slip still reads the same shelf plus filters. The stamp is 200 plus a shorter list.",
      uses:
        "Search, pagination, filters, and take-home list screens at the restaurant counter. Teach the collection one GET with Params instead of ten paths. OpenAPI documents query parameters on the operation. Copy as curl with a quoted URL so the shell keeps the ampersands. Interview system design for list endpoints. Health checks usually skip filters; CRUD lists use them every day.",
      watch:
        "Passwords and tokens in the query string land in access logs, proxies, and browser history, like shouting the day pass across the dining room. Use a header. A GET body for filters is ignored or surprising. Do not invent /todosDone. Secrets in Referer come from query strings too. Green Postman still skips CORS for the dining room."
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
        "An HTML form sent fields. fetch sent JSON. The server parser expected the other one. req.body was empty and the dining room said the API was down. People toggled Postman Body tabs at random. Interviews asked JSON versus form-data and candidates said both are data. File uploads arrived as giant base64 strings in a JSON field and the stove died.",
      what:
        "Raw JSON is an object such as title Milk with Content-Type application/json, the usual API body in Postman (raw) and curl -d. form-data is fields and files, multipart, the tray. x-www-form-urlencoded is the HTML form's classic encoding. Method is still POST; URL and headers still matter. The HTTP client lets you pick the body type explicitly. The browser hides it behind form or fetch.",
      solves:
        "Match the parser: express.json() versus multer or urlencoded. At the counter you see empty body and fix the Content-Type before rewriting React. File plus title can ride as two parts. Interviews hear two boxes, not one blob. QA copies the working body as curl -F or -d. The waiter stops mixing a sealed lunch with a tray.",
      example:
        "A sealed lunch box (JSON) versus a tray of labeled bowls plus a photo clipped on (form-data). The restaurant clerk opens the box the sticker promised. If you hand a sealed box to a clerk who only unpacks trays, the kitchen finds nothing to cook. Guests never see the packaging. POST /todos wants the lunch box. POST /avatar wants the tray.",
      uses:
        "JSON for APIs, signup, todos, and /predict. form-data when a file rides along: avatars, CSV import. urlencoded for old HTML forms. Postman Body tabs: raw JSON versus form-data. curl -d versus -F. Teach take-homes to set Content-Type before they blame the route. Newman should use the same body type the stove expects.",
      watch:
        "Sending JSON with a form-data parser, or the other way around, leaves req.body empty. Multipart plus only express.json() will not see the file. A huge base64 photo inside JSON is not form-data and can crash the stove. Wrong Content-Type is the usual bug. Green Postman still does not prove the dining room sent the same packaging."
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
        "You pasted a token by hand every ten minutes. It expired. You thought the API died. The dining room still looked logged in from a cookie you never copied. Protected slips in the collection were 401 for hours. Interviews asked how you test login in Postman and people said I paste the JWT. QA screenshots showed the password in the body forever.",
      what:
        "POST /login with a JSON body of email and password, Content-Type application/json. Read the JWT from the reply. In Postman's Tests tab, save json.token into the environment as {{token}}. Later requests send Authorization Bearer {{token}} from the Authorization tab. That is the same envelope the SPA builds after fetch login. curl can do the two steps by hand. The collection becomes login then the rest of the pad. Not a browser cookie jar.",
      solves:
        "One click login, then the whole collection works until the day pass expires. You separate a bad password (login 401) from a forgotten header (/me 401). QA replays the pad without hunting localStorage. Newman can run login first and fail the PR if {{token}} never appears. Interviews hear a two-step story: mint the ticket, pin it on later slips.",
      example:
        "Get a day pass at the restaurant gate (POST /login), then stamp the next kitchen doors with that pass (Bearer {{token}}). The clerk at /me only looks at the envelope. Guests in the dining room may already hold a cookie; the counter still needs its own ticket. When the pass expires, buy another at the gate instead of declaring the stove dead.",
      uses:
        "Any JWT API, take-home authed CRUD, and team collections that start with login. Save token in the environment, not in the URL. Run the same two steps as curl in a README. Newman with a login request at the top of the folder. Interview walkthroughs of /login then /me. Mobile and SPA kitchens share this pattern.",
      watch:
        "Saving the password in a shared collection or cloud workspace is leaving the gate code on the public menu. Do not commit real users. Token in the URL or a screenshot is a leak. Tests that assume a forever JWT go stale. Postman still skips CORS, so a green login here does not mean React on :5173 can call /login."
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
        "A 200 with ok false looked green. Humans blinked and clicked Send again. The dining room toast hid a lying kitchen. Collections were a tour, not a check. CI had nothing to fail. Interviews asked how you know a create worked and candidates said I looked at the JSON. A missing id shipped because the status line was enough for tired eyes.",
      what:
        "A Postman test script runs after the HTTP reply: pm.test checks status is 201 and the JSON has an id. It is still the same request — method, URL, headers, body — plus a clerk who reads the stamp and counts plates. Newman runs those scripts in the terminal. The browser has no such pad unless you write tests in code. Collections store the scripts on each slip. curl needs extra jq to approximate this.",
      solves:
        "Collections become checks, not only clicks. Newman can fail CI when the kitchen lies with 200 and ok false. You catch a create that forgot id before guests see an empty card. Interviews hear that Send is not enough. QA shares a pad that turns red. The dining room can still be wrong, but the stove's contract is gated.",
      example:
        "A restaurant clerk who counts the plates, not only hears the cook shout ready. The slip said 201 and an id; the clerk ticks the box. If the kitchen shouted ready and sent an empty tray, the clerk rings the bell (test fail). Guests never vote. The robot waiter (Newman) uses the same counting rules after every kitchen change.",
      uses:
        "Smoke tests, interview take-homes with a collection, and CI after deploy. Assert status, one id, maybe a header. Login Tests that save {{token}} often sit beside these checks. Share the folder with QA. Keep scripts small so the pad stays a menu, not a second codebase. Pair with curl plus jq when you have no Newman.",
      watch:
        "Asserting the whole body when only id matters makes brittle tests that fail on a new timestamp. Do not point Newman at production writes. Scripts cannot prove CORS for the dining room. A green local Send with no tests is still a human blink. Keep secrets out of assertion messages and screenshots."
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
        "The collection was a local habit. Deploy broke /login and nobody knew until a user called. Ada's laptop was green. Staging was red. The dining room looked fine in a screenshot. Humans forgot to click Send after the kitchen moved. curl in the README drifted from the real pad. Interviews asked how you automate Postman and people said we do not.",
      what:
        "Newman is Postman without the window: a CLI HTTP runner for the collection's methods, URLs, headers, bodies, and test scripts. You export the pad plus a secret-free environment and run newman in a terminal or GitHub Action after the API boots. It is closer to curl-in-a-loop than to a browser. CORS is still skipped. The same envelope you click locally becomes a command. Not the React dining room.",
      solves:
        "The same orders run on every PR. A 401 on login fails the gate before guests sit down. You stop relying on Ada's memory. Interviews hear collection plus CI, not only a GUI demo. QA's pad and the pipeline share one menu. The kitchen change is proven by stamps, not by a spinner screenshot.",
      example:
        "A robot waiter after every kitchen change, placing the same ten restaurant orders: health, login, one dosa, maybe a forbidden hall. If the stove stamps wrong, the robot stops the shift. Guests never place those ten themselves. The human clerk still uses the paper pad (Postman) to explore; the robot reads the photocopy (Newman) on a timer.",
      uses:
        "CI smoke tests: health, login, one CRUD, a 403 on admin. Run after docker compose up so the robot waiter meets a live stove. Reuse the team collection instead of rewriting curl by hand. Local newman run before you push. Take-homes that want a green pipeline. Export the pad whenever the human counter changes so the robot stays honest.",
      watch:
        "Pointing Newman at production with DELETE requests throws real plates. Keep prod keys out of the env file in Git. Tests that snapshot entire JSON go brittle. Newman still skips CORS, so a green Action does not prove React on :5173. Do not export include tokens into the CI workspace."
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
        "Alt-tab to a heavy app for one GET. You lost the file, forgot the header, and blamed the stove. The dining room was farther still. Small teams wanted the pad in the PR, not a cloud workspace. Screenshots of Postman did not review well. Interviews asked about Thunder Client and people said it is another Postman without naming the envelope.",
      what:
        "Thunder Client is an HTTP client inside VS Code: method, URL, headers, body, Send, the same envelope as Postman. REST Client uses a .http file you can read as text and commit. Both talk to the kitchen without the React dining room and without CORS. You can keep {{baseUrl}} beside the route. curl remains the photocopy for CI. Collections or folders group the slips. It is still not a browser cookie jar.",
      solves:
        "Try the route next to the code you just wrote. The counter is a notepad on the kitchen door, not another building. A PR can review the .http file. You learn status and JSON without leaving the editor. Interviews still want method and stamp, not the extension name. QA can import later into Postman if they want the full GUI pad.",
      example:
        "A notepad taped to the restaurant kitchen door. The cook writes GET /todos and POST /todos, walks one step, and reads the stamp. Guests in the dining room never see the pad. Nobody runs across the street to a branded window just to ask if milk is on the shelf. The phone call (curl) still works when the notepad is at home.",
      uses:
        "Solo work, small teams, and take-homes that should not require a cloud account. Commit .http files without secrets so the next shift replays the pad. Use Thunder Client when you already live in the editor. Export as curl for GitHub Actions. Keep a Postman collection too if QA prefers that counter.",
      watch:
        "A committed Bearer token is a day pass nailed to the kitchen door in Git history. Use variables or a gitignored env. Thunder Client still skips CORS, so green Send is not a green React page. Do not put prod hosts and live keys in the shared notepad. Brand wars are not the skill; the envelope is."
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
        "People thought Postman was the only HTTP client. Teams delayed a take-home over a license screen. Others learned five logos and still could not name GET versus POST. The dining room never cared which window took the order. Interviews asked for alternatives and candidates listed brands with no envelope. Chat argued while the kitchen waited.",
      what:
        "Insomnia and Hoppscotch are other GUI HTTP clients: method, URL, headers, body, Send, same as Postman. Bruno keeps the collection as files you can Git. Hoppscotch runs in a browser tab but still is a counter, not your React app. Thunder Client and .http files live in VS Code. curl is the phone call. Swagger /docs is the kitchen's own menu. All read a status stamp and JSON.",
      solves:
        "Same job: send HTTP. Pick the window you will actually use. A PR can review Bruno or .http. A teammate with no install can try Hoppscotch or curl. FastAPI /docs is already there. Interviews hear that the skill transfers because the envelope does not change. You stop blocking on one vendor's desktop app.",
      example:
        "Different restaurant counters on the same street, same dosa from the same kitchen. POST /orders is the dish whether the window says Postman, Insomnia, Bruno, or a phone call named curl. The clerk stamps 201 or 401. Guests in the dining room eat one plate. Nobody reprints the recipe because a counter painted a new logo.",
      uses:
        "Bruno when you want the collection in the PR. Hoppscotch for a quick try with no install. Insomnia if the team already lives there. Thunder Client in VS Code. curl in README and CI. Swagger Try it on FastAPI. Postman when the existing pad and environments are already there. Interviews: pick one and show the envelope.",
      watch:
        "Brand wars waste the interview. Interviewers want method, URL, status, and JSON, not a logo. A public Hoppscotch or /docs can still leak admin routes. Git-friendly folders with a live Bearer are still a leaked day pass. Green on any counter still does not prove the dining room passed CORS."
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
        "The wiki listed dead routes. Types drifted. Frontend sent the old field name and the dining room toasted error. Chat had last year's pad. People opened Postman and guessed paths. Backend and QA argued about JSON shape. Interviews asked what Swagger is and candidates said documentation. The kitchen had changed the dish and nobody reprinted the card.",
      what:
        "OpenAPI is a spec of paths, methods, bodies, headers, and status codes — a machine menu. Swagger UI is the clickable counter, often /docs on FastAPI, with Try it: fill JSON and Send. FastAPI builds both from your functions. That Try-it is an HTTP client generated from the stove, same envelope as Postman or curl, not the React dining room. You can import the spec into a collection. /openapi.json is the menu file itself.",
      solves:
        "The running app is the menu. Try it without exporting Postman first. Types and 422 stamps stay nearer the code. Frontend stops sending last year's field. Interviews hear spec plus Try it plus I can still replay in curl. QA gets a live card. You still use collections when you need environments, tests, and Newman.",
      example:
        "A restaurant menu the kitchen reprints when a dish dies, not a stained paper above the dining room from last year. Try it is walking to the counter and ordering from tonight's card. The stamp is 200 or 422. Guests and waiters should read this card. The wiki is the stained paper. Postman is another window that can import the same menu.",
      uses:
        "FastAPI /docs and redoc, Spring springdoc, Express swagger-jsdoc, and public API catalogs. Point a teammate at /docs instead of Slack screenshots. Import OpenAPI into Postman for a collection you can share. Copy Try it as curl for CI. Interview take-homes that already serve /docs. Compare the spec to the dining-room fetch payload so the waiter sends tonight's field names.",
      watch:
        "Public /docs can leak admin routes, like posting the staff menu on the sidewalk. Lock it or split public and private specs. Try it in the browser may hit cookies and CORS differently than Postman. Stale decorators reprint last year's paper. A generated menu does not replace reading the status stamp yourself."
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
        "People refreshed the React page. The real error was a 400 in the Network tab they never opened. The dining room toast said error. Five things changed at once. Interviews asked how you debug an API and candidates said I console.log. Nobody walked to the counter with the same method, URL, headers, and body. A DNS miss and a 422 looked identical from the table.",
      what:
        "Repeat the call in Postman or curl, the HTTP client, not the dining room. Read status, then body, then headers. Change one piece of the envelope: URL, method, header, or body. curl -i prints the stamp in the first line. The browser Network tab is the camera of what the waiter really sent, including Origin and cookies. CORS only appears on the camera, not at the counter.",
      solves:
        "You name the broken layer: DNS, TLS, 401, 422, or the UI. If the counter is 201, the stove is fine and the waiter or the canteen gate is next. If the counter is 400, fix the body before rewriting React. Interviews hear a sequence, not panic. QA can replay the failing slip from a collection. You stop replacing the steering wheel when the engine is cold.",
      example:
        "A mechanic who checks the restaurant kitchen engine before replacing the dining-room steering wheel. First walk to the counter: does GET /todos connect, what stamp, what message? Then look at the security camera (Network) to see if the waiter sent a different envelope. Guests only saw a spinner. One changed field at a time, like tasting salt before rewriting the whole recipe.",
      uses:
        "Every it does not work ticket, take-home panic, and on-call night. Start with curl -i or Postman Send. Then open DevTools Network on the page. Copy as curl from the red row. Compare counter versus camera. Newman later turns the working pad into a smoke check so the next deploy fails earlier.",
      watch:
        "Changing five things at once means you will not know what fixed it. A green Postman send skips CORS, so do not close the ticket until the dining room is checked. Do not paste live tokens into the issue. Read the body; a 200 can still lie. Do not blame React first when the counter already stamped 404."
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
        "You needed cookies the page already had, or you needed a clean request with no cookies. The dining room succeeded and the counter failed, or the other way around. Interviews asked Postman versus Network and candidates said both show JSON. CORS only appeared in the browser. People screenshot the GUI instead of Copy as cURL. CSRF headers hid in the camera.",
      what:
        "The Network tab is a security camera of what the dining-room page really sent: cookies, Origin, CORS preflight, CSRF. Postman is a clean HTTP envelope you build at the counter: method, URL, headers, body, no browser jar unless you add it. curl is the phone-call twin of that clean envelope. Copy as cURL from Chrome bridges camera to counter. Neither view replaces the other; one records the waiter, one lets you replay a practice order.",
      solves:
        "Use Network to copy the failing call. Use Postman to change one header and retry without the page. You see whether CORS, a missing cookie, or a bad body is the layer. Interviews hear camera versus counter. QA can import the curl and keep a collection. You stop guessing why the stove answered the waiter but not the clerk.",
      example:
        "Security camera over the dining room (Network) versus a practice order at the restaurant counter (Postman). The camera shows the waiter carrying cookies and an Origin badge. The counter lets you send a clean slip or pin the same cookie on purpose. Guests never see the replay. If the camera is red and the counter is green, the canteen gate (CORS) is the usual suspect.",
      uses:
        "CORS bugs, cookie sessions, CSRF tokens, and any night Postman is 201 while React is blocked. Copy as cURL from the red row. Import into Postman. Compare Authorization versus Cookie. Teach take-homes to open Network before rewriting fetch. Save the working clean envelope in a collection once the camera is understood.",
      watch:
        "Cookie login that works in the browser and 401s in Postman means you forgot the cookie or CSRF header on the counter slip. Postman skips CORS, so green Send is not a green page. Do not paste the copied curl with a live session cookie into Slack. Changing five headers at once hides the fix. The camera can lie if you filtered the wrong request."
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
        "Slack had screenshots of URLs. Tokens expired. Staging changed. New hires guessed paths. QA had a different pad than backend. The dining room README listed last year's host. Interviews asked how you share an API and people said we hop on a call. A live JWT sat in the screenshot. Twenty localhost links rotted in chat.",
      what:
        "Share a Postman collection plus a Local environment without secrets: method, URL templates, headers, bodies, and {{baseUrl}}. Or commit .http or Bruno files so Git is the binder. Or point them at Swagger /docs, the kitchen's own menu with Try it. curl in the README is the phone-call photocopy. The teammate still picks GET or POST, still reads a status stamp and JSON, still must add their own day pass.",
      solves:
        "They import and hit Send. No archaeology through chat. Onboarding is pick Local, run login, then the pad. Interviews can be handed a collection. QA and backend argue from one menu. Staging is an env dropdown, not a search-replace. Newman can run the same binder in CI once secrets stay out.",
      example:
        "Handing over the restaurant order binder and the street name, not your house keys. The dishes stay: login, list, one dosa. The day pass is bought at their gate, not photocopied from yours. Guests never see the binder. If you include the live keys, you handed the next street your house. /docs is the printed menu when you have no binder to export.",
      uses:
        "PR descriptions, QA hand-off, interview take-homes, and onboarding week one at the restaurant. Export the collection without a prod env. Commit api.http if it has no secrets. Send the staging /docs link when the kitchen already prints a menu. Put curl samples in the README. Keep {{token}} empty in the shared box so each clerk buys their own day pass.",
      watch:
        "Export with include tokens pins the day pass to the public menu. Do not Slack a prod environment. A collection that still hardcodes localhost will surprise a teammate who picked Staging. Public /docs can leak admin routes. Green on their Postman still skips CORS for their dining room. Treat synced pads like .env."
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
        "Everything was 200 with an error inside, or everything was 500. The dining room toast said error for a missing field, a missing ticket, and a down stove. Interviews asked which codes you know and candidates said 200 and 404. Postman users never read the status line. Collections could not branch. QA filed one bug for six kitchen policies.",
      what:
        "Status codes are stamps on the HTTP reply you read in Postman, curl -i, or the Network tab, after method, URL, headers, and body go out. 200 ok, 201 created, 204 no body, 400 bad input, 401 login, 403 forbidden, 404 missing, 409 conflict, 422 validation, 429 rate limit, 500 server bug. OpenAPI lists them per path. The browser hides them behind a toast.",
      solves:
        "The UI and Postman tests can branch on the stamp, not on English in the body. 401 goes to login. 422 highlights the field. 201 confirms the create. Newman fails if create is 200 with no id. Interviews hear a map, not a shrug. You stop treating every red toast as a 500. The kitchen and the dining room share one legend.",
      example:
        "Restaurant kitchen stamps on the slip: ready (200), new plate filed (201), we need a name (400 or 422), who are you (401), wrong hall (403), no such dish (404), two cooks grabbed the last table (409), too many orders (429), the stove caught fire (500). Guests only hear sorry. The clerk at the counter reads the number. curl -i prints it first.",
      uses:
        "Every backend and frontend interview, take-home CRUD, and Postman test scripts. Map each React toast to a stamp. Document codes in OpenAPI. Assert them in Newman. Teach QA to read the counter before filing. Copy as curl -i when a ticket needs the raw line. Health checks want 200, creates want 201.",
      watch:
        "200 for a create hides whether the row was new. 500 for a missing field is a stove fire for a blank name; that is 400 or 422. Do not collapse 401 and 403. A 200 with ok false still looks green to tired eyes — write a test. Green Postman stamps still skip CORS for the dining room."
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
        "A retry of POST /orders created two dosas. The user clicked twice on a slow dining-room network. The waiter resent the slip. Interviews asked why PUT versus POST matters and candidates said they are updates. Caches and proxies retried GET and cooked a plate. Collections had a create button people mashed. Payments double-charged when the counter was impatient.",
      what:
        "Idempotent means doing the HTTP request again does not change the result. GET, PUT, and DELETE should be. POST create usually is not. In Postman you see this by sending twice: PUT /todos/5 with the same JSON stays one plate; POST /orders adds another dosa. Same envelope — method, URL, headers, body — the verb decides retry safety. curl and the browser retry too. This is kitchen policy about repeats.",
      solves:
        "Retries are safe on PUT /todos/5. POST needs an Idempotency-Key header or a unique constraint so two clicks still cook one plate. Interviews hear a system-design answer, not a guess. You can prove it at the counter before teaching React disable-on-submit. Payments and order create stop doubling. Logs stay readable because GET never writes.",
      example:
        "Telling the restaurant clerk shelf 5 is Milk twice (PUT) versus add a Milk twice (POST). The first pair leaves one carton. The second pair leaves two. Guests mashed the dining-room button on a slow night. The counter lets you press Send twice on purpose and count plates. A phone call (curl) twice is the same lesson. The stove does not care which window repeated the slip.",
      uses:
        "Payments, order create, interview system design, and any take-home with a retrying client. Show PUT versus POST in the collection. Add Idempotency-Key on POST when the kitchen supports it. Newman should not POST create in a loop against staging without cleanup. Teach frontend to disable submit, but do not rely on the waiter alone.",
      watch:
        "A GET that is not idempotent because it deletes is a kitchen that throws the plate when you only asked to look. Blind POST retries double dosas and charges. PUT that secretly patches one field surprises the next cook. Do not point a write collection at production to demo retries. Green Postman still skips CORS for the dining room."
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
        "JSON cannot hold a photo well. People base64'd a 10MB image into a field and the server died. The dining room fetch sent a giant string. express.json() choked. Interviews asked how you send a file and candidates said I put it in the body. Postman stayed on raw JSON. Nginx returned 413 and React said error. QA could not replay the upload from a screenshot.",
      what:
        "Use form-data with a file key. Content-Type becomes multipart/form-data, a tray of parts, not a sealed JSON lunch. In Postman pick Body form-data, type file, choose the disk file; add title as another part. curl uses -F. The HTTP method is still POST; URL and Authorization still sit on the envelope. The browser's FormData is the dining-room twin. Collections can save the field names, not the bytes.",
      solves:
        "The photo is a part. Title can be another part. The kitchen parser (multer) sees a file, not a 10MB string inside JSON. You prove the upload at the counter before rewriting React. Interviews hear multipart, not I uploaded it. QA replays with curl -F. Newman can attach a small fixture. The stove stays up because the tray matches the clerk.",
      example:
        "A restaurant tray: a card that says Milk, plus the photo clipped on. The clerk unpacks labeled bowls, not a sealed lunch box. Guests in the dining room attach a file input; you still send the same tray from Postman or a phone call with -F. If you hand a giant base64 lunch to a tray clerk, the kitchen finds no photo, only a heavy box, and the stove dies.",
      uses:
        "Avatars, CSV import, homework uploads, and any take-home with multer. Set Authorization Bearer on the same slip. Keep JSON for /todos and form-data for /avatar. Document the parts in OpenAPI. Copy as curl -F into the README. Teach frontend FormData plus the same field names you used at the counter.",
      watch:
        "Forgetting file size limits (Nginx client_max_body_size) yields 413 while React says error. JSON plus express.json() will not see the file. A committed real photo or a live token in the collection is a leak. Huge fixtures blow CI. Green Postman still skips CORS; the dining room may need a different Content-Type dance on preflight."
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
        "Frontend was blocked until backend finished /todos. The dining room had no stove to call. Interviews asked how teams work in parallel and candidates said we wait. Screenshots of a future JSON lived in Figma. People pointed Postman at a half-built kitchen and blamed the waiter. Take-homes had no collection. Demos failed when the real route was late.",
      what:
        "A mock server is a fake kitchen that returns the agreed JSON for the same HTTP envelope: method, URL, headers, body, then a canned stamp. Postman Mock hosts the collection. MSW intercepts the dining-room fetch. A tiny Express stub listens on a port. curl and the real Postman window can hit {{mockUrl}} the way they hit localhost. Swagger examples can seed the fake menu.",
      solves:
        "The UI can be built against the contract. Swap {{baseUrl}} later from mock street to real street. Waiters practice while the real kitchen is still tiling. Tests stay stable. Interviews hear parallel work, not we blocked. QA can demo the pad against plastic plates. Newman can even smoke the mock if you want the collection green before the stove exists.",
      example:
        "A cardboard restaurant kitchen that serves plastic dosas so the waiters can practice seating and slips. POST /orders still looks like an order. The stamp is a fake 201. Guests in a demo eat the story, not the grain. When the real stove opens, you change the street on the env card. Nobody rewrites every dish. Do not send demo guests to the cardboard alley after opening night.",
      uses:
        "Parallel frontend and backend work, investor demos, contract tests, and take-homes where the API is late. Postman Mock from the same collection. MSW for React tests. A stub Express for local {{baseUrl}}. Keep OpenAPI examples aligned so the plastic menu matches the future stove. Switch env when the real /todos lands.",
      watch:
        "Shipping the mock URL to production seats guests in a cardboard kitchen. A mock that always 200 hides 401 and 422. Do not commit mock tokens that look real. Browser MSW is not Postman; CORS may still apply in the dining room. Keep the mock honest or the waiter learns the wrong plate shape."
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
        "Candidates said I use Postman and could not name a status code or why CORS failed. They listed Insomnia, Thunder Client, and Bruno like a menu of logos. The dining room was the only place they had ever clicked. Interviews asked for curl and got a description of Send. A green collection import was their whole story. Nobody mentioned method, URL, headers, or body.",
      what:
        "They want the kitchen-versus-dining-room story. Postman is an HTTP client: method, URL, headers, body, Send, then status and JSON. It is not a browser, so CORS will not stop it. curl is the same envelope as a command. A collection is the saved pad; an environment is the street. You read 401 versus 403, prove the stove, then check the waiter. That sentence beats a list of tool names.",
      solves:
        "You sound like you have shipped a route, not only imported a collection. You can debug a 401 at the counter, write the curl on the whiteboard, and explain why React still failed. Interviewers hear a mechanic, not a tourist. The pad, the phone call, and the camera each have a job. You stop hiding behind the brand.",
      example:
        "A cook who can plate a dosa without the restaurant app. They walk to the counter, say POST /orders, read 201, then write curl -i. If the dining room still fails, they name CORS or a missing Bearer, not the API is broken. Guests never see that practice. A cook who only says I use Postman is reading the logo on the window, not cooking.",
      uses:
        "Amazon, Google, Microsoft, Meta, Adobe, and every backend or frontend screen. Take-homes that want a collection plus a README curl. On-call stories about 401 versus CORS at the canteen gate. Teaching a teammate the envelope in one minute at the restaurant counter. Newman and /docs are bonus chapters after the kitchen-versus-dining-room story lands.",
      watch:
        "Listing tool names. Say method, URL, status, and one bug you found. Do not claim Postman proves the browser. Do not paste a live token on the whiteboard. Do not confuse 401 with 403. A memorized logo list without the kitchen-versus-dining-room picture is the failure mode this question is hunting."
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

const out = path.join(__dirname, "..", "frontend", "data", "postman.js");
const body =
  "window.PREP_DATA = window.PREP_DATA || {};\n" +
  'window.PREP_DATA["postman"] = ' +
  JSON.stringify(data, null, 2) +
  ";\n";
fs.writeFileSync(out, body);
console.log("wrote", out, "notes", notes.length, "examples", examples.length, "questions", questions.length);
