import fs from "fs";

function note(title, body) {
  return { title, body: body.trim() };
}

const aws = [
  note(
    "What AWS is",
    `The problem before
You buy racks, power, and a locked room. Capacity sits idle most of the year. Opening another city means another building project.

What this is
Amazon Web Services is a collection of on-demand infrastructure APIs. You rent compute, storage, databases, and networking instead of owning a data center, and you pay for consumed capacity. A Region is a geographic area. An Availability Zone is an isolated data-center campus inside that Region. IAM authorizes every API call.

What it solves
You open a toolbox in many cities without buying the building. You still design how services connect and fail over. The cloud is rented APIs, not a finished app.

Real-life example
A rented market in many cities: kitchens for compute, warehouses for storage, locked back rooms for networks. Mumbai is a Region. Two separate substations in that city are Availability Zones.

Uses
Every AWS interview opener. Sketch Region, AZ, and IAM before you name twenty services.

Watch out
Listing service names with no request path. Forgetting that you still own IAM, data, and failover.`
  ),
  note(
    "IAM first",
    `The problem before
A leaked key can do everything. Access keys sit in a file and never expire. You cannot say who may open which door.

What this is
IAM answers who may call which API on which resource. Users are long-lived human identities. Roles are assumed and issue temporary credentials. Policies are JSON with Effect, Action, Resource, and optional Condition. Prefer roles over static access keys. Least privilege grants only required actions on required resources. Require MFA for human sign-in.

What it solves
A leak has a smaller blast radius. Apps wear a day pass, not a photocopied house key. You revoke by changing a policy instead of hunting keys in git.

Real-life example
A building badge that lists which doors open. A visitor pass that expires today is safer to drop than an employee master key left in email.

Uses
Every AWS design. Interview opener after What is AWS. EC2, Lambda, and CI should assume roles.

Watch out
Action star and Resource star on a human. Committing access keys. Skipping MFA on console login.`
  ),
  note(
    "EC2",
    `The problem before
You buy a physical box and wait weeks. Or you SSH into one named pet forever and cannot replace it. Port 22 is open to the street.

What this is
Amazon EC2 provides virtual machines. You pick an AMI, instance type, volumes, and security groups. You patch the guest OS unless a higher service owns that layer. Billing continues while the instance runs. An Auto Scaling Group keeps a replaceable fleet from a launch template.

What it solves
You rent computers by the hour and treat them as cattle. Unhealthy boxes get replaced. Place app instances behind a load balancer in private subnets. Prefer Session Manager over inbound SSH.

Real-life example
A rented kitchen stall in a locked market hall. The stall recipe is the AMI. Three identical stalls beat one famous stove you cannot rebuild.

Uses
App servers, bastions, batch workers. Interviews: AMI, security group, ASG.

Watch out
Public SSH on port 22 to the world. Putting the only database on a single instance you dare not replace. Hand-editing a live box so the next scale-out boots the old template.`
  ),
  note(
    "S3",
    `The problem before
Disks fill up. A shared POSIX disk is hard to scale. One overwrite deletes the only copy. A public folder leaks because someone wanted the website to work.

What this is
Amazon S3 stores objects at keys inside buckets. It is highly durable object storage, not a Linux filesystem. Slash characters in keys are naming, not directories. Keep Block Public Access on unless the bucket must serve a public site. Versioning helps recover from overwrite or delete. Encryption at rest is a baseline. Lifecycle rules move objects to colder classes.

What it solves
Huge files and backups have a home. You GET and PUT over HTTP APIs. Durability is the almost-never-lose-the-bytes story, which is not the same as uptime this minute.

Real-life example
A coat-check: bag in, ticket out. The ticket is the key. There is no cd into a folder even if the ticket says 2026/cat.jpg. Desk, closet, warehouse are storage classes.

Uses
Photos, backups, static sites behind CloudFront, data lakes. Interviews: bucket, key, Block Public Access.

Watch out
Public buckets. Treating S3 like a database disk. Glacier for thumbnails the website needs on every page load.`
  ),
  note(
    "VPC",
    `The problem before
Everything sits on the public internet. The database has a public IP so you can connect from a cafe. App and data share one huge street.

What this is
A VPC is a customer-defined private network. You allocate a CIDR, then public and private subnets with route tables. An Internet Gateway gives bidirectional internet for public IPs. A NAT Gateway lets private instances start outbound only. Security groups are stateful firewalls on network cards. Apps and databases typically run in private subnets. The load balancer often sits in public subnets.

What it solves
Internal roads stay internal. The shop window can face the street. You control who talks to whom. Plan IP ranges so you can peer later.

Real-life example
A fenced campus: shop window on the street, safe in the back room. NAT is a one-way mail slot out. The bouncer on each door is a security group.

Uses
Every real workload. Interviews: public vs private, IGW vs NAT.

Watch out
One huge public subnet for app and database. A single NAT in one AZ. Custom NACLs that forget return ports before you master security groups.`
  ),
  note(
    "RDS and Aurora",
    `The problem before
You patch MySQL yourself, miss backups, and put the only copy in one AZ. You open a public database so you can connect from a cafe.

What this is
Amazon RDS is managed MySQL, PostgreSQL, and related engines. AWS helps with patching, automated backups, and optional Multi-AZ. Schema and indexes remain your job. Multi-AZ is high availability, not extra read capacity. Read replicas are async copies for reads. Aurora is AWS-built MySQL- and PostgreSQL-compatible with shared storage. Place databases in private subnets with no public IP.

What it solves
Failover and backups have a product, not a hope. You still choose size and schema. Reads can scale on replicas if you accept lag.

Real-life example
A rented garden plot: they water the soil, you choose the plants. Multi-AZ is an understudy waiting in the wings, not a second ticket window for reads. A replica is a photocopier a few seconds behind.

Uses
OLTP for web apps. Interviews: Multi-AZ vs replica, Aurora vs RDS.

Watch out
Publicly accessible RDS. Pointing the app at a classic Multi-AZ standby for reads. Migrating to Aurora to fix a missing index.`
  ),
  note(
    "Lambda",
    `The problem before
You keep a fleet of VMs running for a few requests an hour. Or you try a twenty-minute batch in a function. Fat packages make the first customer wait.

What this is
AWS Lambda runs code on events without a customer-managed fleet. You pay per request and duration, with a 15-minute maximum. Cold starts happen when a new environment is created. Give each function a least-privilege execution role. API Gateway is the usual HTTPS door. SQS and EventBridge often feed workers. Keep packages small. Use RDS Proxy when many invokes open database connections.

What it solves
Spiky APIs and glue jobs need no idle boxes. Small packages start faster. The proxy reuses hangers so the database is not buried in new connections.

Real-life example
A fridge light that turns on when the door opens. The first customer of the day may wait while the shop unlocks. A receptionist rings a specialist per visitor when API Gateway sits in front.

Uses
APIs, queues, EventBridge glue, cron-like rules. Interviews: timeout, cold start, IAM role.

Watch out
Work longer than 15 minutes. Long-lived keys in the zip. One new RDS connection per invoke. A 100 MB dependency suitcase.`
  ),
  note(
    "Load balancing and DNS",
    `The problem before
Users hit one VM by IP. That box dies and the shop is dark. Sticky sessions pin people to a sick waiter. You treat DNS as a path router.

What this is
An Application Load Balancer routes HTTP by path, host, TLS, and optional WAF. A Network Load Balancer forwards TCP, UDP, or TLS at high speed. Target groups and health checks pick who gets traffic. Prefer a shared cache or tokens over sticky sessions. Route 53 is authoritative DNS, not an HTTP proxy. Alias records can point at an ALB or CloudFront.

What it solves
Many boxes share one name. Unhealthy targets drop out. The phone book can fail over. Web apps usually want the concierge, not the freight tunnel.

Real-life example
A hotel concierge versus a freight tunnel. Route 53 is the phone book that can also forward if the first number does not answer. Sticky is always getting the same waiter because they remember your order in their head.

Uses
Web apps on ALB. High-performance TCP on NLB. Names and failover on Route 53. Interviews: ALB vs NLB, alias vs CNAME.

Watch out
NLB for path-based HTTP. CNAME on the zone apex. Sticky sessions plus an ASG replace. Health checks that query the database so a blink marks every app down.`
  ),
  note(
    "Observability",
    `The problem before
Checkout is slow and you have no request id. A leaked key leaves no story. Alarms paint pretty graphs that page nobody.

What this is
Amazon CloudWatch holds metrics, logs, alarms, and dashboards. AWS CloudTrail records who called which AWS API. X-Ray and OpenTelemetry draw traces. Correlate logs with request ids. Alarms should notify an on-call owner who can act. Restrict who can read the CloudTrail destination bucket.

What it solves
You can ask why, not only is it up. Forensics exist after a suspected breach. A line with a nurse attached is an alarm. A line with no nurse is decoration.

Real-life example
A hospital monitor for the app, CCTV for the control plane, and a subway map of one passenger for a trace. Protect the CCTV tape room.

Uses
Every production account. Interviews: CloudWatch vs CloudTrail. Latency hunts across Lambda and API Gateway.

Watch out
CloudTrail off to save money. DEBUG forever with no retention. Tracing every request at 100 percent. Fifty alarms to email that nobody reads.`
  ),
  note(
    "Pricing",
    `The problem before
The bill is a surprise. Idle EC2, unused NAT, and leftover load balancers sit there for months. Nobody owns a tag. NAT carries all S3 traffic.

What this is
On-demand charges for running capacity. Savings Plans and Reserved Instances discount a usage promise. Spot uses spare capacity and can be interrupted. Internet egress, cross-AZ traffic, and NAT data processing are common silent costs. Stop idle EC2, rightsize volumes, lifecycle S3, and tag so the bill has an owner.

What it solves
Architecture is a cost decision, not only a diagram. You can turn off empty rooms and stop renting unused front doors. Measure before you buy a yearly membership.

Real-life example
Turning off lights and not renting empty rooms. Receiving postcards is cheap; sending parcels abroad is not. Last-minute airline seats can bump you. A gym membership is cheaper only if you actually go.

Uses
Cost reviews. Interviews: egress, NAT, Spot vs on-demand, Savings Plans.

Watch out
NAT for all S3 traffic when a gateway endpoint would do. Spot for a single irreplaceable database. Buying a three-year size you will not use.`
  ),
  note(
    "Well-Architected Framework",
    `The problem before
You only talk cost, or only security. The design has no named risks. The interview becomes a service dump.

What this is
The AWS Well-Architected Framework reviews a workload across six pillars: operational excellence, security, reliability, performance efficiency, cost optimization, and sustainability. It is a structured review, not a certificate requirement. Identify one concrete risk per pillar and record leftover gaps.

What it solves
You present a design as a health checkup with named sections. Interviewers can follow you. Gaps stay honest. The same six-pillar outline is a sound way to talk through a sketch.

Real-life example
A shop inspection clipboard: kitchen habits, locks, spare generator, speed of service, waste, and lights left on. You do not need a framed certificate to use the clipboard.

Uses
Architecture interviews. Team reviews even without an official AWS review.

Watch out
Treating it as a badge hunt. Talking only cost. Listing pillars with no risk attached.`
  ),
  note(
    "Reference architecture",
    `The problem before
You draw random boxes. IAM is missing. Everything is one AZ. Keys sit in files. NAT lives in only one campus.

What this is
A standard web path reaches Route 53, then CloudFront, then an ALB in public subnets. Application tasks run in private Auto Scaling Groups or ECS services. RDS Multi-AZ and a cache occupy private data subnets. S3 stores objects. Every integration uses an IAM role rather than long-lived keys. State Multi-AZ placement, NAT or VPC endpoints, CloudWatch, and CloudTrail when you describe the design.

What it solves
You can sketch a campus map in two minutes. The layers stay in order: name, edge, door, kitchen, vault, coat-check. Security and failover have a spoken place.

Real-life example
Street sign, neighborhood brochure rack, front desk, kitchen in the back, register in the vault, coat-check for bags. Staff wear badges, not spare metal keys. Two substations, not one.

Uses
System design on AWS. Interview closer: draw the path, then name IAM and AZ.

Watch out
Boxes with no IAM or AZ story. Public RDS. NAT in only one AZ. latest image tags with no digest.`
  ),
];

