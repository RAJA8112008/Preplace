window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA["practice-ml"] = {
  "kind": "practice",
  "notes": [
    {
      "title": "Most asked",
      "body": "After the hands-on labs, open questions tagged Most asked. Those are the interview questions Amazon, Google, Meta, and Microsoft repeat. Same easy comments on the right of the code."
    },
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
    },
    {
      "id": 19,
      "level": "beginner",
      "q": "What is overfitting?",
      "a": "The problem before\nThe shop model recited every past bill, including the day the clerk typed 99999 by mistake. On new customers it failed. Train score looked perfect. The holdout score was poor. They shipped it because the training notebook was green.\nWhat this is\nOverfitting is memorizing training rows instead of learning a pattern that works on new rows. You spot it when train score is high and test score is low. Causes: too flexible a model, too little data, too many features, training until the noise is carved in. Underfitting is the opposite: too simple, both scores low.\nWhat it solves\nYou catch a model that will die in production. Fixes: more data, a simpler model, regularization, early stopping, dropout, fewer junk features. Always print both scores. The holdout is the exam; the training set is the practice book.\nReal-life example\nA bank fraud model that memorizes yesterday's ten fraud names misses today's new thief and flags Ada because her row looked like a training curiosity. A warehouse demand model that fits last year's festival spike as a law then over-orders. The kirana kid who memorizes worksheet answers fails the unseen paper.\nUses\nEvery train versus test conversation. Plot learning curves. Regularization such as L2, simpler linear models, more rows. Compare train versus holdout in the notebook before you ship /predict.\nWatch out\nA tiny dataset overfits easily. Tuning until the test score is perfect is overfitting the test set — that is why you want a third split. Accuracy on an imbalanced spam set can hide the mess. Do not peek at test to pick the story.",
      "code": "print(m.score(Xt, yt), m.score(Xv, yv))  # train vs holdout",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 20,
      "level": "beginner",
      "q": "Train / validation / test — why three?",
      "a": "The problem before\nThey split once, tuned the C parameter until the holdout looked great, and called that number unseen performance. It was not unseen. The exam questions had been used as homework. Production was the first true exam and it failed.\nWhat this is\nThree piles. Train: the model learns weights. Validation: you pick hyperparameters and architecture. Test: one final number you do not tune on. If you tune on the test set, it is no longer a fair exam. A simple lab may use two piles; interviews want the reason for three.\nWhat it solves\nYou get an honest last number. You can compare two models on validation without burning the test set. You explain cross-validation as rotating the validation fold when data is scarce. random_state makes the split repeatable in a lab.\nReal-life example\nSchool: practice worksheets are train, a mock exam you use to decide how late to study is validation, the board exam once is test. A bank builds on last year's cases, tunes on last month, reports on a sealed week. A warehouse forecasts on old weeks, tunes on recent weeks, scores on a locked festival week.\nUses\nsklearn train_test_split, then a second split or a validation fold. Time-based split for sales — do not shuffle the future into train. Stratify on rare spam so each pile has both classes.\nWatch out\nShuffling time series leaks the future. The same person in train and test is group leakage. Tiny test sets bounce. Using test to choose the model, then quoting that score as gospel, is the original sin of this card.",
      "code": "Xt, Xv, yt, yv = train_test_split(X, y, test_size=0.25, random_state=0)",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 21,
      "level": "intermediate",
      "q": "Precision vs recall?",
      "a": "The problem before\nA spam filter hid half of Ada's real mail and the shop called it accurate because most mail is ham. A medical screen bragged about precision while missing sick patients. One number hid the trade-off. Interviewers ask which error is worse for this product.\nWhat this is\nPrecision: of the rows we called spam, or sick, or fraud, how many were correct — true positives over true plus false positives. Recall: of all real positives, how many we caught — true positives over true plus false negatives. You move a threshold to trade them. F1 is the harmonic mean when you need one blend. Accuracy is a third number that lies on imbalanced data.\nWhat it solves\nYou pick the pain. A medical screen often wants high recall: do not miss the sick. A spam filter that hides real mail wants high precision: do not bury the invoice. A bank fraud block that stops honest cards needs precision; a fraud review queue can lean recall.\nReal-life example\nWarehouse metal detector. High recall beeps on every metal sliver and also on belt buckles — false positives. High precision only beeps when sure, and a tool sneaks through — false negatives. The kirana is-this-note-fake check is the same trade.\nUses\nConfusion-matrix interviews, threshold plots, precision-recall curves. Say the product and which cell hurts. Pair with class imbalance: one percent spam.\nWatch out\nOptimizing accuracy on 99 percent ham yields a model that never predicts spam. Precision and recall need a defined positive class. Macro versus micro averages matter when you have many labels. Do not quote F1 without saying who is the positive class.",
      "code": "# precision = tp / (tp + fp)\n# recall    = tp / (tp + fn)",
      "ask": "Most asked · Amazon · Google · Meta"
    },
    {
      "id": 22,
      "level": "intermediate",
      "q": "Bias vs variance?",
      "a": "The problem before\nA straight line missed the curve — high bias. A wiggly line hit every training crumb and missed new crumbs — high variance. Teams added features until the notebook looked perfect and production wiggled. They used the words as insults, not as errors.\nWhat this is\nBias is error from a model that is too simple to see the pattern: underfitting. Variance is error from a model that jumps when the training sample jumps: overfitting. You trade them. More data lowers variance. A simpler model lowers variance and can raise bias. Regularization is a knob on that trade.\nWhat it solves\nYou diagnose from the two scores. Both low: raise capacity or add features — bias. Train high, test low: more data, simpler model, regularize — variance. You stop only adding layers because a blog said deep. Print train and holdout together.\nReal-life example\nA bank uses only age to pick fraud — high bias, the line is too simple. A model with a parameter per customer memorizes last month — high variance. A warehouse that forecasts from one quiet Tuesday is variance. A kirana that always predicts average day is bias.\nUses\nLearning curves, regularization, model family choice — linear versus deep trees. Interview drawing: a bullseye, bias off-center, variance spread.\nWatch out\nMore features can raise variance. More data does not fix a wrong target. High variance plus leakage looks like magic. Do not confuse statistical bias with social bias without saying you switched meanings. Print train and holdout together every time you change capacity, or you are only guessing which error you have.",
      "code": "# underfit — raise model capacity\n# overfit  — more data or a simpler model",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 23,
      "level": "beginner",
      "q": "Supervised vs unsupervised?",
      "a": "The problem before\nA stakeholder said predict the clusters and we have no labels in the same sentence. A team ran k-means on spam and wondered where the accuracy score went. Another team needed labels they did not have and quietly used future outcomes as if they were known at train time.\nWhat this is\nSupervised learning has labels: X in, y out. Spam versus ham, price, fraud yes or no. Unsupervised has no y: cluster customers, compress, find outliers. Most interview predict-X stories are supervised. Semi-supervised and reinforcement sit to the side if they ask.\nWhat it solves\nYou know whether you must label a dataset. You know which metrics apply: precision needs a label; silhouette does not. You pick LogisticRegression versus KMeans. You explain that clustering is a suggestion, not a graded exam, unless someone labels the clusters later.\nReal-life example\nThe bank labels past transfers fraud or not — supervised. The warehouse piles similar boxes without names — unsupervised. The kirana sorts spices by smell with no price target — unsupervised. Predicting next week's rupees from past weeks is supervised.\nUses\nFirst fork in an ML interview. Classification and regression are supervised. PCA and k-means are unsupervised. RAG retrieval is not this fork; it is search. Ask whether y exists before you pick a metric.\nWatch out\nEvaluating k-means with accuracy without labels is theater. Using the label as a feature is leakage. Unsupervised clusters may not match business segments. We will label later is a project cost, not a model type. If there is no honest label at train time, do not invent one from the future and call the exam supervised.",
      "code": "X, y = features, labels  # supervised\n# kmeans.fit(X)  # unsupervised — no y",
      "ask": "Most asked · Amazon · Microsoft · Google"
    },
    {
      "id": 24,
      "level": "beginner",
      "q": "What is a confusion matrix?",
      "a": "The problem before\nAccuracy said 99 percent. The model always answered ham. Spam still landed in the inbox. Nobody could see false positives versus false negatives. The shop celebrated the number and customers missed invoices.\nWhat this is\nA confusion matrix is a table of predicted versus real. For two classes: true negative and false positive on the actual-negative row; false negative and true positive on the actual-positive row. NxN for many classes. Precision, recall, and specificity are read from those cells. Accuracy is true positives plus true negatives over all, and it can hide the rare class.\nWhat it solves\nYou see which error you make. You set a threshold and watch false positives versus false negatives move. You explain a 99 percent not-spam model that never catches spam. You pick a cost: a bank false positive blocks a card; a false negative pays a thief.\nReal-life example\nWarehouse quality gate. Rows are truly good or bad; columns are what the inspector said. A false positive is a good jar thrown away. A false negative is a bad jar on the shelf. The kirana metal detector and the bank fraud queue use the same grid.\nUses\nBinary interviews, sklearn confusion_matrix, threshold talks. Draw the two-by-two on the whiteboard. Pair with precision and recall.\nWatch out\nAxis conventions swap; say predicted on columns and real on rows, or the reverse, out loud. Multiclass matrices hide in a blur if you only quote accuracy. Imbalance makes true negatives huge. Do not optimize one cell while ignoring cost. Always name the rare class and which cell is expensive before you celebrate a 99 percent score.",
      "code": "#            predicted no   predicted yes\n# real no        TN              FP\n# real yes       FN              TP",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 25,
      "level": "intermediate",
      "q": "Why scale features?",
      "a": "The problem before\nSalary 90000 sat next to age 30. Distance models thought salary was the only ingredient. Gradient steps zigzagged. Trees did not care much, so a team scaled everything by habit and then leaked: they fit the scaler on train plus test.\nWhat this is\nFeature scaling puts numbers on a common scale. StandardScaler subtracts the mean and divides by standard deviation. MinMax squeezes to a range. Fit the scaler on train only, then transform train and test. Trees and rule lists care less; kNN, SVM, logistic regression, and neural nets often care a lot.\nWhat it solves\nDistance means distance, not who has the bigger unit. Gradients behave. Regularization treats coefficients fairly. You stop age from being invisible next to rupees. The same scaler must be stored with the model so /predict transforms live rows the same way.\nReal-life example\nA shop scale that weighs spices in grams and sacks in kilograms without converting will say the sack is the only item. A bank model with rupees and a 0/1 flag needs scale. The warehouse measures aisle meters and box counts — normalize before a distance search.\nUses\nkNN, SVM, logistic, neural nets, k-means. Persist the scaler next to model.joblib. Mention robust scalers if outliers dominate.\nWatch out\nFit on all data, then split — leakage. Scaling the label by accident. Scaling one-hot columns is usually pointless. Trees often skip this; saying always scale is half wrong. Production must apply the same means, not re-fit on one request. Fit the scaler on train only and ship that same scaler with the model, or live rows will sit on a different scale.",
      "code": "from sklearn.preprocessing import StandardScaler\nsc = StandardScaler().fit(Xt)\nXt2, Xv2 = sc.transform(Xt), sc.transform(Xv)",
      "ask": "Most asked · Amazon · Google"
    },
    {
      "id": 26,
      "level": "advanced",
      "q": "What is data leakage?",
      "a": "The problem before\nThe notebook score was magical. Production died. The model had seen a future column such as paid_at, the test rows, or a feature built from the label. They split after fitting the scaler. The exam was in the homework.\nWhat this is\nData leakage is information at train time that you would not have at predict time. Sources: target leakage — a column that is the answer in disguise — train-test contamination — fit on all rows — group leakage — same user in both piles — and time leakage, tomorrow's price in today's features. Split first, then fit.\nWhat it solves\nYou ship a score that can exist in the real API. You refuse features that arrive after the decision. You keep Ada's other applications out of her test fold if the unit is the person. You treat the predict API as the law: if the field is not on the request, it is not a feature.\nReal-life example\nA bank model uses collection_agent_assigned to predict default — that flag is set after they already know risk. A warehouse uses next week's arrival to predict this week's stockout. A kirana spam model includes the human label column renamed as notes. All look smart, then the till fails.\nUses\nEvery feature review. Split, then scaler, then model. Time-based splits for sales. Group splits for users. Ask whether /predict would have this field.\nWatch out\nPreprocessing on the full frame. Target encoding without folds. IDs that correlate with the label. RAG that retrieves the answer document from the test set. A leaked model is not a bit optimistic; it is a different, illegal exam.",
      "code": "# split first\nXt, Xv, yt, yv = train_test_split(X, y)\n# then fit scaler / model on Xt only",
      "ask": "Most asked · Amazon · Google · Meta"
    }
  ]
};
