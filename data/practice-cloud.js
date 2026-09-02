window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA["practice-cloud"] = {
  "kind": "practice",
  "notes": [
    {
      "title": "How to use this lab",
      "body": "Tiny AWS tasks around a todo/login app. Free tier plus a billing alarm."
    },
    {
      "title": "HTTPS",
      "body": "CloudFront or an ALB. ACM certificate on the load balancer."
    },
    {
      "title": "IAM vs app auth",
      "body": "IAM is for AWS APIs. Your todo users are JWT or Cognito, not IAM users."
    }
  ],
  "examples": [
    {
      "title": "S3 + CloudFront HTTPS",
      "lang": "txt",
      "desc": "Static files. HTTPS at the edge.",
      "code": "// CloudFront origin = S3 bucket\n// Alternate domain + ACM cert = https://app.example.com"
    },
    {
      "title": "Lambda todo GET",
      "lang": "js",
      "desc": "Handler returns JSON. API Gateway is HTTPS.",
      "code": "exports.handler = async function () {\n  return {\n    statusCode: 200,\n    body: JSON.stringify([{ id: 1, text: \"read\" }])  // Read\n  };\n};"
    },
    {
      "title": "RDS URL",
      "lang": "txt",
      "desc": "Same SQL as laptop, different host.",
      "code": "postgres://app:pass@xxx.rds.amazonaws.com:5432/app"
    },
    {
      "title": "IAM policy snippet",
      "lang": "txt",
      "desc": "One bucket, read only.",
      "code": "{\n  \"Effect\": \"Allow\",\n  \"Action\": [\"s3:GetObject\"],\n  \"Resource\": \"arn:aws:s3:::my-app-uploads/*\"\n}"
    },
    {
      "title": "Presigned upload",
      "lang": "js",
      "desc": "Browser PUTs to S3 over HTTPS without your AWS keys.",
      "code": "async function uploadUrl(Bucket, Key) {\n  return s3.getSignedUrlPromise(\"putObject\", { Bucket, Key, Expires: 60 });\n}"
    },
    {
      "title": "Secrets as env",
      "lang": "js",
      "desc": "DATABASE_URL from secrets manager.",
      "code": "const url = process.env.DATABASE_URL;  // not a file in Git"
    },
    {
      "title": "Force HTTPS on CloudFront",
      "lang": "txt",
      "desc": "Redirect HTTP to HTTPS.",
      "code": "ViewerProtocolPolicy: redirect-to-https"
    },
    {
      "title": "Security group",
      "lang": "txt",
      "desc": "443 from world. 5432 only from the API SG.",
      "code": "ALB :443 0.0.0.0/0\nRDS :5432 sg-api-only"
    }
  ],
  "questions": [
    {
      "id": 1,
      "level": "beginner",
      "q": "Practice: static todo UI on S3 + HTTPS",
      "a": "Bucket for files. CloudFront + ACM for https://.",
      "code": "// upload dist/ to S3\n// CloudFront default root index.html"
    },
    {
      "id": 2,
      "level": "beginner",
      "q": "Practice: Lambda hello HTTPS",
      "a": "API Gateway → Lambda → { ok: true }.",
      "code": "exports.handler = async function () {\n  return { statusCode: 200, body: \"{\"ok\":true}\" };\n};"
    },
    {
      "id": 3,
      "level": "intermediate",
      "q": "Practice: RDS for todos",
      "a": "Same INSERT as local, host is RDS.",
      "code": "await db.query(\"INSERT INTO todos(text) VALUES ($1)\", [text]);  // Create"
    },
    {
      "id": 4,
      "level": "intermediate",
      "q": "Practice: IAM for the API box",
      "a": "Role with s3:PutObject on one prefix.",
      "code": "// use the instance / task role — no access keys in code"
    },
    {
      "id": 5,
      "level": "intermediate",
      "q": "Practice: Cognito or JWT",
      "a": "Your users are not IAM users.",
      "code": "const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);"
    },
    {
      "id": 6,
      "level": "beginner",
      "q": "Practice: security group for SSH",
      "a": "22 from your IP only.",
      "code": "22 tcp your.ip/32"
    },
    {
      "id": 7,
      "level": "advanced",
      "q": "Practice: private RDS",
      "a": "No public IP on RDS.",
      "code": "// RDS in private subnets"
    },
    {
      "id": 8,
      "level": "intermediate",
      "q": "Practice: HTTPS redirect at the edge",
      "a": "ALB or CloudFront viewer policy.",
      "code": "redirect-to-https"
    },
    {
      "id": 9,
      "level": "beginner",
      "q": "Practice: billing alarm",
      "a": "Alarm if estimated charges > $5.",
      "code": "// console: Billing → Budgets"
    },
    {
      "id": 10,
      "level": "intermediate",
      "q": "Practice: upload avatar via presign",
      "a": "API makes URL. Browser PUT to S3 HTTPS.",
      "code": "res.json({ url });  // browser PUTs the file"
    },
    {
      "id": 11,
      "level": "advanced",
      "q": "Practice: secrets",
      "a": "JWT_SECRET in Secrets Manager.",
      "code": "const secret = process.env.JWT_SECRET;"
    },
    {
      "id": 12,
      "level": "beginner",
      "q": "IAM vs app authorization?",
      "a": "IAM = who may call AWS. App role = who may delete a todo.",
      "code": "if (req.user.role !== \"admin\") return res.status(403).end();  // app authz"
    },
    {
      "id": 13,
      "level": "intermediate",
      "q": "Practice: CORS on API Gateway",
      "a": "Allow the CloudFront origin only.",
      "code": "Access-Control-Allow-Origin: https://app.example.com"
    },
    {
      "id": 14,
      "level": "beginner",
      "q": "Practice: do not commit keys",
      "a": "If you leaked a key, rotate it.",
      "code": "aws iam create-access-key"
    },
    {
      "id": 15,
      "level": "advanced",
      "q": "Practice: WAF sketch",
      "a": "Rate limit login at the edge.",
      "code": "# AWS WAF rate-based rule on /login"
    },
    {
      "id": 16,
      "level": "intermediate",
      "q": "Practice: HTTPS health to ALB",
      "a": "Target group /health on 3000. ALB 443.",
      "code": "GET /health → 200"
    },
    {
      "id": 17,
      "level": "beginner",
      "q": "S3 vs RDS for todos?",
      "a": "Todos are rows. S3 is files.",
      "code": "-- todos live in RDS"
    },
    {
      "id": 18,
      "level": "intermediate",
      "q": "Practice: logout / revoke",
      "a": "Short JWT TTL, or Cognito global sign-out.",
      "code": "res.clearCookie(\"sid\");"
    }
  ]
};
