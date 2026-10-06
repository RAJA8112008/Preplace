"use strict";

const fs = require("fs");
const path = require("path");

const _counts = [];
const story = (a) => {
  const keys = ["problem", "what", "solves", "example", "uses", "watch"];
  for (const k of keys) {
    const text = String(a[k] ?? "");
    const n = text.trim().split(/\s+/).filter(Boolean).length;
    _counts.push(n);
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
    title: "The problem before CI/CD",
    body: story({
      problem:
        "Ada merged on Friday. Tests ran only on her laptop. Bob copied files to the server with FTP. Monday morning checkout was 500 and nobody knew which zip was live. Staging had tasted a different folder. The factory had no weigh station and no stamped lid, only a shared drive of mystery archives and a Slack thread asking who last touched prod.",
      what:
        "CI is a robot weigh station that tests every change in Git. CD is delivery, meaning main stays releasable, or deployment, meaning the taxi actually leaves. The recipe is a pipeline file in Git such as .github/workflows/ci.yml. The artifact is the stamped box tagged with the git sha. Deploy promotes that digest to a room — you never bake a new cake in the parking lot.",
      solves:
        "A red test stops the merge before the truck leaves the yard. Production runs the same artifact staging already tasted, so those bytes are what you ship. Rollback is last week's stamped box, not a Slack ping asking Ada whether she still has the zip. The lid names the git sha so the factory can put that box back on the shelf.",
      example:
        "A factory: every batch is weighed at the station (CI). Only a stamped box goes on the truck (CD). You do not bake a new cake in the parking lot and call it the same batch. The recipe on the wall is the pipeline file in Git. The stamp on the lid is the git sha, and three rooms can carry that one box without a second bake.",
      uses:
        "Every team with GitHub Actions, GitLab CI, CircleCI, or Jenkins. Node, Python, Go, Docker, and Terraform all use the same loop: recipe in Git, weigh the batch, stamp the box, promote the digest. Interviews at Amazon, Google, and Microsoft start here before Kubernetes. Campus labs and startups both need this factory picture on day one of shipping.",
      watch:
        "A green deploy with no tests is CD without CI — a truck with no weigh station. A test that only runs on one laptop is not CI. Rebuilding for production so the flags match is a second bake in the parking lot. Secrets pasted into the YAML are recipe cards with the cupboard key printed on them. latest as the only tag means you cannot find last week's box."
    })
  },
  {
    title: "CI then CD",
    body: story({
      problem:
        "People said we have CI/CD and meant a button that copies files after lunch. Or they rebuilt for production at four o'clock and staging had tested a different cake that morning. Nobody could say whether CD meant the suitcase was packed or the taxi had already left. The factory used one poster for three different jobs and the interview whiteboard froze on the first follow-up.",
      what:
        "CI is Continuous Integration: merge often, and a robot lints, tests, and builds every change from a pipeline file in Git. Continuous Delivery means main is always releasable — the stamped box sits by the dock. Continuous Deployment means every green main actually goes live — the taxi leaves without a human wave. The artifact is that box tagged with the git sha. Deploy is promotion of the digest, not a second bake.",
      solves:
        "You can name which meaning you use when someone says we do CD. Approvals can still sit in front of production while you keep Delivery. The suitcase, which is the artifact, does not get repacked between staging and prod. Interviewers hear a weigh-then-ship story instead of a logo list, and they let you draw the rooms next.",
      example:
        "Delivery packs the suitcase and leaves it by the factory door with the sha on the tag. Deployment sends the taxi with that same bag, not a new bag stuffed in the parking lot. CI is the weigh station that refused a wet batch before anyone packed. Three words, one box, one lid — that is the whole poster.",
      uses:
        "This is the interview first question on GitHub Actions, GitLab CI, and Jenkins loops. Then draw: push, test, image, staging, optional approve, prod, same sha. Amazon, Google, and Microsoft all want delivery versus deployment named out loud. Campus labs use the same picture before anyone opens Kubernetes. Keep the suitcase packed before you talk about the taxi.",
      watch:
        "Saying we do CD without saying delivery versus deployment. A weekly FTP copy is not continuous anything. A deploy job that rebuilds the image is a second bake pretending to be promotion. If you cannot point at the pipeline file in Git and the sha on the lid, you are still waving a poster, not giving a factory tour."
    })
  },
  {
    title: "Pipeline as code",
    body: story({
      problem:
        "The build lived in Jenkins clicks on a box under someone's desk. When the owner left, nobody knew why the job skipped tests on main. A new hire could not grep the recipe because it was not in Git. Friday's hotfix ran an old click-path that still copied files with FTP. The factory recipe lived in the chef's head, and the weigh station vanished with the chef.",
      what:
        "The recipe is a pipeline file in Git: .github/workflows/ci.yml, .gitlab-ci.yml, or a Jenkinsfile next to the app. A pull request can change the recipe with the code, so the weigh station and the truck schedule are reviewed like any other file. CI is the jobs that test and stamp. CD is the later jobs that promote that stamped box. The artifact and the deploy steps are lines in the same recipe, not tribal clicks.",
      solves:
        "Git history shows who removed the scan and when. Branches get the same checks as main because they share the file. You can grep secrets mistakes and required job names. A new hire reads the wall instead of booking a meeting with a missing chef. Rollback of the recipe is a revert, the same as rollback of the app.",
      example:
        "The kitchen recipe is taped next to the food, not locked in the chef's head. If someone scratches out the weigh step, the tape on the wall still shows the old card in Git. A guest chef from another shift follows the same card and stamps the same lid. The truck does not leave on a whispered change that never hit the wall.",
      uses:
        "GitHub Actions, GitLab CI, CircleCI, and Jenkins all want the recipe in the repo. Terraform and Docker builds belong in the same file family so the factory is one tour. Interviews ask where the pipeline lives before they ask for a Kubernetes diagram. Campus labs start with ci.yml on day one of the Git module.",
      watch:
        "Secrets pasted into the YAML are the cupboard key printed on the recipe card. A click-only pipeline you cannot grep is the chef's head again. A workflow file outside .github/workflows/ is a recipe taped in the parking lot — GitHub never sees it. Do not fork a private Jenkins job that only one laptop can run and call it pipeline as code."
    })
  },
  {
    title: "Same artifact, three rooms",
    body: story({
      problem:
        "Staging used image latest at ten in the morning. Production built again at four and pulled a new library. It worked in staging was a lie because the bytes had changed. Rollback meant hunting Slack for whoever still had the zip. The factory painted a new box in the parking lot and stuck the old sticker on it, then blamed the shop for a cake nobody had tasted.",
      what:
        "Build once in CI. Tag the artifact with the git sha or the image digest. Promote that same stamped box: dev, then staging, then production. Only environment variables and secrets change between rooms. CD is that promotion, not a second docker build on the prod job. The pipeline file in Git should pass the sha through every deploy step so the lid never gets a fresh stamp in the yard.",
      solves:
        "What you tested is what you ship, byte for byte. Rollback is the previous sha on the shelf, not a prayer and a laptop bake. Staging's green smoke is about the same lid production will carry. Interviewers hear promote, not rebuild, and they stop asking whether latest is a version. The factory can name the batch when checkout goes 500 at midnight.",
      example:
        "One stamped box. The shop, the warehouse, and the truck all carry box abc123 — not a new box painted with the same sticker. If the warehouse liked the taste, the truck does not bake a cousin cake at the loading dock. The lid is the git sha. Three rooms, one weigh, one stamp, one story you can tell with a marker.",
      uses:
        "Docker images, jars, and static zips all follow this rule. GitHub Packages, ECR, and S3 are just shelves for the stamped box. Vercel still builds from a commit sha even when you never see a registry. Amazon and Uber interviews ask this as why not latest, then wait for promote the digest.",
      watch:
        "latest in production is a sticker that moves while you sleep. Rebuilding for prod because the flags are different is a second bake. A deploy job that runs docker build again has already broken the three-room rule. If the pipeline cannot print the sha it shipped, you do not have an artifact, you have a hope and a parking-lot oven."
    })
  }
];