const devops = [
  note(
    "DevOps idea",
    `The problem before
Builders throw a finished app over a wall and walk away. Release week is a surprise. Tools pile up with no shared owner. You list Jenkins and Kubernetes and stop.

What this is
DevOps is a way of working, not only a job title. The people who write the app and the people who run it share one loop: build, test, ship, watch production, and learn. Automation makes that loop fast and repeatable. Tools help, but a pile of YAML without shared ownership is not DevOps.

What it solves
You ship often without surprising users. Feedback is a loop, not a ceremony. Tell the story from commit to rollback, not only the tool names.

Real-life example
One kitchen, not a cook who plates and a waiter who never talks. The ticket goes cook, taste, serve, watch the table, change the recipe. A stack of recipe cards with nobody owning the floor is not a restaurant.

Uses
What is DevOps interviews. Opening any delivery story.

Watch out
Naming twenty tools with no loop. Claiming DevOps because you have a YAML file. Culture talk with zero automation, or robots with zero shared on-call.`
  ),
  note(
    "CI",
    `The problem before
People merge once a month. Tests run only on one laptop. Bugs show up at release week. A slow red job trains everyone to ignore the robot.

What this is
CI means Continuous Integration. People merge small changes often. A robot then lints, tests, builds, and scans every change. Feedback should arrive in minutes, not at release week. The same checks should work on your laptop and in the pipeline.

What it solves
Integration pain stays small. Fast, honest tests are the point. If CI is slow or flaky, people stop trusting it, so keep the job short and deterministic.

Real-life example
Airport security for every suitcase, not a search on launch day. Tasting the soup on two stoves if versions matter. A smoke alarm that beeps for toast soon has no believers.

Uses
Every pull request. Interviews: What is CI, required checks, flaky tests.

Watch out
Deploying when tests are red. Node latest in CI. Retrying a red test until green and calling that a fix.`
  ),
  note(
    "CD",
    `The problem before
Main is a junk drawer. You rebuild for prod and the bytes differ from staging. People say we do CD and mean two different things.

What this is
CD means the main branch stays releasable. Continuous Delivery means you could ship any green build. Continuous Deployment means every green main actually goes live. People mix the letters, so you should define them. Prod may still need an approval click. You promote the same artifact, not a fresh rebuild. Staging is the dress rehearsal.

What it solves
What you tested is what you ship. Config and secrets may change between rooms. The image digest should not. Delivery packs the suitcase. Deployment sends the taxi.

Real-life example
A boxed lunch with a fingerprint on the lid. You carry that same box from the rehearsal kitchen to the dining room. You do not recook between rooms and still call it the same meal.

Uses
Release interviews. Promotion vs rebuild. Delivery vs deployment.

Watch out
Tagging latest in staging and latest in prod. Rebuilding for prod because compile flags felt different. Saying CD without saying which meaning.`
  ),
  note(
    "Pipeline as code",
    `The problem before
The real jobs live only in a web UI. Nobody can grep history. A production check changes and the PR never saw it.

What this is
Pipeline as code means the CI/CD steps live in git next to the app. GitHub Actions, GitLab CI, and Jenkinsfile are common forms. You review pipeline changes like app changes. History tells you who changed a check. Keep the workflow file in the same pull request as the code it tests.

What it solves
The robot recipe is reviewable. Branches get the same checks. A click-only pipeline stops being a secret in someone's account.

Real-life example
The kitchen checklist hangs on the same clipboard as the dish, not in the manager's private notebook. When the checklist changes, the same review tastes both.

Uses
GitHub Actions workflows. Jenkinsfile. Any CI you want to audit.

Watch out
Editing production jobs only in a GUI. Pasting cloud keys into the YAML. A required check name that does not match the job name.`
  ),
  note(
    "IaC",
    `The problem before
Prod buckets appear from clicks. The next plan wants to destroy a surprise. Two people apply at once and the catalog lies.

What this is
IaC means Infrastructure as Code. You describe servers, networks, and buckets in files. A tool then makes the real cloud match those files. Terraform, Pulumi, CloudFormation, and Bicep are common. Always plan before you apply. State is the tool's notebook of real resource ids, so protect it.

What it solves
Environments become repeatable and reviewable. Click-ops drift is visible. The file is the wish. The tool compares wish versus world.

Real-life example
A city map you update in git, not chalk on a wall. Preview the haircut before the scissors. The catalog in the locked drawer is state. Do not leave it on a laptop desktop.

Uses
Cloud networks, buckets, databases. Interviews: plan vs apply, state, drift.

Watch out
Committing terraform.tfstate. Apply without reading a destroy line. Fixing prod in the console and never updating the files.`
  ),
  note(
    "Environments",
    `The problem before
Dev, staging, and prod are three different recipes. Prod is a unique snowflake. You rebuild because prod needs different compile flags.

What this is
Teams usually have dev, staging, and production. A build should walk those rooms in order. Use the same image digest in each room. Only config and secrets should change. A human approval can sit in front of prod. Promotion keeps it worked in staging honest.

What it solves
The dress rehearsal tested the same box you serve. You can still hide unfinished work with flags. You do not rewrite the script between rooms.

Real-life example
One boxed lunch carried through a practice kitchen, then the dining room. The sauce bottle on the table may differ. The box fingerprint must not.

Uses
Release flow. Interviews: promote the artifact, trunk-based plus flags.

Watch out
Long-lived prod branches. Building a new image for prod. Changing code between staging and prod and calling it the same release.`
  ),
  note(
    "Config & secrets",
    `The problem before
Passwords sit in git and in images. The pipeline uses a human's cloud keys. A leaked .env is still in history after you delete the line.

What this is
Config is non-secret settings like log level or feature names. Secrets are passwords, tokens, and keys. Config can live in env vars or a store. Secrets belong in a vault, not in git. Rotate secrets when they leak. Give the pipeline its own least-privilege identity.

What it solves
A leaked robot key should not be a master key. Config can be reviewed. Secrets can be rotated without rebaking the cake.

Real-life example
A labeled drawer for opening hours versus a safe with an auto-changing lock for the till code. The robot gets its own visitor badge, not your house key.

Uses
App env, CI OIDC roles, Parameter Store, Secrets Manager. Interviews: what never goes in git.

Watch out
Committing .env with real keys. Baking DB passwords into task YAML. Deleting a leaked line and skipping rotation.`
  ),
  note(
    "Observability",
    `The problem before
You only know is it up. Checkout is slow and each service has a private diary. Alerts page on CPU 81 percent. Unique user ids explode the metric cabinet.

What this is
Observability is how you understand a live system from what it emits. Logs are events. Metrics are numbers over time. Traces follow one request across services. Alerts should page on user pain, not every CPU blip. SLIs and SLOs beat noisy CPU rules. Put a request id on the whole story.

What it solves
You can ask why checkout is slow. One sticker ties the diary, the speedometer, and the GPS track. Quiet alerts that matter keep on-call sane.

Real-life example
A car dashboard plus a mechanic's trace, not only a check-engine light. A diary, a speedometer, and a GPS track of one trip. A filing cabinet that needs a new drawer per human explodes.

Uses
Production services. Interviews: three pillars, golden signals, SLI SLO SLA.

Watch out
print error with no request id. Metric labels like user_id. Paging on every warning. Three tools with three different ids.`
  ),
  note(
    "Reliability",
    `The problem before
Uptime is a hope. Nobody owns the incident. Restores are untested. Features ship while the error pocket is empty. Six people restart the same pod.

What this is
Reliability is keeping the promise users care about. SLOs name the target. Error budgets name the room to fail. Incidents need owners, comms, and a blameless write-up after. Runbooks tell on-call what to check. Chaos is optional. Restores you have actually practiced are not optional.

What it solves
Feature versus reliability becomes a number, not a shouting match. Mitigate first, root-cause later. A spare parachute you have opened is a plan.

Real-life example
Shop closed versus receipts vanished: RTO and RPO. Spare tires, photocopies, a second warehouse: HA, backup, DR. A fire drill, not arson, if you inject failure.

Uses
SRE interviews. On-call design. Disaster recovery talk.

Watch out
A green backup tick with never-restore. Paging for graph wrinkles. Postmortems with no tickets. Chaos in prod with no abort.`
  ),
  note(
    "Security (DevSecOps)",
    `The problem before
Security is a week at the end. npm audit is the only scan. Keys sit in commits. The cluster cannot tell who baked the image.

What this is
DevSecOps means security joins the same delivery loop. Scan dependencies, source, containers, and IaC on every change. Sign artifacts so the cluster knows who built them. Shift left means find issues earlier, not only in CI. You still need runtime defenses. Least privilege for humans and for robots. Rotate anything that leaked.

What it solves
Findings arrive while the change is still small. SAST, DAST, and SCA find different bugs. A metal detector at the door of git catches some keys. Runtime still needs a bouncer.

Real-life example
Wash hands during cooking, not only at dessert. Proofreading a recipe, tasting the soup, checking the spice brands. Signing the lunchbox so the dining room knows the kitchen.

Uses
PR scan jobs. Supply chain interviews. Secret scanning and rotation.

Watch out
A review the day before launch. Only SCA and calling the app secure. git rm a key without rotation. Signing nothing and hoping the cluster trusts latest.`
  ),
  note(
    "GitOps & platforms",
    `The problem before
Every team invents deploy. CI pushes into the cluster with a long-lived kubeconfig. Live kubectl edit is the source of truth. Drift is a rumor.

What this is
GitOps means git holds the desired state, and a controller in the cluster pulls it. Push deploy from CI is the older sibling: the pipeline talks to the cluster. Internal platforms give teams a paved road: starter repos, default CI, default logs. Teams should not each reinvent deploy.

What it solves
Drift is easier to see when git is the source of truth. The paved road is faster than twenty unique runbooks. Reviewers see YAML diffs like app diffs.

Real-life example
The floor plan hangs in the city archive. A clerk in the building pulls the latest plan, rather than a courier shoving furniture from a laptop. A paved road beats twenty dirt tracks to the same market.

Uses
Argo CD, Flux, internal developer platforms. Interviews: pull vs push deploy.

Watch out
kubectl edit prod as the process. A platform so rigid teams shadow-IT around it. GitOps with secrets committed in plain YAML.`
  ),
  note(
    "Interview habit",
    `The problem before
You recite twenty tools. There is no number. There is no rollback. Culture and YAML never meet in one story. You panic on trade-offs.

What this is
In a DevOps interview, tell one story end to end: commit, CI, artifact, deploy, verify, rollback. Add a number, such as two hours down to fifteen minutes. Mention one outage you would prevent next time. Culture plus automation in the same anecdote. Own one slice deeply. Stay calm about trade-offs.

What it solves
The interviewer can walk your factory. They hear a loop, not a brand list. A rollback sentence proves you thought past the happy path.

Real-life example
A new shift manager asks how lunch gets to the table. You walk ticket, taste, box fingerprint, dining room, smoke check, and the fire escape. You do not dump the catalog of oven brands.

Uses
Every DevOps interview closer. Same habit when you teach a teammate.

Watch out
Tool soup. No metric. No rollback. Pretending there is one correct pipeline for every shop.`
  ),
];

