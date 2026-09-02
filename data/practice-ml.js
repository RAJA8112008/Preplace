window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA["practice-ml"] = {
  "kind": "practice",
  "notes": [
    {
      "title": "How to use this lab",
      "body": "Train → save → predict. Then wrap predict in a small HTTPS API with a key."
    },
    {
      "title": "CRUD of a model",
      "body": "Create = train. Read = load + predict. Update = retrain. Delete = drop the file."
    },
    {
      "title": "Auth",
      "body": "A predict API still needs a key so strangers do not burn your CPU."
    }
  ],
  "examples": [
    {
      "title": "Train a tiny yes/no model",
      "lang": "python",
      "desc": "sklearn on two numbers.",
      "code": "from sklearn.linear_model import LogisticRegression\nX = [[0], [1], [2], [3]]\ny = [0, 0, 1, 1]\nm = LogisticRegression().fit(X, y)\nprint(m.predict([[1.5]])[0])"
    },
    {
      "title": "Save and load",
      "lang": "python",
      "desc": "joblib dump / load.",
      "code": "import joblib\njoblib.dump(m, \"model.joblib\")\nm2 = joblib.load(\"model.joblib\")"
    },
    {
      "title": "Predict API",
      "lang": "js",
      "desc": "POST JSON { x: 1.5 }.",
      "code": "app.post(\"/predict\", function (req, res) {\n  const y = model.predict([[req.body.x]])[0];  // Read the model\n  res.json({ y });\n});"
    },
    {
      "title": "API key",
      "lang": "js",
      "desc": "Authorization: Bearer lab-key.",
      "code": "function requireKey(req, res, next) {\n  if (req.headers.authorization !== \"Bearer \" + process.env.API_KEY) {\n    return res.status(401).end();  // authentication\n  }\n  next();\n}"
    },
    {
      "title": "Train/test split",
      "lang": "python",
      "desc": "Never test on the same rows you trained.",
      "code": "from sklearn.model_selection import train_test_split\nXt, Xv, yt, yv = train_test_split(X, y, test_size=0.25, random_state=0)"
    },
    {
      "title": "RAG-style retrieve",
      "lang": "js",
      "desc": "Fake top-1 by keyword for practice.",
      "code": "function retrieve(q, chunks) {\n  return chunks.find((c) => c.includes(q.slice(0, 4))) || chunks[0];\n}"
    },
    {
      "title": "HTTPS client",
      "lang": "js",
      "desc": "The notebook calls the live model.",
      "code": "const res = await fetch(\"https://api.example.com/predict\", {\n  method: \"POST\",\n  headers: {\n    \"Content-Type\": \"application/json\",\n    Authorization: \"Bearer \" + key\n  },\n  body: JSON.stringify({ x: 1.5 })\n});"
    },
    {
      "title": "Do not return raw PII",
      "lang": "js",
      "desc": "Predict a label, not the training row.",
      "code": "res.json({ spam: true });  // not the email body"
    }
  ],
  "questions": [
    {
      "id": 1,
      "level": "beginner",
      "q": "Practice: fit a line",
      "a": "LinearRegression on x → y.",
      "code": "from sklearn.linear_model import LinearRegression\nm = LinearRegression().fit([[1],[2],[3]], [2,4,6])\nprint(m.predict([[4]])[0])"
    },
    {
      "id": 2,
      "level": "beginner",
      "q": "Practice: save the model",
      "a": "joblib.dump.",
      "code": "joblib.dump(m, \"model.joblib\")"
    },
    {
      "id": 3,
      "level": "intermediate",
      "q": "Practice: /predict",
      "a": "Load once at boot. POST x → y.",
      "code": "app.post(\"/predict\", auth, function (req, res) {\n  res.json({ y: m.predict([[req.body.x]])[0] });\n});"
    },
    {
      "id": 4,
      "level": "intermediate",
      "q": "Practice: API key auth",
      "a": "401 if missing.",
      "code": "if (req.headers.authorization !== \"Bearer \" + process.env.API_KEY) {\n  return res.status(401).json({ error: \"key\" });\n}"
    },
    {
      "id": 5,
      "level": "beginner",
      "q": "Practice: train/test split",
      "a": "25% holdout.",
      "code": "train_test_split(X, y, test_size=0.25, random_state=0)"
    },
    {
      "id": 6,
      "level": "intermediate",
      "q": "Practice: accuracy print",
      "a": "score on the holdout.",
      "code": "print(m.score(Xv, yv))"
    },
    {
      "id": 7,
      "level": "advanced",
      "q": "Practice: HTTPS deploy",
      "a": "Same as the backend lab.",
      "code": "fetch(\"https://ml.example.com/predict\", { method: \"POST\", body, headers })"
    },
    {
      "id": 8,
      "level": "beginner",
      "q": "Practice: CRUD a dataset row",
      "a": "Append a labelled row to CSV.",
      "code": "import pandas as pd\ndf = pd.read_csv(\"rows.csv\")\ndf.loc[len(df)] = {\"x\": 4, \"y\": 1}\ndf.to_csv(\"rows.csv\", index=False)"
    },
    {
      "id": 9,
      "level": "intermediate",
      "q": "Practice: retrain job",
      "a": "Read CSV, fit, dump.",
      "code": "m = LogisticRegression().fit(X, y)\njoblib.dump(m, \"model.joblib\")"
    },
    {
      "id": 10,
      "level": "beginner",
      "q": "Practice: delete a bad row",
      "a": "Filter and save. Retrain after.",
      "code": "df = df[df.x >= 0]\ndf.to_csv(\"rows.csv\", index=False)"
    },
    {
      "id": 11,
      "level": "advanced",
      "q": "Practice: do not leak train text",
      "a": "Return a snippet, not the PII dump.",
      "code": "res.json({ chunkId: h.id, snippet: h.body.slice(0, 200) });"
    },
    {
      "id": 12,
      "level": "intermediate",
      "q": "Practice: vector search toy",
      "a": "Closest by a fake score.",
      "code": "hits.sort((a, b) => b.score - a.score);\nreturn hits.slice(0, 3);"
    },
    {
      "id": 13,
      "level": "beginner",
      "q": "Why auth on /predict?",
      "a": "Open predict endpoints get scraped and cost money.",
      "code": "Authorization: Bearer …"
    },
    {
      "id": 14,
      "level": "intermediate",
      "q": "Practice: role for /retrain",
      "a": "Only admin may POST /retrain.",
      "code": "if (req.user.role !== \"admin\") return res.status(403).end();"
    },
    {
      "id": 15,
      "level": "beginner",
      "q": "Practice: evaluate before ship",
      "a": "Print holdout score.",
      "code": "assert m.score(Xv, yv) > 0.6"
    },
    {
      "id": 16,
      "level": "advanced",
      "q": "Practice: version the file",
      "a": "model_v3.joblib.",
      "code": "MODEL = process.env.MODEL_PATH || \"model_v3.joblib\";"
    },
    {
      "id": 17,
      "level": "intermediate",
      "q": "Practice: HTTPS + key from the notebook",
      "a": "Never hardcode the key in a public gist.",
      "code": "key = os.environ[\"API_KEY\"]"
    },
    {
      "id": 18,
      "level": "beginner",
      "q": "Spam vs ham labels",
      "a": "0/1 or spam/ham. Keep a codebook.",
      "code": "y = [0, 0, 1, 1]  # 1 = spam"
    }
  ]
};