const examples = [
  {
    title: "CI on every pull request",
    lang: "txt",
    desc: story({
      problem:
        "A pull request looked fine on Ada's laptop. Merge broke main because tests never ran on the combined code. Bob's branch had passed last week against an older main, and the two cakes collided in the oven. Nobody had a weigh station on the door of the merge. Monday's checkout was red and the factory blamed the last person who clicked Merge.",
      what:
        "A workflow file under .github/workflows is the recipe in Git. on: pull_request starts the robot weigh station. The job checks out that sha, runs npm ci from the lockfile, then npm test. That is CI: every change is weighed before it joins the official batch. CD comes later, when a stamped box is promoted. The pipeline file and the app move in the same pull request.",
      solves:
        "Red checks block the merge if you turn on required status checks, so a wet batch never reaches the truck. Reviewers read the badge instead of hoping Ada's laptop still matches. Main stays a releasable line of stamped lids. The factory grades the combined dough, not two separate bowls that never met.",
      example:
        "A teacher grades the homework before it goes in the official notebook. You do not stamp the chapter as library stock because it looked neat on the kitchen table. The robot opens the same notebook the class will use. If the weigh station says no, the chapter stays in the draft pile and the truck does not leave.",
      uses:
        "Every Node, Python, or Go repo on GitHub. GitLab merge requests use the same idea with .gitlab-ci.yml. Interviews at Amazon and Microsoft ask what runs on a PR before they ask about Kubernetes. Campus labs start here: put ci.yml in Git and watch the badge on the pull request. The weigh station belongs on the merge door.",
      watch:
        "This file must sit in .github/workflows/ or GitHub never sees the recipe. A workflow that only lints is a weigh station that never uses the scale. Skipping required checks to unblock is opening the dock with no stamp. Do not run only Ada's laptop tests and call the badge CI."
    }),
    code: `# .github/workflows/ci.yml
name: ci
on:
  pull_request:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: npm
      - run: npm ci
      - run: npm test`
  },
  {
    title: "npm ci, not npm install",
    lang: "txt",
    desc: story({
      problem:
        "CI passed last week. A floating range pulled a new package overnight and tests died. Nobody changed app code, only the shelf behind the factory. Two laptops had two different trees because npm install rewrote the lock. The weigh station was honest and still weighed a different bag than Ada's kitchen. Monday's badge flipped red and the team hunted a ghost in their own files.",
      what:
        "npm ci installs exactly the lockfile, then deletes node_modules first so the tree is a clean stamp. npm install may rewrite the lock and pick whatever is on the shelf. In CI the recipe in Git should call npm ci so the robot weighs the same bag the commit named. The artifact you bake later sits on that frozen tree. CD still promotes the image, not a lottery of packages.",
      solves:
        "Laptop and robot get the same tree, so a red test is about your code, not a surprise library. Repeatable CI is the weigh station using the same shopping list every shift. You can replay last week's batch by checking out the sha and running ci again. The factory stops calling works on my machine a strategy.",
      example:
        "A shopping list with versions versus buy some milk, whatever is on the shelf. The factory clerk ticks the list, not the sale bin. If the list says milk 1.2.3, the robot does not grab 1.3.0 because it was at the front. The stamped box is built from that exact cart, not from a wander through the aisle.",
      uses:
        "CI for every Node app on GitHub Actions or GitLab. Keep package-lock.json in Git next to the pipeline file so the recipe and the list travel together. Yarn and pnpm have the same idea with their own freeze files. Interviews ask why ci not install, then wait for the lockfile sentence.",
      watch:
        "gitignore the lockfile and CI is a lottery each morning. Running npm install on the runner rewrites the list and ships a cousin cake. A lock committed on Windows and rewritten on the runner is still a second bake. Pin the package manager version if the factory has two clerks who spell the list differently."
    }),
    code: `# CI
npm ci
npm test

# laptop first time
npm install
# then commit package-lock.json`
  },
  {
    title: "Build a Docker image in CI",
    lang: "txt",
    desc: story({
      problem:
        "Production was built by hand on a laptop. The Dockerfile on Git was older than the running box. Nobody could name the commit inside the live container. Rollback meant asking Ada if her Docker Desktop still had last week's image. The factory baked in a parking lot and slapped a handwritten sticker on the lid while the wall recipe gathered dust.",
      what:
        "CI checks out the sha from Git, runs docker build, tags the image as app colon that sha, and pushes the registry. That image is the artifact — the stamped box. The pipeline file in Git is the recipe for the bake. CD later pulls that same tag into staging and production. You do not bake again on the prod job. The lid is the git sha, not latest.",
      solves:
        "The image id is the commit, so staging and production can pull the same tag. Rollback is the previous sha on the shelf. It worked in staging talks about those bytes. The factory can point at a digest when checkout is 500 at midnight. Interviewers hear build once, promote twice.",
      example:
        "The factory stamps the batch number on the lid after the weigh station says yes. The warehouse and the truck both carry lid abc123. Nobody paints a new box at the loading dock and copies the number with a marker. If the truck needs yesterday's cake, they take yesterday's lid off the shelf, not a cousin from Ada's laptop oven.",
      uses:
        "Any container deploy: GitHub Actions to Docker Hub, ECR, GHCR, or GitLab's registry. Kubernetes, ECS, and Compose all pull a tag. Interviews at Amazon and Uber start with sha tags before they ask about rolling updates. Campus labs can push to a local registry with the same stamp rule. The lid is the commit, not a mood.",
      watch:
        "Pushing latest only means you cannot roll back to the other latest. A prod job that runs docker build is a second bake. Tagging with latest and also the sha is fine if production pins the sha. Never let the truck choose a floating sticker while you sleep. Last week's box must still have a name."
    }),
    code: `# after tests
- uses: docker/login-action@v3
  with:
    username: \${{ secrets.DOCKERHUB_USER }}
    password: \${{ secrets.DOCKERHUB_TOKEN }}
- run: |
    docker build -t myapp:\${{ github.sha }} .
    docker push myapp:\${{ github.sha }}`
  },
  {
    title: "Secrets stay out of YAML",
    lang: "txt",
    desc: story({
      problem:
        "A token sat in ci.yml. Git history still has it after you delete the line. Forks, CI logs, and a curious intern can still read the cupboard key. Rotating later does not unspread a secret that lived on every clone. The factory printed the lock combination on the recipe card taped to the wall, then wondered why the yard was unlocked.",
      what:
        "GitHub Settings holds Secrets. The workflow reads the value through secrets.NAME while the pipeline file in Git only has the name. CI uses that name to log in, migrate, or push the artifact. CD uses the same cupboard for deploy URLs. The recipe stays reviewable; the jar stays in a locked cupboard. Prefer short-lived OIDC roles over a long AKIA key in the drawer.",
      solves:
        "Logs and pull requests do not print the password if you never echo it. A new hire can read the recipe without inheriting the prod database URL. Rotation is changing the cupboard, not rewriting Git history. The factory can open-source the card and keep the jar. Interviewers want this split before they ask about vault products.",
      example:
        "The recipe says use the jar on the top shelf. The jar is in a locked cupboard. Guests may photograph the card on the wall. They still cannot open the cupboard. If you write the combination on the card, every photocopy of the recipe is a spare key. Echoing the jar in a job log is reading the combination into the hallway microphone.",
      uses:
        "Tokens, cloud keys, Docker logins, and deploy URLs. GitHub Actions, GitLab CI variables, and Jenkins credentials all follow the same cupboard rule. OIDC is the visitor badge that expires. Campus labs still start with a named secret for DATABASE_URL so the YAML never holds the connection string. The recipe card names the jar, never the combination.",
      watch:
        "echo of the secret in a step prints it in the job log. Rotate if it leaked, and treat Git history as already public. Committing a .env next to the pipeline file is the same leak with extra steps. A long-lived cloud key in the drawer is a spare house key under the factory mat."
    }),
    code: `# repo Settings → Secrets and variables → Actions
# add  DATABASE_URL

- name: migrate
  env:
    DATABASE_URL: \${{ secrets.DATABASE_URL }}
  run: npm run migrate
# never: echo "$DATABASE_URL"`
  },
  {
    title: "Staging then prod (same image)",
    lang: "txt",
    desc: story({
      problem:
        "Production was a new build with different compile flags. Staging had tasted a different cake. The truck left with a cousin of the box the shop approved. Rollback could not find the sha because each room baked its own lid. The factory called it CI/CD and still ran two ovens, one at the counter and one in the parking lot at four o'clock.",
      what:
        "One CI job tests and builds the artifact, tagging it with the git sha. A later CD job deploys that sha to staging, then to production after approval. GitHub environments name the rooms. The pipeline file in Git wires needs so a red weigh station never starts the truck. Only env and secrets change. The box does not get a second bake between the counter and table one.",
      solves:
        "Promotion, not a second bake. Staging's smoke test is about the same bytes production will serve. Approvals sit in front of the taxi without unpacking the suitcase. Rollback is the previous sha, already sitting on the shelf. Interviewers hear dress rehearsal then the show, same costume. The lid does not get a fresh stamp in the yard.",
      example:
        "The same boxed dosa: counter tasting, then the customer table. You do not fry a new dosa in the parking lot because the table asked for extra chutney — you change the side cup, not the stamp on the lid. If table one complains, you bring back yesterday's stamped box, not a cousin from Ada's home kitchen.",
      uses:
        "environments named staging and production on GitHub, plus GitLab environments. Docker, jars, and static zips all promote a digest. Amazon and Microsoft interviews draw this after CI versus CD. Campus labs can fake the rooms with two echo steps as long as the sha is the same. Three rooms, one lid, one weigh.",
      watch:
        "needs: test so a red test never deploys. A prod job that runs docker build has already broken the rule. Skipping the staging environment to go faster is sending the truck before the counter taste. latest between rooms is a sticker that slides while you walk the hallway. The rail must hold the truck behind the scale."
    }),
    code: `jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm test

  deploy-staging:
    needs: test
    environment: staging
    runs-on: ubuntu-latest
    steps:
      - run: echo deploy myapp:\${{ github.sha }} to staging

  deploy-prod:
    needs: deploy-staging
    environment: production   # required reviewers in GitHub
    runs-on: ubuntu-latest
    steps:
      - run: echo deploy myapp:\${{ github.sha }} to prod`
  },
  {
    title: "Cancel the old run",
    lang: "txt",
    desc: story({
      problem:
        "You pushed five times. Five CIs piled up on the same branch. The first stale run finished last and posted a confusing red X on a commit that was already replaced. Reviewers waited on a weigh station that was grading yesterday's dough. The factory ran five trucks for one street and the oldest truck arrived at the dock with a spoiled batch.",
      what:
        "concurrency groups runs on the same branch or ref. cancel-in-progress stops the old robot so only the latest sha is weighed. The pipeline file in Git names the group. CI still tests, builds, and stamps that latest box. CD should use a tighter group so a prod apply is not cancelled mid-stamp. The recipe stays one file; the queue stays honest.",
      solves:
        "Only the latest commit is graded, so the badge matches the code in the pull request. Runners are not wasted on dough you already threw away. Feedback stays minutes, not a pile of leftover jobs. The factory clerk throws away the old clipboard when you hand in a new ticket.",
      example:
        "The teacher throws away the old draft when you hand in a new one. Grading five drafts of the same chapter is how the red X lands on the wrong page. The weigh station keeps the latest batch on the scale and dumps the previous bowl. The truck still only leaves with the stamped lid of the bowl that survived.",
      uses:
        "Busy pull requests on GitHub Actions and GitLab. Any repo where people push fixup commits every two minutes. Interviews mention this when they ask how you keep PR CI fast. Campus labs feel it the first time five classmates push to one branch. Grade the latest dough, not five leftover bowls.",
      watch:
        "Cancelling a production deploy mid-apply can leave the room half-painted. Use a tighter concurrency group for deploy jobs, or set cancel-in-progress false on the CD job. Cancelling tests on a PR is fine. Cancelling the truck while it is already in the tunnel is how you ship a half box."
    }),
    code: `concurrency:
  group: ci-\${{ github.ref }}
  cancel-in-progress: true`
  },
  {
    title: "GitLab CI is the same idea",
    lang: "txt",
    desc: story({
      problem:
        "A team used GitLab. People thought CI only exists as GitHub Actions and froze when the interviewer said merge request pipeline. They could not point at a recipe file in Git or name stages. The factory still needed a weigh station and a stamped box, but the logo on the wall was different and the candidate treated it as another planet.",
      what:
        "GitLab CI is a pipeline file in Git named .gitlab-ci.yml. You list stages, then jobs with a script. A merge request still runs the robot weigh station. CI tests and builds the artifact, often tagging with CI_COMMIT_SHA. CD jobs in a later stage deploy that same sha. Different factory, same weigh-then-ship rule as Actions or Jenkins.",
      solves:
        "Same loop: test, then build, then deploy. You can explain GitLab without learning a new religion. Interviewers hear you know pipeline as code, not one vendor. The stamped box still moves through rooms. A GitHub-only story no longer dies when the job posting says GitLab. The wall card color can change; the scale cannot.",
      example:
        "A different factory, same weigh-then-ship rule. The wall card is a different color. The scale still refuses a wet batch. The truck still only carries a lid with a commit number. You do not invent a new cake because the kitchen is in a different city. Guests still eat the box that passed the counter taste.",
      uses:
        "GitLab-hosted repos, self-managed GitLab, and companies that never opened GitHub Actions. Interviews at Amazon and Google still accept this picture if you name stages and the sha. Campus labs that give you GitLab should start with this file next to the app, not a click job on a shared runner box.",
      watch:
        "A job without a stage still runs, so know which stage failed. only and rules change who gets a truck. Secrets belong in GitLab CI variables, not in the YAML. Do not rebuild the image in the deploy stage and call it the same artifact. latest is still a sliding sticker here."
    }),
    code: `# .gitlab-ci.yml
stages: [test, build, deploy]

unit:
  stage: test
  image: node:22
  script:
    - npm ci
    - npm test

image:
  stage: build
  script:
    - docker build -t myapp:$CI_COMMIT_SHA .
  only: [main]`
  },
  {
    title: "Manual run (workflow_dispatch)",
    lang: "txt",
    desc: story({
      problem:
        "You needed to redeploy yesterday's sha without a fake empty commit. The only button people knew was git commit --allow-empty, which dirtied history and still rebuilt a cousin cake. Hotfix night needed the same recipe with a different lid. The factory had no reprint button on the wall, only a rumor that Ada still had the zip on her laptop.",
      what:
        "workflow_dispatch adds a Run workflow button on GitHub. You can pass the sha as an input so CD deploys that stamped box again. The pipeline file in Git is still the recipe. CI should still run if you are building; a pure redeploy should pull the existing artifact, not bake in the parking lot. The human starts the same truck with the same lid.",
      solves:
        "A human can start the same recipe without lying to Git. Hotfix rollback is typing yesterday's sha, not inventing a new commit. Migrations and one-off jobs get a labeled button instead of a secret script on a laptop. The factory reprint matches the wall card, including needs: test when you are not only moving an old box.",
      example:
        "A reprint button on the factory wall. You type batch abc123 and the truck carries that lid again. You do not mix a new batter because the last print smeared. The weigh station already stamped that box last week. The clerk does not ask you to pretend a blank page is a new chapter just to wake the robot.",
      uses:
        "Hotfix redeploy, one-off migrations, and demo environments. GitLab has similar manual jobs. Interviews ask how you ship yesterday without a fake commit. Campus labs can add the button after the first ci.yml so students see a human door on the same recipe. The reprint still carries the old lid, not a parking-lot cousin.",
      watch:
        "A button that skips tests and bakes a new image is CD without CI. Keep needs: test when the run builds. A dispatch that deploys latest instead of the input sha is a sliding sticker. Do not pass secrets as inputs — those belong in the cupboard, not on the reprint form."
    }),
    code: `on:
  workflow_dispatch:
    inputs:
      sha:
        description: "image tag"
        required: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - run: echo deploy myapp:\${{ inputs.sha }}`
  },
  {
    title: "Health smoke after deploy",
    lang: "txt",
    desc: story({
      problem:
        "The pipeline said success because kubectl apply exited zero. Checkout was 500 for ten minutes while the badge stayed green. Users found the broken box before the factory did. CD had sent the truck and never tasted the plate. The weigh station had passed at build time, then nobody checked the table after the box landed in the room.",
      what:
        "After deploy, curl the real health URL and fail the job if it is not 200. That step is still CD, still in the pipeline file in Git, still about the same artifact sha you just promoted. CI already weighed the batch. The smoke is a taste at the table, not a second bake. localhost on the runner is the kitchen sink, not the dining room.",
      solves:
        "A green tick means the box answers, not only that YAML was sent to the cluster. You catch a bad config or a crashed process before Slack fills with screenshots. Rollback can start from a red smoke instead of from angry checkout. The factory admits the truck arrived and the cake is edible, or it does not stamp the run as done.",
      example:
        "Taste the dosa at the table, not only stamp the kitchen ticket. The ticket can say sent while the plate is cold. A clerk who only watches the ticket printer will serve a 500. The weigh station already happened. This is the last bite before you tell the guest the batch is live. If the bite fails, bring back yesterday's stamped box.",
      uses:
        "Every CD job on GitHub Actions, GitLab, and Jenkins. Newman collections and Playwright smokes belong here too. Interviews at Amazon and Microsoft ask what green means after apply. Campus labs can curl localhost of a compose stack as practice, then switch to the real staging URL. Green must mean the plate at the table is edible.",
      watch:
        "localhost in CI is the runner, not your production host. Use the real URL of the room you just deployed. A smoke that always greps hello from a mocked file is a fake taste. Do not mark the job green if curl failed and you decided to continue-on-error for vibes."
    }),
    code: `- name: smoke
  run: |
    curl -f https://api.example.com/health
    # -f = fail the step on 404/500`
  },
  {
    title: "Required check on main",
    lang: "txt",
    desc: story({
      problem:
        "CI was red and someone merged anyway. The robot was decoration. Main received a wet batch and the truck left with it. Branch protection was a rumor in a wiki. The factory hung a weigh-station sign and left the dock unlatched, so the badge was a poster, not a lock. Monday's checkout was the first honest test.",
      what:
        "GitHub branch protection on main: require a pull request, required reviewers, and the job named unit-tests to be green. No force-push. That job lives in the pipeline file in Git. CI is the weigh station; the required check is the lock on the dock door. CD still promotes a stamped box later. The name in Settings must match the YAML job name or the lock never sees green.",
      solves:
        "The door stays locked until the badge is green, so a red robot cannot be ignored. Force-push cannot rewrite the official notebook in the night. Reviewers and the weigh station both have to stamp. The factory treats the badge as a contract, not a suggestion. Interviewers want this lock named after they hear what CI is.",
      example:
        "The library will not stamp the official book until the robot grades the chapter. A teacher who likes the handwriting still cannot skip the grade. The dock clerk checks the weigh ticket, not a smile from the driver. If the ticket is red, the truck waits. Yesterday's stamped chapter stays on the shelf until the new one passes.",
      uses:
        "Every company repo on GitHub or GitLab protected branches. Open source uses the same lock so random forks cannot paint main. Amazon, Google, and Microsoft interviews ask how you stop merge on red. Campus labs should turn this on the moment the first ci.yml exists, or the badge teaches the wrong habit.",
      watch:
        "The required name must match jobs.test.name in the YAML or protection never sees green. Disabling the check to unblock is opening the dock. A required job that only lints while tests are optional is a scale that never weighs. Do not allow administrators to skip the check unless the factory is on fire and you write the skip down."
    }),
    code: `# GitHub → Settings → Branches → main
# Require a pull request
# Require status checks: unit-tests
# Do not allow force pushes

# YAML job name must match:
jobs:
  test:
    name: unit-tests`
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
  Q(1, "beginner", "What is CI/CD?", {
    problem:
      "Code was merged by zip and hope. Bugs showed up on Monday in production. Tests lived on Ada's laptop. Bob copied files with FTP and nobody could name the live commit. Staging had tasted a different folder. The factory had no weigh station, no stamped lid, and no recipe on the wall — only a Slack thread asking who last touched the server.",
    what:
      "CI is a robot weigh station that tests every change in Git. CD is delivery, meaning main stays releasable, or deployment, meaning the taxi actually leaves. The recipe is a pipeline file in Git such as .github/workflows/ci.yml. The artifact is the stamped box tagged with the git sha. Deploy promotes that digest to a room — you never bake a new cake in the parking lot.",
    solves:
      "Red tests stop the merge before the truck leaves. Production is not a surprise rebuild of a cousin cake. Rollback is last week's stamped box. Interviewers hear weigh then ship, not a logo dump. The factory can point at a sha when checkout is 500. Campus labs get one story that survives GitHub, GitLab, and Jenkins.",
    example:
      "Weigh every batch at the station (CI). Only a stamped box goes on the truck (CD). You do not fry a new dosa in the parking lot and call it the counter taste. The wall card is the pipeline file. The lid is the git sha. Three rooms can carry that one box without a second bake, and last week's lid is still on the shelf.",
    uses:
      "GitHub Actions, GitLab CI, and Jenkins — same loop of recipe, weigh, stamp, promote. Node, Python, Docker, and Terraform interviews at Amazon, Google, Microsoft, and Meta all open here. Campus labs start with a ci.yml next to the app before anyone says Kubernetes. First week on a team is this factory picture.",
    watch:
      "A deploy button with no tests is CD without CI — a truck with no scale. A test that only runs on one laptop is not CI. Rebuilding for production is a second bake. Secrets in the YAML are the cupboard key on the recipe card. latest as the only tag means you cannot find last week's box."
  }, `name: ci
on: [pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm test`, "Most asked · Amazon · Google · Microsoft · Meta"),

  Q(2, "beginner", "CI vs Continuous Delivery vs Continuous Deployment?", {
    problem:
      "People said we do CD and meant three different things. One team meant a packed suitcase. Another meant the taxi already left. A third meant a Friday FTP copy. Interviewers asked delivery versus deployment and the whiteboard froze. The factory hung one poster over three jobs, so nobody could say whether a human still waved at the dock.",
    what:
      "CI is merge often plus a robot that lints, tests, and builds from a pipeline file in Git. Continuous Delivery means main is always releasable — the stamped artifact sits by the door. Continuous Deployment means every green main actually goes live — the taxi leaves. Deploy is promoting that sha. You can still put an approve click in front of production and honestly call it Delivery.",
    solves:
      "You can put an approve click in front of prod and still have Delivery. You can name which meaning your team uses. The suitcase does not get repacked between staging and production. Interviewers hear two CD words as two pictures, not one mashed slogan. The factory tour has a dock and a taxi, labeled separately.",
    example:
      "Pack the suitcase (delivery). Send the taxi (deployment). Same bag, same sha on the tag. The weigh station already happened (CI). A human can still wave at the taxi without opening the bag and stuffing new socks in the parking lot. If they ask which one you run, point at the wave or the automatic gate, not at a logo.",
    uses:
      "Interview definition, then say which one your team uses. GitHub environments with required reviewers are Delivery. Auto-deploy to prod on green main is Deployment. Amazon, Google, and Microsoft all ask this wording. Campus labs should pick one sentence and stick to it on the poster. Name the wave at the dock or the automatic gate.",
    watch:
      "Calling a weekly manual copy continuous deployment. Saying we do CD without delivery versus deployment. A deploy job that rebuilds the image is not promotion. If you cannot point at the pipeline file and the sha, you are still waving the mashed poster. Do not claim Deployment if a human must click every time."
  }, `# delivery: artifact is ready
# deployment: a job actually ships it
deploy-prod:
  environment: production   # humans click Approve
  needs: test`, "Most asked · Amazon · Google · Microsoft"),

  Q(3, "beginner", "What is a CI pipeline?", {
    problem:
      "Checkout, test, and deploy were three tribal knowledge steps. Someone skipped test and the truck left anyway. The order lived in a wiki and in the chef's head. A new hire could not grep the sequence. Friday's hotfix ran deploy first because that was the bookmark. The factory had stations with no rail between them, so a wet batch still reached the dock.",
    what:
      "A pipeline is jobs in order in a file in Git: checkout, install, test, build, scan, publish, deploy. A failed early job stops the later ones. That file is .github/workflows/ci.yml or .gitlab-ci.yml. CI is the weigh and stamp. The artifact is the box from the build job. CD is the deploy jobs that promote that sha. needs: is the rail that ties the rooms.",
    solves:
      "Fail fast. You do not ship a red build. The order is a rule in Git, not a hope in Slack. Reviewers see which station failed. Rollback of the recipe is a revert. Interviewers want this sequence drawn before Kubernetes. The factory rail keeps the truck behind the scale. A skipped gate is still a wet batch on the plane.",
    example:
      "Airport security: if the first gate fails, you do not board. The weigh station is the first gate. The stamped box is the boarding pass with the sha. The airplane is production. You do not bake a new cake at the gate because the flags on the ticket look different. A skipped security check is a deploy job with no needs: test.",
    uses:
      "Every workflow file on GitHub, GitLab, Circle, and Jenkins. Docker builds, Terraform plans, and npm test all sit as stations on the same rail. Amazon and Microsoft interviews ask you to list the jobs in order. Campus labs start with test then build, then add deploy as a later station.",
    watch:
      "A deploy job that does not need: test is a truck that left during the weigh. Jobs with no needs race and can stamp an unweighed box. A pipeline that only deploys is CD without CI. Putting secrets in the YAML is printing the cupboard key on the rail map. latest between stations is a sliding sticker."
  }, `jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm test
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - run: docker build -t myapp:\${{ github.sha }} .`, "Most asked · Amazon · Google · Microsoft"),

  Q(4, "beginner", "What is GitHub Actions?", {
    problem:
      "You wanted the robot next to the repo, not a Jenkins box someone forgot to patch under a desk. Click jobs vanished when the owner left. A pull request had no badge. The recipe was not in Git so a PR could not change the weigh station with the app. The factory needed a wall card reviewers could grep, not a tribal server in a closet.",
    what:
      "YAML under .github/workflows is the pipeline file in Git. A trigger such as push or pull_request starts jobs on a runner. Steps are actions or shell. CI is those jobs weighing and stamping. The artifact is what you build and upload. CD is later jobs that deploy that sha. Secrets stay in Settings; the file only names them. The robot lives next to the code.",
    solves:
      "The recipe is in Git. Pull requests get checks. History shows who removed the scan. You do not SSH into a forgotten Jenkins to read the truth. Interviewers accept Actions as the default GitHub factory. A new hire clones the repo and already has the wall card. Branch protection can require the job name you wrote in the YAML.",
    example:
      "A robot grader that wakes when you hand in a chapter. The notebook is the repo. The grading rubric is ci.yml on the wall. The stamp on the chapter is the git sha. If the grader says red, the library does not file the chapter. A later robot can put the same stamped chapter on the public shelf after a human waves.",
    uses:
      "Test, lint, build images, deploy, and scheduled jobs. Node, Python, Docker, and Terraform all fit. Amazon, Google, Microsoft, and Adobe interviews expect this file path. Campus labs start here because the repo already lives on GitHub. Same weigh-then-ship rule as GitLab, different wall color. The robot lives next to the recipe in Git.",
    watch:
      "Secrets pasted into the YAML. A file not under .github/workflows/ is a recipe GitHub never reads. Pin action versions so Monday's runner is not a different planet. A workflow with no tests is a grader that only stamps the cover. Do not use latest as the only image tag you deploy."
  }, `name: ci
on:
  pull_request:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "22"
      - run: npm ci && npm test`, "Most asked · Amazon · Google · Microsoft · Adobe"),

  Q(5, "beginner", "What should CI run on every PR?", {
    problem:
      "CI only ran lint. A broken test merged. Or CI ran a forty-minute e2e and people skipped waiting, then merged red. The badge died as a social contract. The factory either never used the scale or used a banquet oven for every sip. Reviewers stopped trusting the weigh ticket and went back to Ada's laptop.",
    what:
      "On a pull request the pipeline file in Git should install from the lockfile, run unit tests, maybe lint and a cheap build. That is CI: a fast weigh station. Slow e2e can sit on main or at night. The artifact bake can wait until the PR is green if the image is expensive. CD still happens after merge, promoting the sha. Feedback in minutes keeps people at the scale.",
    solves:
      "Feedback in minutes. People still trust the badge. Main stays protected by a required fast job. Heavy banquets still run, just not on every sip. Interviewers hear a split: PR CI versus nightly. The factory grades the homework tonight and cooks the banquet on Sunday without pretending they are the same oven.",
    example:
      "Taste the soup on the stove. Do not cook the whole banquet for every sip. The weigh station is a spoon, not a wedding. If the spoon is salty, you do not need a five-course proof. The stamped box for the truck can wait until the recipe is merged. A guest who waits forty minutes for a spoon will steal food from the back door.",
    uses:
      "Node, Python, and Go repos on GitHub Actions and GitLab. Path filters can skip the image bake on a docs-only PR. Amazon, Google, and Meta ask what you run on a PR versus main. Campus labs should keep PR CI under ten minutes or students will merge without looking. The spoon stays a spoon; the banquet waits for Sunday.",
    watch:
      "Only e2e. PRs wait, then people merge red. Skipping the only test that catches the bug because it was slow. A required check that is only lint while npm test is optional. Caching forever so a broken lockfile hides in the spice rack. Cancelling the wrong job and thinking the banquet was the spoon."
  }, `- run: npm ci
- run: npm test
- run: npm run lint
# keep e2e for main or a nightly workflow`, "Most asked · Amazon · Google · Meta"),

  Q(6, "beginner", "What is an artifact? Why the same one?", {
    problem:
      "Staging tested build A. Production was a new build B that pulled a different library. It worked in staging was a lie about different bytes. Rollback hunted Slack for a zip. The factory painted a new box in the parking lot, stuck the old sticker on it, and blamed the shop. Monday checkout could not name the lid that was live.",
    what:
      "The artifact is the stamped box: a Docker image, zip, or jar. CI builds it once and tags it with the git sha or digest. CD promotes that same digest from staging to production. The pipeline file in Git passes the sha through every deploy job. Only env and secrets change between rooms. You never bake again for prod because the flags look different.",
    solves:
      "It worked in staging is about those bytes. Rollback is the previous sha on the shelf. Three rooms carry one lid. Interviewers hear promote, not rebuild. The factory can print the digest when the site is 500. You stop arguing about latest as if it were a version. The parking-lot oven is not a promotion.",
    example:
      "One stamped box on three trucks. Not a new box with the same sticker. The shop, the warehouse, and the road all read lid abc123. If the warehouse liked the taste, the road truck does not mix a cousin batter at the light. Last week's lid stays on the shelf for the fire. The weigh station already happened before any truck moved.",
    uses:
      "Docker registries, GitHub Packages, and S3 zips. Kubernetes, ECS, and static hosts all pull a sha. Vercel still builds from a commit even when you never see a registry. Amazon, Google, Microsoft, and Uber ask why not latest. Campus labs can tag a local image with the commit and promote it between two compose files.",
    watch:
      "latest in production. Rebuilding for prod on the deploy job. Tagging only with a branch name that moves. An artifact that is a folder on Ada's laptop. If the pipeline cannot print the sha it shipped, you do not have an artifact. A second docker build is a parking-lot oven wearing a promotion badge."
  }, `docker build -t myapp:\${{ github.sha }} .
docker push myapp:\${{ github.sha }}
# staging and prod both pull myapp:<that-sha>`, "Most asked · Amazon · Google · Microsoft · Uber"),

  Q(7, "beginner", "Where do CI secrets live?", {
    problem:
      "AWS keys sat in the workflow file. Deleting the line later did not un-leak git history. Forks, logs, and a curious intern still had the cupboard key. Rotation was a panic after the leak, not a design. The factory printed the combination on the recipe card taped to the wall and called it pipeline as code.",
    what:
      "Repo or org secret store. The pipeline file in Git writes secrets.NAME and never the value. CI uses that name to install, migrate, or push the artifact. CD uses the same cupboard for deploy tokens. Prefer OIDC short-lived cloud roles over long AKIA keys in the drawer. The recipe stays reviewable; the jar stays locked. GitHub Settings, GitLab variables, Jenkins credentials — same cupboard idea.",
    solves:
      "The file has a name. The cupboard has the jar. Logs and pull requests stay clean if you do not echo. A public fork of the recipe does not inherit production. Rotation is changing the cupboard, not rewriting history. Interviewers want this split before they ask about HashiCorp Vault. The factory can open-source the wall card.",
    example:
      "Recipe says top shelf. The key is not printed on the recipe card. Guests may photograph the card. They cannot open the cupboard. Echoing the jar into the job log is reading the combination into the hallway. Committing .env next to ci.yml is taping a spare key to the wall under the card.",
    uses:
      "DATABASE_URL, deploy tokens, Docker login, npm tokens. GitHub Actions, GitLab CI, and Jenkins. OIDC for AWS, Azure, and GCP from the job. Campus labs still start with one named secret so students never paste a connection string into YAML. Interviews at Amazon, Google, and Microsoft all ask where the key lives.",
    watch:
      "echo the secret. Commit .env. Long-lived cloud keys under the mat. Passing secrets as workflow_dispatch inputs that show in the UI. continue-on-error after a leak. A role that is admin on the whole cloud account. git rm does not unspread a key that already sat in history and forks. Treat a leaked jar as already copied."
  }, `- env:
    DATABASE_URL: \${{ secrets.DATABASE_URL }}
  run: npm run migrate
# Settings → Secrets → Actions`, "Most asked · Amazon · Google · Microsoft"),

  Q(8, "intermediate", "What is a required status check?", {
    problem:
      "CI was red. Someone merged anyway. The robot was a suggestion. Main took a wet batch and the truck left. Branch protection was a wiki rumor. The factory hung a weigh-station sign and left the dock unlatched. Monday checkout was the first honest test, and the badge had trained everyone to ignore it.",
    what:
      "Branch protection: main needs a pull request, N reviews, and this job name green. No force-push. The job lives in the pipeline file in Git. CI is the weigh; the required check is the lock on the dock. CD still promotes a stamped sha later. The name in Settings must match the YAML name or the lock never sees green. GitLab protected branches are the same lock with different clicks.",
    solves:
      "The door stays locked until the badge is green. A red robot cannot be smiled past. Force-push cannot rewrite the official notebook at night. Reviewers and the scale both stamp. Interviewers want this lock after they hear what CI is. The factory treats the badge as a contract, not decoration.",
    example:
      "The official book will not take a chapter until the robot stamps it. A librarian who likes the handwriting still checks the grade. The dock clerk reads the weigh ticket, not the driver's joke. If the ticket is red, the truck waits. Yesterday's stamped chapter stays on the shelf until the new one passes the scale.",
    uses:
      "Every company main branch on GitHub or GitLab. Open source uses it so random forks cannot paint main. Amazon, Google, Microsoft, and Meta interviews ask how you stop merge on red. Campus labs should enable it the day ci.yml exists, or students learn that red is optional. The dock lock is the badge, not a wiki rumor.",
    watch:
      "Required name does not match jobs.test.name. Protection never sees green. Admins skipping the check to unblock. A required job that only lints while tests are optional. Allowing force-push on main. Renaming the YAML job and forgetting Settings, so the lock waits forever on a ghost name. A scale you unlatch is decoration again."
  }, `jobs:
  test:
    name: unit-tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test
# Settings → Branches → require "unit-tests"`, "Most asked · Amazon · Google · Microsoft · Meta"),

  Q(9, "intermediate", "needs: and fail-fast?", {
    problem:
      "Deploy started while tests were still running — or after they failed. Two jobs with no rail raced. The truck left during the weigh. Staging received a box the scale had already rejected. The pipeline file listed jobs as a pile, not a sequence. The factory had stations in a room with no conveyor, so a wet batch still got a shipping label.",
    what:
      "needs: test means the deploy job waits and skips if test failed. That rail lives in the pipeline file in Git. CI is the needed weigh and stamp. CD is the later job that promotes the sha. Fail-fast on a matrix stops sibling versions when one already proved the dough is wet. The artifact should only move after the jobs that built and tested it have a green stamp.",
    solves:
      "Order is a rule, not a hope. A red weigh station never starts the truck. You read which station failed instead of a pile of racing logs. Interviewers hear needs as the conveyor. The factory can add staging then production as two more cars on the same rail without a second bake.",
    example:
      "The truck does not leave until the weigh-station stamp. A driver who likes the paint job still waits for the ticket. If the scale says no, the dock stays closed. Two trucks with no stamp will race into the tunnel. The lid on the box is still the git sha; needs only decides when that lid may move to the next room.",
    uses:
      "Any multi-job workflow on GitHub Actions or GitLab stages. Test then build then deploy is the usual rail. Amazon and Microsoft ask this after what is a pipeline. Campus labs should add needs the moment they split jobs, or the echo deploy will run on red tests. The conveyor is a rule in Git, not a hope.",
    watch:
      "Two jobs with no needs: they race. A deploy job that only needs: build while tests sit off to the side. continue-on-error on the test job so the truck always leaves. A matrix with fail-fast false that hides a red version until lunch. Rebuilding the image in the deploy job after needs already passed — still a second bake."
  }, `jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm test
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - run: echo only if test passed`, "Most asked · Amazon · Microsoft"),

  Q(10, "intermediate", "npm ci vs npm install in CI?", {
    problem:
      "npm install on the runner changed the tree. Works on my machine came back. A floating range pulled a new package overnight and tests died with no app change. Two clerks bought two milks. The weigh station was honest and still weighed a different bag than Ada's kitchen. The lockfile was gitignored so the shopping list never rode with the recipe.",
    what:
      "npm ci is a clean install from the lockfile: delete node_modules, then stamp that exact tree. npm install may update the lock and grab whatever is on the shelf. The pipeline file in Git should call ci in CI so the robot weighs the commit's list. The artifact you bake sits on that frozen tree. CD still promotes the image, not a lottery of packages. Yarn and pnpm freeze the same way with their lockfiles.",
    solves:
      "Repeatable CI. Laptop and robot share a tree, so a red test is about your code. You can replay last week's sha and get the same bag. Interviewers want ci not install as a one-sentence habit. The factory stops treating the aisle sale as the recipe. Main stays a line of stamped lids, not a surprise library each morning.",
    example:
      "Buy the exact list, not whatever is on sale. The clerk ticks milk 1.2.3 and does not grab 1.3.0 because it faced the door. The stamped box is built from that cart. A second shopper who wanders the aisle is npm install on the runner. The wall recipe and the shopping list must both live in Git or the factory is guessing.",
    uses:
      "Node apps in GitHub Actions and GitLab. Commit package-lock.json next to ci.yml. Interviews at Amazon, Microsoft, and Google ask this after what runs in CI. Campus labs fail this the first time they gitignore the lock and wonder why the badge flickers. Python pip install -r with hashes is the cousin habit.",
    watch:
      "No lockfile in Git. Running npm install in the workflow. A lock rewritten on the runner each job. Two package managers fighting over the list. Caching with a key that ignores the lock hash. Shipping latest of a dependency as if the weigh station named it. The parking-lot bake starts with the wrong cart."
  }, `- run: npm ci
- run: npm test
# commit package-lock.json`, "Most asked · Amazon · Microsoft · Google"),

  Q(11, "intermediate", "What is a matrix build?", {
    problem:
      "It passed on Node 22. Users on 18 crashed. CI only weighed one stove. The factory stamped a box that melted in a colder room. Interviewers asked how you test two versions and the candidate said we should remember to run it locally. The pipeline file had one job and one lucky version, so the badge lied to half the customers.",
    what:
      "strategy.matrix runs the same CI job on several versions from the pipeline file in Git. Each cell is a weigh station on another stove: Node 18 and 22, or Python 3.11 and 3.12. The artifact you ship is still one stamped sha, usually built on the version production runs. CD does not deploy twelve cakes. Fail-fast can stop the matrix when one cell already proved the dough is wet.",
    solves:
      "Catch works on my version. Users on the older runtime get a vote before merge. Interviewers hear matrix without a cloud lecture. The factory tastes the soup on two stoves, not twenty. Required checks can demand the whole matrix green, so one lucky cell cannot open the dock. Extra stoves are scales, not extra trucks.",
    example:
      "Taste the soup on two stoves, not twenty. The recipe on the wall lists the stoves. A cook who only tastes the new stove will ship salt to the old kitchen. The truck still carries one stamped box, built on the stove the dining room actually uses. Extra stoves are weigh stations, not extra trucks leaving with cousin cakes.",
    uses:
      "Node 18/20/22, Python 3.11/3.12, Ubuntu and macOS. GitHub Actions matrix and GitLab parallel:matrix. Amazon and Google interviews ask this after PR CI. Campus labs should keep two versions, not a combinatorial banquet that takes an hour and trains people to merge without waiting. Two honest stoves beat twenty skipped ones.",
    watch:
      "A huge matrix that takes an hour. People merge without waiting. Fail-fast false hiding a red cell. Requiring only one cell in branch protection. Building twelve production images. Matrix on deploy jobs that race twelve trucks. A cell that uses latest instead of a pinned runtime, so Monday is a different stove."
  }, `jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node: ["20", "22"]
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node }}
      - run: npm ci && npm test`, "Most asked · Amazon · Google"),

  Q(12, "intermediate", "How do you cache CI?", {
    problem:
      "Every pull request re-downloaded the internet. Feedback was twelve minutes. People stopped waiting and merged on hope. The weigh station was honest and still too slow to be a contract. Runners fetched the same spice rack a hundred times a day. The factory treated every sip as a trip to the wholesale market, so the badge died socially.",
    what:
      "Cache npm or pip keyed on the lockfile hash inside the pipeline file in Git. When the lock changes, the key changes and the rack restocks. setup-node cache: npm is the usual shortcut. CI still runs npm ci on a warm rack, then tests, then stamps. CD does not need this cache if it only pulls a sha. The artifact stays the image, not the cache. A cache is a spice rack, not the cake.",
    solves:
      "Faster honest installs. PR CI stays in minutes so people wait for the badge. The lockfile remains the shopping list; the cache is only the pantry. Interviewers hear key on the lock hash. The factory restocks when the list changes, not on a forever key that hides a rotten jar.",
    example:
      "Keep the spice rack; restock when the shopping list changes. The clerk does not drive to the market for every sip of soup. If the list adds chili, the rack gets chili. If the list stays, yesterday's rack is fine. The stamped box is still baked after the weigh, not scooped from the spice jars and called lunch. A forever key is a rack nobody ever cleans.",
    uses:
      "actions/cache or setup-node cache: npm. pip, gradle, and docker layer caches follow the same hash-the-list idea. Amazon and Microsoft ask this when PR CI is slow. Campus labs feel it on the first shared runner. GitLab cache: key files is the same pantry with different YAML. The rack is spices, not the stamped cake.",
    watch:
      "A forever key that hides a broken lockfile. Caching node_modules without the lock hash. Restoring a cache from another branch's secrets. Using cache as a substitute for npm ci. Caching the built artifact under latest so rooms share a sliding sticker. A cache that never saves because the path was wrong, and you still wait twelve minutes."
  }, `- uses: actions/setup-node@v4
  with:
    node-version: "22"
    cache: npm
- run: npm ci`, "Most asked · Amazon · Microsoft"),

  Q(13, "intermediate", "What are flaky tests and why do they kill CI?", {
    problem:
      "A test failed one in ten times. People clicked Re-run until green and stopped believing the badge. Required checks became a slot machine. Real bugs hid behind toast alarms. The weigh station beeped for steam and the factory stopped evacuating. Monday's outage had been red last Friday, then green after three reruns, and nobody fixed the clock in the test.",
    what:
      "A flake fails without a real bug: clocks, order, shared state, leftover rows. CI is only a contract if the same input stamps the same lid. Fix the test or quarantine it briefly with a ticket. The pipeline file in Git should not retry until green as the design. CD still promotes a sha; a flake must not randomly block or randomly bless that sha. Seeded time and isolated data keep the scale honest.",
    solves:
      "CI is a contract again. Reviewers trust the badge. A red run means the dough is wet, not that the moon was wrong. Interviewers hear quarantine plus fix, not mash the retry button. The factory alarm means fire, so people still leave the building. Required checks become a lock instead of a lottery at the dock.",
    example:
      "A fire alarm that beeps for toast. Soon nobody leaves the building. The weigh station that rejects a dry batch one morning and accepts it after lunch is that alarm. The truck drivers learn to ignore the ticket. Last week's stamped box sat on the shelf while a flaky scale accused a good cake, then blessed a wet one on the third try.",
    uses:
      "Any suite you run on pull requests. Jest, pytest, Playwright, and Go tests all flake the same way. Amazon, Google, and Meta ask this after they hear you have CI. Campus labs hit it the first time a test uses Date.now or a shared database. Quarantine belongs in the tracker, not as a forever skip.",
    watch:
      "Retry until green as the fix. A flake detector that just reruns three times and ships. Shared mutable fixtures across tests. Sleeping two seconds instead of waiting for a condition. Time bombs that only fail at midnight UTC. Disabling the required check because the scale is noisy. Quarantine with no owner and no expiry."
  }, `// bad: depends on the clock
// expect(Date.now()).toBe(start + 1000)

// good: same input, same output
function add(a, b) { return a + b; }
console.log(add(2, 3) === 5);`, "Most asked · Amazon · Google · Meta"),

  Q(14, "intermediate", "How do you deploy staging then production?", {
    problem:
      "Production was a different build. Or production deployed on every push with no human look. Staging tasted cake A and the truck carried cake B. Rollback could not find the sha. The factory either skipped the counter or skipped the wave at the dock. Interviewers asked how you promote and the candidate said we copy files twice.",
    what:
      "needs: test, then environment: staging, then environment: production with required reviewers. Same sha on every job. CI weighs and stamps the artifact in the pipeline file in Git. CD promotes that digest to the counter, tastes /health, then — if a human waves — to table one. Only env and secrets change. You never docker build again on the prod job. GitLab environments are the same rooms.",
    solves:
      "Dress rehearsal, then the show. Same costume. Approvals sit in front of the taxi without unpacking the suitcase. Staging smoke is about the bytes production will serve. Rollback is the previous sha already on the shelf. Interviewers hear promote, not rebuild. The factory can name which room has which lid at midnight.",
    example:
      "Taste at the counter, then serve table one the same plate. You do not fry a new dosa in the parking lot because the table asked for extra chutney — you change the side cup. If table one complains, yesterday's stamped box comes back from the shelf. The weigh station already happened. The human wave is Delivery, not a second bake.",
    uses:
      "GitHub Environments and GitLab environments. Docker, jars, and static zips all promote a digest. Amazon, Google, and Microsoft draw this after CI versus CD. Campus labs can echo two rooms as long as the sha is identical. Kubernetes and ECS still pull the same tag into two namespaces. Same costume from counter to table.",
    watch:
      "A second docker build on the prod job. Skipping staging to go faster. Deploying latest between rooms. A production environment with no required reviewers when you claimed Delivery. needs: that skip test. Smoke that curls localhost on the runner. A wave that approves a different sha than staging tasted. The parking-lot oven is still not promotion."
  }, `deploy-prod:
  needs: deploy-staging
  environment: production
  runs-on: ubuntu-latest
  steps:
    - run: deploy myapp:\${{ github.sha }}`, "Most asked · Amazon · Google · Microsoft"),

  Q(15, "intermediate", "Blue-green vs rolling vs canary?", {
    problem:
      "A big-bang deploy took the site down. Rollback was SSH and hope. One truck dumped the whole new batch on the dining room at once. The previous stamped box was already in the bin. Nobody watched error rate. The factory had CD that meant replace everything and pray, with no second kitchen and no sip before the banquet.",
    what:
      "Blue-green: two stacks, flip the pointer when the new stamped sha is healthy. Rolling: replace a few boxes at a time so old and new lids share the room briefly. Canary: five percent of traffic, watch, then grow. All three are CD strategies for promoting the same artifact, not a second bake. CI already weighed. Health checks decide if the truck keeps going. The pipeline file in Git should name the sha, not latest.",
    solves:
      "You pick cost versus safety. All need health checks. Rollback is flip the pointer, or stop the roll, or turn the canary off — usually faster than SSH. Interviewers hear three pictures, not one mashed slogan. The factory can say which door they use on production night. Staging can still be the counter taste before any of these.",
    example:
      "Two kitchens and a door (blue-green). Change train cars while moving (rolling). One sip first (canary). The cake in every picture is the same stamped sha. You do not mix a parking-lot batter because the door is sticky. If the sip is bitter, you stop pouring. Yesterday's kitchen stays warm until the new lid earns the door.",
    uses:
      "Interviews plus real CD on Kubernetes, ECS, and load balancers. Netflix and Uber love canary talk. Amazon and Google ask blue-green versus rolling. Campus labs can explain the door with two compose stacks. Feature flags can act like a tiny canary without a second cluster. Health still decides if the truck keeps rolling.",
    watch:
      "Canary with no dashboard. Flip before health is green. Rolling with a migration that old boxes cannot read. Blue-green that still writes one database both kitchens punch. Deploying latest so you cannot say which lid is green. SSH as the only rollback. Skipping CI because the canary will catch it — the scale still comes first."
  }, `# canary idea
# 95%  myapp:old-sha
#  5%  myapp:\${{ github.sha }}
# if /health and error rate ok, raise to 100%`, "Most asked · Amazon · Google · Uber · Netflix"),

  Q(16, "intermediate", "How do you roll back?", {
    problem:
      "v4 was bad. Nobody remembered the previous image id. The database migration could not go back. SSH and hope was the runbook. The factory threw away last week's stamped box and only kept latest. Checkout was 500 and Slack asked Ada if she still had the zip. The recipe in Git had no sha to reprint.",
    what:
      "Redeploy the previous artifact sha, or turn a flag off. Schema must still work with the old app — expand and contract, not DROP COLUMN in the same release. CD is promotion of a known lid, so rollback is promotion of an older lid. CI already built that older box. The pipeline file in Git can take a sha input. A practiced fire escape is a reprint button, not a new bake in the fire.",
    solves:
      "A practiced fire escape. Midnight has a named box, not a prayer. Feature flags can skip the truck entirely. Interviewers hear previous sha plus expand/contract. The factory keeps last week's lid on the shelf. Staging can replay the same rollback so you are not practicing in production smoke. Do not invent a recipe in the fire.",
    example:
      "Put last week's stamped box back on the shelf. Do not invent a new recipe in the fire. The clerk reads the lid number from the last green ticket and sends that truck again. If you already smashed the old pans (dropped a column), the old cake will not fit. The weigh station is not the fire drill — the shelf of old lids is.",
    uses:
      "Every CD story in an interview at Amazon, Google, and Microsoft. Kubernetes rollouts, ECS service updates, and static buckets all pin a sha. workflow_dispatch with a sha input is the reprint button. Campus labs should keep two image tags on a registry so rollback is a real command, not a speech.",
    watch:
      "DROP COLUMN in the same release. Rollback is then blocked. Only tagging latest so yesterday vanished. Rebuilding v3 in the parking lot instead of pulling the old digest. Flags that default on with no off switch. A migration that data cannot reverse. SSH as the documented plan. Forgetting that CD without stored artifacts has no shelf."
  }, `# previous green sha from the last successful run
deploy myapp:abc1234
# faster: FEATURE_CHECKOUT=false`, "Most asked · Amazon · Google · Microsoft"),

  Q(17, "beginner", "GitHub Actions vs GitLab CI vs Jenkins?", {
    problem:
      "Brand wars. Interviewers want when you pick each, not a logo recitation. Candidates listed three names and could not point at a recipe file. The factory still needed a weigh station and a stamped box, but the candidate treated each kitchen as a different religion. A Jenkins box under a desk was called CI/CD because the sticker said so.",
    what:
      "Same idea: pipeline as code. Actions lives next to GitHub as YAML under .github/workflows. GitLab CI is .gitlab-ci.yml with stages. Jenkins is often self-hosted and plugin-heavy, with a Jenkinsfile in Git if you are lucky. CI weighs and stamps. The artifact is the box. CD promotes the sha. Three factories, one weigh-then-ship rule. You pick where the code lives and who patches runners.",
    solves:
      "You pick where the code lives and who patches runners. Interviewers hear a trade-off: ops cost versus convenience. You can walk the same loop on any logo. A GitHub-only story no longer dies on a GitLab posting. The factory tour survives a brand switch. Campus labs can use whichever wall the course gave them.",
    example:
      "Three factories, one weigh-then-ship rule. The wall card is a different color. The scale still refuses a wet batch. The truck still carries a lid with a commit number. You do not invent a new cake because the kitchen is in another city. Guests still eat the box that passed the counter taste, not a parking-lot cousin.",
    uses:
      "Any job description that lists two of them. Amazon, Google, and Microsoft all accept this picture. Migrating from Jenkins clicks to a Jenkinsfile is the same pipeline-as-code move. Campus labs should name the file path first, then the vendor. Terraform and Docker still sit as stations on every rail. The scale does not care which logo is on the wall.",
    watch:
      "Listing logos. Say one trade-off: ops cost versus convenience. A click-only Jenkins with no file in Git is the chef's head again. Pretending Actions cannot deploy. Pretending Jenkins cannot be as-code. Secrets in any of the three YAMLs. latest as the only tag on all three trucks. A catalog is not a factory tour."
  }, `# Actions:  .github/workflows/ci.yml
# GitLab:   .gitlab-ci.yml
# Jenkins:  Jenkinsfile
# all: checkout → test → artifact → deploy`, "Most asked · Amazon · Google · Microsoft"),

  Q(18, "intermediate", "What is OIDC in CI?", {
    problem:
      "Long-lived AWS keys in GitHub secrets. A leak was a spare house key under the factory mat. Rotating AKIA after a log echo was a fire drill. Forks and old workflow runs still remembered the combination. The cupboard held a master that never expired, so the recipe card only needed one lucky photocopy to open the cloud.",
    what:
      "The job proves it is this repo, then assumes a short-lived cloud role. permissions id-token: write is the visitor desk. CI uses that badge to push the artifact or apply infra. CD uses the same badge to deploy the sha. The pipeline file in Git names the role, not the password. No AKIA in the drawer if you can avoid it. AWS, Azure, and GCP all offer this visitor-badge pattern from Actions.",
    solves:
      "No long-lived cloud key in the secret drawer if you can avoid it. A leaked workflow cannot use a key that already expired. Rotation is the role trust, not a panic string replace. Interviewers at Amazon hear you will not paste AKIA into YAML. The factory issues a badge that dies at the end of the shift.",
    example:
      "A visitor badge that expires versus a spare key in a drawer. Guests may photograph the recipe. They still cannot keep the badge after lunch. A spare house key under the mat is the AKIA in GitHub secrets. The desk checks that this factory and this job may enter the warehouse, then takes the badge back when the truck is loaded.",
    uses:
      "AWS, Azure, and GCP from GitHub Actions, plus similar federation on GitLab. Deploy, push to ECR, and Terraform apply. Amazon, Google, and Microsoft interviews ask this after where do secrets live. Campus labs can still start with named secrets, then graduate to OIDC when a cloud account exists. The visitor badge should die at the end of the shift.",
    watch:
      "A role that is admin on the whole account. Trusting every GitHub repo in the org. Forgetting id-token: write so the badge never prints. Still keeping AKIA as a backup under the mat. Echoing the temporary credentials. A pull_request from a fork that you accidentally allow to assume prod. The visitor desk must name the exact factory."
  }, `jobs:
  aws:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
    steps:
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123:role/gha`, "Most asked · Amazon · Google · Microsoft"),

  Q(19, "beginner", "What happens when you push to main?", {
    problem:
      "Candidates could not walk commit to robot to site. They started at Kubernetes and never named a sha. Interviewers asked what happens on git push and the whiteboard jumped to pods. The factory tour had no door, no scale, and no truck — only a cloud poster. Monday's outage still could not be told as one minute of stations.",
    what:
      "Push triggers the workflow file in Git. The runner checks out that sha, installs from the lockfile, and tests — that is CI, the weigh station. If green, it builds the artifact tagged with the sha, deploys that digest to a room, and smoke-checks /health — that is CD, the truck and the table taste. Staging may come before production. Rollback is the previous lid. You start at the commit, not at the cluster.",
    solves:
      "One story you can tell in a minute. Interviewers hear shipped, not memorized logos. You can point at each station if they hand you a marker. The factory tour has a door, a scale, a stamp, a truck, and a bite at the table. Campus labs can narrate localhost compose with the same beats.",
    example:
      "Hand in the chapter, robot grades, library shelf updates, someone opens the book and checks page one. The chapter is the commit. The grade is CI. The bound copy is the artifact. The shelf is deploy. Page one is /health. If page one is blank, put last week's bound copy back. You do not reprint a cousin chapter in the parking lot because the shelf screws looked different.",
    uses:
      "Every explain CI/CD interview at Amazon, Google, Microsoft, Meta, and Adobe. GitHub Actions, GitLab CI, and Jenkins all follow this walk. First-week onboarding should be this minute, not a tool catalog. Draw it: push, test, image, staging, smoke, approve, prod, same sha. Start at the commit, never at the cluster poster.",
    watch:
      "Starting at Kubernetes. Start at the commit. Skipping tests because the cluster will crash anyway. Deploying latest. Rebuilding on the prod job. Smoke on localhost of the runner. A story with twenty tools and zero sha. Forgetting that Delivery may still wait for a human wave before the last truck."
  }, `# 1 git push origin main
# 2 on: push runs ci.yml
# 3 npm ci && npm test
# 4 docker build -t app:$SHA
# 5 deploy that $SHA
# 6 curl -f https://app/health`, "Most asked · Amazon · Google · Microsoft · Meta · Adobe"),

  Q(20, "intermediate", "How do you keep PR CI fast?", {
    problem:
      "A forty-minute pipeline. People merged without waiting. CI died as a social contract. Required checks became furniture. The factory used a banquet oven for every sip of soup. Reviewers stopped looking at the badge because lunch always won. A docs typo still baked a mobile image and the dock stayed busy with the wrong trucks.",
    what:
      "Unit tests on pull requests, cache keyed on the lockfile, cancel old runs, and path filters so a docs-only PR skips the image bake. That split lives in the pipeline file in Git. CI on a PR is a fast weigh station. Slow e2e and the full artifact bake can sit on main or night. CD still promotes a sha after merge. Concurrency throws away yesterday's dough when you push again.",
    solves:
      "Minutes, not lunch. People wait for the badge, so the lock on the dock still works. Interviewers hear a split: homework tonight, banquet Sunday. The factory grades what changed. Required PR CI stays short enough to remain a contract instead of furniture. A forty-minute spoon trains people to steal from the back door.",
    example:
      "Grade the homework tonight, banquet on Sunday. A teacher who cooks a wedding for every worksheet will watch students skip class. The weigh station is a spoon. The truck still only leaves with a stamped sha after merge. If only the menu typo changed, do not rebuild the hotel kitchen. The clerk cancels the old clipboard when a new draft arrives.",
    uses:
      "Busy repos on GitHub Actions and GitLab. Nx and Turborepo help when the factory is a monorepo. Amazon, Google, and Meta ask this after PR CI feels slow. Campus labs should keep the student badge under ten minutes or they will merge red. Path filters and concurrency belong in the same ci.yml.",
    watch:
      "Skipping the only test that catches the bug. Path filters that miss a shared library. Cancelling a production deploy with the same group as PR tests. Caching with a forever key. A required check that is the forty-minute banquet. People allowed to skip the badge because it was slow — fix the oven, do not unlatch the dock."
  }, `concurrency:
  group: ci-\${{ github.ref }}
  cancel-in-progress: true

on:
  pull_request:
    paths-ignore: ["docs/**", "*.md"]`, "Most asked · Amazon · Google · Meta"),

  Q(21, "intermediate", "What is a smoke test after deploy?", {
    problem:
      "kubectl apply exited zero. Users saw 500. The pipeline was green. CD had sent the truck and never tasted the plate. The weigh station had passed at build time, then nobody checked the table. Slack filled with screenshots while the badge smiled. Rollback waited for angry checkout instead of a red smoke step.",
    what:
      "A tiny real request after deploy: GET /health or a login, against the real URL of the room you just filled. Fail the job if it is not 200. That step lives in the pipeline file in Git as part of CD. CI already weighed the batch. The artifact is the sha you promoted. localhost on the runner is the kitchen sink, not the dining room. Newman collections belong here too.",
    solves:
      "Green means the app answers, not only that YAML was sent. You catch a crashed process before users do. Rollback can start from a red smoke. Interviewers hear table taste after the truck. The factory admits the cake is edible or it does not stamp the run as done. Staging and production both deserve a bite.",
    example:
      "Taste the plate at the table. The kitchen ticket can say sent while the dosa is cold. A clerk who only watches the printer will serve a 500. The weigh station already happened. This is the last bite before you tell guests the batch is live. If the bite fails, bring back yesterday's stamped box from the shelf, not a parking-lot cousin.",
    uses:
      "Every CD job on GitHub Actions, GitLab, and Jenkins. Newman, Playwright, or curl -f. Amazon, Microsoft, and Google ask what green means after apply. Campus labs can curl a compose URL as practice, then switch to staging. Kubernetes ready probes are cousins, not a replacement for a pipeline smoke. Taste the real table, not the runner's sink.",
    watch:
      "curl localhost in the runner. That is not production. continue-on-error on the smoke so the badge lies. A health endpoint that always returns 200 while checkout is 500. Smoking a mocked file. Forgetting the real host after a canary. Marking deploy success on apply exit code alone. The truck arrived is not the cake is edible."
  }, `- name: smoke
  run: curl -f https://api.example.com/health`, "Most asked · Amazon · Microsoft · Google"),

  Q(22, "beginner", "Why pin actions and image versions?", {
    problem:
      "actions/checkout at v1 floated. node:latest moved overnight. Monday CI was a different planet. The weigh station used a random sack of flour and blamed the dough. A green Friday became a red Monday with no app change. The factory recipe said flour and the truck brought a cousin brand the scale had never tasted.",
    what:
      "Pin checkout@v4, node 22, FROM node:22-alpine, a digest if you can. Reproducible runners and reproducible bakes. The pipeline file in Git should name versions the way the lockfile names packages. CI weighs the same kitchen it weighed last week. The artifact tag is still the git sha. CD promotes that sha, not a floating latest base. Pinning is how yesterday's recipe still cooks.",
    solves:
      "Yesterday's recipe still cooks. A red Monday is about your commit, not a surprise runner. Interviewers hear pin versus latest. The factory can replay a sha and get the same stamp. Rollback of the recipe is a revert of pinned versions, not a hunt through Docker Hub tags that already moved.",
    example:
      "The same brand of flour, not flour from a random sack. A baker who writes flour on the wall will bake a different cake every dawn. The weigh station still uses the scale. The lid is still the git sha. The truck still carries that lid. The sack on the shelf is labeled 22-alpine, not whatever arrived at the dock while you slept.",
    uses:
      "Every workflow and Dockerfile on GitHub Actions, GitLab, and Jenkins. Node, Python, and Go images. Amazon and Google ask this after why did CI break with no diff. Campus labs should pin from the first ci.yml so Monday is still the same classroom. Dependabot can bump pins on purpose instead of the planet drifting.",
    watch:
      "@master or :latest in production pipelines. Floating action major tags you never review. Pinning in CI but FROM latest in the Dockerfile, so the artifact still drifts. A digest nobody records. Skipping npm ci because the image already had node_modules. The parking-lot bake starts when the base image moved and you still tagged the box as the old sha's cousin."
  }, `- uses: actions/checkout@v4
- uses: actions/setup-node@v4
  with:
    node-version: "22"
# FROM node:22-alpine`, "Most asked · Amazon · Google"),

  Q(23, "intermediate", "How do you explain CI/CD in an interview?", {
    problem:
      "Candidates listed Jenkins, Kubernetes, and Terraform and never walked a commit to production. The whiteboard was a logo catalog. Interviewers asked for one story and got twenty tools. The factory tour never opened the door. Nobody named a pipeline file in Git, a sha on a lid, or a smoke at the table. Rollback was a shrug.",
    what:
      "Tell one story: pull request, required tests (CI, the weigh station in a pipeline file in Git), merge, build the artifact tagged with the sha, staging, smoke, optional approve (Delivery), production same sha (CD), rollback is the previous sha. Start at the commit. The box never gets a second bake. Draw the rooms. Add one number if you have it, such as PR CI is four minutes. That is the tour, not the catalog.",
    solves:
      "You sound like you have shipped, not memorized logos. Follow-ups already have a map: secrets, needs, latest, flakes. Interviewers let you write YAML next. The factory picture survives GitHub or GitLab. Campus labs can rehearse this minute until it is muscle. You can stop after the rollback lid and still have answered CI/CD.",
    example:
      "A factory tour, not a tool catalog. Door, scale, stamp, counter, table, shelf of old lids. Guests do not need the brand of the oven. They need to see the same boxed dosa move from weigh to truck. If they ask for Kubernetes, it is one room on the tour, not the front gate. Last week's lid is still on the shelf when they ask how you roll back.",
    uses:
      "Amazon, Google, Microsoft, Meta, Uber, Adobe — every DevOps and SDE loop. GitHub Actions, GitLab CI, Jenkins — same walk. Onsite whiteboards and phone screens both want this minute. First-week onboarding should be this tour before anyone is handed a cluster. Draw it even if they only asked what is CI/CD.",
    watch:
      "Twenty tools, zero numbers. Add PR CI is four minutes if you have it. Starting at Kubernetes. Forgetting the sha. Rebuilding for prod in the story. No smoke. No rollback lid. Saying we do CD without delivery versus deployment. A catalog of Terraform modules with no weigh station. The parking-lot bake sneaking back in as we rebuild with prod flags."
  }, `# say this order
# PR  →  npm test (required)
# merge → docker build app:$SHA
# staging → curl /health
# prod (approve) → same $SHA
# bad? → deploy previous $SHA`, "Most asked · Amazon · Google · Microsoft · Meta · Uber · Adobe"),

  Q(24, "intermediate", "Monorepo: do you test everything on every PR?", {
    problem:
      "A docs typo ran a thirty-minute mobile suite. People merged without waiting. The weigh station treated a menu change as a hotel rebuild. Shared libraries still needed a vote, but the cafe menu did not. The factory had one giant scale for every hallway. CI died as a social contract while the real bug lived in a package nobody retested.",
    what:
      "Path filters or a change-detection job: test only the apps that changed, plus shared libs that sit under them. The pipeline file in Git lists paths. CI stays a fast weigh station on the pull request. The artifact bake for an unchanged app can wait. CD still promotes each app's own sha when that app actually moved. Nx and Turborepo compute the graph so a db package change still wakes the api tests.",
    solves:
      "Fast PRs, still safe when a shared package moves. Interviewers hear graph, not skip everything. The factory rebuilds the hotel only when the hotel's foundation moved. Required checks can target the jobs that matter for that change. People wait for the badge again because the spoon is a spoon, not a wedding.",
    example:
      "If only the cafe menu changed, do not rebuild the hotel. The clerk still weighs the soup if the shared spice rack moved. The truck for the hotel stays parked. The truck for the cafe carries a new stamped menu sha. Guests in the hotel still eat last week's hotel lid, which is correct. A typo on the menu should not wake the bakery at 3am.",
    uses:
      "Nx, Turborepo, and paths in GitHub Actions. Google, Meta, and Uber live in monorepos and ask this. Campus labs with apps/ and packages/ should filter early. GitLab rules:changes is the same idea. Docker builds per app still tag with the git sha when that app ships. Rebuild the hotel only when its foundation moved.",
    watch:
      "Skipping the shared library's dependents. A paths filter that forgets packages/db. A required check that always waits on the mobile suite even for docs. Change detection that compares the wrong base branch. Caching a stale graph. Deploying every app because one README moved. The parking-lot bake of the whole city for a cafe typo."
  }, `on:
  pull_request:
    paths:
      - "apps/api/**"
      - "packages/db/**"`, "Most asked · Google · Meta · Uber"),

  Q(25, "beginner", "What if CI is red?", {
    problem:
      "People merged anyway or disabled the check to unblock. The robot was furniture. Main took a wet batch and the truck left. A flake was treated as weather. Real failures hid behind reruns. The factory unlatched the dock because the scale was inconvenient. Monday checkout was the first honest test, and the badge had trained everyone to ignore red.",
    what:
      "Red means do not merge. Read the log. Fix the test or the app. Re-run only if the runner died. CI is the weigh station in the pipeline file in Git; a red ticket is the lock working. CD does not start, and a red run is not a stamped box you promote. Reproduce locally, push the fix, and keep required checks on. Quarantine a flake with an owner — do not skip the scale.",
    solves:
      "The badge stays a contract. Reviewers trust green. Interviewers hear you will not merge red. The factory truck waits. Rollback stays a rare fire, not a daily habit caused by ignoring the scale. Campus labs learn the right muscle: open the first failed step, not the skip button. Main remains a line of lids the counter already tasted.",
    example:
      "A failed weigh-station. The truck waits. A driver who likes the paint job still needs a green ticket. Rerunning the scale without fixing the wet dough is hoping toast will stop the alarm. Last week's stamped box stays on the shelf until this batch actually passes. The clerk does not disable the scale to unblock lunch.",
    uses:
      "Daily team habit on GitHub, GitLab, and Jenkins. Amazon, Google, and Microsoft ask this as a culture question after what is CI. Incident reviews start here: was main red, and did someone skip the check. Campus labs should treat a red badge as a failed lab, not extra credit to ignore.",
    watch:
      "Skipping the check. Rerunning a flake until green without a fix. continue-on-error on tests. Merging with admin override and no write-up. Pushing --no-verify as a lifestyle. Disabling the required job overnight and forgetting. Shipping a red artifact because CD did not need: test. The parking-lot bake of a hotfix that never went through the scale."
  }, `# open the red job → first failed step
# reproduce: npm ci && npm test
# push the fix — do not merge red`, "Most asked · Amazon · Google · Microsoft")
];

const data = { kind: "practice", notes, examples, questions };
const out = path.join(__dirname, "..", "frontend", "data", "cicd.js");
fs.writeFileSync(
  out,
  "window.PREP_DATA = window.PREP_DATA || {};\n" +
    'window.PREP_DATA["cicd"] = ' +
    JSON.stringify(data, null, 2) +
    ";\n"
);
console.log(
  "wrote",
  out,
  "notes",
  notes.length,
  "examples",
  examples.length,
  "questions",
  questions.length,
  "field words min",
  Math.min(..._counts),
  "max",
  Math.max(..._counts)
);
