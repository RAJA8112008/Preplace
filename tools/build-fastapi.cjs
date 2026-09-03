const fs = require("fs");
const path = require("path");

const q = (id, level, question, a, code, extra = {}) => ({
  id, level, q: question, a, code, lang: "python", ...extra
});

const fastapi = {
  notes: [
    {
      title: "Before you use FastAPI",
      body: "Before you use this\nKnow what an API is: the UI (or another server) sends HTTP to a URL, you answer with JSON. Know GET vs POST. Install Python 3.10+, then: pip install fastapi uvicorn. Run with uvicorn main:app --reload.\n\nWhy we use it\nFastAPI is the usual Python way to ship a REST API in 2026. Types become validation and docs. Async is first-class. /docs is free Swagger. ML teams use it to wrap a model in /predict.\n\nWhen to pick this\nPython team, ML serving, OpenAPI required, or you want Pydantic validation. Node shops still use Express. Tiny scripts can stay Flask."
    },
    {
      title: "What an API is",
      body: "An API is a contract: method + path + body in, status + JSON out. The browser never talks to the database. FastAPI (or Express) is the kitchen that reads the ticket and sends the plate."
    },
    {
      title: "REST in one page",
      body: "Resources have URLs: /todos, /todos/3. GET reads. POST creates (201). PUT/PATCH updates. DELETE removes. Use query ?page=2 for filters. Put ids in the path, not secrets. GET must not delete data."
    },
    {
      title: "Why FastAPI",
      body: "You type Python types. Pydantic checks the body. Wrong JSON becomes 422 with a clear list. OpenAPI is built: /docs and /redoc. async def talks to DBs and HTTP without blocking. That is why it beat Flask for new APIs."
    },
    {
      title: "The pieces",
      body: "app = FastAPI(). @app.get / @app.post attach routes. A Pydantic BaseModel is the body shape. Depends() injects a DB session or the current user. HTTPException is how you send 404. uvicorn is the server process."
    },
    {
      title: "Auth, CORS, HTTPS",
      body: "Validate JWT or an API key in a dependency, not in every route by hand. CORSMiddleware lists real UI origins. HTTPS is usually terminated at Nginx or the host. Never put the secret in the repo."
    },
    {
      title: "Status codes you must know",
      body: "200 OK, 201 created, 204 no body, 400 bad input you already checked, 401 not logged in, 403 logged in but not allowed, 404 missing, 422 FastAPI validation, 429 rate limit, 500 your bug. Interviews ask 401 vs 403 every time."
    },
    {
      title: "Interview habit",
      body: "Say: resource URL, verb, status, then the Pydantic model. Mention /docs. Mention that validation is not auth. Mention async only if the work waits on I/O."
    }
  ],
  examples: [
    {
      title: "1. Hello API",
      lang: "python",
      desc: "Before you use this\nInstall fastapi and uvicorn. Save this as main.py.\n\nWhat this is\nThe smallest FastAPI app: one GET that returns JSON.\n\nWhy we use it\nProve the server starts. Then add real routes.\n\nWhat the code is doing\nFastAPI() is the app. @app.get(\"/\" ) is the route. uvicorn main:app --reload serves it.\n\nWatch out\nThe name after the colon is the variable, app, not the file name.",
      code: `from fastapi import FastAPI

app = FastAPI()  # the API

@app.get("/")
def home():
    return {"ok": True}  # JSON

# run: uvicorn main:app --reload`
    },
    {
      title: "2. Path and query",
      lang: "python",
      desc: "Before you use this\nA path is /todos/3. A query is ?done=true.\n\nWhat this is\nPath params are in the URL. Query params are after ?.\n\nWhy we use it\nIds belong in the path. Filters belong in the query.\n\nWhat the code is doing\nitem_id comes from /items/{item_id}. q is optional ?q=.\n\nWatch out\nDo not put passwords in the query. Logs and history keep them.",
      code: `@app.get("/items/{item_id}")
def read_item(item_id: int, q: str | None = None):
    return {"id": item_id, "q": q}  #  /items/3?q=ada`
    },
    {
      title: "3. Pydantic body",
      lang: "python",
      desc: "Before you use this\nPOST needs a JSON body. You do not parse it by hand.\n\nWhat this is\nA BaseModel is the shape FastAPI expects.\n\nWhy we use it\nWrong types become 422. /docs shows the model. You never trust raw dict keys.\n\nWhat the code is doing\nTodoIn has text. FastAPI fills todo from JSON. 201 means created.\n\nWatch out\nA missing required field is 422, not 200 with None.",
      code: `from pydantic import BaseModel
from fastapi import status

class TodoIn(BaseModel):
    text: str  # required

@app.post("/todos", status_code=status.HTTP_201_CREATED)
def create(todo: TodoIn):
    return {"id": 1, "text": todo.text, "done": False}`
    },
    {
      title: "4. 404 with HTTPException",
      lang: "python",
      desc: "Before you use this\nA missing id is not an empty 200.\n\nWhat this is\nHTTPException sets the status and a JSON detail.\n\nWhy we use it\nThe UI can tell 404 from 500. Interviews want this, not a silent None.\n\nWhat the code is doing\nIf the todo is missing, raise 404. Else return the row.\n\nWatch out\nDo not return {\"error\": ...} with status 200.",
      code: `from fastapi import HTTPException

@app.get("/todos/{todo_id}")
def get_todo(todo_id: int):
    item = db.get(todo_id)
    if item is None:
        raise HTTPException(status_code=404, detail="todo not found")
    return item`
    },
    {
      title: "5. Depends — current user",
      lang: "python",
      desc: "Before you use this\nMany routes need the logged-in user. Copy-paste JWT code is a bug factory.\n\nWhat this is\nDepends runs a function and injects the result.\n\nWhy we use it\nOne place to read the token. Routes stay short. Tests can override the dependency.\n\nWhat the code is doing\nget_user reads the Bearer token. me uses that user.\n\nWatch out\n401 if no token. Do not skip Depends and trust a user_id in the body.",
      code: `from fastapi import Depends, Header, HTTPException

def get_user(authorization: str | None = Header(default=None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="login required")
    return {"id": 1}  # after you check the JWT

@app.get("/me")
def me(user=Depends(get_user)):
    return user`
    },
    {
      title: "6. CORS for a React UI",
      lang: "python",
      desc: "Before you use this\nReact on :5173 and API on :8000 are two origins. The browser will block fetch without CORS.\n\nWhat this is\nCORSMiddleware lists origins the browser may call.\n\nWhy we use it\nThe UI can send JSON (and cookies if you set credentials).\n\nWhat the code is doing\nallow_origins is the real UI URL, not * if you use cookies.\n\nWatch out\nallow_origins=[\"*\"] plus cookies is invalid. List the UI.",
      code: `from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # the React app
    allow_methods=["*"],
    allow_headers=["*"],
)`
    },
    {
      title: "7. Serve a model",
      lang: "python",
      desc: "Before you use this\nThe model is already trained and saved. FastAPI only wraps it.\n\nWhat this is\nPOST /predict takes features, returns a number or class.\n\nWhy we use it\nML jobs want you to ship the model as an API, not only a notebook.\n\nWhat the code is doing\nFeatures is the body. model.predict returns one value.\n\nWatch out\nLoad the model once at startup, not on every request.",
      code: `class Features(BaseModel):
    rooms: float
    area: float

@app.post("/predict")
def predict(row: Features):
    y = model.predict([[row.rooms, row.area]])[0]  # one number
    return {"price": float(y)}`
    },
    {
      title: "8. Health check",
      lang: "python",
      desc: "Before you use this\nLoad balancers and Docker need a cheap URL that means 'alive'.\n\nWhat this is\nGET /health returns 200 if the process is up.\n\nWhy we use it\nDeploy, k8s, and uptime checks hit this, not /docs.\n\nWhat the code is doing\nA tiny dict. No database in the simple version.\n\nWatch out\nA /health that queries a down DB will flap the whole service.",
      code: `@app.get("/health")
def health():
    return {"status": "ok"}`
    }
  ],
  questions: []
};

