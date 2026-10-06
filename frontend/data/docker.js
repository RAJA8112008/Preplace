window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA.docker = {
  "notes": [
    {
      "title": "Container vs VM",
      "body": "The problem before\nYou call a container a tiny VM. You expect a Windows guest on a Linux engine. You think each container has its own kernel.\n\nWhat this is\nA container is an isolated process that shares the host kernel. A virtual machine includes a guest operating system and fake hardware. Namespaces hide names. cgroups set limits. Containers start faster and pack denser. They are not as strong a security wall as a hypervisor.\n\nWhat it solves\nYou pack many shops in one building (one kernel). You still know when you truly need a second building (a VM).\n\nReal-life example\nA cubicle in a shared library (container) versus a whole house with its own plumbing (VM). Same building electricity in the cubicle. The house has its own fuse box.\n\nUses\nWhat is Docker? interviews. Choosing container vs VM for another OS.\n\nWatch out\nExpecting a Windows container on Linux Docker Engine without a VM. Treating isolation as a hypervisor wall."
    },
    {
      "title": "Image vs container",
      "body": "The problem before\nYou store a database on the writable layer, delete the container, and the diary is gone. Or you edit the Dockerfile and expect running containers to change.\n\nWhat this is\nAn image is a frozen layered filesystem plus a default command — the cake from the recipe. A container is one running or stopped instance with a writable top layer. Many containers can come from one image.\n\nWhat it solves\nThe image stays clean. You can open many meals from one frozen lunch. Writes you care about go on a volume.\n\nReal-life example\nCookie cutter (image) versus one cookie with crumbs (container). The cutter stays clean. Crumbs live on the cookie unless you put a real plate under it.\n\nUses\nbuild vs run. Interviews: image vs container in one minute.\n\nWatch out\nDeleting a container and losing data that was only on the writable layer. Editing the recipe and not baking again."
    },
    {
      "title": "Dockerfile",
      "body": "The problem before\nYou have no recipe. Each laptop installs Node their way. Or you COPY . with secrets and git junk in the suitcase.\n\nWhat this is\nA Dockerfile is the recipe that bakes an image. FROM picks the starting kitchen. COPY and RUN add files and install steps, each as a layer. ENV, USER, and CMD (or ENTRYPOINT) set runtime config, the user, and the start command.\n\nWhat it solves\nThe same box runs on any machine that can run that image. You ship a recipe and a frozen snapshot, not install Node my way.\n\nReal-life example\nA lunchbox recipe card: starting kitchen, grocery list, bake steps, who wears the badge, what you eat when you open it.\n\nUses\nEvery app you containerize. Interviews: FROM, RUN, CMD, COPY.\n\nWatch out\nOrder that busts cache. No .dockerignore so secrets enter the suitcase. Editing the file and expecting live containers to change."
    },
    {
      "title": "Layers & cache",
      "body": "The problem before\nYou COPY . first, then npm ci. Every typo reinstalls the world. Or you RUN rm .env and believe the password left the image.\n\nWhat this is\nEach Dockerfile instruction can become a layer. Changing an early line invalidates later cache. Copy the dependency list before the full source so install layers reuse. Deleting a file in a later layer does not remove it from an earlier layer's bytes.\n\nWhat it solves\nBuilds stay fast. You plan the stack so secrets never become a layer.\n\nReal-life example\nStacked transparencies. Covering a password with a blank sheet does not shred the sheet underneath. The grocery list layer stays cached while you change the garnish.\n\nUses\nAny production Dockerfile. Interviews: why copy package.json first.\n\nWatch out\nSecrets in layers. COPY . first. Two apt-get RUNs so flyers stay in sheet 1."
    },
    {
      "title": "Compose",
      "body": "The problem before\nYou docker run five containers by hand with forgotten networks. Or you treat Compose as Kubernetes for many offices.\n\nWhat this is\nCompose is a YAML seating chart for several containers: app, database, cache. services, networks, and volumes live in one file. up opens the office. down closes cubicles. Named volumes usually survive down unless you ask to smash them.\n\nWhat it solves\nA laptop stack starts together. Service names resolve on the project hallway. Good for local. Not a multi-datacenter orchestrator.\n\nReal-life example\nOne shop floor plan: cashier (api), register (db), a named locker for the books. Open the shutters (up). Close the cubicles (down). Do not smash the locker unless you said -v.\n\nUses\nLocal MERN stacks. Interviews: Compose vs Swarm vs k8s.\n\nWatch out\ndown -v on a laptop that held the only Postgres. Treating Compose as production Kubernetes."
    },
    {
      "title": "Volumes",
      "body": "The problem before\nPostgres data lived on the throwaway plate. You removed the container. The shop forgot every order.\n\nWhat this is\nA volume is a real plate for data you care about. Named volumes persist after the container is deleted. A bind mount maps a host folder, useful in development. The container filesystem is throwaway unless you mount something.\n\nWhat it solves\nThe cupboard labeled pgdata keeps the notebook. Dev can bind ./src for a live notebook. Databases belong on a named volume, not on the writable layer.\n\nReal-life example\nA named locker in the back room versus crumbs on the table. Delete the cubicle and the locker is still there — unless you smashed lockers on purpose.\n\nUses\nDatabases, uploads, anything that must survive recreate.\n\nWatch out\ndown -v. Bind-mounting over /app and hiding node_modules. Anonymous volumes you cannot find later."
    },
    {
      "title": "Networks",
      "body": "The problem before\nThe api uses localhost:5432 for Postgres. That localhost is the api cubicle itself. Or neighbors use the published street port instead of the hallway name.\n\nWhat this is\nA Docker network is a hallway. Compose makes a project network so services resolve by name: db is a DNS name. Publish ports with host:container for the street door. Neighbors should use the hallway name and the container port.\n\nWhat it solves\napi talks to db:5432. Your laptop tools use the street door. Two different doors, two different visitors.\n\nReal-life example\nHallway nameplates (db, redis) versus the street number on the building. Staff walk the hallway. Customers use the street door.\n\nUses\nCompose stacks. Interviews: published port vs internal DNS.\n\nWatch out\nlocalhost inside a container is that container. Mapping the wrong room port. Publishing every backend port to the world."
    },
    {
      "title": "Registry",
      "body": "The problem before\nOnly your laptop has the cake. The server says image not found. Or you tag only latest and nobody knows which bytes production runs.\n\nWhat this is\nA registry is a warehouse for images: Docker Hub, GHCR, ECR. You build, tag, push, and pull. A tag is a sticky note that can move. A digest is a fingerprint of exact bytes.\n\nWhat it solves\nCI bakes, uploads, the cluster downloads. Pin versions in production. Login so private pulls work.\n\nReal-life example\nA supermarket shelf. The sticky note latest can move to a new cake tomorrow. The fingerprint is this exact cake.\n\nUses\nAny deploy that is not only on my machine. Interviews: tag vs digest, Hub rate limits.\n\nWatch out\nlatest with IfNotPresent. Committing the registry password. Pulling a name you never pushed."
    },
    {
      "title": "Security",
      "body": "The problem before\nThe process wears uid 0. Secrets are baked into layers. Port 80 bind failure and someone sets privileged: true.\n\nWhat this is\nRun as a non-root USER. Scan images for known holes. Do not bake secrets into layers. A read-only root filesystem forces logs onto stdout or a volume. Small bases reduce what an attacker finds.\n\nWhat it solves\nA breakout as USER app is still bad. A breakout as root is worse. Rotating a password does not require rebaking if it was never in the cake.\n\nReal-life example\nDrop the master key (USER). Do not print the till code on the recipe card. A tiny empty room (distroless) has fewer tools for a thief. alpine uses musl and can break some native Node plugs.\n\nUses\nProduction Dockerfiles. CI scan gates. Interviews: USER, secrets, privileged.\n\nWatch out\nCOPY .env. privileged: true on the product API. alpine for a glibc native module."
    },
    {
      "title": "Multi-stage",
      "body": "The problem before\nProduction ships the workshop: compilers, npm, and a 1GB cake. Or you copy node_modules from Debian builder into alpine runtime and native addons crash.\n\nWhat this is\nA multi-stage build uses two FROM blocks. The builder stage has compilers and npm. The runtime stage copies only the artifact into a slim image. COPY --from names the stage.\n\nWhat it solves\nThe showroom does not ship the workshop tools. The cake stays a weekend bag.\n\nReal-life example\nBake in the back kitchen (builder). Carry only the finished plates to the dining room (runtime). Leave the oven behind.\n\nUses\nNode dist/, Go binaries, any compile-then-run app.\n\nWatch out\nUsing the fat builder as production because it already runs. Mixing libc between stages."
    },
    {
      "title": "Logs & exec",
      "body": "The problem before\ndocker logs is empty because the app only writes /var/log/app.log inside the cubicle. Or you exec and apt-get tools, then the next container has none of that.\n\nWhat this is\nContainer logs are the waiter notebook: the engine copies stdout and stderr. exec starts a visitor in the same namespaces; the app stays pid 1. PID 1 must hear stop signals, or stop becomes a kill after a timeout. Distroless images may have no shell to visit.\n\nWhat it solves\n12-factor apps print to stdout so the notebook has pages. You peek without replacing the cook.\n\nReal-life example\nThe waiter copies what the cook shouts (stdout). A visitor can walk the cubicle. The cook is still pid 1 and must hear the fire alarm (TERM).\n\nUses\nDebugging, interviews: logs vs files, exec vs PID 1, distroless.\n\nWatch out\nFile-only logs that die with the container. Production config via exec. npm start as pid 1 swallowing TERM."
    },
    {
      "title": "Interview habit",
      "body": "The problem before\nYou recite docker run -d -p -e -v. The interviewer wanted isolation, layers, and where data lives.\n\nWhat this is\nExplain recipe (Dockerfile), cake (image), meal (container), plate (volume), hallway (network). Say why data must live in volumes. Know CMD versus ENTRYPOINT and why exec form matters for PID 1.\n\nWhat it solves\nA one-minute map. Kubernetes is many offices later. You tell a story, not a flag dump.\n\nReal-life example\nThe interviewer is a new shift manager. You walk the floor: recipe, frozen lunch, one meal, real plate, hallway nameplates. You do not recite oven knob numbers.\n\nUses\nEvery Docker interview closer. Same story when you teach a teammate.\n\nWatch out\nOnly listing commands. Forgetting to say where the database notebook lives."
    }
  ],
  "questions": [
    {
      "id": 1,
      "level": "beginner",
      "q": "What is Docker?",
      "a": "Docker packages an app with its runtime so the same box runs on any machine that can run that image.\nYou ship a recipe and a frozen snapshot, not 'install Node my way.' The recipe bakes an image. An image starts a container.\nIn the code:\nFROM is the starting kitchen (node 20 alpine). WORKDIR is the cutting board. COPY package.json brings the grocery list. Commented RUN would bake dependencies. COPY . . brings source. Commented CMD is what runs when you open the box. The last comment is recipe -> image -> container.\nA common mistake is calling Docker a tiny virtual machine. It shares the host kernel.",
      "code": "# a lunchbox recipe (Dockerfile is the recipe card)\nFROM node:20-alpine          # the kitchen you start from\nWORKDIR /app                 # the cutting board\nCOPY package.json .\n# RUN npm ci                 # bake dependencies into the box\nCOPY . .\n# CMD [\"node\", \"server.js\"]  # what the lunch is when you open it\n# the idea: recipe -> image (frozen lunch) -> container (eating it)"
    },
    {
      "id": 2,
      "level": "beginner",
      "q": "What is a container?",
      "a": "A container is an isolated process with its own view of files, pids, and often network.\nLinux namespaces make the costume. cgroups set CPU and memory limits. It is not a tiny VM. It shares the host kernel.\nIn the code:\nimage has layers and default_cmd node server.js. container is based_on that image, has a writable_layer (scratch paper), process node as pid 1, and limits. The last comment says same library building, different cubicle.\nA common mistake is thinking each container has its own Linux kernel. Only a VM does that.",
      "code": "# image vs one running cubicle\nimage:\n  layers: [\"os bits\", \"node\", \"your app\"]\n  default_cmd: [\"node\", \"server.js\"]\n\ncontainer:\n  based_on: image\n  writable_layer: \"scratch paper on top\"\n  process: \"node as pid 1 inside the cubicle\"\n  limits: \"cgroup memory/cpu\"\n# same library building (host kernel), different cubicle"
    },
    {
      "id": 3,
      "level": "beginner",
      "q": "container vs virtual machine?",
      "a": "A VM includes fake hardware and a guest kernel. A container uses the host Linux kernel and only packs the app layers.\nVMs isolate more strongly and boot slower. Containers start fast and pack denser. Another kernel (Windows guest on Linux) needs a VM.\nIn the code:\nvm has hardware_fake true, guest_kernel yes, size large, boot slow. container has hardware_fake false, guest_kernel no, size small, boot fast.\nA common mistake is expecting a Windows container on a Linux Docker Engine without a VM in between.",
      "code": "# two packing styles\nvm:\n  hardware_fake: true\n  guest_kernel: \"yes (Windows on Linux hypervisor, etc.)\"\n  size: \"large\"\n  boot: \"slow\"\n\ncontainer:\n  hardware_fake: false\n  guest_kernel: \"no — uses the host Linux kernel\"\n  size: \"small\"\n  boot: \"fast\""
    },
    {
      "id": 4,
      "level": "beginner",
      "q": "image vs container?",
      "a": "An image is a frozen layered filesystem plus a default command. A container is one instance with a writable top layer and a lifecycle (running or stopped).\nThe image stays clean. Crumbs (logs, temp files) live on the container unless you mount a volume.\nIn the code:\nimage app:1.0 has read_only_layers base, deps, app_code and metadata cmd. container app-a is from that image, extra_writable crumbs, state running or stopped. The last comment says crumbs live on the cookie unless you mount a plate.\nA common mistake is storing a database on the writable layer, then deleting the container and losing the data.",
      "code": "# cookie cutter vs cookie\nimage \"app:1.0\":\n  read_only_layers:\n    - base\n    - deps\n    - app_code\n  metadata:\n    cmd: [\"node\", \"server.js\"]\n\ncontainer \"app-a\":\n  from: \"app:1.0\"\n  extra_writable: \"crumbs (logs, temp files)\"\n  state: \"running | stopped\"\n# image stays clean; crumbs live on the cookie unless you mount a plate (volume)"
    },
    {
      "id": 5,
      "level": "beginner",
      "q": "What is a Dockerfile?",
      "a": "A Dockerfile is a list of steps to bake an image. Each step can become a layer. The file is not the cake. The built image is the cake.\nYou later name that cake with a tag.\nIn the code:\nFROM python 3.12 slim is the kitchen. WORKDIR /srv. COPY requirements.txt. Commented RUN pip install bakes libs. COPY app.py. Commented CMD python app.py. The last comment says the card is baked into an image named something:tag.\nA common mistake is editing the Dockerfile and expecting running containers to change. You must bake again and start a new container.",
      "code": "# Dockerfile = recipe card\nFROM python:3.12-slim      # start with a known kitchen\nWORKDIR /srv\nCOPY requirements.txt .\n# RUN pip install -r requirements.txt   # bake libs into a layer\nCOPY app.py .\n# CMD [\"python\", \"app.py\"]\n# later: this card is baked into an image named something:tag"
    },
    {
      "id": 6,
      "level": "beginner",
      "q": "FROM?",
      "a": "FROM chooses the starting image: OS bits plus maybe Node or Python. Pin a version. latest moves under your feet.\nYour app sits on someone else's layers. distroless is an almost empty runtime.\nIn the code:\nFROM node:20-alpine is a named version. Commented FROM node:latest is shaky. Commented distroless is an almost empty apartment. WORKDIR /app follows.\nA common mistake is FROM ubuntu:latest in production and getting a surprise kernel-userland mismatch months later. Pin the tag.",
      "code": "# pick a starting kitchen, with a version pin\nFROM node:20-alpine        # good: named version\n# FROM node:latest         # shaky: the furniture can change overnight\n# FROM gcr.io/distroless/nodejs20  # almost empty apartment, tiny runtime\nWORKDIR /app"
    },
    {
      "id": 7,
      "level": "beginner",
      "q": "RUN vs CMD vs ENTRYPOINT?",
      "a": "RUN happens while baking the image (install packages). CMD is the default command when a container starts. ENTRYPOINT is the main program; CMD can be default arguments.\nTogether at start they become the process, here node server.js.\nIn the code:\nCommented RUN apk add is factory, baked into the image. ENTRYPOINT node is the waiter. CMD server.js is the default argument. The last comment says at start: node server.js.\nA common mistake is putting npm install in CMD so every start reinstalls instead of baking once with RUN.",
      "code": "# factory vs restaurant\nFROM node:20-alpine\n# RUN apk add --no-cache python3     # factory: baked into the image\nWORKDIR /app\nCOPY . .\n# ENTRYPOINT [\"node\"]                # waiter: always this program\n# CMD [\"server.js\"]                  # default argument (the plate)\n# at start: node server.js"
    },
    {
      "id": 8,
      "level": "beginner",
      "q": "CMD exec vs shell form?",
      "a": "Exec form is a JSON array: the program is pid 1 and hears SIGTERM. Shell form is a string that wraps through /bin/sh, which may eat the stop signal.\nThe array is about who holds the microphone, not about JSON fashion.\nIn the code:\nCommented exec form CMD [node, server.js] — Node is pid 1. Shell form CMD node server.js — sh is pid 1, Node is a child. The last comment says who holds the microphone.\nA common mistake is shell form, then wondering why stop always waits and then kills.",
      "code": "# two ways to write the last line\n# exec form — Node is pid 1, hears TERM\n# CMD [\"node\", \"server.js\"]\n\n# shell form — sh is pid 1, Node is a child\n# CMD node server.js\n\n# the array is not \"JSON for fun\"; it is \"who holds the microphone\""
    },
    {
      "id": 9,
      "level": "beginner",
      "q": "COPY vs ADD?",
      "a": "COPY copies files from the build context into the image. ADD can also unpack tar and fetch URLs, which surprises people.\nPrefer COPY unless you really want unpack-or-download.\nIn the code:\nCOPY package.json and COPY src are explicit papers. Commented ADD app.tar.gz may auto-unpack. Commented ADD https://... downloads at bake time.\nA common mistake is ADD of a zip you did not mean to unpack, so the image layout looks 'random.'",
      "code": "# explicit papers\nFROM alpine\nWORKDIR /app\nCOPY package.json /app/          # just copy this file\nCOPY src/ /app/src/              # just copy this folder\n# ADD app.tar.gz /app/           # may auto-unpack — surprising\n# ADD https://example.com/a /app # download at bake time — also surprising"
    },
    {
      "id": 10,
      "level": "beginner",
      "q": "WORKDIR?",
      "a": "WORKDIR sets the current directory for later COPY, RUN, and CMD paths.\nA relative COPY then lands in that folder. Later RUN lines also start there.\nIn the code:\nWORKDIR /app. COPY package.json . means /app/package.json. COPY server.js . CMD node server.js looks for /app/server.js. Later RUN lines also start on /app.\nA common mistake is mixing WORKDIR /app with COPY to /usr/src/app and then CMD cannot find the file.",
      "code": "FROM node:20-alpine\nWORKDIR /app                 # cutting board\nCOPY package.json .          # means /app/package.json\nCOPY server.js .\n# CMD [\"node\", \"server.js\"]  # looks for /app/server.js\n# later RUN lines also start on /app"
    },
    {
      "id": 11,
      "level": "beginner",
      "q": "ENV vs ARG?",
      "a": "ARG is a build-time only value (oven sticky note). ENV is baked into the image and visible at runtime (printed on the lunchbox).\nYou can copy ARG into ENV. Secrets in ARG can still land in layer history if you are careless. Prefer runtime injection for secrets.\nIn the code:\nARG NODE_ENV=production. ENV NODE_ENV gets that value. ENV PORT=3000. Commented ARG SECRET warns it can end up in layer history.\nA common mistake is ARG PASSWORD then RUN that uses it, then thinking the password is gone. History still has the layer.",
      "code": "FROM node:20-alpine\nARG NODE_ENV=production      # oven sticky note (build)\nENV NODE_ENV=$NODE_ENV       # printed on the lunchbox (runtime)\nENV PORT=3000\n# ARG SECRET=...             # still ends up in layer history if you are careless\n# prefer runtime env injection, not printed secrets"
    },
    {
      "id": 12,
      "level": "beginner",
      "q": "EXPOSE?",
      "a": "EXPOSE is documentation: the app listens on this port inside the container. It does not open a hole on the host by itself.\nHost mapping is a separate story (publish or Compose ports).\nIn the code:\nENV PORT=3000. EXPOSE 3000. Commented CMD node. The last comment says host mapping is a different story.\nA common mistake is EXPOSE 3000 and wondering why localhost:3000 on the laptop is closed. You still need publish.",
      "code": "# sign on the shop, not the street door\nFROM node:20-alpine\nENV PORT=3000\nEXPOSE 3000                  # documentation: app listens on 3000 inside\n# CMD [\"node\", \"server.js\"]\n# host mapping is a different story (Compose ports or publish)"
    },
    {
      "id": 13,
      "level": "beginner",
      "q": "docker build?",
      "a": "docker build reads the Dockerfile (recipe) plus a context folder (ingredient box) and produces an image (cake) with a tag (name).\nCOPY can only see files that were in that box.\nIn the code:\nComments name Dockerfile as recipe, context directory . as ingredient box. COPY package.json and COPY src must be in the box. tag is the cake's name app:1.0.2.\nA common mistake is running build from the wrong folder so COPY cannot find package.json.",
      "code": "# build is: recipe + ingredient box -> cake\n# Dockerfile          = recipe\n# context directory . = ingredient box (only what COPY needs)\n#\n# FROM node:20-alpine\n# COPY package.json .    # this file must be in the box\n# COPY src ./src\n#\n# tag is the cake's name: app:1.0.2"
    },
    {
      "id": 14,
      "level": "beginner",
      "q": "What is the build context?",
      "a": "The build context is the suitcase sent to the builder. COPY only sees what is in it. Huge .git or node_modules make the suitcase slow and can leak files into the image if you COPY .\n.dockerignore is the do-not-pack list.\nIn the code:\ncontext_folder is . accidentally_in_suitcase lists .git, node_modules, .env. needed is package.json and src/. The last comment names .dockerignore.\nA common mistake is COPY . with no ignore file, baking secrets and node_modules into a 1GB cake.",
      "code": "# suitcase handed to the baker\ncontext_folder: \".\"\naccidentally_in_suitcase:\n  - .git\n  - node_modules\n  - .env\nneeded:\n  - package.json\n  - src/\n# .dockerignore is the \"do not pack\" list for this suitcase"
    },
    {
      "id": 15,
      "level": "beginner",
      "q": ".dockerignore?",
      "a": ".dockerignore lists paths that must not enter the build suitcase.\nThe baker never sees those paths. .env and .git belong here almost always.\nIn the code:\nThe list is .git, node_modules, npm-debug.log, .env, coverage, dist, .idea. The last comment says the baker never sees these paths.\nA common mistake is ignoring dist while your CMD runs from dist, so the image has no app to start. Ignore only what the recipe does not COPY.",
      "code": "# .dockerignore — packing NO list\n.git\nnode_modules\nnpm-debug.log\n.env\ncoverage\ndist\n.idea\n# the baker never sees these paths in the suitcase"
    },
    {
      "id": 16,
      "level": "beginner",
      "q": "docker run?",
      "a": "docker run creates a container from an image and starts it. That is a meal from a frozen lunch.\nstart later would chew again on an existing leftover box. run usually means create plus start.\nIn the code:\nimage app:1.0. container name app-a, env PORT 3000, published_port 8080 to 3000, empty mounts, cmd node server.js. Comments: run = create and start, start = chew again.\nA common mistake is run every time and creating dozens of leftover exited containers instead of start on the same name.",
      "code": "# from frozen lunch (image) to one meal (container)\nimage: \"app:1.0\"\ncontainer:\n  name: \"app-a\"\n  env: { PORT: \"3000\" }\n  published_port: \"8080 on host -> 3000 in cubicle\"\n  mounts: []\n  cmd: [\"node\", \"server.js\"]\n# run = create this meal and start chewing\n# start = chew again on a leftover meal box"
    },
    {
      "id": 17,
      "level": "beginner",
      "q": "-p 8080:80?",
      "a": "Publish mapping host:container is a street door to a room port. 8080:80 means laptop 8080 forwards to the process listening on 80 inside.\nAnother container on the Docker network uses the service name and the room port, not the street number.\nIn the code:\nhost door 8080, container process_listens 80. Browser on laptop uses host 8080. Another container uses hostname:80.\nA common mistake is mapping 8080:8080 while the app listens on 80, then the street door hits an empty room.",
      "code": "# hotel map\nhost:\n  door: 8080                 # street\ncontainer:\n  process_listens: 80        # room\n\n# browser on laptop -> host:8080 -> room 80\n# another container on the docker network -> hostname:80 (the room)"
    },
    {
      "id": 18,
      "level": "beginner",
      "q": "-e and --env-file?",
      "a": "Runtime env (-e or env_file) clips variables when the container starts. They are not baked into the image.\nDo not COPY .env into the Dockerfile. That prints secrets into layers.\nIn the code:\nCompose api image app:1.0, environment NODE_ENV and PORT. Commented env_file is the same idea for many keys. The last comment says do not COPY .env into the Dockerfile.\nA common mistake is baking .env at build time, then rotating the password in the file and wondering why the container still has the old one.",
      "code": "# clip a form at open-time (Compose teaching YAML)\nservices:\n  api:\n    image: app:1.0\n    environment:\n      NODE_ENV: production\n      PORT: \"3000\"\n    # env_file: .env.runtime    # same idea, many keys\n    # do not COPY .env into the Dockerfile"
    },
    {
      "id": 19,
      "level": "beginner",
      "q": "docker ps vs ps -a?",
      "a": "docker ps lists running containers. ps -a includes leftover boxes that exited.\nImages are the cutters, listed separately.\nIn the code:\nrunning has api and redis Up. all_tables also has job Exited 0. The last comment says images list would be cutters app:1.0, redis:7.\nA common mistake is thinking a container vanished because ps (without -a) hid an Exited box that still holds the writable layer.",
      "code": "# two guest lists\nrunning:\n  - { name: \"api\",   status: \"Up\" }\n  - { name: \"redis\", status: \"Up\" }\nall_tables:\n  - { name: \"api\",   status: \"Up\" }\n  - { name: \"job\",   status: \"Exited 0\" }   # leftover box\n# images list would be cutters: app:1.0, redis:7"
    },
    {
      "id": 20,
      "level": "beginner",
      "q": "docker logs?",
      "a": "docker logs is stdout and stderr copied by the engine. 12-factor apps print to stdout.\nIf the app only writes /var/log/app.log inside the cubicle, the waiter notebook is empty unless that path is mounted.\nIn the code:\nComments show console.log to PORT. The engine copies that stream. If the app only writes a file inside, the notebook is empty.\nA common mistake is tailing docker logs while the process logs only to a file that dies with the container.",
      "code": "# 12-factor: the app speaks to stdout\n# server.js idea:\n#   console.log(\"listening on \" + process.env.PORT)\n# the engine copies that stream into \"container logs\"\n#\n# if the app only writes /var/log/app.log inside the cubicle\n# the waiter notebook is empty unless that path is mounted"
    },
    {
      "id": 21,
      "level": "beginner",
      "q": "docker exec?",
      "a": "docker exec starts a visitor process in the same namespaces as the running container. pid1 stays the app.\nProduction config belongs in the image or Compose, not in visitors. distroless images may have no sh to visit.\nIn the code:\ncontainer api pid1 node server.js with namespaces. exec is a visitor sh. The last comments say sh may not exist in distroless, and production config does not belong in visitors.\nA common mistake is exec and apt-get installing tools, then the next new container from the image has none of that.",
      "code": "# same cubicle, extra visitor\ncontainer \"api\":\n  pid1: \"node server.js\"\n  namespaces: { pid, net, mnt }\n\n# exec is a visitor process in those same namespaces\nvisitor: \"sh\"   # may not exist in distroless\n# production config belongs in the image/compose, not in visitors"
    },
    {
      "id": 22,
      "level": "beginner",
      "q": "docker stop vs kill?",
      "a": "stop sends SIGTERM to pid 1, waits, then SIGKILL. kill (the engine kill) is SIGKILL now.\nNode should listen for SIGTERM, close the HTTP server, then exit 0. If pid 1 is a shell that ignores TERM, you always wait then get KILL.\nIn the code:\nComments: stop is TERM then wait then KILL. kill is KILL now. Node should listen for SIGTERM and close. If pid 1 is a shell, you always wait then get KILL.\nA common mistake is stop on a shell-form CMD and calling Docker broken because shutdown is never graceful.",
      "code": "# doorbells on pid 1\n# stop:  TERM -> wait N seconds -> KILL\n# kill:  KILL now\n\n# Node should:\n#   listen for SIGTERM\n#   close the HTTP server\n#   then exit 0\n# if pid 1 is a shell that ignores TERM, you always wait then get KILL"
    },
    {
      "id": 23,
      "level": "intermediate",
      "q": "Why is PID 1 special?",
      "a": "PID 1 is the teacher inside the container: it must hear SIGTERM and reap dead children.\nIf a shell is pid 1, Node may never hear the fire alarm. Exec-form CMD or tini as pid 1 fixes that.\nIn the code:\nbad CMD through a shell, sh is pid 1. good CMD array, node is pid 1. also ENTRYPOINT tini then node. Teacher jobs: hear SIGTERM, wait on dead children.\nA common mistake is npm start as pid 1, which may swallow TERM depending on npm version and scripts.",
      "code": "# who is the teacher?\n# bad:  CMD node server.js through a shell -> sh is pid 1\n# good: CMD [\"node\", \"server.js\"]          -> node is pid 1\n# also: ENTRYPOINT [\"tini\", \"--\"] then node\n#\n# teacher jobs:\n#   1. hear SIGTERM (fire alarm)\n#   2. wait() on dead children (collect slips)"
    },
    {
      "id": 24,
      "level": "intermediate",
      "q": "tini?",
      "a": "tini is a tiny pid-1 helper: it forwards the fire alarm to Node and reaps zombie children.\nMany official images already bake a similar monitor. You put tini as ENTRYPOINT, then CMD is the app.\nIn the code:\nFROM node alpine. ENTRYPOINT tini --. CMD node server.js. Comments: fire alarm -> tini -> Node, dead children tini reaps.\nA common mistake is adding tini but still using shell-form CMD, so the chain is messy again.",
      "code": "FROM node:20-alpine\n# tini as the hall monitor\n# ENTRYPOINT [\"tini\", \"--\"]\n# CMD [\"node\", \"server.js\"]\n#\n# fire alarm -> tini -> Node\n# dead child processes -> tini reaps them\n# many official images already bake a similar monitor"
    },
    {
      "id": 25,
      "level": "intermediate",
      "q": "image layers?",
      "a": "Image layers are stacked transparencies. Each instruction can add a layer id. The container adds a writable top.\nDeleting a file in a new layer only covers it. The old layer still has the bytes, so secrets can remain.\nIn the code:\nlayers aaa FROM alpine, bbb RUN apk add nodejs, ccc COPY app.js. container_top wr1 writable crumbs. Deleting app.js in a new layer only covers it; layer ccc still has the bytes.\nA common mistake is RUN rm .env in a later layer and believing the password is gone from the image.",
      "code": "# stacked transparencies\nlayers:\n  - id: aaa  from: \"FROM alpine\"\n  - id: bbb  from: \"RUN apk add nodejs\"\n  - id: ccc  from: \"COPY app.js\"\ncontainer_top:\n  id: wr1\n  writable: true    # crumbs\n# deleting app.js in a new layer only covers it; layer ccc still has the bytes"
    },
    {
      "id": 26,
      "level": "intermediate",
      "q": "How do you use the build cache well?",
      "a": "Cache-friendly order: copy the lockfile, install, then copy source that changes often.\nIf you COPY . first, every typo busts the install layer and you reinstall npm every build.\nIn the code:\nCOPY package.json package-lock.json first. Commented RUN npm ci cached if lockfile unchanged. COPY . . last. The last comment says COPY . first busts the install layer.\nA common mistake is COPY . . then RUN npm ci in that order.",
      "code": "# cache-friendly order\nFROM node:20-alpine\nWORKDIR /app\nCOPY package.json package-lock.json .   # changes rarely\n# RUN npm ci                            # cached if lockfile unchanged\nCOPY . .                                # your source, changes often\n# CMD [\"node\", \"server.js\"]\n# if you COPY . first, every typo busts the install layer"
    },
    {
      "id": 27,
      "level": "intermediate",
      "q": "multi-stage build?",
      "a": "A multi-stage build has a builder FROM and a runtime FROM. You copy only artifacts across with COPY --from.\nWorkshop tools stay in builder. Runtime is the showroom.\nIn the code:\nFROM node:20 AS builder, COPY, commented npm ci && build. FROM node:20-alpine AS runtime, COPY --from=builder dist and package.json. Commented USER node and CMD dist/server.js.\nA common mistake is copying node_modules from a Debian builder into an alpine runtime, then native addons crash.",
      "code": "# workshop then showroom\nFROM node:20 AS builder\nWORKDIR /src\nCOPY . .\n# RUN npm ci && npm run build\n\nFROM node:20-alpine AS runtime\nWORKDIR /app\nCOPY --from=builder /src/dist ./dist\nCOPY --from=builder /src/package.json .\n# USER node\n# CMD [\"node\", \"dist/server.js\"]\n# workshop tools stay in builder; runtime is the showroom"
    },
    {
      "id": 28,
      "level": "intermediate",
      "q": "alpine vs debian slim vs distroless?",
      "a": "alpine is small and uses musl libc. debian slim uses glibc, a bit larger, fewer native-module surprises. distroless is almost empty: no shell, tiny, harder to peek.\nPick based on native addons and how you debug.\nIn the code:\nThree commented FROM lines: alpine loft musl, bookworm-slim glibc, distroless empty room no sh. WORKDIR /app.\nA common mistake is alpine for a module that ships glibc binaries, then 'works on my laptop' with debian Node.",
      "code": "# three apartments\n# FROM node:20-alpine           # loft, musl, sometimes native addon pain\n# FROM node:20-bookworm-slim    # standard glibc wiring, a bit larger\n# FROM gcr.io/distroless/nodejs20  # empty room: no sh, tiny, harder peek\nWORKDIR /app"
    },
    {
      "id": 29,
      "level": "intermediate",
      "q": "Why might alpine break a Node module?",
      "a": "alpine uses musl. Some Node native addons (bcrypt, sharp) compile or ship for glibc. The plug does not fit.\nA debian slim base often fixes it without changing your app code.\nIn the code:\nCommented FROM alpine RUN npm ci, bcrypt/sharp compiled for glibc != musl. Then FROM bookworm-slim RUN npm ci, the plug fits. WORKDIR /app.\nA common mistake is chasing Node version when the real mismatch is musl vs glibc.",
      "code": "# the plug story\n# FROM node:20-alpine\n# RUN npm ci\n#   bcrypt / sharp / some native addons:\n#     compiled for glibc  !=  musl libc in Alpine\n#\n# FROM node:20-bookworm-slim    # same recipe, standard libc\n# RUN npm ci                    # the plug fits\nWORKDIR /app"
    },
    {
      "id": 30,
      "level": "intermediate",
      "q": "USER instruction?",
      "a": "USER switches the process away from root (uid 0) to a named user in the image.\nCOPY --chown should match that user so the app can read its files. The process then wears that badge.\nIn the code:\nCOPY --chown=node:node . . USER node. Commented CMD node. The process wears the node badge, not uid 0.\nA common mistake is USER node after COPY as root without chown, then EACCES on the files.",
      "code": "FROM node:20-alpine\nWORKDIR /app\nCOPY --chown=node:node . .\nUSER node                    # take off the master key\n# CMD [\"node\", \"server.js\"]\n# the process now wears the node badge, not uid 0"
    },
    {
      "id": 31,
      "level": "intermediate",
      "q": "Why not run as root?",
      "a": "Root in a container is still a powerful uid on Linux, especially if someone escapes the namespaces.\nA breakout as USER app is still bad. A breakout as root is worse. Drop root on purpose.\nIn the code:\naddgroup/adduser app, COPY --chown=app, USER app. Comments: breakout wearing USER app is still bad; wearing root is worse.\nA common mistake is 'it is only a container' and leaving USER root because a folder was owned by root.",
      "code": "FROM node:20-alpine\nRUN addgroup -S app && adduser -S app -G app\nWORKDIR /app\nCOPY --chown=app:app . .\nUSER app\n# a breakout wearing USER app is still bad\n# a breakout wearing root is worse"
    },
    {
      "id": 32,
      "level": "intermediate",
      "q": "What is a volume?",
      "a": "A volume is a plate Docker manages so data outlives the container. Named volumes have a label you can find.\nDeleting the container does not smash a named volume. The writable layer is still throwaway.\nIn the code:\nCompose db postgres:16, volumes pgdata to /var/lib/postgresql/data. volumes pgdata {}. Comments: deleting the container does not smash pgdata.\nA common mistake is bind-mounting a Windows path into Postgres data and getting permission or lock weirdness. Prefer a named volume for the engine data dir.",
      "code": "# Compose: a named plate for Postgres\nservices:\n  db:\n    image: postgres:16\n    volumes:\n      - pgdata:/var/lib/postgresql/data   # the cupboard plate\nvolumes:\n  pgdata: {}\n# deleting the container does not smash pgdata\n# the writable layer of the container is still throwaway"
    },
    {
      "id": 33,
      "level": "intermediate",
      "q": "bind mount vs volume?",
      "a": "A bind mount maps a host path into the container (your notebook, good for dev). A named volume is a Docker locker. tmpfs is RAM scratch.\nDev binds source. Production images COPY source and use named volumes only for data.\nIn the code:\napi volumes ./src:/app/src bind, pgdata named locker, tmpfs /tmp. volumes pgdata {}.\nA common mistake is bind-mounting over /app and hiding the image's node_modules with an empty host folder.",
      "code": "services:\n  api:\n    image: app:dev\n    volumes:\n      - ./src:/app/src           # bind: your notebook on the desk (dev)\n      - pgdata:/var/lib/pg       # named locker (data)\n      - type: tmpfs\n        target: /tmp             # RAM scratch\nvolumes:\n  pgdata: {}"
    },
    {
      "id": 34,
      "level": "intermediate",
      "q": "Why is DB data lost when I remove a container?",
      "a": "If database files lived only on the container writable layer, remove the container and the diary is gone.\nThe volumes line puts the notebook in a cupboard named pgdata.\nIn the code:\ndb postgres:16, pgdata mounted at postgresql data. volumes pgdata {}. Comments: without the volumes line the diary was throwaway; with it the notebook stays.\nA common mistake is docker compose down -v which also smashes named lockers, then 'Docker ate my database.'",
      "code": "services:\n  db:\n    image: postgres:16\n    volumes:\n      - pgdata:/var/lib/postgresql/data\nvolumes:\n  pgdata: {}\n# without the volumes line, the diary was on the throwaway plate\n# with it, the notebook stays in the cupboard named pgdata"
    },
    {
      "id": 35,
      "level": "intermediate",
      "q": "anonymous vs named volumes?",
      "a": "An anonymous volume has a random id, hard to find later. A named volume has a label like pgdata.\nPrefer the labeled locker for anything you care about.\nIn the code:\nFirst volumes line is /var/lib/postgresql/data with no name (anonymous). Commented named pgdata. volumes pgdata {}. Prefer the labeled locker.\nA common mistake is anonymous volumes piling up after every compose up, filling the disk with mystery lockers.",
      "code": "services:\n  db:\n    image: postgres:16\n    volumes:\n      - /var/lib/postgresql/data          # anonymous: random locker number\n      # - pgdata:/var/lib/postgresql/data  # named: you can find it\nvolumes:\n  pgdata: {}\n# prefer the labeled locker for anything you care about"
    },
    {
      "id": 36,
      "level": "intermediate",
      "q": "Docker networks?",
      "a": "Docker networks are hallways. Compose creates a project bridge network so services have DNS names.\nhost mode sits on the laptop's street. none is no hallway and no street.\nIn the code:\napi and db on backend. networks backend driver bridge, private hallway with DNS names api, db. Comments contrast host and none.\nA common mistake is creating a second custom network and forgetting to attach db, then name db does not resolve.",
      "code": "services:\n  api:\n    networks: [backend]\n  db:\n    networks: [backend]\nnetworks:\n  backend:\n    driver: bridge          # private hallway with DNS names api, db\n# host: would mean \"sit on the street with the laptop\"\n# none: no hallway, no street"
    },
    {
      "id": 37,
      "level": "intermediate",
      "q": "Why can service A reach service B by name in Compose?",
      "a": "Compose DNS: the service name is the hostname on the project network. Use db:5432, the hallway name plus the room port.\nlocalhost inside api is api itself, not the database. The host-published 5432 is for your laptop tools, not for neighbors.\nIn the code:\napi DATABASE_URL postgres://db:5432/app. Commented localhost URL is wrong. db ports 5432:5432 is the street door for laptop tools. Neighbors use db:5432.\nA common mistake is DATABASE_URL=localhost:5432 inside the api container.",
      "code": "services:\n  api:\n    environment:\n      DATABASE_URL: postgres://db:5432/app   # hallway name + ROOM port\n    # DATABASE_URL: postgres://localhost:5432  # wrong: api's own cubicle\n  db:\n    image: postgres:16\n    ports:\n      - \"5432:5432\"   # street door for your laptop tools\n# neighbors use db:5432, not the street"
    },
    {
      "id": 38,
      "level": "intermediate",
      "q": "host network mode?",
      "a": "host network mode shares the host's network stack. The process bind of 3000 is the host's 3000. Compose ports and EXPOSE are not the hallway story anymore.\nUse it as an exception, not the office floor plan. Isolation is weaker.\nIn the code:\napi network_mode host. Comments: EXPOSE and ports are not the hallway story. process bind 3000 -> host 3000. Use as an exception.\nA common mistake is host mode plus ports: which then confuse you because mapping is skipped.",
      "code": "services:\n  api:\n    image: app:1.0\n    network_mode: host\n    # EXPOSE and ports: are not the hallway story anymore\n    # process bind 3000 -> host's 3000\n# use this as an exception, not the office floor plan"
    },
    {
      "id": 39,
      "level": "beginner",
      "q": "What is Docker Compose?",
      "a": "Compose is a seating chart YAML: several services, networks, volumes. up opens the office. down closes it.\nbuild: . bakes api. image: postgres pulls catering. depends_on is start order, not 'db is ready.'\nIn the code:\nservices api build . ports 3000, depends_on db. db postgres:16 with pgdata. volumes pgdata {}. Comments: up open, down close.\nA common mistake is treating Compose as production Kubernetes. It is one machine's seating chart.",
      "code": "# compose.yaml — seating chart\nservices:\n  api:\n    build: .\n    ports: [\"3000:3000\"]\n    depends_on: [db]\n  db:\n    image: postgres:16\n    volumes: [pgdata:/var/lib/postgresql/data]\nvolumes:\n  pgdata: {}\n# up is \"open the office\"; down is \"close the office\""
    },
    {
      "id": 40,
      "level": "beginner",
      "q": "docker compose up?",
      "a": "compose up creates networks, volumes, and starts services. -d returns your terminal. down stops and removes containers, usually keeping named volumes. down -v also smashes named lockers.\nThat last flag is how databases vanish.\nIn the code:\nComments describe up, up -d, down, down -v (pgdata gone). services api image app:1.0.\nA common mistake is aliasing down -v as 'clean everything' on a laptop that had real data in pgdata.",
      "code": "# lifecycle of a seating chart\n# up:    build hallway, place lockers, start api + db\n# up -d: same, you get your terminal back\n# down:  stop people, remove cubicles, keep named lockers (usually)\n# down -v: also smash the named lockers (pgdata gone)\nservices:\n  api:\n    image: app:1.0"
    },
    {
      "id": 41,
      "level": "intermediate",
      "q": "depends_on limitation?",
      "a": "depends_on without a health condition only waits until the container process starts, not until Postgres accepts connections.\ncondition: service_healthy waits for the healthcheck to pass. The app should still retry on connect.\nIn the code:\napi depends_on db condition service_healthy. db healthcheck pg_isready, interval 5s, retries 10.\nA common mistake is depends_on: [db] and then api crashing on first boot because Postgres was still starting.",
      "code": "services:\n  api:\n    depends_on:\n      db:\n        condition: service_healthy   # wait for the till, not just lights\n  db:\n    image: postgres:16\n    healthcheck:\n      test: [\"CMD-SHELL\", \"pg_isready -U postgres\"]\n      interval: 5s\n      retries: 10"
    },
    {
      "id": 42,
      "level": "intermediate",
      "q": "healthcheck?",
      "a": "A healthcheck is a pulse Docker runs inside the container. Exit 0 means healthy. Non-zero means sick.\nCompose and swarm can wait on that pulse. Kubernetes uses its own probes instead of this Dockerfile field, mostly.\nIn the code:\napi healthcheck CMD node fetch localhost:3000/health, interval 10s, timeout 3s, retries 3. 0 = healthy pulse.\nA common mistake is a healthcheck that hits a slow dependency, so a DB blip marks the whole api unhealthy forever.",
      "code": "services:\n  api:\n    image: app:1.0\n    healthcheck:\n      test: [\"CMD\", \"node\", \"-e\", \"fetch('http://localhost:3000/health').then(r=>process.exit(r.ok?0:1))\"]\n      interval: 10s\n      timeout: 3s\n      retries: 3\n# 0 = healthy pulse, non-zero = sick"
    },
    {
      "id": 43,
      "level": "intermediate",
      "q": "restart policies?",
      "a": "Restart policies decide if a dead container is reopened. no stays down. on-failure reopens on crash code not 0. always reopens even after engine reboot. unless-stopped is always except a deliberate close.\nA crash loop with always still reopens. Fix the crash.\nIn the code:\napi restart unless-stopped. Comments list no, on-failure, always, unless-stopped.\nA common mistake is always on a container that exits 0 on purpose (a one-shot job), so it runs forever.",
      "code": "services:\n  api:\n    image: app:1.0\n    restart: unless-stopped\n    # no            = stay down\n    # on-failure    = reopen if crash code != 0\n    # always        = reopen even after engine reboot\n    # unless-stopped = always, except a deliberate close"
    },
    {
      "id": 44,
      "level": "intermediate",
      "q": "compose profiles?",
      "a": "Compose profiles hide extra services until you ask for them. Default seating might only start api. profile debug also starts adminer.\nDev tools stay off the default chart.\nIn the code:\napi has no profile. adminer has profiles debug and ports 8080. Default seating: only api. profile debug: also adminer.\nA common mistake is putting redis behind a profile, then the api fails in default up because redis is missing.",
      "code": "services:\n  api:\n    image: app:1.0\n  adminer:\n    image: adminer\n    profiles: [\"debug\"]     # extra room\n    ports: [\"8080:8080\"]\n# default seating chart: only api\n# profile debug: also open adminer"
    },
    {
      "id": 45,
      "level": "intermediate",
      "q": "docker compose vs swarm vs k8s?",
      "a": "Compose is one machine / laptop. Swarm is a few Docker nodes with replicas. Kubernetes is a cluster with Deployment and Service YAML.\nScale of maps, not moral ranking. Start with Compose. Graduate when you have many machines.\nIn the code:\ncompose where one machine, file compose.yaml. swarm a few nodes. k8s a cluster, file Deployment / Service YAML.\nA common mistake is inventing a swarm because Kubernetes felt scary, then still needing Kubernetes later anyway.",
      "code": "# scale of maps\ncompose:\n  where: \"one machine / laptop\"\n  file: \"compose.yaml\"\nswarm:\n  where: \"a few Docker nodes\"\n  file: \"same compose-like ideas + replicas\"\nk8s:\n  where: \"a cluster\"\n  file: \"Deployment / Service YAML\""
    },
    {
      "id": 46,
      "level": "beginner",
      "q": "tag an image?",
      "a": "A tag is a sticky note on an image id. One cake (sha256) can have many notes: myapp:1.0.2, a registry path, and latest.\npush publishes the note plus the cake. latest can move tomorrow.\nIn the code:\nimage_id sha256:abc. tags myapp:1.0.2, ghcr.io/you/myapp:1.0.2, myapp:latest. push publishes the note and the cake.\nA common mistake is tagging only latest, then not knowing which bytes production runs.",
      "code": "# sticky notes on the same cake\nimage_id: \"sha256:abc...\"\ntags:\n  - \"myapp:1.0.2\"\n  - \"ghcr.io/you/myapp:1.0.2\"\n  - \"myapp:latest\"          # this note can move tomorrow\n# push publishes the note + the cake to a warehouse"
    },
    {
      "id": 47,
      "level": "intermediate",
      "q": "latest tag problem?",
      "a": "latest is a moving word. Yesterday it was sha256:old. Today it is sha256:new. A machine that does not re-pull still eats old.\nA version tag like 1.0.3 is a new word for a new cake.\nIn the code:\nyesterday latest old. today latest new, same word different cake. A cluster that does not re-pull still eats old. myapp:1.0.3 is a new word.\nA common mistake is deploy latest with imagePullPolicy IfNotPresent, so the node never fetches today's cake.",
      "code": "# two days, one word\nyesterday:\n  latest: \"sha256:old\"\ntoday:\n  latest: \"sha256:new\"     # same word, different cake\n# a cluster that does not re-pull still eats sha256:old\n# myapp:1.0.3 is a new word for a new cake"
    },
    {
      "id": 48,
      "level": "intermediate",
      "q": "image digest?",
      "a": "A digest is the image fingerprint: myapp@sha256:abc. A tag can be moved on the registry. Two pulls of the digest are the same bytes.\nKubernetes can pin the digest in the image field.\nIn the code:\ntag myapp:1.0.2 can be moved. digest myapp@sha256:abc123 is this exact cake. k8s image field can use the digest. two pulls of the digest are the same bytes.\nA common mistake is pinning a tag in production and then someone retags 1.0.2 to different bytes.",
      "code": "# nickname vs fingerprint\ntag:    \"myapp:1.0.2\"                 # can be moved on the registry\ndigest: \"myapp@sha256:abc123...\"      # this exact cake\n# k8s image field can use the digest form\n# two pulls of the digest are the same bytes"
    },
    {
      "id": 49,
      "level": "beginner",
      "q": "docker pull / push?",
      "a": "push uploads a tagged image to a registry. pull downloads it. CI bakes, uploads, the cluster downloads. Login is showing the warehouse your badge.\nWithout push, only your laptop has the cake.\nIn the code:\nlaptop_or_ci baked myapp:1.0.2 uploaded to ghcr. cluster downloaded the same name. login is showing the badge.\nA common mistake is pull on the server of a name you never pushed, then 'image not found' looks like a Kubernetes bug.",
      "code": "# warehouse flow (idea, not a command list)\nlaptop_or_ci:\n  baked: \"myapp:1.0.2\"\n  uploaded_to: \"ghcr.io/you/myapp:1.0.2\"\ncluster:\n  downloaded: \"ghcr.io/you/myapp:1.0.2\"\n# login is showing the warehouse your badge"
    },
    {
      "id": 50,
      "level": "intermediate",
      "q": "GHCR / ECR / Docker Hub?",
      "a": "Docker Hub, GHCR, and ECR are different shelves. Official Hub images live under library/. GHCR is GitHub membership. ECR is AWS.\nAnonymous Hub pulls have rate limits. CI should log in.\nIn the code:\nhub docker.io/library/node:20 with rate limits. ghcr.io/org/app. ecr 123.dkr.ecr... CI should use a logged-in shopper.\nA common mistake is CI pulling node:20 anonymously from Hub until the build fails with toomanyrequests.",
      "code": "# supermarket shelves\nhub:  \"docker.io/library/node:20\"     # rate limits for anonymous shoppers\nghcr: \"ghcr.io/org/app:1.0.2\"         # GitHub membership\necr:  \"123.dkr.ecr.region.amazonaws.com/app:1.0.2\"\n# CI should use a logged-in shopper, not a random passer-by"
    },
    {
      "id": 51,
      "level": "intermediate",
      "q": "How do you pass secrets at runtime?",
      "a": "Pass secrets at start time as environment or mounted secret files, not as COPY into the image.\nThe value is given when the container starts. Rotating it does not require rebaking the cake.\nIn the code:\napi environment DATABASE_URL from env at start, not baked. Commented secrets db_password swarm-style files. never COPY .env in the Dockerfile.\nA common mistake is ARG/ENV password in the Dockerfile, then rotating the password in a .env that the image never reads.",
      "code": "services:\n  api:\n    image: app:1.0\n    environment:\n      DATABASE_URL: env.DATABASE_URL   # given at start, not baked in image\n    # secrets: [db_password]            # swarm-style files\n    # never: COPY .env .  in the Dockerfile"
    },
    {
      "id": 52,
      "level": "advanced",
      "q": "secrets in image layers?",
      "a": "A secret copied into an early layer stays in that layer even if a later RUN rm covers the file.\nThe stack still has layer 2. Better: a secret mount during bake is a hose, not a sheet.\nIn the code:\nlayer 2 COPY .env, layer 5 RUN rm .env only covers the top. better RUN --mount=type=secret npm ci. the secret is a hose during bake, not a sheet.\nA common mistake is docker history and thinking rm made the password unrecoverable. It did not.",
      "code": "# stacked sheets\n# layer 2: COPY .env .          # password is here\n# layer 5: RUN rm .env          # only covers the top\n# the stack still has layer 2\n#\n# better: RUN --mount=type=secret,id=npm  npm ci\n# the secret is a hose during bake, not a sheet"
    },
    {
      "id": 53,
      "level": "intermediate",
      "q": "BuildKit?",
      "a": "BuildKit is the modern builder: cache mounts, secret mounts, and parallel stages.\nA cache mount is a spice drawer reused across bakes. A secret mount never becomes a layer sheet.\nIn the code:\nsyntax dockerfile:1, COPY lockfiles, commented RUN --mount=type=cache npm ci and RUN --mount=type=secret npmrc. cache mount spice drawer, secret mount spice that never becomes a sheet.\nA common mistake is disabling BuildKit and losing those mounts, then putting secrets back in ENV.",
      "code": "# syntax=docker/dockerfile:1\nFROM node:20-alpine\nWORKDIR /app\nCOPY package.json package-lock.json .\n# RUN --mount=type=cache,target=/root/.npm npm ci\n# RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm ci\n# cache mount = spice drawer reused across bakes\n# secret mount = spice that never becomes a layer sheet"
    },
    {
      "id": 54,
      "level": "intermediate",
      "q": "RUN --mount=type=cache?",
      "a": "RUN --mount=type=cache keeps a folder (like npm's cache) between builds without storing it as a permanent layer of your app.\n/root/.npm is the spice rack. /app/node_modules is still in the cake if you installed into /app.\nIn the code:\nCOPY lockfiles then commented RUN --mount=type=cache target /root/.npm npm ci --omit=dev. Comments distinguish spice rack vs node_modules in the cake.\nA common mistake is cache-mounting /app/node_modules and then wondering why a fresh image has no modules. That mount is not a layer.",
      "code": "# syntax=docker/dockerfile:1\nFROM node:20-alpine\nWORKDIR /app\nCOPY package.json package-lock.json .\n# RUN --mount=type=cache,target=/root/.npm \\\n#     npm ci --omit=dev\n# /root/.npm is the spice rack\n# /app/node_modules is still in the cake if you installed here"
    },
    {
      "id": 55,
      "level": "beginner",
      "q": "docker inspect?",
      "a": "inspect prints the nutrition label: image, IP, env, mounts. If PORT is missing there, the process never saw it.\nYou are reading facts, not changing them.\nIn the code:\ncontainer image app:1.0, ip 172.18.0.4, env PORT and NODE_ENV, mounts pgdata to postgres data. If PORT is missing here, the process never saw it.\nA common mistake is exporting PORT in your laptop shell and expecting inspect on the container to show it. Clip env on the container.",
      "code": "# a nutrition label (idea of inspect JSON)\ncontainer:\n  image: \"app:1.0\"\n  ip: \"172.18.0.4\"\n  env: [\"PORT=3000\", \"NODE_ENV=production\"]\n  mounts:\n    - { source: \"pgdata\", dest: \"/var/lib/postgresql/data\" }\n# if PORT is missing here, the process never saw it"
    },
    {
      "id": 56,
      "level": "beginner",
      "q": "docker stats?",
      "a": "stats shows live CPU and memory per container. Without a memory limit, 800Mi can become all RAM.\nCompose deploy.resources or engine limits are the breaker. Kubernetes later uses requests/limits on the same idea.\nIn the code:\napi 120% CPU 800Mi, db 4% 200Mi. If api has no memory limit, 800Mi can become all RAM.\nA common mistake is watching laptop Activity Monitor only, which mixes Docker Desktop's VM with your browsers.",
      "code": "# power meters\n# NAME   CPU    MEM\n# api    120%   800Mi\n# db     4%     200Mi\n# if api has no memory limit, 800Mi can become \"all RAM\"\n# Compose deploy.resources or engine limits are the breaker"
    },
    {
      "id": 57,
      "level": "intermediate",
      "q": "memory and CPU limits?",
      "a": "Memory and CPU limits are cgroup breakers on the cubicle. mem_limit 512m is a RAM fuse. cpus 0.50 is half a CPU.\nThe process can still try to use more RAM and then get killed (OOM).\nIn the code:\napi mem_limit 512m, cpus 0.50. idea: breaker at 512Mi RAM and half a CPU. Kubernetes later uses requests/limits.\nA common mistake is setting CPU limit tiny, then calling the API 'slow' when it is throttled on purpose.",
      "code": "services:\n  api:\n    image: app:1.0\n    mem_limit: 512m\n    cpus: 0.50\n    # idea: breaker at 512Mi RAM and half a CPU\n    # Kubernetes later uses requests/limits on the same idea"
    },
    {
      "id": 58,
      "level": "intermediate",
      "q": "OOM in a container?",
      "a": "OOM in a container means the process crossed mem_limit. Node heap plus native memory counts.\nrestart policy may reopen the shop, then blow again. The diary is often exit 137, not a nice stack trace.\nIn the code:\napi mem_limit 256m. Node heap + native > 256m, fuse blows. restart may reopen then blow again. diary exit 137.\nA common mistake is raising the limit forever instead of finding a leak or a missing --max-old-space-size plan.",
      "code": "services:\n  api:\n    image: app:1.0\n    mem_limit: 256m\n# Node heap + native memory > 256m -> fuse blows\n# restart policy may reopen the shop, then blow again\n# the diary: exit 137, not a nice stack trace"
    },
    {
      "id": 59,
      "level": "intermediate",
      "q": "exit code 137?",
      "a": "Exit 137 is 128+9, SIGKILL, often OOM. 143 is 128+15, SIGTERM, a polite stop. 0 is finished the recipe.\nIf api restarts with 137, look at mem_limit and leaks, not a missing semicolon.\nIn the code:\n0 finished, 143 SIGTERM, 137 SIGKILL often OOM. if api restarts with 137, look at mem_limit and leaks.\nA common mistake is googling 'Node 137' as an application error code in your source. It is a signal math story.",
      "code": "# exit codes as stories\n# 0   = finished the recipe\n# 143 = 128+15 SIGTERM (polite stop)\n# 137 = 128+9  SIGKILL (force, often OOM)\n#\n# if api restarts with 137, look at mem_limit and leaks\n# not at a missing semicolon"
    },
    {
      "id": 60,
      "level": "intermediate",
      "q": "read-only root filesystem?",
      "a": "A read-only root filesystem refuses writes into the image layers. Put scratch on tmpfs and uploads on a volume. Logs go to stdout.\nTries to write /var/log inside the image will fail — that is the point.\nIn the code:\napi read_only true, tmpfs /tmp, volumes uploads:/app/uploads. volumes uploads {}. tries to write logs into /var/log inside the image will fail; put logs on stdout.\nA common mistake is read_only without a writable /tmp, then the app crashes creating temp files.",
      "code": "services:\n  api:\n    image: app:1.0\n    read_only: true\n    tmpfs:\n      - /tmp\n    volumes:\n      - uploads:/app/uploads\nvolumes:\n  uploads: {}\n# tries to write logs into /var/log inside the image will fail — good, put logs on stdout"
    },
    {
      "id": 61,
      "level": "intermediate",
      "q": "capabilities?",
      "a": "Linux capabilities are extra keys beyond uid. cap_drop ALL then cap_add only what you need, such as NET_BIND_SERVICE to listen on 80.\nThe cubicle does not get the whole master ring. Combine with a non-root user.\nIn the code:\ncap_drop ALL, cap_add NET_BIND_SERVICE, user 1000:1000. the cubicle does not get the whole master ring.\nA common mistake is privileged: true because bind on 80 failed, instead of NET_BIND_SERVICE or listening on 3000.",
      "code": "services:\n  api:\n    image: app:1.0\n    cap_drop: [\"ALL\"]\n    cap_add: [\"NET_BIND_SERVICE\"]   # only the \"listen on 80\" key\n    user: \"1000:1000\"\n# the cubicle does not get the whole master ring"
    },
    {
      "id": 62,
      "level": "advanced",
      "q": "privileged container?",
      "a": "privileged: true gives the container almost host-level keys. Nested Docker demos use it. A normal api must stay false.\nIf api is privileged, a bug is a host problem.\nIn the code:\ndind privileged true loaded gun. api privileged false normal shop. if api is privileged, a bug is a host problem.\nA common mistake is copying a compose snippet for dind into the product API.",
      "code": "services:\n  dind:\n    image: docker:dind\n    privileged: true          # loaded gun — nested engine demos\n  api:\n    image: app:1.0\n    privileged: false         # normal shop\n# if api is privileged, a bug is a host problem"
    },
    {
      "id": 63,
      "level": "intermediate",
      "q": "Docker socket mount risk?",
      "a": "Mounting /var/run/docker.sock gives a container the host engine's control panel. It can start a privileged container on the HOST.\nThat is not a cubicle anymore. It is the building keys. CI helpers sometimes do this; treat it as root on the host.\nIn the code:\nci-helper volume docker.sock. this helper can create a privileged container on the HOST. not a cubicle; building keys.\nA common mistake is mounting the socket 'so the app can build images' in production.",
      "code": "services:\n  ci-helper:\n    image: docker:cli\n    volumes:\n      - /var/run/docker.sock:/var/run/docker.sock  # the control panel\n# this helper can create a privileged container on the HOST\n# that is not a cubicle anymore; it is the building keys"
    },
    {
      "id": 64,
      "level": "intermediate",
      "q": "image scanning?",
      "a": "Image scanning looks for known CVEs in packages inside the cake. A CI gate can fail the PR on CRITICAL findings.\nA red sticker blocks the merge. Scanning is not a substitute for running as non-root.\nIn the code:\nTeaching CI: checkout, trivy image myapp:ci --severity CRITICAL --exit-code 1. a red sticker blocks the merge.\nA common mistake is scanning latest on Monday and shipping an unscanned rebuild on Friday with the same tag.",
      "code": "# CI gate (teaching YAML)\n# name: scan\n# on: pull_request\n# jobs:\n#   trivy:\n#     steps:\n#       - uses: actions/checkout@v4\n#       - run: trivy image myapp:ci --severity CRITICAL --exit-code 1\n# a red sticker blocks the merge"
    },
    {
      "id": 65,
      "level": "beginner",
      "q": "How do you write a Dockerfile for a Node app?",
      "a": "A solid Node Dockerfile pins FROM, sets WORKDIR, copies the lockfile first, installs, copies source, USER node, EXPOSE, exec-form CMD.\nLockfile first is cache. USER drops the master key. Array CMD is pid 1.\nIn the code:\nFROM alpine, WORKDIR /app, COPY package.json package-lock.json, commented npm ci --omit=dev, COPY . ., USER node, EXPOSE 3000, commented CMD array. lockfile first, USER, array CMD.\nA common mistake is CMD npm start as root with COPY . including .env.",
      "code": "FROM node:20-alpine\nWORKDIR /app\nCOPY package.json package-lock.json .\n# RUN npm ci --omit=dev\nCOPY . .\nUSER node\nEXPOSE 3000\n# CMD [\"node\", \"server.js\"]\n# lockfile first = cache; USER = drop master key; array CMD = pid 1"
    },
    {
      "id": 66,
      "level": "intermediate",
      "q": "npm ci vs npm install in Docker?",
      "a": "npm ci installs exactly from the lockfile and fails if it does not match. npm install may rewrite the lockfile, messy in CI.\nThe lockfile must be in the suitcase. --omit=dev keeps test tools out of production cakes.\nIn the code:\nCOPY package.json package-lock.json (shopping list must be in the suitcase). commented npm ci exact list. commented npm install may rewrite the list. COPY . .\nA common mistake is npm install in Docker without copying package-lock.json, so every bake is a different tree.",
      "code": "FROM node:20-alpine\nWORKDIR /app\nCOPY package.json package-lock.json .   # shopping list must be in the suitcase\n# RUN npm ci --omit=dev                 # exact list\n# RUN npm install                       # may rewrite the list — messy in CI\nCOPY . ."
    },
    {
      "id": 67,
      "level": "intermediate",
      "q": "Why copy package.json separately?",
      "a": "Copy package.json (and the lockfile) in their own layer, install, then copy source that changes daily.\nThe slow oven (npm ci) stays cached while you tweak src.\nIn the code:\nCOPY package.json package-lock.json grocery list layer. commented RUN npm ci slow oven cached. COPY src garnish layer. commented CMD src/server.js.\nA common mistake is COPY . . before install, so editing README busts npm ci.",
      "code": "FROM node:20-alpine\nWORKDIR /app\nCOPY package.json package-lock.json .  # grocery list layer\n# RUN npm ci                           # slow oven, cached\nCOPY src ./src                         # garnish layer, changes daily\n# CMD [\"node\", \"src/server.js\"]"
    },
    {
      "id": 68,
      "level": "beginner",
      "q": "What is a registry namespace?",
      "a": "A registry namespace is the shelf address: host, owner, image name, then tag.\nofficial Hub library/nginx is not the same shelf as you/myapp. The last part is the sticky note.\nIn the code:\nofficial_hub docker.io/library/nginx:1.25. user_hub docker.io/you/myapp:1.0.2. github ghcr.io/org/myapp:1.0.2. last part tag, middle shelf owner.\nA common mistake is docker pull nginx thinking you pulled your app named nginx from GHCR. You pulled Hub's official nginx.",
      "code": "# postal addresses for cakes\nofficial_hub: \"docker.io/library/nginx:1.25\"\nuser_hub:     \"docker.io/you/myapp:1.0.2\"\ngithub:       \"ghcr.io/org/myapp:1.0.2\"\n# the last part is the sticky note (tag)\n# the middle is the shelf owner"
    },
    {
      "id": 69,
      "level": "intermediate",
      "q": "private registry auth in CI?",
      "a": "CI logs into a private registry with a token stored as a secret, then pulls. Kubernetes later uses imagePullSecrets on the ServiceAccount.\nNever commit ~/.docker/config.json. That file is a password pile.\nIn the code:\nenv REGISTRY_TOKEN secret. robot shows token to ghcr then pulls. k8s imagePullSecrets ghcr-creds. never commit config.json.\nA common mistake is echoing the token in CI logs 'for debug' and leaking it in the job transcript.",
      "code": "# CI story\n# env: REGISTRY_TOKEN  (secret)\n# the robot shows the token to ghcr.io, then pulls org/app:1.0.2\n# k8s later:\n#   imagePullSecrets: [{ name: ghcr-creds }]\n# never commit ~/.docker/config.json"
    },
    {
      "id": 70,
      "level": "intermediate",
      "q": "docker system prune?",
      "a": "prune throws dangling images and stopped containers away. Default prune does not smash named volumes. --volumes also smashes lockers — goodbye databases.\nKnow which trash you mean.\nIn the code:\ndangling_images leftover sheets, stopped_containers dirty tables, named_volumes pgdata. default prune trash and dirty tables. --volumes smash lockers.\nA common mistake is system prune -a --volumes on a laptop that held the only copy of postgres data.",
      "code": "# trash vs lockers\ndangling_images: \"<none> leftover sheets\"\nstopped_containers: \"dirty tables\"\nnamed_volumes: \"labeled lockers (pgdata)\"\n# default prune: trash and dirty tables\n# --volumes: also smash lockers — say goodbye to databases"
    },
    {
      "id": 71,
      "level": "beginner",
      "q": "dangling image?",
      "a": "A dangling image is a cake with no tag, often the previous build after you retagged app:1.0.2 onto a new id.\nprune throws unreferenced old cakes away. Named tags you still use are kept.\nIn the code:\nimages app:1.0.2 sha256:new and tags none sha256:old dangling. old is the previous cake without a note. prune throws unreferenced old cakes away.\nA common mistake is deleting by id and removing the image a running container still needs.",
      "code": "# after a rebuild\nimages:\n  - { tags: [\"app:1.0.2\"], id: \"sha256:new\" }\n  - { tags: [\"<none>\"],    id: \"sha256:old\" }   # dangling\n# old is the previous cake without a note\n# prune throws unreferenced old cakes away"
    },
    {
      "id": 72,
      "level": "intermediate",
      "q": "builder pattern vs multi-stage?",
      "a": "The old builder pattern was two Dockerfiles plus a script copying a binary. Multi-stage is one file, two FROM, COPY --from.\nSame idea: workshop then showroom, less glue.\nIn the code:\nFROM golang AS builder, COPY, commented go build -o /out/app. FROM distroless, COPY --from=builder /out/app /app. commented ENTRYPOINT /app.\nA common mistake is keeping the fat builder as the production image because 'it already runs.'",
      "code": "# old: two recipes, a script copies the binary\n# now: one file, two FROM\nFROM golang:1.22 AS builder\nWORKDIR /src\nCOPY . .\n# RUN go build -o /out/app\n\nFROM gcr.io/distroless/base-debian12\nCOPY --from=builder /out/app /app\n# ENTRYPOINT [\"/app\"]"
    },
    {
      "id": 73,
      "level": "intermediate",
      "q": "COPY --from?",
      "a": "COPY --from copies from another image or named stage, not from the build context suitcase.\nYou can borrow busybox for a debug stage, or copy /out/app from builder.\nIn the code:\nFROM alpine AS runtime. COPY --from=busybox /bin/busybox. commented COPY --from=builder /out/app. USER nobody. commented ENTRYPOINT.\nA common mistake is COPY --from=builder without naming AS builder on the first FROM, so the stage name does not exist.",
      "code": "FROM alpine AS runtime\n# borrow a binary from another image\nCOPY --from=busybox:1.36 /bin/busybox /bin/busybox\n# or from a stage:\n# COPY --from=builder /out/app /usr/local/bin/app\nUSER nobody\n# ENTRYPOINT [\"/usr/local/bin/app\"]"
    },
    {
      "id": 74,
      "level": "beginner",
      "q": "What does docker compose build do?",
      "a": "compose build only cooks services that have a build: kitchen. Services with only image: are pulled, not baked.\nThe image: name under a build service is the tag after bake.\nIn the code:\napi build context . dockerfile Dockerfile, image ghcr.io/you/api:dev name after bake. db image postgres:16 catering, no bake. compose build only cooks kitchens.\nA common mistake is compose build expecting postgres to rebuild. There is no kitchen.",
      "code": "services:\n  api:\n    build:\n      context: .\n      dockerfile: Dockerfile\n    image: ghcr.io/you/api:dev     # name after bake\n  db:\n    image: postgres:16             # catering from a warehouse, no bake\n# compose build only cooks services that have a kitchen (build:)"
    },
    {
      "id": 75,
      "level": "intermediate",
      "q": "dev bind mount workflow?",
      "a": "Dev bind mount puts your host ./src over /app/src so edits appear without rebuild. nodemon restarts the process. Production image has COPY src, no bind, and usually not nodemon as pid 1.\nThe two workflows are different meals.\nIn the code:\napi build ., volumes ./src:/app/src live notebook, command npx nodemon src/server.js. production image has COPY src, no bind, no nodemon as pid 1 if you can help it.\nA common mistake is shipping the compose dev bind chart to a server that has no ./src, so the mount is empty.",
      "code": "services:\n  api:\n    build: .\n    volumes:\n      - ./src:/app/src            # live notebook (dev only)\n    command: [\"npx\", \"nodemon\", \"src/server.js\"]\n# production image has COPY src, no bind, no nodemon as pid 1 if you can help it"
    },
    {
      "id": 76,
      "level": "intermediate",
      "q": "Docker Desktop vs Engine on Linux?",
      "a": "Docker Engine on Linux uses this machine's kernel. Docker Desktop on Mac/Windows runs Linux inside a VM (the dollhouse). Bind mounts cross that wall and can be slow.\nThe commands look the same. The kernel is not your Mac kernel.\nIn the code:\nmac_desktop your_os macOS, linux_kernel inside a VM. linux_engine your_os Linux, linux_kernel this machine. bind mounts cross the dollhouse wall, can be slow.\nA common mistake is 'Docker is slow on Mac' and rewriting the app, when the cost is file shares into the VM.",
      "code": "# where the kernel lives\nmac_desktop:\n  your_os: \"macOS\"\n  linux_kernel: \"inside a VM (the dollhouse)\"\nlinux_engine:\n  your_os: \"Linux\"\n  linux_kernel: \"this machine\"\n# bind mounts cross the dollhouse wall — can be slow"
    },
    {
      "id": 77,
      "level": "advanced",
      "q": "overlay2?",
      "a": "overlay2 is the usual storage driver: lower read-only image layers plus an upper writable layer, merged as /.\nMany containers share the same lower sheets. Crumbs are per container.\nIn the code:\nupper container writable crumbs. lower app COPY layer, npm layer, alpine layer. merged what the process sees as /. many containers share lower sheets. crumbs per container.\nA common mistake is filling the disk with overlay crumbs from thousands of leftover containers and blaming 'Docker is a black hole' without prune of stopped boxes.",
      "code": "# overlay2 is stacked sheets on disk\nupper: \"container writable crumbs\"\nlower: [\"app COPY layer\", \"npm layer\", \"alpine layer\"]\nmerged: \"what the process sees as /\"\n# many containers share the same lower sheets\n# crumbs are per container"
    },
    {
      "id": 78,
      "level": "intermediate",
      "q": "logging drivers?",
      "a": "A logging driver copies stdout. json-file is the default and can grow forever without max-size.\nSet rotation. Kubernetes later has the node agent ship those files.\nIn the code:\napi logging driver json-file, max-size 10m, max-file 3. without max-size the waiter notebook can eat the disk.\nA common mistake is a chatty app filling /var/lib/docker with json logs until the disk is 100%.",
      "code": "services:\n  api:\n    image: app:1.0\n    logging:\n      driver: json-file\n      options:\n        max-size: \"10m\"\n        max-file: \"3\"\n# without max-size, the waiter notebook can eat the disk\n# k8s: the runtime writes files the node agent ships"
    },
    {
      "id": 79,
      "level": "intermediate",
      "q": "docker cp?",
      "a": "docker cp copies files in or out of a running or stopped container. It is break-glass, not a pipeline.\nSlipped notes vanish when the cubicle is deleted unless a volume held them. Production should COPY in the Dockerfile.\nIn the code:\ncopy OUT container log to ./app.log. copy IN debug.sh to /tmp. production should COPY debug-free apps. slipped notes vanish when deleted unless a volume.\nA common mistake is a deploy process based on cp into a live container, then the next recreate loses the hack.",
      "code": "# break-glass, not a pipeline\n# copy OUT:  container:/var/log/app.log -> ./app.log\n# copy IN:   ./debug.sh -> container:/tmp/debug.sh\n#\n# production should COPY debug-free apps in the Dockerfile\n# slipped notes vanish when the cubicle is deleted (unless a volume)"
    },
    {
      "id": 80,
      "level": "beginner",
      "q": "How do you enter a crashing container?",
      "a": "A crashing container exits before you can exec. Override entrypoint to sh (if the image has a shell) so you can sit inside and read files. Better first: read logs. distroless: no sh — use logs or a debug sidecar.\nYou are turning on a lamp, not fixing production forever.\nIn the code:\nnormal CMD node exits 1 immediately. entrypoint sh lamp sit in the cubicle, then read files, env, missing deps. better first: logs. distroless no sh.\nA common mistake is restart: always on a crash loop, which hides the exit so you never read the first log line.",
      "code": "services:\n  api:\n    image: app:1.0\n    # normal: CMD node server.js  -> exits 1 immediately\n    entrypoint: [\"sh\"]            # lamp: sit in the cubicle\n    # then read files, env, missing deps\n# better first: read the waiter notebook (logs)\n# distroless: no sh — use logs or a debug sidecar"
    },
    {
      "id": 81,
      "level": "intermediate",
      "q": "entrypoint vs command override?",
      "a": "ENTRYPOINT is the waiter program. CMD is default arguments. A start override usually replaces CMD. Replacing ENTRYPOINT with sh changes the waiter; CMD may be ignored depending on form.\nCompose entrypoint and command map to those two knobs.\nIn the code:\nENTRYPOINT node, CMD server.js. extra worker.js -> node worker.js replaces CMD. replacing ENTRYPOINT with sh, waiter is now sh. Compose entrypoint and command.\nA common mistake is setting command: [\"--help\"] with an ENTRYPOINT that is not the app, so the flags go to the wrong program.",
      "code": "FROM node:20-alpine\n# ENTRYPOINT [\"node\"]\n# CMD [\"server.js\"]\n# start with extra \"worker.js\" -> node worker.js (replaces CMD)\n# replacing ENTRYPOINT with sh -> waiter is now sh, CMD may be ignored depending on form\n#\n# Compose:\n#   entrypoint: [\"node\"]\n#   command: [\"server.js\"]"
    },
    {
      "id": 82,
      "level": "intermediate",
      "q": "init containers in compose?",
      "a": "A one-shot migrate service with depends_on condition completed_successfully is Compose's janitor-then-cashiers pattern.\nDo not put migrate.js as the start of every api replica. Five replicas would race migrations.\nIn the code:\nmigrate command node migrate.js, restart on-failure. api depends_on migrate service_completed_successfully. janitor finishes then cashiers.\nA common mistake is migrate && server in the same CMD on a scaled service, so every replica migrates.",
      "code": "services:\n  migrate:\n    image: app:1.0\n    command: [\"node\", \"migrate.js\"]\n    restart: on-failure\n  api:\n    image: app:1.0\n    depends_on:\n      migrate:\n        condition: service_completed_successfully\n# janitor finishes; then cashiers\n# do not put migrate.js as the start of every api replica"
    },
    {
      "id": 83,
      "level": "beginner",
      "q": "What is a good .dockerignore list?",
      "a": "A good .dockerignore drops .git, node_modules, env files, coverage, editor folders, and extra Dockerfiles you do not COPY.\nIf you bake dist inside the image, also ignore a local dist/ that might be stale. Do not ignore files your COPY needs.\nIn the code:\nList .git, gitignore, node_modules, logs, .env, .env.*, coverage, idea, vscode, Dockerfile*, README.md. if you bake dist inside, also ignore local dist/.\nA common mistake is ignoring package-lock.json, then ci cannot see the lockfile.",
      "code": "# .dockerignore\n.git\n.gitignore\nnode_modules\nnpm-debug.log\n.env\n.env.*\ncoverage\n.idea\n.vscode\nDockerfile*\nREADME.md\n# if you bake dist inside, also ignore local dist/"
    },
    {
      "id": 84,
      "level": "advanced",
      "q": "reproducible builds?",
      "a": "Reproducible builds pin the base image digest, use a lockfile, and avoid unpinned apt-get that changes flour brands overnight.\nFROM image@sha256:... is an exact kitchen fingerprint. Unpinned apt-get update is not.\nIn the code:\nFROM node:20-alpine@sha256:abc exact kitchen. COPY lockfiles. commented npm ci lockfile pins npm world. commented apt-get unpinned flour brand changes. COPY . .\nA common mistake is pinning the app tag but FROM node:20 so the base still moves.",
      "code": "FROM node:20-alpine@sha256:abc...   # exact kitchen fingerprint\nWORKDIR /app\nCOPY package.json package-lock.json .\n# RUN npm ci --omit=dev              # lockfile pins npm world\n# RUN apt-get update && apt-get install foo  # unpinned: flour brand changes\nCOPY . ."
    },
    {
      "id": 85,
      "level": "intermediate",
      "q": "apt-get in Dockerfiles?",
      "a": "apt-get in Docker should be one RUN: update, install with no extra recommends, then delete apt lists in the same layer.\nTwo layers leave grocery flyers in sheet 1 even if sheet 2 deletes files.\nIn the code:\nFROM debian bookworm-slim. commented one RUN update, install ca-certificates, rm apt lists. one sheet: tools in, flyers out. two sheets: flyers stay in sheet 1.\nA common mistake is apt-get update in one RUN and install in another, so cache reuses a stale update layer.",
      "code": "FROM debian:bookworm-slim\n# RUN apt-get update \\\n#  && apt-get install -y --no-install-recommends ca-certificates \\\n#  && rm -rf /var/lib/apt/lists/*\n# one sheet: tools in, grocery flyers out\n# two sheets: flyers stay in sheet 1 even if sheet 2 deletes files"
    },
    {
      "id": 86,
      "level": "intermediate",
      "q": "HEALTHCHECK in Dockerfile?",
      "a": "HEALTHCHECK in a Dockerfile is the image's default pulse. Compose can use it. Kubernetes wants spec.containers[].readinessProbe (and liveness) instead.\nDo not assume k8s reads HEALTHCHECK.\nIn the code:\nCOPY . /app. commented HEALTHCHECK interval 10s CMD node fetch 127.0.0.1:3000/health. Compose reads this; Kubernetes wants readinessProbe.\nA common mistake is adding HEALTHCHECK and expecting kubectl to stop sending traffic. k8s did not look at that field.",
      "code": "FROM node:20-alpine\nCOPY . /app\n# HEALTHCHECK --interval=10s --timeout=3s \\\n#   CMD node -e \"fetch('http://127.0.0.1:3000/health').then(r=>process.exit(r.ok?0:1))\"\n# Compose reads this; Kubernetes wants spec.containers[].readinessProbe instead"
    },
    {
      "id": 87,
      "level": "beginner",
      "q": "How do you share an image without a registry?",
      "a": "save writes image bytes to a tar. load reads that tar on another machine. A registry is shelves with names and tags.\nUSB lasagna works for a demo. CI uses shelves.\nIn the code:\nsave image bytes -> app.tar. load app.tar -> image on the other laptop. registry ghcr.io/you/app:1.0.2 on shelves. USB works for a demo; CI uses shelves.\nA common mistake is emailing a 2GB tar every day instead of a registry.",
      "code": "# cooler vs supermarket\n# save: image bytes -> app.tar\n# load: app.tar -> image on the other laptop\n#\n# registry: ghcr.io/you/app:1.0.2 on shelves\n# USB lasagna works for a demo; CI uses shelves"
    },
    {
      "id": 88,
      "level": "intermediate",
      "q": "multi-arch images?",
      "a": "A multi-arch image is an index: one name, several cakes (amd64, arm64). An M1 laptop pulls the arm cake. An EC2 amd64 pulls the intel cake.\nCompose platform can force a foot, which may emulate and go slow.\nIn the code:\nindex myapp:1.0.2 linux/amd64 intel-cake, linux/arm64 apple-cake. M1 pulls apple. EC2 amd64 pulls intel. Compose platform linux/amd64 can force a foot, slow emulation.\nA common mistake is assuming one sha256 blob runs on every CPU architecture.",
      "code": "# one name, two cakes\nindex \"myapp:1.0.2\":\n  linux/amd64: \"sha256:intel-cake\"\n  linux/arm64: \"sha256:apple-cake\"\n# M1 laptop pulls apple-cake\n# EC2 amd64 pulls intel-cake\n# Compose platform: linux/amd64 can force a foot (slow emulation)"
    },
    {
      "id": 89,
      "level": "intermediate",
      "q": "why does an image work on my M1 and fail on the server?",
      "a": "Images are CPU-architecture specific. Bake on M1 and you often get linux/arm64. A linux/amd64 server then says exec format error.\nBake for the socket you will plug into, or publish a pair index.\nIn the code:\nFROM node alpine baked on M1 -> linux/arm64 by default. server linux/amd64 -> exec format error. bake platforms linux/amd64 or a pair index.\nA common mistake is 'it works in Docker Desktop' as proof it will run on the amd64 VM.",
      "code": "# FROM node:20-alpine\n# baked on M1 -> linux/arm64 by default\n# server: linux/amd64 -> \"exec format error\"\n#\n# bake for the socket you will plug into:\n#   platforms: linux/amd64\n# or a pair index for both feet"
    },
    {
      "id": 90,
      "level": "advanced",
      "q": "distroless debugging?",
      "a": "distroless has no shell and almost no OS tools. You cannot exec sh. Debug with stdout logs, or a second container with busybox sharing the network.\nThe showroom stays sealed on purpose.\nIn the code:\nFROM distroless nodejs20, COPY dist/server.js, commented USER nonroot CMD server.js. no /bin/sh. debug: stdout logs, or a second container with busybox sharing the network.\nA common mistake is FROM distroless then apt-get in the same stage. There is no apt there.",
      "code": "# sealed showroom\nFROM gcr.io/distroless/nodejs20\nCOPY dist/server.js /app/server.js\n# USER nonroot\n# CMD [\"server.js\"]\n# no /bin/sh in this apartment\n# debug: stdout logs, or a second container with busybox sharing the network"
    },
    {
      "id": 91,
      "level": "intermediate",
      "q": "12-factor and Docker?",
      "a": "Twelve-factor says config in env, logs to stdout, one process per service.\nA second process (cron) belongs in another cubicle or a Kubernetes CronJob, not stuffed beside the web server.\nIn the code:\napi environment DATABASE_URL postgres://db:5432/app. logs console.log -> stdout. db postgres. one process per service. a second process cron belongs in another cubicle.\nA common mistake is crond + node in one container, then logs and restarts become two stories in one pid 1.",
      "code": "services:\n  api:\n    image: app:1.0\n    environment:\n      DATABASE_URL: postgres://db:5432/app\n    # logs: console.log -> stdout\n  db:\n    image: postgres:16\n# one process per service\n# a second process (cron) belongs in another cubicle or a k8s CronJob"
    },
    {
      "id": 92,
      "level": "intermediate",
      "q": "PID 1 and Node?",
      "a": "If npm is pid 1, it may swallow SIGTERM and Node never hears the fire alarm. CMD [node, server.js] makes Node pid 1. server.js should listen for SIGTERM and server.close().\nThis is the same PID 1 lesson with a Node costume.\nIn the code:\nUSER node. commented CMD npm start may be pid 1 and swallow TERM. CMD node server.js Node hears the fire alarm. server.js process.on SIGTERM server.close.\nA common mistake is npm start in production Compose and then 10-second kills on every deploy.",
      "code": "FROM node:20-alpine\nWORKDIR /app\nCOPY . .\nUSER node\n# CMD [\"npm\", \"start\"]     # npm may be pid 1 and swallow TERM\n# CMD [\"node\", \"server.js\"] # Node hears the fire alarm\n# server.js: process.on(\"SIGTERM\", () => server.close())"
    },
    {
      "id": 93,
      "level": "beginner",
      "q": "What is docker compose watch / bind for hot reload?",
      "a": "Compose watch (or a bind + nodemon) syncs source into the container for a fast inner loop. package.json changes may rebuild.\nNeither is a Kubernetes rolling update. Production still bakes an image and rolls copies.\nIn the code:\ndevelop watch action sync path ./src target /app/src, rebuild on package.json. old classroom: bind ./src and nodemon. neither is a Kubernetes rolling update.\nA common mistake is using watch in production so a laptop folder is required on the server.",
      "code": "services:\n  api:\n    build: .\n    develop:\n      watch:\n        - action: sync\n          path: ./src\n          target: /app/src\n        - action: rebuild\n          path: package.json\n# old classroom: bind ./src and nodemon\n# neither is a Kubernetes rolling update"
    },
    {
      "id": 94,
      "level": "intermediate",
      "q": "networking: published port vs internal?",
      "a": "Published ports are street doors for your laptop. Internal URLs use hallway DNS and the container port.\napi must not use localhost:6379 to reach redis. That localhost is api itself. redis:6379 is the neighbor.\nIn the code:\napi ports 3000:3000 street. REDIS_URL redis://redis:6379 hallway. redis image redis:7 also published 6379 for your GUI. api must not use localhost:6379.\nA common mistake is publishing every backend port to 0.0.0.0 on a shared server 'for convenience.'",
      "code": "services:\n  api:\n    ports: [\"3000:3000\"]          # street 3000\n    environment:\n      REDIS_URL: redis://redis:6379  # hallway\n  redis:\n    image: redis:7\n    ports: [\"6379:6379\"]          # street for your GUI\n# api must not use localhost:6379 (that is api itself)"
    },
    {
      "id": 95,
      "level": "advanced",
      "q": "MTU / VPN Docker issues?",
      "a": "MTU is packet size. A VPN tunnel may be narrower (1400) than the default Docker bridge (1500). Mystery timeouts and hung HTTPS can be oversized packets.\nSet the network MTU to fit the tunnel.\nIn the code:\nnetworks backend bridge driver_opts mtu 1400 smaller boxes for a narrow VPN. services api on backend. home LAN 1500 vs VPN 1400 = mystery timeouts.\nA common mistake is rewriting the app for 'flaky network' when only Docker-over-VPN packets were too big.",
      "code": "networks:\n  backend:\n    driver: bridge\n    driver_opts:\n      com.docker.network.driver.mtu: \"1400\"   # smaller boxes for a narrow VPN tunnel\nservices:\n  api:\n    networks: [backend]\n# home LAN MTU 1500 vs VPN 1400 = mystery timeouts\n# the seating chart's hallway width needs to fit the tunnel"
    },
    {
      "id": 96,
      "level": "intermediate",
      "q": "How do you keep images small?",
      "a": "Keep images small: alpine or distroless runtime, multi-stage so compilers stay in builder, .dockerignore so .git and tests never enter, npm ci --omit=dev, COPY only dist.\nWeekend bag, not a moving truck.\nIn the code:\nFROM alpine AS runtime, COPY lockfiles, commented npm ci --omit=dev and cache clean, COPY dist, USER node. not in the suitcase: .git, tests, docs, compilers. alpine + multi-stage + ignore = weekend bag.\nA common mistake is COPY . . including tests, docs, and local node_modules, then wondering why history shows a 400MB COPY layer.",
      "code": "FROM node:20-alpine AS runtime\nWORKDIR /app\nCOPY package.json package-lock.json .\n# RUN npm ci --omit=dev && npm cache clean --force\nCOPY dist ./dist\nUSER node\n# not in the suitcase: .git, tests, docs, compilers (left in builder stage)\n# alpine + multi-stage + ignore = weekend bag"
    },
    {
      "id": 97,
      "level": "beginner",
      "q": "docker history?",
      "a": "docker history is a receipt: each layer size and instruction. A 400MB COPY . . usually means node_modules or .git entered the suitcase.\nDiet: .dockerignore and COPY only src.\nIn the code:\nLAYER SIZE INSTRUCTION aaa 8MB FROM alpine, bbb 40MB apk add nodejs, ccc 400MB COPY . . oops node_modules, ddd 1MB USER node. diet: ignore node_modules, COPY only src.\nA common mistake is looking at the final image size only, not which instruction ballooned.",
      "code": "# a receipt (idea of history)\n# LAYER   SIZE    INSTRUCTION\n# aaa     8MB     FROM alpine\n# bbb     40MB    RUN apk add nodejs\n# ccc     400MB   COPY . .          # oops node_modules in the suitcase\n# ddd     1MB     USER node\n# diet: .dockerignore node_modules, COPY only src"
    },
    {
      "id": 98,
      "level": "intermediate",
      "q": "SBOM?",
      "a": "An SBOM is an ingredients label: OS packages and app libraries with versions.\nWhen a CVE drops, search this label, not your memory. Generate it in CI and store it next to the image digest.\nIn the code:\nimage myapp:1.0.2 packages alpine-baselayout, nodejs 20.x, express 4.19.x. when a CVE drops, search this label, not your memory.\nA common mistake is an SBOM of the builder stage while you shipped distroless runtime, so the label lists compilers you did not ship.",
      "code": "# ingredients label (SBOM idea)\nimage: \"myapp:1.0.2\"\npackages:\n  - { name: \"alpine-baselayout\", version: \"3.x\" }\n  - { name: \"nodejs\", version: \"20.x\" }\n  - { name: \"express\", version: \"4.19.x\" }\n# when a CVE drops, search this label, not your memory"
    },
    {
      "id": 99,
      "level": "advanced",
      "q": "rootless Docker?",
      "a": "Rootless Docker runs the engine as you, and maps container root into your uid via user namespaces.\nA breakout from rootless has less building-key access than a rootful engine. Some features (some ports, some drivers) are harder.\nIn the code:\nrootful engine_user root on the host, container_root often powerful. rootless engine_user you, container_root mapped to your uid. a breakout from rootless has less building-key access.\nA common mistake is assuming rootless makes every image safe. You still drop capabilities and USER inside.",
      "code": "# two privilege stories\nrootful:\n  engine_user: \"root on the host\"\n  container_root: \"often also powerful\"\nrootless:\n  engine_user: \"you\"\n  container_root: \"mapped to your uid (user namespace)\"\n# a breakout from rootless has less building-key access"
    },
    {
      "id": 100,
      "level": "advanced",
      "q": "How do you explain Docker in an interview?",
      "a": "In an interview, tell Docker as recipe, cake, meal, plate, hallway — then Kubernetes when you have many offices.\nAn image is a frozen layered lunch. A container is one meal with crumbs. A volume is a real plate. A network is hallway DNS by service name. Do not recite docker run flags.\nIn the code:\nmodel image frozen layered lunch recipe Dockerfile, container one meal with crumbs, volume a real plate, network hallway DNS, next Kubernetes when many offices. tell a story, not docker run -d -p -e -v.\nA common mistake is only listing commands. Interviewers want isolation, layers, and where data lives.",
      "code": "# one-minute map\nmodel:\n  image: \"frozen layered lunch (recipe = Dockerfile)\"\n  container: \"one meal with crumbs (writable layer)\"\n  volume: \"a real plate so crumbs you care about survive\"\n  network: \"hallway DNS by service name\"\n  next: \"Kubernetes when you have many offices\"\n# tell a story, not docker run -d -p -e -v"
    }
  ]
};