const machinelearning = [
  note(
    "What ML is",
    `The problem before
You type every rule by hand. The next case does not match your ifs. You call any if-statement machine learning. You expect a human brain in the laptop.

What this is
Machine learning means the computer finds a pattern from examples, then guesses for new examples. You show it a table of past cases. It is not a human brain and it does not understand like a person. The pattern lives in the model's numbers after training. Start with a simple model and an honest test set.

What it solves
New rows can get a guess without you writing a new rule for each one. You still choose the data and the question. Garbage data still makes a garbage model.

Real-life example
A shopkeeper who studies last month's bills, then guesses today's price band. The notebook of numbers is the model. A rule you wrote yourself, like if size over 50, is not training.

Uses
What is ML interviews. AI vs ML vs deep learning nested picture. First table projects.

Watch out
Calling a handwritten rule machine learning. A huge net on 40 rows. Skipping an honest test set.`
  ),
  note(
    "Data first",
    `The problem before
You pick a fancy model on day one. Empty cells, mixed units, and leaked columns hide in the sheet. The question is not named in plain words.

What this is
Rows are examples. Columns are features, the facts you know, plus usually one target, the answer you want to guess. Look at missing values, units, and weird rows before you fit. Print the table head. Name the question in plain words first. Most project time is cleaning, not picking a fancy model.

What it solves
You see typos before fit. If two columns leak the answer, you catch it before scores look amazing and real life fails.

Real-life example
A kitchen prep board before the oven. Taste the soup: head, missing, units. A spreadsheet of students with marks in the last column is a dataset.

Uses
Every ML project. Interviews: feature vs label, EDA before fit.

Watch out
Fitting before you look at a single row. Putting the label into X. Building a feature with tomorrow's answer in the margin.`
  ),
  note(
    "Train vs test",
    `The problem before
You fit on all rows, then quote a perfect score. You tune twenty settings on the sealed exam. Time data is shuffled so tomorrow leaks into yesterday.

What this is
Train means learn the pattern on some rows. Test means check on rows the model has not seen. If you test on train data, you cheat. A validation set is a practice test while you pick settings. The final test set stays sealed until the end. Shuffle is ok for many tables. Time data needs a time split.

What it solves
You get an honesty check that is cheaper than production. Mock tests versus the board exam. Three piles: train, valid, test.

Real-life example
Yesterday's crossword is not today's. Open the sealed envelope once, after you finished studying. Predicting tomorrow using a newspaper from next week is a random split on dated sales.

Uses
train_test_split, cross-validation, time series. Interviews: why split, leakage.

Watch out
Fitting on test. Tuning on test until it is no longer a test. Shuffle on dated rows.`
  ),
  note(
    "Supervised learning",
    `The problem before
You mix guessing a price with guessing a yes/no and pick the wrong metric. You call clustering classification. You never say whether rows had an answer key.

What this is
Supervised learning means each training row has a label. Regression predicts a number. Classification predicts a category or yes/no. You train with the answer key, then you guess without it. Most beginner projects are supervised. Say which job you need before you pick a model. Metrics differ for numbers versus classes.

What it solves
The model has a teacher. You can score guesses against y. You pick MAE for rupees and precision-recall for rare spam, not one blurry accuracy for both.

Real-life example
A teacher with an answer key versus sorting Lego by color with no key. Guessing a temperature versus guessing a weather word.

Uses
Prices, spam, pass/fail, most first projects. Interviews: regression vs classification.

Watch out
Accuracy on a price. Calling clustering classification. Using y as a feature.`
  ),
  note(
    "Unsupervised",
    `The problem before
You report accuracy with no y. You treat cluster ids as true labels. You pick k because a blog said 3.

What this is
Unsupervised means no label. You look for groups or structure, like clustering customers. You still have to interpret the groups. There is no accuracy against y, because there is no y. k-means is the first tool people name. Plots and stories check if groups make sense. Exploration is the point, not a magic truth.

What it solves
You can find picnic blankets in the data when nobody labeled the picnic. You still name what a group means in business words.

Real-life example
Placing k picnic blankets and pulling people to the nearest blanket. Sorting Lego by color with no answer sheet. The id 0 and 1 are group tags you still have to explain.

Uses
Customer segments, compression plots, EDA. Interviews: k-means, no accuracy.

Watch out
Treating cluster ids as ground truth. Skipping scale before k-means. Claiming a correct k from math alone.`
  ),
  note(
    "Overfitting",
    `The problem before
Train accuracy is 99 percent and you celebrate. Test is 55 percent. A tree with no depth cap memorized every weird house.

What this is
Overfitting is great on train and weak on new data. The model memorized noise, like one weird house, as if it were a rule. A simpler model, more data, or regularization can help. Always compare train score and test score. A big gap is the first clue.

What it solves
You catch a student who only memorized the answer key. You can back off depth, add data, or add a speed limit on weights.

Real-life example
A student who memorizes the answer key word for word fails a reworded question. A spaghetti noodle tracing every dot on the scatter.

Uses
Every model review. Interviews: train vs test gap, regularization.

Watch out
Celebrating train score alone. max_depth none on a small table. Boosting until train is perfect with no validation.`
  ),
  note(
    "Underfitting",
    `The problem before
Train and test are both weak. You add dropout and other brakes. You hunt twenty tricks before you check whether the shape can even learn.

What this is
Underfitting is weak on train and weak on test. The model cannot even learn the training pattern. Try a more flexible model or better features. A straight line through a rainbow curve is honest but the wrong shape. Low train score is the first clue.

What it solves
You stop blaming the test set when the model never learned the homework. You try a richer model or better ingredients before a forest of regularizers.

Real-life example
A stiff ruler laid on a rainbow. Honest, and still the wrong kitchen tool. A student who cannot do the practice problems will not magically pass the board exam.

Uses
First diagnosis when both scores are low. Interviews: overfit vs underfit.

Watch out
Adding regularizers when the model is already too weak. Switching libraries before you check train score. Twenty tricks before a better feature.`
  ),
  note(
    "Metrics",
    `The problem before
You quote accuracy on fraud. Always not-spam looks great. You pick RMSE for a yes/no. You hunt models before you name which miss hurts.

What this is
Regression uses MAE and RMSE, errors in the same units as the number. Classification uses accuracy, precision, recall, and F1. Accuracy lies when 99 percent of emails are not spam. A dummy that always says not-spam looks great. Name which error hurts more in the business. Draw a confusion matrix. Pick the metric before you hunt for models.

What it solves
Rupees get rupee errors. Rare yes rows get precision and recall. The 2-by-2 scoreboard shows false alarms and misses. A baseline keeps you honest.

Real-life example
Airport security: flagged bags that had a problem versus real problem bags that you found. Always saying no tornado in a quiet town looks accurate and is useless. 1 km late versus 100 km late if you square the miss.

Uses
Every supervised project. Interviews: precision vs recall, confusion matrix, baseline.

Watch out
Only accuracy on imbalanced classes. Mixing FP and FN in the story. Quoting F1 without saying which class.`
  ),
  note(
    "Features",
    `The problem before
Income in rupees shouts down age. You scale on train plus test. The target hides inside a feature. There is no written recipe.

What this is
A feature is one input the model can use. You can also build features, like price per room. Scaling to similar ranges helps many models. Do not leak the target into a feature. Fit scalers on train only, then transform test. Trees often do not need scaling. Distance models do. Write the recipe down.

What it solves
The cook gets chopped ingredients, not a whole pumpkin and a grain of salt on the same scale. New rows follow the same recipe. Leaks get dropped before the exam.

Real-life example
Height in km and weight in grams: one number shouts. Chopping vegetables so the cook can cook. Seeing the exam answer printed in the margin of the question is leakage.

Uses
Feature engineering, StandardScaler, one-hot. Interviews: scale on train only, leakage.

Watch out
Fitting the scaler on all rows. Encoding the label into X. Dropping real rare events like fraud because they look extreme.`
  ),
  note(
    "scikit-learn flow",
    `The problem before
You jump to a huge neural net for a 200-row spreadsheet. You scale the whole dataset, then split. You call score only on the rows you just fit.

What this is
scikit-learn is the main Python library for classic table ML. The verbs are fit, predict, and score. Split first. Then fit on train. Then predict on test. A Pipeline chains scale then model so test does not leak. Start here before deep learning. Import names are long; that is normal.

What it solves
One object remembers the factory belt: wash, then bake, in that order every time. You get split, models, metrics, and pipelines in one toolbox.

Real-life example
Study, then exam, then a red pen: fit, predict, score. A well-labeled toolbox for table data. A factory belt that will not wash the sealed exam into the training water.

Uses
First ML in Python. Interviews: Pipeline, fit predict score.

Watch out
fit on test. Scaling by hand on all rows, then only piping the model. A giant net when sklearn is the right first toolbox.`
  ),
  note(
    "Bias-variance",
    `The problem before
You say bias when you mean a prejudiced dataset. You only know overfit as a word. You cannot name the stiff ruler versus the wiggly noodle.

What this is
High bias means too simple, missing the real pattern. High variance means too wiggly, jumping when the training set changes. You want a sweet spot on unseen data. Regularization and more data can help variance. A richer model can help bias. Name the trade-off in interviews.

What it solves
You diagnose underfit as high bias and overfit as high variance. You pick a calmer model or a richer one on purpose, not by superstition.

Real-life example
A stiff ruler versus a spaghetti noodle tracing every dot. Turning all volume knobs down a bit (L2) versus clicking some off (L1). Oven temperature is a hyperparameter you choose; the batter does not.

Uses
Model complexity talks. Regularization interviews. Choosing tree depth.

Watch out
Using bias here to mean unfair data. Alpha so huge every weight is nearly zero. A richer model before you have any signal in the features.`
  ),
  note(
    "Ethics",
    `The problem before
A score looks fair because it is a number. You tell a manager the model proves X causes Y. You never ask who can be harmed. Live data shifts and nobody watches.

What this is
Models copy bias in the data. Ask who can be harmed. A score is not fair just because it is a number. Correlation is not causation. Do not claim a model causes an outcome unless the study was built for that. Watch live scores because the world changes. Say what you would not claim.

What it solves
You stay humble in business claims. Ice cream and drowning both rise in summer. Two clocks that both say 3 do not cause the hour.

Real-life example
A hiring score that copies last decade's bias in the training file. A shop that ranks loans without asking who is shut out. Rechecking the blackboard when the neighborhood changes.

Uses
Every deployed model. Interviews: correlation vs causation, monitoring.

Watch out
Shipping a score as fairness. Causal claims from a correlational fit. Never watching production after day one.`
  ),
];