fastapi.questions = [
  q(1, "beginner", "What is an API?",
    "Before you use this\nThe UI cannot open the database. It needs a door on the server.\n\nWhat this is\nAn API is that door: HTTP method + URL in, status + JSON out.\n\nWhy we use it\nMany clients (web, mobile, another service) can share one contract. You change the kitchen without reprinting the menu names.\n\nWhat happens\nThe client fetch-es /todos. FastAPI runs your function. JSON goes back. The browser never holds the DB password.",
    `import requests
r = requests.get("http://127.0.0.1:8000/todos")
print(r.status_code, r.json())  # 200 and a list`),

  q(2, "beginner", "What is REST?",
    "Before you use this\nKnow HTTP verbs and that a URL can name a thing, not a verb like /getTodos.\n\nWhat this is\nREST is a style: resources at URLs, verbs on those URLs, JSON bodies, correct status codes.\n\nWhy we use it\nThe same ideas work in FastAPI, Express, and Go. Interviews start here before Pydantic.\n\nWhat happens\n/todos is the collection. /todos/3 is one item. GET reads. POST creates.",
    `# REST map
# GET    /todos      list
# POST   /todos      create
# GET    /todos/3    one item
# PATCH  /todos/3    update
# DELETE /todos/3    remove`),

  q(3, "beginner", "GET vs POST vs PUT vs PATCH vs DELETE?",
    "Before you use this\nThe method is the verb on the request line, not a field in JSON.\n\nWhat this is\nGET reads and must be safe. POST creates. PUT replaces the whole item. PATCH changes some fields. DELETE removes.\n\nWhy we use it\nCaches, browsers, and proxies treat GET as safe. A GET that deletes is a bug.\n\nWhat happens\nFastAPI: @app.get, @app.post, @app.put, @app.patch, @app.delete.",
    `@app.get("/todos")
def list_todos():
    return todos  # Read

@app.post("/todos")
def add_todo(todo: TodoIn):
    return save(todo)  # Create`),

  q(4, "beginner", "What is FastAPI?",
    "Before you use this\nYou already know Python functions and type hints: name: str.\n\nWhat this is\nFastAPI is a Python web framework for APIs. You write functions. It turns them into HTTP routes, validates bodies, and builds /docs.\n\nWhy we use it\nLess glue than Flask for JSON APIs. Async. Automatic OpenAPI. Used for ML /predict and normal CRUD.\n\nWhat happens\napp = FastAPI(). Decorators attach routes. uvicorn runs the app.",
    `from fastapi import FastAPI
app = FastAPI(title="Preplace API")

@app.get("/ping")
def ping():
    return {"pong": True}`),

  q(5, "beginner", "Why do people pick FastAPI over Flask?",
    "Before you use this\nFlask is older and fine for tiny apps and HTML pages.\n\nWhat this is\nFastAPI adds type-based validation, async, and free Swagger. Flask needs extra libraries for the same.\n\nWhy we use it\nYou spend time on the product, not on writing a schema by hand. ML teams already live in Python.\n\nWhat happens\nA wrong body is 422 with a field list. /docs is there on day one.",
    `# Flask: you parse and check by hand
# FastAPI: TodoIn does the check
@app.post("/todos")
def create(todo: TodoIn):
    return todo`),

  q(6, "beginner", "How do you run a FastAPI app?",
    "Before you use this\nThe file is main.py and the app variable is named app.\n\nWhat this is\nuvicorn is the ASGI server. --reload restarts on save while you learn.\n\nWhy we use it\nFastAPI is not a server by itself. uvicorn speaks HTTP to your app.\n\nWhat happens\nuvicorn main:app --reload --port 8000. Open http://127.0.0.1:8000/docs.",
    `# terminal
# uvicorn main:app --reload --port 8000
# main = file main.py   app = the FastAPI()`),

  q(7, "beginner", "What is uvicorn?",
    "Before you use this\nWSGI (Flask) is sync. ASGI can do async and WebSockets.\n\nWhat this is\nuvicorn is a fast ASGI server. It loads your app and listens on a port.\n\nWhy we use it\nIt is the usual process in front of FastAPI. Gunicorn can manage several uvicorn workers in production.\n\nWhat happens\nClient → uvicorn → your @app.get function → JSON back.",
    `# production idea
# gunicorn -k uvicorn.workers.UvicornWorker main:app`),

  q(8, "beginner", "Path parameter vs query parameter?",
    "Before you use this\nLook at a URL: /todos/3?done=true. 3 is the path. done is the query.\n\nWhat this is\nPath params identify the resource. Query params filter, sort, and paginate.\n\nWhy we use it\nA clear URL is the API. Do not hide the id in the body of a GET.\n\nWhat happens\n{todo_id} in the path becomes an argument. q: str | None = None is an optional query.",
    `@app.get("/todos/{todo_id}")
def one(todo_id: int, done: bool | None = None):
    return {"id": todo_id, "done": done}`),

  q(9, "beginner", "What is Pydantic?",
    "Before you use this\nYou already write Python classes. Type hints say text: str.\n\nWhat this is\nPydantic turns a class into a validator. FastAPI uses it for bodies, query models, and responses.\n\nWhy we use it\nBad JSON never reaches your DB code. /docs draws the model. You get .text as a real field.\n\nWhat happens\nclass TodoIn(BaseModel): text: str. A body {\"text\": 9} is 422.",
    `from pydantic import BaseModel, Field

class TodoIn(BaseModel):
    text: str = Field(min_length=1, max_length=200)`),

  q(10, "beginner", "What does status 422 mean in FastAPI?",
    "Before you use this\n400 is 'you sent something I reject'. FastAPI is more specific.\n\nWhat this is\n422 Unprocessable Entity: the JSON did not match the model (wrong type, missing field).\n\nWhy we use it\nThe client sees which field failed. You do not write that if/raise yourself.\n\nWhat happens\nPOST {\"text\": 12} to a str field → 422 with loc and msg.",
    `# body {"text": 12}  while text: str
# → 422 {"detail":[{"loc":["body","text"],"msg":"..."}]}`),

  q(11, "beginner", "How do you return 201 Created?",
    "Before you use this\n200 means OK. A new row should say created.\n\nWhat this is\nstatus_code=201 on the decorator, or Response.\n\nWhy we use it\nThe UI knows it was created, not just 'ok'. REST interviews listen for 201 on POST.\n\nWhat happens\n@app.post(..., status_code=201) then return the new item.",
    `from fastapi import status

@app.post("/todos", status_code=status.HTTP_201_CREATED)
def create(todo: TodoIn):
    return {"id": 7, "text": todo.text}`),

  q(12, "beginner", "401 vs 403?",
    "Before you use this\nLogin is not the same as permission.\n\nWhat this is\n401: we do not know who you are (no/bad token). 403: we know you, and you may not do this.\n\nWhy we use it\nThe UI shows login vs 'not allowed'. Mixing them makes support painful.\n\nWhat happens\nMissing Authorization → 401. User role user hits /admin → 403.",
    `if user is None:
    raise HTTPException(401, "login required")
if user["role"] != "admin":
    raise HTTPException(403, "admin only")`),

  q(13, "intermediate", "What is /docs in FastAPI?",
    "Before you use this\nOpenAPI is a JSON description of paths, bodies, and errors.\n\nWhat this is\n/docs is Swagger UI generated from your types. /redoc is another view. /openapi.json is the raw spec.\n\nWhy we use it\nFrontend and testers try the API without Postman setup. Interviews love 'docs for free'.\n\nWhat happens\nYou add a Pydantic model; the form on /docs updates. No extra file unless you hide routes.",
    `# open while uvicorn runs
# http://127.0.0.1:8000/docs
# http://127.0.0.1:8000/redoc`),

  q(14, "intermediate", "What is OpenAPI / Swagger?",
    "Before you use this\nA human README goes stale. Machines need a schema.\n\nWhat this is\nOpenAPI is the spec. Swagger UI is a common docs page. FastAPI emits OpenAPI from your code.\n\nWhy we use it\nCodegen, contract tests, and onboarding. Express teams add this later; FastAPI has it on day one.\n\nWhat happens\nClients generate TypeScript types from /openapi.json.",
    `app = FastAPI(
    title="Todos",
    version="1.0.0",
    description="CRUD for one user list",
)`),

  q(15, "intermediate", "async def vs def in FastAPI?",
    "Before you use this\nWaiting on a DB or HTTP is I/O. Crunching numbers is CPU.\n\nWhat this is\nasync def lets the event loop serve other requests while you await. Plain def runs in a thread pool.\n\nWhy we use it\nMany open connections. You do not block the whole process on one slow query if you await.\n\nWhat happens\nawait session.execute(...). Do not run a 10s CPU loop in async def without a thread.",
    `@app.get("/todos")
async def list_todos():
    rows = await db.fetch("SELECT * FROM todos")  # wait without blocking
    return rows`),

  q(16, "intermediate", "What is Depends?",
    "Before you use this\nRoutes need a DB session or a user. You do not want to copy that setup 20 times.\n\nWhat this is\nDepends(fn) runs fn first and passes the result into the route.\n\nWhy we use it\nShared auth, shared DB, easy tests (override Depends).\n\nWhat happens\ndef get_db(): yield session. Route does db=Depends(get_db).",
    `def get_db():
    db = Session()
    try:
        yield db  # give the route a session
    finally:
        db.close()

@app.get("/todos")
def list_todos(db=Depends(get_db)):
    return db.query(Todo).all()`),

  q(17, "intermediate", "How do you do JWT auth in FastAPI?",
    "Before you use this\nHash passwords (bcrypt/passlib). Keep JWT_SECRET in env. Users live in SQL.\n\nWhat this is\nLogin checks the password and returns a signed token. Later routes Depends on a function that decodes Bearer.\n\nWhy we use it\nAny server can check the token. The browser stores it (httpOnly cookie is safer than localStorage).\n\nWhat happens\nOAuth2PasswordBearer(tokenUrl=\"login\") reads the header. jwt.decode gives user id.",
    `from fastapi.security import OAuth2PasswordBearer
import jwt

oauth2 = OAuth2PasswordBearer(tokenUrl="login")

def current_user(token: str = Depends(oauth2)):
    try:
        data = jwt.decode(token, SECRET, algorithms=["HS256"])
    except jwt.PyJWTError:
        raise HTTPException(401, "bad token")
    return data  # {"sub": user_id}`),

  q(18, "intermediate", "How do you add CORS?",
    "Before you use this\nOrigin is scheme + host + port. localhost:5173 ≠ localhost:8000.\n\nWhat this is\nCORSMiddleware tells the browser which UI may call you.\n\nWhy we use it\nReact and FastAPI on two ports during dev. Production: your real https://app domain.\n\nWhat happens\nA preflight OPTIONS, then the real POST. Without CORS the browser hides the response.",
    `app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)`),

  q(19, "intermediate", "How do you handle errors?",
    "Before you use this\nA missing row is not a crash. A crash should still be JSON, not an HTML stack in production.\n\nWhat this is\nHTTPException for expected 4xx. Unexpected bugs become 500. You can add exception handlers.\n\nWhy we use it\nThe client always parses JSON. Logs still get the traceback on 500.\n\nWhat happens\nraise HTTPException(404, \"not found\"). FastAPI formats {\"detail\": ...}.",
    `@app.get("/users/{user_id}")
def get_user(user_id: int):
    user = db.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="user not found")
    return user`),

  q(20, "intermediate", "What is APIRouter?",
    "Before you use this\nmain.py should not hold 80 routes.\n\nWhat this is\nAPIRouter is a group of routes you include on the app, often with a prefix /api/v1.\n\nWhy we use it\nTodos file, users file, health file. Teams can own folders.\n\nWhat happens\nrouter = APIRouter(prefix=\"/todos\"). app.include_router(router).",
    `from fastapi import APIRouter
router = APIRouter(prefix="/todos", tags=["todos"])

@router.get("")
def list_todos():
    return []

app.include_router(router)`),

  q(21, "intermediate", "How do you version an API?",
    "Before you use this\nClients already call you. A breaking field rename will crash their app.\n\nWhat this is\nPut /api/v1 in the prefix. Keep v1 alive when you ship v2.\n\nWhy we use it\nMobile apps cannot all update the same day. Versioning is kindness.\n\nWhat happens\ninclude_router(..., prefix=\"/api/v1\"). Docs show both if you mount two.",
    `app.include_router(todos_v1, prefix="/api/v1")
app.include_router(todos_v2, prefix="/api/v2")`),

  q(22, "intermediate", "How do you upload a file?",
    "Before you use this\nJSON cannot hold a photo well. Use multipart form.\n\nWhat this is\nUploadFile is FastAPI's file type. You read bytes or stream to disk/S3.\n\nWhy we use it\nAvatars, CSVs, PDFs for RAG. Do not trust the filename; pick a safe name.\n\nWhat happens\nfile: UploadFile = File(). await file.read() then store.",
    `from fastapi import File, UploadFile

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    data = await file.read()  # bytes
    return {"name": file.filename, "n": len(data)}`),

  q(23, "intermediate", "What are background tasks?",
    "Before you use this\nThe user should not wait for email or a thumbnail.\n\nWhat this is\nBackgroundTasks runs work after the response is sent.\n\nWhy we use it\nSimple jobs without Redis. For retries and many workers, use a real queue.\n\nWhat happens\ntasks.add_task(send_email, to). Return 202 or 200 first.",
    `from fastapi import BackgroundTasks

def send_hi(email: str):
    print("mail", email)  # pretend SMTP

@app.post("/signup")
def signup(email: str, tasks: BackgroundTasks):
    tasks.add_task(send_hi, email)  # after the response
    return {"ok": True}`),

  q(24, "intermediate", "How do you test a FastAPI route?",
    "Before you use this\nYou should not need a live port for unit tests.\n\nWhat this is\nTestClient (httpx) calls the app in process.\n\nWhy we use it\nCI can POST /todos and assert 201 without uvicorn.\n\nWhat happens\nclient = TestClient(app). client.get(\"/health\").status_code == 200.",
    `from fastapi.testclient import TestClient
client = TestClient(app)

def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"`),

  q(25, "intermediate", "How do you talk to SQL from FastAPI?",
    "Before you use this\nThe table already exists. Use a parameterized query. Pool connections.\n\nWhat this is\nSQLAlchemy or a driver. Depends yields a session. Routes never create engines per request.\n\nWhy we use it\nUsers and money stay in SQL. FastAPI is only the door.\n\nWhat happens\nget_db yields Session. query or execute. commit on writes.",
    `@app.get("/todos")
def list_todos(db=Depends(get_db)):
    return db.execute("SELECT id, text FROM todos").fetchall()`),

  q(26, "intermediate", "How do you paginate?",
    "Before you use this\nNever SELECT * and send a million rows.\n\nWhat this is\nlimit and offset, or cursor WHERE id > last.\n\nWhy we use it\nThe UI shows a page. The DB stays fast.\n\nWhat happens\nskip: int = 0, limit: int = 20. Cap limit at 100.",
    `@app.get("/todos")
def list_todos(skip: int = 0, limit: int = 20):
    limit = min(limit, 100)  # cap
    return todos[skip: skip + limit]`),

  q(27, "advanced", "How do you serve an ML model?",
    "Before you use this\nTrain and save the model first (joblib). Users still need a real API contract.\n\nWhat this is\nLoad once on startup. POST /predict with a Pydantic body. Return a number or class.\n\nWhy we use it\nNotebooks are not products. Jobs want a URL the app can call.\n\nWhat happens\nlifespan loads model. Each request only runs predict.",
    `from contextlib import asynccontextmanager
import joblib

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.model = joblib.load("model.joblib")  # once
    yield

app = FastAPI(lifespan=lifespan)`),

  q(28, "advanced", "How do you protect /predict with an API key?",
    "Before you use this\nThe model costs CPU. Random people should not flood it.\n\nWhat this is\nA header X-API-Key compared to an env secret. Wrong key → 401.\n\nWhy we use it\nSimple for internal tools and ML demos. Users/passwords still need JWT for a product.\n\nWhat happens\nDepends reads the header. hmac.compare_digest so timing is even.",
    `import hmac, os
from fastapi import Header

def need_key(x_api_key: str = Header(...)):
    good = os.environ["API_KEY"]
    if not hmac.compare_digest(x_api_key, good):
        raise HTTPException(401, "bad key")`),

  q(29, "beginner", "What should GET /health do?",
    "Before you use this\nDeploy platforms ping a URL to know the process is up.\n\nWhat this is\nA cheap 200 JSON. Optional: check DB in /ready, keep /health dumb.\n\nWhy we use it\nKubernetes and Render use it. Do not hide it behind JWT.\n\nWhat happens\nGET /health → {\"status\":\"ok\"}.",
    `@app.get("/health")
def health():
    return {"status": "ok"}`),

  q(30, "intermediate", "How do you set response headers like Cache-Control?",
    "Before you use this\nJSON APIs sometimes should not be cached by a CDN.\n\nWhat this is\nReturn a JSONResponse and set headers, or a Response object.\n\nWhy we use it\nPublic catalog can be cached. /me must be private.\n\nWhat happens\nheaders={\"Cache-Control\": \"private, no-store\"} on user routes.",
    `from fastapi.responses import JSONResponse

@app.get("/me")
def me(user=Depends(get_user)):
    return JSONResponse(user, headers={"Cache-Control": "private, no-store"})`),

  q(31, "beginner", "What is a request body vs a response model?",
    "Before you use this\nIn and out can be different shapes. Password in, no password out.\n\nWhat this is\nThe function argument model is the body. response_model filters what you send.\n\nWhy we use it\nYou never leak password_hash. /docs shows both schemas.\n\nWhat happens\ncreate(user: UserIn) -> UserOut. response_model=UserOut.",
    `class UserIn(BaseModel):
    email: str
    password: str

class UserOut(BaseModel):
    id: int
    email: str

@app.post("/users", response_model=UserOut)
def create_user(user: UserIn):
    return save_without_password(user)`),

  q(32, "intermediate", "How do you rate-limit a FastAPI route?",
    "Before you use this\nLogin and /predict get abused. One process memory is not enough with four workers.\n\nWhat this is\nCount requests per IP or user. Redis INCR + TTL is the shared way. SlowAPI is a common helper.\n\nWhy we use it\nProtect CPU and brute-force. Return 429.\n\nWhat happens\nKey rl:ip. If n > 60 per minute, HTTPException 429.",
    `n = redis.incr(f"rl:{ip}")
if n == 1:
    redis.expire(f"rl:{ip}", 60)
if n > 60:
    raise HTTPException(429, "too many requests")`),

  q(33, "beginner", "FastAPI vs Express — when each?",
    "Before you use this\nBoth can do the same REST job.\n\nWhat this is\nExpress is JavaScript/Node. FastAPI is Python + types + OpenAPI.\n\nWhy we use it\nSame company may have both: React+Express, or Python ML+FastAPI. Pick the language of the team and the libraries you need.\n\nWhat happens\nCRUD + JWT looks similar. Validation is built in on FastAPI; you add Joi/Zod on Express.",
    `# same idea
# Express: app.get("/ping", (req,res) => res.json({ok:true}))
# FastAPI: @app.get("/ping") def ping(): return {"ok": True}`),

  q(34, "intermediate", "What is middleware in FastAPI?",
    "Before you use this\nSome work wraps every request: CORS, logs, timing.\n\nWhat this is\nMiddleware runs before and after the route. CORSMiddleware is the one you add first.\n\nWhy we use it\nOne place for request ids and security headers. Routes stay about the resource.\n\nWhat happens\n@app.middleware(\"http\") async def log(request, call_next): response = await call_next(request).",
    `@app.middleware("http")
async def add_time(request, call_next):
    response = await call_next(request)  # run the route
    response.headers["X-Process"] = "fastapi"
    return response`),

  q(35, "advanced", "How do you deploy FastAPI?",
    "Before you use this\nIt works on your laptop with --reload. Production needs a process manager, HTTPS, and env secrets.\n\nWhat this is\nDocker image with uvicorn or gunicorn+uvicorn workers. Nginx or a host terminates TLS. DATABASE_URL in env.\n\nWhy we use it\nReload is for you, not for users. Workers use more than one CPU.\n\nWhat happens\nCMD uvicorn main:app --host 0.0.0.0 --port 8000. Health at /health.",
    `# Dockerfile idea
# CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]`),

  q(36, "beginner", "What JSON does an error look like?",
    "Before you use this\nThe UI will read res.json() on failure too.\n\nWhat this is\nFastAPI default: {\"detail\": \"todo not found\"} or a list for 422.\n\nWhy we use it\nOne shape. The React screen can show detail.\n\nWhat happens\nHTTPException(404, \"todo not found\") → that JSON. Do not invent {error: true} unless the team agrees.",
    `# 404
# {"detail": "todo not found"}
# 422
# {"detail": [{"loc": ["body", "text"], "msg": "field required"}]}`),
];

