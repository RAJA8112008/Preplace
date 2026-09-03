window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA["practice-cloud"] = {
  "kind": "practice",
  "notes": [
    {
      "title": "Most asked",
      "body": "After the hands-on labs, open questions tagged Most asked. Those are the interview questions Amazon, Google, Meta, and Microsoft repeat. Same easy comments on the right of the code."
    },
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
    },
    {
      "id": 19,
      "level": "beginner",
      "q": "What is IAM least privilege?",
      "a": "The problem before\nThe shop gave every clerk the master key to the warehouse, the till, and the landlord's safe. One lost key, and a stranger could spend the bank's money on servers. A homework app pasted AdministratorAccess on the API box because listing actions felt slow.\nWhat this is\nIAM least privilege means a role gets only the actions and resources it needs. The API box may s3:PutObject on one prefix, not s3:* on star. Humans use different identities from apps. Instance roles and task roles replace long-lived access keys in code. Policies name Effect, Action, and Resource.\nWhat it solves\nA leaked app role cannot empty the billing account. A photo-upload bug cannot read the payroll bucket. You can audit who may PutObject. You separate IAM — who may call AWS — from app authz — who may delete a todo. Rotate stays smaller because each identity is narrow.\nReal-life example\nA warehouse badge opens only the loading dock, not the manager's office. The kirana delivery boy may put boxes on the back shelf, uploads/*, and cannot open the cash drawer. The bank teller role is not the vault role. The JSON policy is that badge.\nUses\nEvery EC2, ECS, and Lambda role. CI deploy roles that may push to one ECR repo. Presigned uploads so the browser never sees AWS keys. Interview contrast: IAM versus Cognito or JWT for end users of the todo app.\nWatch out\nAdministratorAccess on a laptop user is how keys in Git become a four-figure bill. Wildcards on Resource are almost as wide. Humans and apps must not share one access key. git rm does not unsend a committed key — disable it the same day.",
      "code": "{\n  \"Effect\": \"Allow\",\n  \"Action\": [\"s3:PutObject\"],\n  \"Resource\": \"arn:aws:s3:::my-app-uploads/*\"\n}",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 20,
      "level": "beginner",
      "q": "S3 vs EBS vs EFS?",
      "a": "The problem before\nThe shop treated every storage product as a disk. They put todo rows in S3 and wondered where UPDATE went. They attached one disk to one EC2 and expected three API boxes to see the same folder. They paid for a shared file system when they only needed a photo bucket.\nWhat this is\nS3 is object storage: you PUT and GET files by key through an API, good for photos and backups. EBS is a block disk attached to one EC2, like a shop PC's hard drive. EFS is a network file system many EC2s can mount at once. Todos as rows belong in RDS, not in any of these three.\nWhat it solves\nYou pick the tool that matches the access. Browser uploads go to S3, often via a presigned URL. The operating system and database data files sit on EBS. A shared uploads folder that POSIX apps already understand can sit on EFS. You stop forcing SQL into a bucket.\nReal-life example\nWarehouse photos of damaged boxes go in a labeled crate anyone with a slip can fetch — S3. The clerk's own desk drawer is EBS: one desk, one drawer. The shared spice rack in the aisle that every clerk reaches is EFS. The sales ledger of rupees is RDS on that desk, not a crate of files.\nUses\nStatic websites and avatars on S3. Boot volumes and RDS storage on EBS. Lift-and-shift apps that need a shared filesystem on EFS. Interview table: object versus block versus file versus rows.\nWatch out\nS3 is not a POSIX disk; you cannot run Postgres data files on S3 as if it were EBS. EBS does not magically attach to two instances. EFS can surprise you on latency and price. Never store the user table as JSON files in a bucket and call it done.",
      "code": "// photos → S3\n// boot disk → EBS\n// shared uploads folder → EFS\n// todos → RDS",
      "ask": "Most asked · Amazon"
    },
    {
      "id": 21,
      "level": "intermediate",
      "q": "Public subnet vs private subnet?",
      "a": "The problem before\nThe shop put the cash ledger on the sidewalk with a public IP so the clerk could SSH from a cafe. Bots found port 5432. The opposite mistake: they hid the load balancer in a hole with no Internet Gateway, so customers could not reach HTTPS.\nWhat this is\nA public subnet has a route to an Internet Gateway; resources with a public IP can be reached from the internet. A private subnet has no public IP; outbound traffic goes through NAT if you need patches and package installs. You place the load balancer in public subnets and the API plus RDS in private ones.\nWhat it solves\nCustomers still hit HTTPS on the ALB. The database is not a public address. Workers can fetch updates through NAT without being inbound-reachable. You draw a simple picture: street door public, back room private.\nReal-life example\nThe bank's street door and receptionist — the ALB — face the road. The vault and the clerks — RDS and API — sit behind a locked corridor. They can send a courier out through a guarded exit, NAT, to buy supplies. Nobody from the street walks into the vault.\nUses\nVPC design interviews, RDS placement, and using SSM or a bastion instead of public SSH on the API. Pair with security groups: 443 from the world on the ALB, 5432 only from the API group.\nWatch out\nA private subnet without NAT cannot reach the internet for yum or npm — that may be what you want. Public RDS is a classic leak. Do not confuse a public subnet with 0.0.0.0/0 on every port; the route and the security group are different layers.",
      "code": "ALB — public subnets\nAPI / RDS — private subnets",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 22,
      "level": "intermediate",
      "q": "EC2 vs Lambda?",
      "a": "The problem before\nThe shop rented a room — a server — that stayed lit all night for a till that rang twice a day. Another shop tried to run a forever WebSocket on a function that lives for one request and then vanishes. Both paid the wrong bill and fought the wrong limits.\nWhat this is\nEC2 is a virtual machine you keep running: you pick the size, the AMI, the disk. Lambda runs your function per request, scales toward zero, and bills by duration and memory. Lambda fits short burst work behind API Gateway. A long-lived socket, a constant API, or a custom runtime may be cheaper or simpler on EC2 or ECS.\nWhat it solves\nYou match the shape of the work. A nightly CSV transform can be Lambda. A todo API with steady traffic may be one small EC2 or a container. You stop paying for idle RAM if the work is spiky. You stop fighting Lambda timeouts if the work is a twelve-hour worker.\nReal-life example\nA warehouse hires a day clerk who sits at the desk even when no truck comes — EC2. Lambda is a temp who appears when a box arrives and leaves when it is labeled. The bank's 200ms fraud check is a temp. The always-on trading ticker is a clerk on a chair.\nUses\nAPI Gateway plus Lambda for webhooks and small APIs. EC2 or ECS for WebSockets, GPUs, or sticky processes. Mention cold starts, the fifteen-minute max, and VPC ENI cold starts as the interview follow-up.\nWatch out\nLambda is not free at huge constant QPS. Putting RDS in a VPC with Lambda without planning ENIs causes mysterious timeouts. Do not store sessions only in /tmp on Lambda. EC2 without a role still tempts people to paste access keys.",
      "code": "exports.handler = async function () {\n  return { statusCode: 200, body: \"{\"ok\":true}\" };\n};",
      "ask": "Most asked · Amazon · Microsoft"
    },
    {
      "id": 23,
      "level": "intermediate",
      "q": "Security group vs NACL?",
      "a": "The problem before\nThe shop nailed a lock to the street and another lock to each clerk's badge, then mixed up which lock remembered the return trip. They opened 443 inbound but forgot that a stateless lock also needs the reply ports. Traffic died in one direction.\nWhat this is\nA security group is a stateful firewall on an elastic network interface: allow 443 in, and replies are allowed out automatically. A NACL is a stateless list on the subnet: you must allow both inbound and outbound rules, including ephemeral ports for replies. Most apps live on security groups. NACLs are a coarse subnet belt.\nWhat it solves\nYou can say the ALB allows 443 from the world, the API allows 3000 only from the ALB group, and RDS allows 5432 only from the API group. That is the usual three-layer picture. NACLs can deny a bad net at the subnet if you truly need a second fence.\nReal-life example\nThe bank badge on a person is the security group: once you are in, walking back out is included. The warehouse gate on the whole street is the NACL: the guard checks you going in and going out as two separate stamps. Forgetting the exit stamp is how a stateless gate traps you.\nUses\nDefault interview diagram for a three-tier VPC. Troubleshoot why a new NACL broke ephemeral replies. Prefer security-group references such as sg-api over 0.0.0.0/0 on data stores.\nWatch out\nNACLs are ordered and have deny rules; security groups are allow-only. A deny-all NACL plus a wide security group still blocks. Do not open 5432 to the world because the NACL felt private. Stateful versus stateless is the sentence they want.",
      "code": "ALB SG: 443 from 0.0.0.0/0\nAPI SG: 3000 from ALB SG\nRDS SG: 5432 from API SG",
      "ask": "Most asked · Amazon"
    },
    {
      "id": 24,
      "level": "beginner",
      "q": "What is a VPC?",
      "a": "The problem before\nThe shop dropped servers on the public internet and hoped passwords were enough. Databases got scanned. Two apps collided on the same flat network. There was no private hallway and no plan for what faces the street.\nWhat this is\nA VPC is your private network in the cloud: a CIDR, subnets, route tables, and gateways. Resources inside talk on private IPs. You choose which subnet has a path to the Internet Gateway and which only has NAT. Security groups and NACLs sit on top of that map.\nWhat it solves\nYou control what is public. RDS can be private. The ALB can be public. Two environments can be two VPCs or two CIDRs. Endpoints can reach S3 without hauling secrets across the open internet. It is the floor plan before you place furniture.\nReal-life example\nA warehouse compound with a fence is the VPC, a public reception lot is the public subnets, and locked aisles are the private subnets. The road out is the Internet Gateway. The staff-only courier door is NAT. The bank branch next door is another VPC; you do not share hallways unless you peer on purpose.\nUses\nFirst box you draw in an AWS design. Place ALB, API, RDS, NAT, and IGW. Mention one VPC per environment as a later choice. Contrast with GCP VPC and Azure VNet as the same idea.\nWatch out\nA VPC is not encryption and not IAM. An open 6379 inside a VPC is still open to every instance in that CIDR if security groups allow it. Overlapping CIDRs break peering later. Slash-16 versus slash-24 sizing is worth one sentence so you do not run out of IPs.",
      "code": "// VPC → public + private subnets → route tables → IGW / NAT",
      "ask": "Most asked · Amazon · Google · Microsoft"
    },
    {
      "id": 25,
      "level": "beginner",
      "q": "Why CloudFront in front of S3?",
      "a": "The problem before\nThe shop turned on the S3 website endpoint. It was HTTP-first, the bucket name leaked, and every photo pulled from one region. Customers in another city waited. A curious person listed objects because the bucket was public.\nWhat this is\nCloudFront in front of S3 is an HTTPS CDN with your domain and an ACM certificate. The origin is the bucket, usually not public. The edge caches static files. ViewerProtocolPolicy redirect-to-https forces TLS. Origin access keeps the bucket closed to the street.\nWhat it solves\nYou get HTTPS on a friendly name, cheaper egress, cache close to users, and a hidden bucket. Launch-day traffic hits edges. You can attach a WAF later. A public S3 website endpoint is weaker and often the wrong default. You also keep one cache policy for the JS bundle.\nReal-life example\nThe warehouse stores banners in a closed crate — S3. Neighborhood lockers — CloudFront — hand out copies over a locked door, HTTPS. The street never walks into the crate. The bank's logo on the login page is a locker object; the account JSON is not.\nUses\nStatic SPAs, image catalogues, docs sites. Pair with SPA error routes to index.html if you use client routing. Set cache headers per path. Mention invalidation or hashed filenames on deploy.\nWatch out\nA public bucket plus CloudFront is still a public bucket if someone hits the S3 URL. Forgetting redirect-to-https leaves HTTP. Caching index.html forever pins an old release. Do not put private user files on a public distribution without signed URLs. Do not leave the bucket world-readable just because CloudFront is in front; origin access should be the only door.",
      "code": "// S3 origin + ACM cert + redirect-to-https",
      "ask": "Most asked · Amazon"
    },
    {
      "id": 26,
      "level": "intermediate",
      "q": "What does RDS Multi-AZ do?",
      "a": "The problem before\nThe shop's only ledger lived in one room. A power cut in that room closed the till. Someone added Multi-AZ and expected reports to get faster. They did not; they got a standby, not extra clerks at viewing windows.\nWhat this is\nRDS Multi-AZ keeps a standby in another availability zone and fails over if the primary dies. It is high availability, not extra read scale. Read scale is a read replica that you query on purpose. Backups still matter. Failover is minutes, not a rebuild from last night.\nWhat it solves\nA zone failure or a host failure does not mean you restore from backup before the shop can sell. You still take snapshots. You still add replicas if SELECT is the bottleneck. Interviewers want that split in one breath: standby versus reader.\nReal-life example\nThe bank keeps a second vault book in another building. If the first building floods, clerks switch. Customers do not suddenly get two tellers for balance inquiries — that would be hiring extra readers, replicas. The warehouse fire door is survival, not more loading bays.\nUses\nProduction RDS for payments and users. Draw primary plus standby in two zones. Contrast with read replicas for reporting. Mention that failover changes the DNS endpoint briefly and drops in-flight connections.\nWatch out\nMulti-AZ is not a read replica; pointing reports at the standby as if it were readable is the usual mix-up. Failover still drops connections. Cross-AZ sync has a write-latency cost. Replicas can lag. Do not skip backups because Multi-AZ exists. Say standby versus reader in one breath: Multi-AZ keeps the shop open, a replica helps the report window.",
      "code": "-- Multi-AZ = standby\n-- read replica = extra reads",
      "ask": "Most asked · Amazon"
    },
    {
      "id": 27,
      "level": "beginner",
      "q": "Why never commit AWS keys?",
      "a": "The problem before\nA clerk pasted an AKIA key into app.js and pushed to GitHub. A scanner used the key the same hour. The shop's card paid for someone else's GPU farm. They ran git rm and thought the key was gone. History still had it.\nWhat this is\nAWS access keys are long-lived secrets that act as a user. You should not put them in Git, Slack, or screenshots. Prefer an instance role, a task role, or a Lambda role. If a key leaked, disable it and rotate the same day. Secrets belong in Secrets Manager or SSM, injected as env.\nWhat it solves\nA public repo cannot spend your money. Apps on EC2 receive short-lived credentials from the metadata service. Humans use IAM Identity Center or scoped keys on a laptop, not a key baked into the AMI. Incident response is disable first, then rotate dependents.\nReal-life example\nThe bank does not tape the vault combination to the street window. The warehouse badge is issued to the building — the role — not photocopied into a flyer, the repo. If a photocopy escapes, you change the combination that day, not next sprint.\nUses\nEvery cloud interview security question. Pair with .gitignore for .env, pre-commit secret scans, and a billing alarm. Mention that git rm is not enough; you disable the key and then clean history if you must.\nWatch out\ngit rm does not unsend history. A key in a gist, a CI log, or a Docker layer is still a leak. Rotating without disabling the old key leaves a window. Do not mint a new key and leave the old one active on the same user.",
      "code": "// use the instance / task role\n// if leaked: disable the access key the same day",
      "ask": "Most asked · Amazon · Google · Microsoft"
    }
  ]
};