const kubernetes = [
  note(
    "What k8s is",
    `The problem before
One Docker host is a lunchbox. Many machines and many services need placement, restarts, and names. You SSH around and docker run, then wonder why nothing replaces a dead box.

What this is
Kubernetes is an orchestrator: it places containers on machines, restarts them, scales copies, and gives them stable names on a network. You write the desired picture in YAML. Controllers keep reality matching that picture. One Docker host is a lunchbox. Kubernetes is many rooms across many floors.

What it solves
You describe copies, not pets. If a room dies, a controller opens another. Compose stays a laptop seating chart. The city transit is the cluster.

Real-life example
A hotel chain with a front desk that keeps three identical kitchens open. You hang a floor plan. Clerks match the building to the plan. You do not babysit each stove by SSH.

Uses
What is Kubernetes interviews. Multi-node production containers. EKS, GKE, AKS as managed planes.

Watch out
Creating raw Pods by hand. Reciting kubectl flags with no desired-state story. Copying Compose into production SSH and calling it orchestration.`
  ),
  note(
    "Cluster pieces",
    `The problem before
You talk to Docker on a random VM. etcd is a mystery. Managed Kubernetes still feels like you run the airport tower by hand.

What this is
A cluster has a control plane and worker nodes. The control plane is the API server, etcd memory, scheduler, and controllers. Workers run kubelet, a container runtime, and your pods. You talk to the API, not to Docker on a random VM. Managed Kubernetes such as EKS, GKE, or AKS often runs the control plane for you.

What it solves
YAML goes to the front desk. The scheduler assigns rooms. Controllers match reality to the picture. If the memory dies, the cluster forgets its picture.

Real-life example
Airport tower plus gates. The front desk is the API server. The memory book is etcd. Each floor has a staff member with hands (kubelet) and a kitchen runtime. AWS may run the tower; you still fly the planes.

Uses
Cluster architecture interviews. Choosing managed vs self-hosted control plane.

Watch out
SSHing to a node to docker run against the plane. Forgetting etcd backup. Treating managed as no ops: you still own nodes, add-ons, and YAML.`
  ),
  note(
    "Pod",
    `The problem before
You think you run a raw container in Kubernetes. You treat a pod IP as a phone number that lasts. Two containers that must share a network sit in two pods.

What this is
A pod is the smallest deployable unit: one or more containers sharing a network and volumes. They share localhost. The pod gets an IP. When the pod dies, that IP is gone. Usually one main app container lives in the room. You almost never run a raw container in Kubernetes. You run a pod.

What it solves
Sidecars can share the room's network and disk. The Deployment hires rooms so you do not pin IPs. Localhost inside the pod is that room, not the node.

Real-life example
A hotel room: one or two people, one doorbell, one bathroom. If the room is vacated, the room number is reused elsewhere. You book rooms, not a mattress in the hallway.

Uses
Every workload. Interviews: pod vs container vs node. Sidecar pattern.

Watch out
Hard-coding pod IPs. Two replicas in one pod thinking that is HA. Putting a database on a naked Pod with no volume and no controller.`
  ),
  note(
    "Workload APIs",
    `The problem before
You babysit each room. Everything is a Deployment, including a disk that needs a stable name. A one-shot report runs forever as a web service.

What this is
Workload APIs create pods for you so you do not babysit each room. A Deployment keeps stateless copies and owns ReplicaSets. A StatefulSet gives stable names and storage. A DaemonSet runs one pod per node. A Job runs until finished. A CronJob starts Jobs on a schedule. Pick the API that matches the job, not always Deployment.

What it solves
Stateless web copies roll forward. Sticky identity and disks have a home. Per-node agents land on every floor. Batch work can finish and leave.

Real-life example
Hiring three identical cashiers (Deployment). A named locker per guest that must stay guest-7 (StatefulSet). A fire warden on every floor (DaemonSet). A one-time inventory count (Job). Inventory every night at 2 (CronJob).

Uses
Apps, datastores, node agents, batch. Interviews: Deployment vs StatefulSet vs Job.

Watch out
Deployment for a database that needs stable identity. A Job with no backoff limit that retries poison forever. DaemonSet for a web API.`
  ),
  note(
    "Service",
    `The problem before
Clients dial a pod IP. The pod dies and the number is gone. You publish every backend on a NodePort to the world. HTTP paths have no front door.

What this is
A Service is a stable virtual IP plus DNS to pods selected by labels. ClusterIP is inside the cluster. NodePort is a doorbell on each node. LoadBalancer asks the cloud for a public number. Ingress or Gateway routes HTTP by host and path. The Service is reception. The Deployment hires rooms.

What it solves
Pods can come and go. Neighbors call api:80 and reach whoever is healthy. The browser path is DNS, load balancer, Ingress, Service, endpoints, pod.

Real-life example
Reception has one phone number. Cashiers change shifts. ClusterIP is an internal extension. NodePort is a doorbell on every building entrance. Ingress is the concierge who hears /api versus /app.

Uses
Every in-cluster caller. North-south HTTP. Interviews: Service types, Ingress vs Service.

Watch out
Mismatch labels so reception rings an empty desk. NodePort for every database. Treating Route 53 or a Service as path routing without Ingress.`
  ),
  note(
    "Labels & selectors",
    `The problem before
You wire traffic to pod names. Names change on every replace. A typo in the selector sends customers to nobody. Two apps share the same app label.

What this is
Labels are key/value tags on objects. Selectors find pods with those tags. Services and Deployments wire up through labels, not through pod names. Names of pods change. Labels are the name tags on shift. Mismatch the selector and traffic goes nowhere.

What it solves
Shift changes keep the same name tags. Reception and hiring use the same tags. You can add extra labels for canaries without renaming the world.

Real-life example
Name tags on waiters: app=api, tier=front. Reception looks for those tags, not for waiter-7h2k. If the tag says cafe and the waiters say kitchen, the dining room starves.

Uses
Service selector, Deployment matchLabels, debugging empty endpoints.

Watch out
Selector that matches the wrong pods. Changing labels on a live Service without matching the template. Using the generated pod name as if it were stable.`
  ),
  note(
    "Config & secrets",
    `The problem before
Passwords sit in the image and in ConfigMaps. You change an env var and wonder why pods still have the old value. You think a Secret is encrypted because it is base64.

What this is
A ConfigMap holds non-secret settings. A Secret holds sensitive data. Default Secrets are base64, not encryption. Mount as environment variables or files. Changing env often needs a new pod. Do not put passwords in ConfigMaps. Do not put them in the image either.

What it solves
Config can be reviewed in git. Secrets can be mounted without rebaking. A new room picks up new env. Rotation is a new value plus a rollout, not a new cake recipe.

Real-life example
A labeled drawer for opening hours versus a safe for the till code. Base64 is a photocopy in another alphabet, not a lock. Printing the till code on the recipe card is baking a secret into the image.

Uses
App config, TLS material, DB passwords via a vault or Secret. Interviews: ConfigMap vs Secret, base64.

Watch out
Passwords in ConfigMaps. Believing base64 is encryption. Editing a live Secret and expecting running processes to notice without a new pod.`
  ),
  note(
    "Probes",
    `The problem before
The balancer sends users to a wedged process. Or a liveness check hits the database and a blink restarts every cashier. Slow boots get killed before they open.

What this is
Probes are health questions. Liveness: am I wedged? Restart if yes. Readiness: may I take customers? Stop traffic if no. Startup: give a slow boot time before liveness starts. Wrong probes cause restart storms.

What it solves
Sick rooms leave the floor. Slow rooms get a grace period. Traffic waits until the waiter is ready. Cheap checks keep a DB blink from firing the staff.

Real-life example
A temperature check at the door, not a full surgery. Firing cashiers when the register blinks is a liveness probe that queried the database. The bouncer only lets healthy waiters onto the floor.

Uses
Every Deployment. Interviews: liveness vs readiness vs startup.

Watch out
Liveness that hits the database. No readiness so half-booted pods take traffic. Probes so strict they restart healthy apps.`
  ),
  note(
    "Resources",
    `The problem before
Pods have no requests. The scheduler packs by hope. HPA lies. A memory hog is OOMKilled and you only see exit 137. You mix m and Mi without knowing the units.

What this is
requests are the reservation the scheduler uses to pick a node. limits are the cgroup cap. Set both. CPU over limit is throttle. Memory over limit is OOMKill, often exit 137. 100 millicores is one tenth of a CPU. Mi means mebibytes. A missing request makes HPA and packing lie.

What it solves
The receptionist can assign a room that actually fits. Neighbors are less likely to starve. You can explain 137 as memory, not a mystery crash.

Real-life example
Booking a table for four (request) versus a hard cap on how many plates you may hold (limit). CPU over the cap is a slow kitchen. Memory over the cap is the table collapsing. Pending often means no floor has room.

Uses
Every pod spec. HPA. Debugging Pending and OOM. Interviews: request vs limit.

Watch out
No requests. Memory limit too small. Adding replicas when every node is full. Treating millicores as milliseconds.`
  ),
  note(
    "kubectl",
    `The problem before
You guess. You skip describe. You kubectl exec and apt-get a fix that the next pod will not have. You dump get all and call that an explanation.

What this is
kubectl talks to the API. get is the roster. describe is the first debug tool: events live there. logs is stdout. exec is a visitor. apply makes reality match a file. rollout watches a Deployment change. Learn describe before you guess.

What it solves
Events tell you ImagePullBackOff, FailedScheduling, OOMKilled. Logs are the waiter notebook. A visitor can peek without replacing the cook. apply is the flight plan, not a one-off poke.

Real-life example
The roster, the incident notebook at the desk, the shout from the kitchen, a visitor pass, hanging a new floor plan, watching the shift change. Describe before you rearrange furniture.

Uses
Day-to-day ops. Interviews: first commands when a pod is crash looping.

Watch out
Production config via exec. Skipping events. Reciting a kubectl dump in an interview. apply from a laptop that is not git.`
  ),
  note(
    "YAML apply",
    `The problem before
kubectl edit prod is the process. Someone typed replicas 10 and left. Git does not match the cluster. The next apply fights the click.

What this is
kubectl apply -f is declarative: the file is the flight plan. GitOps with Argo or Flux applies the same idea from git. Do not make kubectl edit prod your process. Live edits drift from the paper. The cluster will not remember why someone typed replicas 10.

What it solves
Desired state lives in a file you can review. Controllers chase that picture. Drift becomes a diff, not a rumor. The same idea as IaC, for cluster objects.

Real-life example
A paper seating chart versus rearranging chairs by hand each night. Git is the archive copy. A clerk pulling the chart beats a courier shoving tables from a laptop.

Uses
Deployments, Services, GitOps. Interviews: declarative vs imperative, apply vs edit.

Watch out
Live edit as the source of truth. apply a file that is not what git says. Secrets in plain YAML on a public repo.`
  ),
  note(
    "Interview habit",
    `The problem before
You recite a kubectl dump. Pod, Deployment, and Service blur. You never walk a browser to a pod. There is no war story.

What this is
In an interview, nail Pod versus Deployment versus Service first. Then explain probes, rolling updates, and how a browser reaches a pod: DNS, load balancer, Ingress, Service, endpoints. Add one war story such as ImagePullBackOff, Pending, OOM 137, or liveness hitting the database. Talk copies and desired state.

What it solves
The interviewer hears a city map, not a flag list. One outage sentence proves you have operated, not only memorized kinds.

Real-life example
A new shift manager. You walk rooms, hiring, reception, health questions, and the street door. You tell the night the database probe fired every cashier. You do not read the entire command manual aloud.

Uses
Every Kubernetes interview closer. Same story when you teach a teammate.

Watch out
Only listing objects. Forgetting who creates pods. Skipping the HTTP path from browser to container.`
  ),
];