const ask = (id, level, question, a, code, companies) =>
  q(id, level, question, a, code, { ask: "Most asked · " + companies });

const practice = {
  kind: "practice",
  notes: [
    {
      title: "Before you start these labs",
      body: "Before you use this\nInstall: pip install fastapi uvicorn pydantic python-multipart. Know GET and POST. A file named main.py with app = FastAPI().\n\nWhy we use it\nSame CRUD and auth story as Express, in Python. /docs is how you prove the route exists.\n\nWhen to pick this\nPython backend or ML serving. Use the Python stack chip if you also browse other practice topics."
    },
    {
      title: "Most asked",
      body: "After the labs, open Most asked. REST, 401/403, Pydantic, /docs, FastAPI vs Flask — the questions Amazon, Google, and Microsoft repeat."
    },
    {
      title: "Build order",
      body: "Hello → CRUD in memory → Pydantic → 404 → JWT Depends → CORS → SQL → /predict → HTTPS in front."
    }
  ],
  examples: [
    {
      title: "Hello FastAPI",
      lang: "python",
      stack: "python",
      desc: "Before you use this\npip install fastapi uvicorn. Save as main.py.\n\nWhat this is\nOne GET that returns JSON.\n\nWhy we use it\nProve uvicorn can load app.\n\nWhat the code is doing\nFastAPI() then @app.get(\"/\").\n\nWatch out\nuvicorn main:app — app is the variable name.",
      code: `from fastapi import FastAPI
app = FastAPI()

@app.get("/")
def home():
    return {"ok": True}`,
      codes: { python: `from fastapi import FastAPI
app = FastAPI()

@app.get("/")
def home():
    return {"ok": True}` }
    },
    {
      title: "Pydantic create",
      lang: "python",
      stack: "python",
      desc: "Before you use this\nPOST JSON {\"text\":\"read\"}.\n\nWhat this is\nThe body must match TodoIn.\n\nWhy we use it\n422 on bad input. /docs shows the form.\n\nWhat the code is doing\nTodoIn.text is required. 201 on success.\n\nWatch out\nDo not use a raw dict and hope text exists.",
      code: `class TodoIn(BaseModel):
    text: str

@app.post("/todos", status_code=201)
def create(todo: TodoIn):
    return {"id": 1, "text": todo.text, "done": False}`
    },
    {
      title: "Bearer Depends",
      lang: "python",
      stack: "python",
      desc: "Before you use this\nLogin already issued a token.\n\nWhat this is\nEvery private route Depends on current_user.\n\nWhy we use it\nOne 401 path. Routes stay short.\n\nWhat the code is doing\nOAuth2PasswordBearer reads Authorization.\n\nWatch out\nDo not take user id from the body.",
      code: `@app.get("/me")
def me(user=Depends(current_user)):
    return user`
    }
  ],
  questions: []
};