const jobs = [
  {
    path: "c:/Users/Nitin kumar/OneDrive/Desktop/PrepPlace/data/aws.js",
    notes: aws,
    quoted: false,
  },
  {
    path: "c:/Users/Nitin kumar/OneDrive/Desktop/PrepPlace/data/devops.js",
    notes: devops,
    quoted: false,
  },
  {
    path: "c:/Users/Nitin kumar/OneDrive/Desktop/PrepPlace/data/machinelearning.js",
    notes: machinelearning,
    quoted: false,
  },
  {
    path: "c:/Users/Nitin kumar/OneDrive/Desktop/PrepPlace/data/kubernetes.js",
    notes: kubernetes,
    quoted: true,
  },
];

const headings = [
  "The problem before",
  "What this is",
  "What it solves",
  "Real-life example",
  "Uses",
  "Watch out",
];

for (const job of jobs) {
  for (const n of job.notes) {
    for (const h of headings) {
      if (!n.body.includes(h)) {
        throw new Error(`${job.path} ${n.title} missing ${h}`);
      }
    }
    const lines = n.body.split("\n");
    for (const h of headings) {
      const idx = lines.indexOf(h);
      if (idx === -1) throw new Error(`${n.title}: heading not own line: ${h}`);
    }
  }
}

function render(notes, quoted) {
  if (quoted) {
    return notes
      .map(
        (n) =>
          `    {\n      "title": ${JSON.stringify(n.title)},\n      "body": ${JSON.stringify(n.body)}\n    }`
      )
      .join(",\n");
  }
  return notes
    .map(
      (n) =>
        `    { title: ${JSON.stringify(n.title)}, body: ${JSON.stringify(n.body)} }`
    )
    .join(",\n");
}

for (const job of jobs) {
  let src = fs.readFileSync(job.path, "utf8");
  const re = job.quoted
    ? /"notes": \[[\s\S]*?\n  \],\n  "questions":/
    : /notes: \[[\s\S]*?\n  \],\n  questions:/;
  if (!re.test(src)) throw new Error("no notes match: " + job.path);
  const replacement = job.quoted
    ? `"notes": [\n${render(job.notes, true)}\n  ],\n  "questions":`
    : `notes: [\n${render(job.notes, false)}\n  ],\n  questions:`;
  src = src.replace(re, replacement);
  fs.writeFileSync(job.path, src);
  console.log("patched", job.path, job.notes.length, "notes");
}