practice.questions = [
  q(1, "beginner", "Practice: hello FastAPI",
    "Before you use this\npip install fastapi uvicorn.\n\nWhat this is\nA running app with GET /.\n\nWhy we use it\nFirst proof the stack works.\n\nWhat the code is doing\nReturn {\"ok\": True}. Run uvicorn main:app --reload.",
    `from fastapi import FastAPI
app = FastAPI()

@app.get("/")
def home():
    return {"ok": True}`),
  q(2, "beginner", "Practice: in-memory todo CRUD",
    "Before you use this\nA list in memory is gone on restart. That is fine for the lab.\n\nWhat this is\nGET list, POST create, PATCH, DELETE.\n\nWhy we use it\nSame four verbs as Express and SQL.\n\nWhat the code is doing\nAppend a dict. Find by id. 404 if missing.",
    `todos = []

@app.get("/todos")
def list_todos():
    return todos

@app.post("/todos", status_code=201)
def add(todo: TodoIn):
    item = {"id": len(todos) + 1, "text": todo.text, "done": False}
    todos.append(item)
    return item`),
  q(3, "beginner", "Practice: path id + 404",
    "Before you use this\nYou already POST a todo.\n\nWhat this is\nGET /todos/{id} raises 404 when missing.\n\nWhy we use it\nThe UI can show Not found. A silent {} is a bug.\n\nWhat the code is doing\nNext() the list. HTTPException 404.",
    `@app.get("/todos/{todo_id}")
def get_todo(todo_id: int):
    item = next((t for t in todos if t["id"] == todo_id), None)
    if item is None:
        raise HTTPException(404, "todo not found")
    return item`),
  q(4, "intermediate", "Practice: Pydantic validation",
    "Before you use this\ntext must be a non-empty string.\n\nWhat this is\nField(min_length=1). Bad body → 422.\n\nWhy we use it\nYou do not write if not text: 400 for every field.\n\nWhat the code is doing\nTodoIn declares the rule. FastAPI enforces it.",
    `class TodoIn(BaseModel):
    text: str = Field(min_length=1, max_length=200)`),
  q(5, "intermediate", "Practice: JWT login",
    "Before you use this\nHash the password. Users in a dict or SQL.\n\nWhat this is\nPOST /login returns {\"token\": ...}. /me needs Bearer.\n\nWhy we use it\nSame auth story as Node. Secret from env.\n\nWhat the code is doing\njwt.encode after a good password check.",
    `@app.post("/login")
def login(body: LoginIn):
    user = users.get(body.email)
    if not user or not verify(body.password, user["hash"]):
        raise HTTPException(401, "bad login")
    token = jwt.encode({"sub": user["id"]}, SECRET, algorithm="HS256")
    return {"token": token}`),
  q(6, "intermediate", "Practice: admin 403",
    "Before you use this\nYou already know who the user is.\n\nWhat this is\nAdmin route checks role. User role → 403.\n\nWhy we use it\nHiding a button in React is not security.\n\nWhat the code is doing\nif user.role != \"admin\": HTTPException 403.",
    `@app.delete("/admin/users/{user_id}")
def wipe(user_id: int, user=Depends(current_user)):
    if user.get("role") != "admin":
        raise HTTPException(403, "admin only")
    return {"deleted": user_id}`),
  q(7, "intermediate", "Practice: CORS for Vite",
    "Before you use this\nUI on 5173, API on 8000.\n\nWhat this is\nCORSMiddleware allow_origins the UI.\n\nWhy we use it\nfetch from React works.\n\nWhat the code is doing\nList the real origin. Not * if cookies.",
    `app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)`),
  q(8, "beginner", "Practice: open /docs",
    "Before you use this\nThe app is running.\n\nWhat this is\nSwagger UI at /docs. Built from your types.\n\nWhy we use it\nTry POST without writing a client.\n\nWhat the code is doing\nNo extra code. FastAPI mounts it.",
    `# visit http://127.0.0.1:8000/docs
# try POST /todos from the page`),
  q(9, "advanced", "Practice: /predict for a model",
    "Before you use this\nmodel.joblib exists. Load once.\n\nWhat this is\nPOST features, return a prediction.\n\nWhy we use it\nML interview lab: notebook → API.\n\nWhat the code is doing\nPydantic Features. model.predict one row.",
    `@app.post("/predict")
def predict(row: Features):
    y = model.predict([[row.rooms, row.area]])[0]
    return {"price": float(y)}`),
  q(10, "intermediate", "Practice: API key on /predict",
    "Before you use this\nSet API_KEY in env.\n\nWhat this is\nHeader X-API-Key. Wrong → 401.\n\nWhy we use it\nStop anonymous GPU/CPU use.\n\nWhat the code is doing\ncompare_digest the header to the env value.",
    `def need_key(x_api_key: str = Header(...)):
    if not hmac.compare_digest(x_api_key, os.environ["API_KEY"]):
        raise HTTPException(401, "bad key")`),
  q(11, "beginner", "Practice: /health",
    "Before you use this\nDeploy will ping this.\n\nWhat this is\nGET /health → 200 {status: ok}. No JWT.\n\nWhy we use it\nRender, Docker, k8s.\n\nWhat the code is doing\nA tiny dict.",
    `@app.get("/health")
def health():
    return {"status": "ok"}`),
  q(12, "intermediate", "Practice: TestClient",
    "Before you use this\npip install httpx. App is importable.\n\nWhat this is\nIn-process GET /health.\n\nWhy we use it\nCI without a real port.\n\nWhat the code is doing\nTestClient(app).get. assert 200.",
    `from fastapi.testclient import TestClient
c = TestClient(app)
assert c.get("/health").status_code == 200`),
  q(13, "intermediate", "Practice: hide password on the way out",
    "Before you use this\nUserIn has password. The client must not see the hash.\n\nWhat this is\nresponse_model=UserOut without password.\n\nWhy we use it\nLeaking hashes is a security bug.\n\nWhat the code is doing\nTwo models. FastAPI filters the return.",
    `@app.post("/users", response_model=UserOut)
def create_user(user: UserIn):
    return {"id": 1, "email": user.email}`),
  q(14, "advanced", "Practice: lifespan load model",
    "Before you use this\nDo not joblib.load inside /predict.\n\nWhat this is\nlifespan loads once, yields, then process can exit.\n\nWhy we use it\nPredict stays fast. Memory is shared.\n\nWhat the code is doing\napp.state.model = joblib.load(...).",
    `@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.model = joblib.load("model.joblib")
    yield`),
  q(15, "beginner", "Practice: query filter",
    "Before you use this\nGET /todos?done=true.\n\nWhat this is\nOptional query bool.\n\nWhy we use it\nFilters are query, not a new path.\n\nWhat the code is doing\ndone: bool | None = None. Filter the list.",
    `@app.get("/todos")
def list_todos(done: bool | None = None):
    if done is None:
        return todos
    return [t for t in todos if t["done"] is done]`),
  q(16, "intermediate", "Practice: env secrets",
    "Before you use this\nNever commit JWT_SECRET.\n\nWhat this is\nos.environ.get. Fail fast if missing in prod.\n\nWhy we use it\nSame code, different hosts.\n\nWhat the code is doing\nSECRET = os.environ[\"JWT_SECRET\"].",
    `import os
SECRET = os.environ["JWT_SECRET"]  # crash if missing — good`),
  q(17, "advanced", "Practice: HTTPS in front",
    "Before you use this\nuvicorn speaks HTTP on 8000.\n\nWhat this is\nNginx or Render terminates TLS. The app stays HTTP locally.\n\nWhy we use it\nUsers hit https://. Certificates are not inside Python.\n\nWhat the code is doing\nNo TLS code. Trust X-Forwarded-Proto if behind a proxy.",
    `# nginx: listen 443 ssl; proxy_pass http://127.0.0.1:8000;`),
  q(18, "intermediate", "Practice: owner delete",
    "Before you use this\nTodos have user_id. current_user is set.\n\nWhat this is\nDelete only if item.user_id == user.id. Else 403.\n\nWhy we use it\nId in the URL is not permission.\n\nWhat the code is doing\nLoad, compare, delete.",
    `if item["user_id"] != user["id"]:
    raise HTTPException(403, "not your todo")`),

  ask(19, "beginner", "What is an API?",
    "Before you use this\nThe screen cannot open Postgres.\n\nWhat this is\nHTTP in, JSON out. The contract between UI and server.\n\nWhy we use it\nWeb, mobile, and jobs share one door.\n\nWhat happens\nGET /todos → 200 list. FastAPI or Express is just the kitchen.",
    `r = requests.get("http://127.0.0.1:8000/todos")
print(r.json())`,
    "Amazon · Google · Microsoft"),
  ask(20, "beginner", "What is FastAPI and why use it?",
    "Before you use this\nYou know Python functions and type hints.\n\nWhat this is\nA Python framework for REST APIs with validation and /docs.\n\nWhy we use it\nPydantic + OpenAPI + async. Default for new Python APIs and ML /predict.\n\nWhat happens\nDecorators, uvicorn, JSON. Wrong body → 422.",
    `app = FastAPI()
@app.get("/ping")
def ping():
    return {"ok": True}`,
    "Amazon · Google · Microsoft"),
  ask(21, "beginner", "401 vs 403 on an API?",
    "Before you use this\nA token is 'who'. A role is 'may I'.\n\nWhat this is\n401 not logged in. 403 logged in, not allowed.\n\nWhy we use it\nThe UI shows login vs forbidden. Every backend interview asks this.\n\nWhat happens\nNo Bearer → 401. user hits /admin → 403.",
    `raise HTTPException(401, "login required")
raise HTTPException(403, "admin only")`,
    "Amazon · Google · Meta · Microsoft"),
  ask(22, "intermediate", "How does FastAPI validate input?",
    "Before you use this\nA JSON body is just text until you check it.\n\nWhat this is\nPydantic models on the function. Types and Field() become 422 errors.\n\nWhy we use it\nYou do not hand-write 15 ifs. /docs matches the code.\n\nWhat happens\ntext: str = Field(min_length=1). {\"text\": \"\"} → 422.",
    `class TodoIn(BaseModel):
    text: str = Field(min_length=1)`,
    "Amazon · Google · Microsoft"),
  ask(23, "intermediate", "What is /docs?",
    "Before you use this\nOpenAPI is a machine list of routes.\n\nWhat this is\nSwagger UI FastAPI builds from your types. /redoc too.\n\nWhy we use it\nTry the API, share with frontend, generate clients.\n\nWhat happens\nOpen /docs while uvicorn runs. No extra config for a first app.",
    `# http://127.0.0.1:8000/docs`,
    "Amazon · Microsoft · Google"),
  ask(24, "intermediate", "FastAPI vs Flask vs Express?",
    "Before you use this\nAll three can return JSON.\n\nWhat this is\nFlask: small, sync, extra packages for schemas. FastAPI: types, async, docs. Express: Node, huge ecosystem.\n\nWhy we use it\nPick the language of the team. ML → FastAPI. JS shop → Express.\n\nWhat happens\nSame REST verbs. Validation is the usual difference.",
    `# FastAPI: types + /docs
# Flask:   app.route, check by hand
# Express: app.get, add Joi/Zod`,
    "Amazon · Google · Microsoft"),
  ask(25, "intermediate", "How do you secure a FastAPI route?",
    "Before you use this\nHTTPS at the edge. Secrets in env.\n\nWhat this is\nDepends that decode JWT or check an API key. Roles for 403. CORS allowlist.\n\nWhy we use it\nSecurity is not a React if. The server decides.\n\nWhat happens\nOAuth2PasswordBearer + jwt.decode. Missing token 401.",
    `def current_user(token: str = Depends(oauth2)):
    return jwt.decode(token, SECRET, algorithms=["HS256"])`,
    "Amazon · Google · Uber"),
  ask(26, "beginner", "GET vs POST — what must you never do?",
    "Before you use this\nGET can be cached, retried, logged in the URL.\n\nWhat this is\nGET is safe and read-only. POST/PATCH/DELETE change data.\n\nWhy we use it\nA crawler or prefetch must not delete a user.\n\nWhat happens\nDelete is @app.delete, never @app.get(\"/delete\").",
    `@app.delete("/todos/{todo_id}")
def remove(todo_id: int):
    ...`,
    "Amazon · Google · Meta"),
];

function dump(id, data) {
  const out = "window.PREP_DATA = window.PREP_DATA || {};\nwindow.PREP_DATA[" + JSON.stringify(id) + "] = " + JSON.stringify(data, null, 2) + ";\n";
  fs.writeFileSync(path.join(__dirname, "..", "data", id + ".js"), out);
  console.log(id, (data.questions || []).length, "questions");
}

dump("fastapi", fastapi);
dump("practice-api", practice);
