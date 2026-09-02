window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA.kubernetes = {
  "notes": [
    {
      "title": "What k8s is",
      "body": "Kubernetes is an orchestrator: it places containers on machines, restarts them, scales copies, and gives them stable names on a network. You write the desired picture in YAML. Controllers keep reality matching that picture. One Docker host is a lunchbox. Kubernetes is many rooms across many floors."
    },
    {
      "title": "Cluster pieces",
      "body": "A cluster has a control plane and worker nodes. The control plane is the API server, etcd memory, scheduler, and controllers. Workers run kubelet, a container runtime, and your pods. You talk to the API, not to Docker on a random VM. Managed Kubernetes (EKS, GKE, AKS) often runs the control plane for you."
    },
    {
      "title": "Pod",
      "body": "A pod is the smallest deployable unit: one or more containers sharing a network and volumes. They share localhost. The pod gets an IP. When the pod dies, that IP is gone. Usually one main app container lives in the room. You almost never run a raw container in Kubernetes. You run a pod."
    },
    {
      "title": "Workload APIs",
      "body": "Workload APIs create pods for you so you do not babysit each room. A Deployment keeps stateless copies and owns ReplicaSets. A StatefulSet gives stable names and storage. A DaemonSet runs one pod per node. A Job runs until finished; a CronJob starts Jobs on a schedule. Pick the API that matches the job, not always Deployment."
    },
    {
      "title": "Service",
      "body": "A Service is a stable virtual IP plus DNS to pods selected by labels. ClusterIP is inside the cluster. NodePort is a doorbell on each node. LoadBalancer asks the cloud for a public number. Ingress (or Gateway) routes HTTP by host and path. The Service is reception. The Deployment hires rooms."
    },
    {
      "title": "Labels & selectors",
      "body": "Labels are key/value tags on objects. Selectors find pods with those tags. Services and Deployments wire up through labels, not through pod names. Names of pods change. Labels are the name tags on shift. Mismatch the selector and traffic goes nowhere."
    },
    {
      "title": "Config & secrets",
      "body": "A ConfigMap holds non-secret settings. A Secret holds sensitive data. Default Secrets are base64, not encryption. Mount as environment variables or files. Changing env often needs a new pod. Do not put passwords in ConfigMaps. Do not put them in the image either."
    },
    {
      "title": "Probes",
      "body": "Probes are health questions. Liveness: am I wedged? Restart if yes. Readiness: may I take customers? Stop traffic if no. Startup: give a slow boot time before liveness starts. Wrong probes cause restart storms. A liveness check that hits the database will fire cashiers when the DB blinks."
    },
    {
      "title": "Resources",
      "body": "requests are the reservation the scheduler uses to pick a node. limits are the cgroup cap. Set both. CPU over limit is throttle; memory over limit is OOMKill, often exit 137. 100 millicores is one tenth of a CPU, and Mi means mebibytes. A missing request makes HPA and packing lie."
    },
    {
      "title": "kubectl",
      "body": "kubectl talks to the API. get is the roster. describe is the first debug tool: events live there. logs is stdout. exec is a visitor. apply makes reality match a file. rollout watches a Deployment change. Learn describe before you guess."
    },
    {
      "title": "YAML apply",
      "body": "kubectl apply -f is declarative: the file is the flight plan. GitOps (Argo, Flux) applies the same idea from git. Do not make kubectl edit prod your process. Live edits drift from the paper. The cluster will not remember why someone typed replicas 10."
    },
    {
      "title": "Interview habit",
      "body": "In an interview, nail Pod versus Deployment versus Service first. Then explain probes, rolling updates, and how a browser reaches a pod: DNS, load balancer, Ingress, Service, endpoints. Add one war story such as ImagePullBackOff, Pending, OOM 137, or liveness hitting the database. Talk copies and desired state. Do not recite a kubectl dump."
    }
  ],
  "questions": [
    {
      "id": 1,
      "level": "beginner",
      "q": "What is Kubernetes?",
      "a": "Kubernetes runs containers across machines: place them, restart them, scale copies, and give them names on a network.\nYou write the desired picture. Controllers keep reality matching that picture. One Docker host is not enough when you have many machines.\nIn the code:\nkind Deployment name api. spec.replicas 3 is the picture. selector matchLabels app api. template labels app api and image myapp:1.0.2. A controller keeps creating or replacing pods until 3 exist.\nA common mistake is creating raw Pods by hand and then wondering why nothing replaces them when they die.",
      "code": "# desired picture: \"I want 3 copies of my api\"\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: api\nspec:\n  replicas: 3                 # the picture\n  selector:\n    matchLabels: { app: api }\n  template:\n    metadata:\n      labels: { app: api }\n    spec:\n      containers:\n        - name: api\n          image: myapp:1.0.2\n# a controller keeps creating/replacing pods until 3 exist"
    },
    {
      "id": 2,
      "level": "beginner",
      "q": "Why not just Docker Compose in production?",
      "a": "Compose is a great laptop seating chart. Kubernetes adds multi-node placement, self-heal, rolling updates, and access rules (RBAC).\nThe cost is complexity. Do not oversell Compose as city transit. Start with Compose. Graduate when you have many machines and many services.\nIn the code:\nComments contrast Compose one cafe with Kubernetes many gates. Deployment replicas 10, selector app api, image myapp:1.0.2. Many machines can share these copies.\nA common mistake is copying compose.yaml into production SSH and calling it orchestration.",
      "code": "# Compose is one cafe\n# services:\n#   api: { image: myapp:1.0 }\n#\n# Kubernetes is many gates\napiVersion: apps/v1\nkind: Deployment\nmetadata: { name: api }\nspec:\n  replicas: 10                # many machines can share these\n  selector: { matchLabels: { app: api } }\n  template:\n    metadata: { labels: { app: api } }\n    spec:\n      containers: [{ name: api, image: myapp:1.0.2 }]"
    },
    {
      "id": 3,
      "level": "beginner",
      "q": "What is a cluster?",
      "a": "A cluster is a control plane plus worker nodes that run pods.\nManaged Kubernetes (EKS, GKE, AKS) operates the control plane for you. Your YAML talks to the plane, not to Docker on a random VM. If etcd (the memory) dies, the cluster forgets its picture.\nIn the code:\ncontrol_plane lists kube-apiserver front desk, etcd memory, scheduler who sits where, controllers match reality to YAML. workers list kubelet, runtime containerd, pods your apps.\nA common mistake is SSHing to a node to docker run, fighting the control plane that will replace or ignore that box.",
      "code": "# a cluster is two kinds of machines\ncontrol_plane:\n  - kube-apiserver      # the front desk\n  - etcd                # the memory\n  - scheduler           # who sits where\n  - controllers         # match reality to YAML\nworkers:\n  - kubelet             # hands on each node\n  - runtime             # containerd\n  - pods                # your apps"
    },
    {
      "id": 4,
      "level": "beginner",
      "q": "What is a node?",
      "a": "A node is a VM or computer running kubelet and a container runtime. Pods land on nodes that still have enough CPU and memory.\nPending often means no node has room. The scheduler is the receptionist assigning rooms.\nIn the code:\nnode worker-a cpu 4 memory 16Gi, already_used cpu 3 memory 12Gi. a pod that requests cpu 2 will not fit. the receptionist tries another floor.\nA common mistake is adding replicas when every node is full, then more pods sit Pending.",
      "code": "# one hotel floor\nnode:\n  name: worker-a\n  cpu: \"4\"\n  memory: 16Gi\n  already_used:\n    cpu: \"3\"\n    memory: 12Gi\n# a pod that requests cpu: \"2\" will not fit on this floor\n# the receptionist (scheduler) tries another floor"
    },
    {
      "id": 5,
      "level": "beginner",
      "q": "What is a pod?",
      "a": "A pod is one or more containers sharing a network namespace and volumes. It gets an IP. When it dies, that IP is gone. A new pod is a new identity.\nYou almost never run a raw container in Kubernetes. You run a pod. Usually one main app container lives in that room. localhost is the shared phone.\nIn the code:\nkind Pod name api-abc labels app api. container api image myapp:1.0.2 containerPort 3000. this room has one phone: localhost:3000 is the api. if demolished, the phone number is gone.\nA common mistake is treating a pod IP as a stable address in another team's config.",
      "code": "apiVersion: v1\nkind: Pod\nmetadata:\n  name: api-abc\n  labels: { app: api }\nspec:\n  containers:\n    - name: api\n      image: myapp:1.0.2\n      ports:\n        - containerPort: 3000\n# this room has one phone: localhost:3000 is the api\n# if the room is demolished, the phone number is gone"
    },
    {
      "id": 6,
      "level": "beginner",
      "q": "Why not one container API?",
      "a": "A pod can hold helpers (sidecars) that share the phone and the desk: proxies, log shippers. You still usually run one product app per pod.\nTwo product apps that scale differently want two Deployments, two apartments.\nIn the code:\ncontainers api and shipper both mount logs at /var/log. volumes logs emptyDir. same phone localhost, same desk logs volume.\nA common mistake is stuffing unrelated apps in one pod so they must scale and restart together.",
      "code": "apiVersion: v1\nkind: Pod\nmetadata: { name: api-with-helper }\nspec:\n  containers:\n    - name: api\n      image: myapp:1.0.2\n      volumeMounts: [{ name: logs, mountPath: /var/log }]\n    - name: shipper                 # roommate\n      image: log-shipper:1\n      volumeMounts: [{ name: logs, mountPath: /var/log }]\n  volumes: [{ name: logs, emptyDir: {} }]\n# same phone (localhost), same desk (logs volume)"
    },
    {
      "id": 7,
      "level": "beginner",
      "q": "What is a Deployment?",
      "a": "A Deployment keeps N copies of a pod template and can roll out a new image. It owns ReplicaSets. You rarely babysit pods by name.\nIf a copy dies, the manager hires another. That is the default way to run an API.\nIn the code:\nreplicas 3, selector app api, template labels app api, container image myapp:1.0.2. hiring manager keeps 3 rooms with this furniture.\nA common mistake is kubectl delete pod in a loop to 'restart.' The Deployment will recreate; use rollout if you meant an update.",
      "code": "apiVersion: apps/v1\nkind: Deployment\nmetadata: { name: api }\nspec:\n  replicas: 3\n  selector: { matchLabels: { app: api } }\n  template:\n    metadata: { labels: { app: api } }\n    spec:\n      containers:\n        - name: api\n          image: myapp:1.0.2\n# hiring manager keeps 3 rooms with this furniture"
    },
    {
      "id": 8,
      "level": "beginner",
      "q": "ReplicaSet?",
      "a": "A ReplicaSet is the supervisor that actually holds the replica count for one pod template hash.\nDuring a rollout you briefly have two ReplicaSets: old image shrinking, new image growing. You almost never create a ReplicaSet by hand. The Deployment does.\nIn the code:\nComments show old RS count 2 then 1 then 0, new RS 1 then 2 then 3. kind ReplicaSet api-9d8f replicas 3 selector app api plus pod-template-hash. image 1.0.2.\nA common mistake is scaling a ReplicaSet while a Deployment owns it. The Deployment will fight you back to its spec.replicas.",
      "code": "# during a rollout you briefly have two supervisors\n# ReplicaSet old:  pods with image 1.0.1   count -> 2, then 1, then 0\n# ReplicaSet new:  pods with image 1.0.2   count -> 1, then 2, then 3\napiVersion: apps/v1\nkind: ReplicaSet\nmetadata: { name: api-9d8f }\nspec:\n  replicas: 3\n  selector: { matchLabels: { app: api, pod-template-hash: 9d8f } }\n  template:\n    metadata: { labels: { app: api, pod-template-hash: 9d8f } }\n    spec:\n      containers: [{ name: api, image: myapp:1.0.2 }]"
    },
    {
      "id": 9,
      "level": "beginner",
      "q": "What is a Service?",
      "a": "A Service is a stable DNS name and virtual IP that forwards to pods whose labels match the selector.\nport is the desk number. targetPort is the phone in the room. Only Ready pods should get traffic.\nIn the code:\nkind Service name api, selector app api, port 80, targetPort 3000. DNS api.default.svc.cluster.local -> virtual IP -> ready pods.\nA common mistake is selector app: API while pods are labeled app: api. Case and spelling must match.",
      "code": "apiVersion: v1\nkind: Service\nmetadata: { name: api }\nspec:\n  selector: { app: api }      # who is on shift\n  ports:\n    - port: 80                # the desk number\n      targetPort: 3000        # the phone in the room\n# DNS: api.default.svc.cluster.local -> virtual IP -> ready pods"
    },
    {
      "id": 10,
      "level": "beginner",
      "q": "ClusterIP vs NodePort vs LoadBalancer?",
      "a": "ClusterIP is an internal extension, the default. NodePort opens a high port on every node. LoadBalancer asks the cloud for a public address.\nPick the smallest door that fits. Not every Service needs a public number.\nIn the code:\ntype ClusterIP commented as default. commented NodePort doorbell on every node. commented LoadBalancer cloud public number. selector app api port 80 targetPort 3000.\nA common mistake is LoadBalancer for every backend, then a bill of leftover cloud IPs.",
      "code": "apiVersion: v1\nkind: Service\nmetadata: { name: api }\nspec:\n  type: ClusterIP             # internal extension (default)\n  # type: NodePort            # doorbell on every node\n  # type: LoadBalancer        # cloud gives a public number\n  selector: { app: api }\n  ports: [{ port: 80, targetPort: 3000 }]"
    },
    {
      "id": 11,
      "level": "beginner",
      "q": "What is Ingress?",
      "a": "Ingress is HTTP routing: one public door, many back offices, by host and path.\ningressClassName picks which receptionist software (nginx, traefik). The backend is still a Service, not a pod name.\nIn the code:\nkind Ingress name web, ingressClassName nginx, host shop.example.com, path /api Prefix, backend service api port 80. one public door, many back offices.\nA common mistake is creating Ingress with no Ingress controller installed, then wondering why the rules do nothing.",
      "code": "apiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata: { name: web }\nspec:\n  ingressClassName: nginx     # which receptionist software\n  rules:\n    - host: shop.example.com\n      http:\n        paths:\n          - path: /api\n            pathType: Prefix\n            backend:\n              service: { name: api, port: { number: 80 } }\n# one public door, many back offices"
    },
    {
      "id": 12,
      "level": "beginner",
      "q": "namespace?",
      "a": "A namespace is a named building inside the cluster. Teams can both have a Service named api without clashing.\nDNS includes the namespace: api.team-a.svc.cluster.local. RBAC and quotas often attach here.\nIn the code:\nkind Namespace team-a. Service api in namespace team-a, selector app api. DNS api.team-a.svc.cluster.local. team-b can also have metadata.name api.\nA common mistake is kubectl get pods with the wrong namespace and thinking the app vanished.",
      "code": "apiVersion: v1\nkind: Namespace\nmetadata: { name: team-a }\n---\napiVersion: v1\nkind: Service\nmetadata:\n  name: api\n  namespace: team-a\nspec:\n  selector: { app: api }\n  ports: [{ port: 80, targetPort: 3000 }]\n# DNS: api.team-a.svc.cluster.local\n# team-b can also have metadata.name: api"
    },
    {
      "id": 13,
      "level": "beginner",
      "q": "kubectl get / describe?",
      "a": "get is the short roster: name and status. describe is the chart with events, the margin notes that name the real error.\nCrashLoopBackOff on get is not enough. Events may say missing DATABASE_URL.\nIn the code:\npod api-9d8f-xyz on worker-a status CrashLoopBackOff, events Back-off restarting, Error missing DATABASE_URL. get would only say CrashLoopBackOff. the margin notes name the missing env.\nA common mistake is logs first while the pod is Pending. There is no container yet. describe first.",
      "code": "# what describe is telling you (idea)\npod:\n  name: api-9d8f-xyz\n  node: worker-a\n  status: CrashLoopBackOff\n  events:\n    - \"Back-off restarting failed container\"\n    - \"Error: missing DATABASE_URL\"\n# get would only say CrashLoopBackOff\n# the margin notes (events) name the missing env"
    },
    {
      "id": 14,
      "level": "beginner",
      "q": "kubectl logs?",
      "a": "logs is stdout of one container. If the pod has two containers, you must say which roommate. previous is the notebook from the last life if this life just started.\nCrash loops often need previous to see the error before the restart wiped the current stream.\nIn the code:\ncontainers api and shipper. you must say which roommate's notebook. previous: the notebook from the last life if this life just started.\nA common mistake is logs on a sidecar pod and thinking the api is silent. You tailed the shipper.",
      "code": "# a pod with two containers\nspec:\n  containers:\n    - name: api\n      image: myapp:1.0.2\n    - name: shipper\n      image: log-shipper:1\n# you must say which roommate's notebook\n# previous: the notebook from the last life if this life just started"
    },
    {
      "id": 15,
      "level": "beginner",
      "q": "kubectl apply -f?",
      "a": "apply -f sends a paper to the API: make reality match this file. Bump the image in the file, apply again. The Deployment rolls copies. The file is the flight plan.\nImperative create is a shout that is not in git.\nIn the code:\nDeployment api replicas 3, image myapp:1.0.3 bump image here, apply again. apply: make reality match this paper.\nA common mistake is apply then hand-editing live replicas, so git and the cluster disagree.",
      "code": "# the flight plan IS the file\napiVersion: apps/v1\nkind: Deployment\nmetadata: { name: api }\nspec:\n  replicas: 3\n  selector: { matchLabels: { app: api } }\n  template:\n    metadata: { labels: { app: api } }\n    spec:\n      containers: [{ name: api, image: myapp:1.0.3 }]  # bump image here, apply again\n# apply: make reality match this paper"
    },
    {
      "id": 16,
      "level": "intermediate",
      "q": "labels vs annotations?",
      "a": "Labels are name tags used by selectors. Annotations are sticky notes: git sha, build url, not for selecting pods.\nA Service selector can say app: api. It cannot select on git-sha if that lives only in annotations.\nIn the code:\nlabels app api and version 1.0.2. annotations git-sha and build-url. Service spec.selector can say app api, not git-sha.\nA common mistake is putting version in an annotation and expecting a Service to split blue/green on it.",
      "code": "apiVersion: v1\nkind: Pod\nmetadata:\n  name: api-xyz\n  labels:\n    app: api                 # name tag — selectable\n    version: \"1.0.2\"\n  annotations:\n    git-sha: \"a9f3c1\"        # sticky note — not for selectors\n    build-url: \"https://ci/...\"\n# Service spec.selector can say app: api, not git-sha"
    },
    {
      "id": 17,
      "level": "intermediate",
      "q": "label selector?",
      "a": "A label selector is the filter. The pod template labels MUST match that filter or the Deployment is invalid.\nmatchLabels is AND of those keys. matchExpressions can say In, NotIn, Exists.\nIn the code:\nselector matchLabels app api, commented matchExpressions env In prod. template labels app api MUST match the filter. container image myapp:1.0.2.\nA common mistake is changing template labels without changing selector, so the Deployment refuses or orphans pods.",
      "code": "apiVersion: apps/v1\nkind: Deployment\nmetadata: { name: api }\nspec:\n  selector:\n    matchLabels: { app: api }           # filter\n    # matchExpressions:\n    #   - { key: env, operator: In, values: [prod] }\n  template:\n    metadata:\n      labels: { app: api }              # MUST match the filter\n    spec:\n      containers: [{ name: api, image: myapp:1.0.2 }]"
    },
    {
      "id": 18,
      "level": "intermediate",
      "q": "declarative vs imperative?",
      "a": "Declarative means the object should look like this file. Imperative means shout a one-time create command.\nThe file can be reviewed in a PR. The shout cannot.\nIn the code:\nkind ConfigMap api-config data LOG_LEVEL info. the cluster should have this object with this data. imperative would be create a configmap named api-config. that shout is not a file you can review in a PR.\nA common mistake is a wiki of kubectl create commands as the source of truth.",
      "code": "# declarative picture (preferred)\napiVersion: v1\nkind: ConfigMap\nmetadata: { name: api-config }\ndata:\n  LOG_LEVEL: info\n# the cluster should have this object with this data\n#\n# imperative would be \"create a configmap named api-config with LOG_LEVEL=info\"\n# that shout is not a file you can review in a PR"
    },
    {
      "id": 19,
      "level": "intermediate",
      "q": "desired state reconciliation?",
      "a": "Reconciliation is the thermostat: desired replicas 3, reality 2, controller creates 1. A node dies, reality 2 again, create 1 on another node.\nYou do not SSH to start containers. You set the picture.\nIn the code:\nreplicas 3 thermostat setting. selector app api, image myapp:1.0.2. reality has 2 pods -> controller creates 1. node dies, reality has 2 again -> create 1 on another node.\nA common mistake is 'I started it with exec' and expecting the controller to keep that hack.",
      "code": "apiVersion: apps/v1\nkind: Deployment\nmetadata: { name: api }\nspec:\n  replicas: 3                 # thermostat setting\n  selector: { matchLabels: { app: api } }\n  template:\n    metadata: { labels: { app: api } }\n    spec:\n      containers: [{ name: api, image: myapp:1.0.2 }]\n# reality has 2 pods -> controller creates 1\n# node dies, reality has 2 again -> create 1 on another node"
    },
    {
      "id": 20,
      "level": "intermediate",
      "q": "control plane components?",
      "a": "Control plane pieces: apiserver is the only door (authn, authz, admission). etcd is the filing cabinet. scheduler assigns pod to node. controller-manager runs the Deployment and Node loops. cloud-controller talks to LoadBalancers and disks.\nIf etcd is gone, the filing cabinet is empty.\nIn the code:\nkube-apiserver only door, etcd filing cabinet, scheduler assigns pod -> node, controller-manager loops, cloud-controller LoadBalancer disks nodes. if etcd is gone, the filing cabinet is empty.\nA common mistake is backing up nodes' disks and skipping etcd, then you cannot rebuild the cluster picture.",
      "code": "control_plane:\n  kube-apiserver: \"only door in — authn, authz, admission\"\n  etcd: \"filing cabinet of all objects\"\n  scheduler: \"assigns pod -> node\"\n  controller-manager: \"Deployment, Node, Endpoint loops\"\n  cloud-controller: \"LoadBalancer, disks, nodes in the cloud\"\n# if etcd is gone, the filing cabinet is empty"
    },
    {
      "id": 21,
      "level": "intermediate",
      "q": "kubelet?",
      "a": "kubelet is the agent on each worker. It watches Pod objects assigned to this node, calls the runtime (CRI) to start containers, reports Ready and probe results, and runs probes.\nHQ never SSHs to Docker. It talks to kubelet through the API.\nIn the code:\nkubelet watches Pod objects, calls containerd CRI, reports Ready memory pressure probe results, runs liveness readiness startup. HQ never SSHs to Docker.\nA common mistake is stopping kubelet to 'debug' and then wondering why pods on that node go NotReady.",
      "code": "# on each worker\nkubelet:\n  watches: \"Pod objects assigned to this node\"\n  calls: \"containerd (CRI) to start containers\"\n  reports: \"Ready, memory pressure, probe results\"\n  runs: \"liveness / readiness / startup probes\"\n# HQ (API) never SSHs to Docker; it talks to kubelet through the API"
    },
    {
      "id": 22,
      "level": "intermediate",
      "q": "kube-proxy?",
      "a": "kube-proxy (or a replacement like some CNI dataplanes) implements Service virtual IPs at layer 4: packet to ClusterIP:port becomes one of the endpoint IPs.\nThis is not Host header routing. HTTP Host routing is Ingress.\nIn the code:\nservice clusterIP 10.96.10.20 port 80 endpoints two pod IPs :3000. kube-proxy writes rules packet to VIP -> one endpoint. this is L4, not Host header routing.\nA common mistake is expecting a Service to route /api vs /web. That is Ingress, not kube-proxy.",
      "code": "# packet sorting (idea)\nservice:\n  clusterIP: 10.96.10.20\n  port: 80\n  endpoints: [\"10.1.2.5:3000\", \"10.1.2.6:3000\"]   # ready pods\n# kube-proxy writes rules:\n#   packet to 10.96.10.20:80 -> one of the endpoint IPs\n# this is L4, not \"Host header routing\""
    },
    {
      "id": 23,
      "level": "intermediate",
      "q": "container runtime?",
      "a": "The container runtime (containerd, CRI-O) actually starts containers. kubelet speaks CRI, not docker run.\nThe image is still an OCI image, often built by Docker. Production nodes usually skip Docker Engine.\nIn the code:\nstack kubelet needs a container from image myapp:1.0.2, runtime containerd or CRI-O, image OCI can still be built by Docker. Docker Desktop for learning is fine. production nodes usually skip Docker Engine.\nA common mistake is installing Docker Engine on every node because the Dockerfile still says Docker.",
      "code": "# kubelet speaks CRI, not \"docker run\"\nstack:\n  kubelet: \"I need a container from image myapp:1.0.2\"\n  runtime: \"containerd or CRI-O\"\n  image: \"OCI image — can still be built by Docker\"\n# Docker Desktop for learning is fine\n# production nodes usually skip Docker Engine"
    },
    {
      "id": 24,
      "level": "intermediate",
      "q": "etcd?",
      "a": "etcd stores the cluster's objects: pods, services, secrets. Lose etcd, lose the picture of every Deployment.\nApps' own databases are separate. The cluster still cannot manage them without this cabinet.\nIn the code:\netcd keys /registry/pods/default/api-xyz and /registry/services/default/api with clusterIP. lose etcd, lose the picture of every Deployment.\nA common mistake is treating the app Postgres backup as a cluster backup. Restore Postgres, still have no Kubernetes objects.",
      "code": "# filing cabinet keys (idea)\netcd:\n  \"/registry/pods/default/api-xyz\": { spec: \"...\", status: \"...\" }\n  \"/registry/services/default/api\": { clusterIP: \"10.96.10.20\" }\n# lose etcd, lose the picture of every Deployment\n# apps' own databases are separate — but the cluster cannot manage them without this cabinet"
    },
    {
      "id": 25,
      "level": "intermediate",
      "q": "What is a rolling update?",
      "a": "A rolling update starts new pods with the new image and stops old ones in batches. maxUnavailable and maxSurge cap how empty or extra the floor gets.\nmaxUnavailable 0 means never close all tills. maxSurge 1 means at most one extra cashier while switching uniforms.\nIn the code:\nreplicas 3, strategy RollingUpdate maxUnavailable 0 maxSurge 1, image myapp:1.0.3.\nA common mistake is maxUnavailable 100% and taking the whole API down during a rollout.",
      "code": "apiVersion: apps/v1\nkind: Deployment\nmetadata: { name: api }\nspec:\n  replicas: 3\n  strategy:\n    type: RollingUpdate\n    rollingUpdate:\n      maxUnavailable: 0       # never close all tills\n      maxSurge: 1             # at most one extra cashier while switching uniforms\n  selector: { matchLabels: { app: api } }\n  template:\n    metadata: { labels: { app: api } }\n    spec:\n      containers: [{ name: api, image: myapp:1.0.3 }]"
    },
    {
      "id": 26,
      "level": "intermediate",
      "q": "rollout undo?",
      "a": "rollout undo makes the previous ReplicaSet the desired one again. revisionHistoryLimit is how many old uniforms to keep.\nIf the limit is 0, undo has no old set to return to.\nIn the code:\nrevisionHistoryLimit 10 how many old uniforms to keep. replicas 3 image 1.0.3. undo = make the previous ReplicaSet the desired one again.\nA common mistake is undo after you already deleted the old ReplicaSets with a tiny history limit.",
      "code": "apiVersion: apps/v1\nkind: Deployment\nmetadata: { name: api }\nspec:\n  revisionHistoryLimit: 10    # how many old uniforms to keep\n  replicas: 3\n  selector: { matchLabels: { app: api } }\n  template:\n    metadata: { labels: { app: api } }\n    spec:\n      containers: [{ name: api, image: myapp:1.0.3 }]\n# undo = make the previous ReplicaSet the desired one again"
    },
    {
      "id": 27,
      "level": "intermediate",
      "q": "CrashLoopBackOff?",
      "a": "CrashLoopBackOff means the container starts, exits non-zero, and kubelet waits longer each time. The pod object can still say Running while the container is not Ready.\nMissing env, bad CMD, or a migration stuffed in the app container are common. Read previous logs.\nIn the code:\nphase Running, container ready false, restartCount 12, waiting CrashLoopBackOff, last_exit code 1 DATABASE_URL is required. the room is not the problem; the process keeps dying.\nA common mistake is describing CPU as the cause because the pod is 'Running.' The process is dying.",
      "code": "# status story\npod:\n  phase: Running              # the room exists\n  container:\n    ready: false\n    restartCount: 12\n    state: { waiting: { reason: CrashLoopBackOff } }\n  last_exit: { code: 1, message: \"DATABASE_URL is required\" }\n# the room is not the problem; the process keeps dying\n# missing env / bad CMD / migration in the app container"
    },
    {
      "id": 28,
      "level": "intermediate",
      "q": "ImagePullBackOff?",
      "a": "ImagePullBackOff means kubelet could not fetch the image: wrong tag, 401 unauthorized, rate limit, or private registry without a card.\nimagePullSecrets on the pod or ServiceAccount is the membership card.\nIn the code:\nimagePullSecrets ghcr-creds. image ghcr.io/org/api:1.0.2 wrong tag -> ImagePullBackOff. events 401 Unauthorized or not found or toomanyrequests.\nA common mistake is fixing the Deployment image while the ServiceAccount still has no pull secret.",
      "code": "apiVersion: v1\nkind: Pod\nmetadata: { name: api }\nspec:\n  imagePullSecrets:\n    - name: ghcr-creds        # membership card\n  containers:\n    - name: api\n      image: ghcr.io/org/api:1.0.2   # wrong tag -> ImagePullBackOff\n# events: \"401 Unauthorized\" or \"not found\" or \"toomanyrequests\""
    },
    {
      "id": 29,
      "level": "intermediate",
      "q": "Pending pod?",
      "a": "Pending means the pod has no node yet. The lobby. Causes: not enough CPU/memory, nodeSelector that matches nobody, taints, PVC unbound.\nEvents name the missing room type. The app has not started. logs will be empty.\nIn the code:\nnodeSelector disk ssd. requests cpu 8 memory 32Gi maybe no floor has this. Pending = still in the lobby, no room key. events name the missing room type.\nA common mistake is increasing replicas on a Pending pod. You get more lobby tickets.",
      "code": "apiVersion: v1\nkind: Pod\nmetadata: { name: fat-api }\nspec:\n  nodeSelector: { disk: ssd }          # only some floors\n  containers:\n    - name: api\n      image: myapp:1.0.2\n      resources:\n        requests: { cpu: \"8\", memory: 32Gi }  # maybe no floor has this\n# Pending = still in the lobby, no room key\n# events name the missing room type"
    },
    {
      "id": 30,
      "level": "intermediate",
      "q": "requests vs limits?",
      "a": "requests are the reservation for scheduling. limits are the cap. CPU over limit is throttle. Memory over limit is OOMKill.\nSet both. A huge limit with a tiny request packs too tightly, then noisy neighbors.\nIn the code:\nrequests cpu 100m memory 128Mi reservation for the receptionist. limits cpu 500m throttle, memory 256Mi OOMKill above this.\nA common mistake is limits without requests, or 1 CPU written as 1m (a thousand times too small).",
      "code": "apiVersion: v1\nkind: Pod\nmetadata: { name: api }\nspec:\n  containers:\n    - name: api\n      image: myapp:1.0.2\n      resources:\n        requests:\n          cpu: \"100m\"         # reservation for the receptionist\n          memory: 128Mi\n        limits:\n          cpu: \"500m\"         # throttle above this\n          memory: 256Mi       # OOMKill above this"
    },
    {
      "id": 31,
      "level": "intermediate",
      "q": "QoS classes?",
      "a": "QoS classes: Guaranteed when requests equal limits for cpu and memory. Burstable when some requests exist. BestEffort when none.\nBestEffort apps drown first when the floor floods (memory pressure).\nIn the code:\nrequests cpu 100m memory 128Mi limits the same -> Guaranteed. BestEffort apps drown first when the floor floods.\nA common mistake is BestEffort on the API and Guaranteed on a batch job, then the API dies first in a memory squeeze.",
      "code": "# three tickets\n# Guaranteed: requests.cpu == limits.cpu AND requests.memory == limits.memory\n# Burstable:  some requests, maybe different limits\n# BestEffort: no requests or limits\nspec:\n  containers:\n    - name: api\n      resources:\n        requests: { cpu: \"100m\", memory: 128Mi }\n        limits:   { cpu: \"100m\", memory: 128Mi }  # Guaranteed\n# BestEffort apps drown first when the floor floods"
    },
    {
      "id": 32,
      "level": "intermediate",
      "q": "liveness probe?",
      "a": "A liveness probe asks 'am I wedged?' Fail enough times and kubelet restarts the container.\n/livez should NOT query Postgres. If it does, a DB blip restarts every replica.\nIn the code:\nlivenessProbe httpGet /livez port 3000 period 10 failureThreshold 3. /livez should NOT query Postgres. if it does, a DB blip restarts every replica.\nA common mistake is copying the readiness URL into liveness.",
      "code": "apiVersion: v1\nkind: Pod\nmetadata: { name: api }\nspec:\n  containers:\n    - name: api\n      image: myapp:1.0.2\n      livenessProbe:\n        httpGet: { path: /livez, port: 3000 }   # \"am I wedged?\"\n        periodSeconds: 10\n        failureThreshold: 3\n# /livez should NOT query Postgres\n# if it does, a DB blip restarts every replica"
    },
    {
      "id": 33,
      "level": "intermediate",
      "q": "readiness probe?",
      "a": "A readiness probe asks 'may I take customers?' Fail and the Service stops sending. The process can still be alive.\nUse this for warmup or a dependency that should close the till, not fire the cashier.\nIn the code:\nreadinessProbe httpGet /readyz port 3000 period 5. fail /readyz -> Service stops sending. process can still be alive unlike a failed liveness.\nA common mistake is no readiness probe, so traffic hits pods that are still compiling or still migrating.",
      "code": "apiVersion: v1\nkind: Pod\nmetadata: { name: api }\nspec:\n  containers:\n    - name: api\n      image: myapp:1.0.2\n      readinessProbe:\n        httpGet: { path: /readyz, port: 3000 }  # \"may I take customers?\"\n        periodSeconds: 5\n# fail /readyz -> Service stops sending\n# process can still be alive (unlike a failed liveness)"
    },
    {
      "id": 34,
      "level": "intermediate",
      "q": "startup probe?",
      "a": "A startup probe covers slow boot. Liveness stays off until startup succeeds (or hits failureThreshold * period).\nWithout it, liveness can kill a JVM during boot.\nIn the code:\nstartupProbe /livez port 8080 failureThreshold 30 period 10 ~5 minutes to open the shop. livenessProbe the same path. without startup, liveness can kill the JVM during boot.\nA common mistake is raising liveness timeout to 10 minutes for boot, then hanging pods take 10 minutes to restart in production too.",
      "code": "apiVersion: v1\nkind: Pod\nmetadata: { name: java-api }\nspec:\n  containers:\n    - name: api\n      image: myapp-java:1.0.2\n      startupProbe:\n        httpGet: { path: /livez, port: 8080 }\n        failureThreshold: 30\n        periodSeconds: 10          # ~5 minutes to open the shop\n      livenessProbe:\n        httpGet: { path: /livez, port: 8080 }\n# without startup, liveness can kill the JVM during boot"
    },
    {
      "id": 35,
      "level": "intermediate",
      "q": "probe types?",
      "a": "Probe types: httpGet a path, tcpSocket is anyone listening, exec a tiny command, grpc a port.\n/readyz should be a cheap boolean, not the test suite.\nIn the code:\nreadinessProbe httpGet /readyz port 3000. commented tcpSocket, exec node -e process.exit(0), grpc port. /readyz should be a cheap boolean, not run the test suite.\nA common mistake is exec curl in a distroless image that has no curl, so the probe always fails.",
      "code": "readinessProbe:\n  httpGet:\n    path: /readyz\n    port: 3000\n  # tcpSocket: { port: 3000 }     # is anyone listening?\n  # exec: { command: [\"node\", \"-e\", \"process.exit(0)\"] }  # keep it tiny\n  # grpc: { port: 50051 }\n# /readyz should be a cheap boolean, not \"run the test suite\""
    },
    {
      "id": 36,
      "level": "intermediate",
      "q": "ConfigMap?",
      "a": "A ConfigMap is non-secret config as keys. You can envFrom the whole map or mount files.\nChanging LOG_LEVEL as env usually needs a new pod. File mounts can be seen if the app watches files.\nIn the code:\nConfigMap api-config LOG_LEVEL info FEATURE_X false. container envFrom configMapRef api-config. changing LOG_LEVEL may need a new pod.\nA common mistake is putting DATABASE_URL in a ConfigMap because it was 'easier to see.' That is a Secret.",
      "code": "apiVersion: v1\nkind: ConfigMap\nmetadata: { name: api-config }\ndata:\n  LOG_LEVEL: info\n  FEATURE_X: \"false\"\n---\nspec:\n  containers:\n    - name: api\n      envFrom: [{ configMapRef: { name: api-config } }]\n# changing LOG_LEVEL may need a new pod to pick up env\n# file mounts can be seen if the app watches files"
    },
    {
      "id": 37,
      "level": "intermediate",
      "q": "Secret?",
      "a": "A Secret is for sensitive data. Default storage is base64, not encryption at rest unless the cluster enables it.\nMount as files so describe and process lists are less likely to show the value than env. stringData is teaching sugar; etcd stores base64 data.\nIn the code:\nSecret api-db stringData DATABASE_URL fake. volumeMount /secrets/db readOnly. volumes secret api-db. file at /secrets/db/DATABASE_URL not in describe env.\nA common mistake is kubectl describe and pasting Secret data from a wiki, thinking base64 hid it. decode is one command.",
      "code": "apiVersion: v1\nkind: Secret\nmetadata: { name: api-db }\ntype: Opaque\nstringData:\n  DATABASE_URL: postgres://user:pass@db:5432/app   # teaching fake\n---\nspec:\n  containers:\n    - name: api\n      volumeMounts:\n        - name: db\n          mountPath: /secrets/db\n          readOnly: true\n  volumes:\n    - name: db\n      secret: { secretName: api-db }\n# file at /secrets/db/DATABASE_URL — not in describe env"
    },
    {
      "id": 38,
      "level": "intermediate",
      "q": "imagePullSecrets?",
      "a": "imagePullSecrets are registry credentials kubelet shows when pulling. Attach them to the ServiceAccount the pod uses, or on the pod spec.\nMissing card -> 401 in events -> ImagePullBackOff.\nIn the code:\nServiceAccount api-sa imagePullSecrets ghcr-creds. pod serviceAccountName api-sa image ghcr.io/org/api:1.0.2. kubelet shows the card when pulling. missing card -> 401 in events.\nA common mistake is creating the secret in default and running the pod in team-a. Secrets do not cross namespaces.",
      "code": "apiVersion: v1\nkind: ServiceAccount\nmetadata: { name: api-sa }\nimagePullSecrets:\n  - name: ghcr-creds\n---\nspec:\n  serviceAccountName: api-sa\n  containers:\n    - name: api\n      image: ghcr.io/org/api:1.0.2\n# kubelet shows the card when pulling\n# missing card -> 401 in events"
    },
    {
      "id": 39,
      "level": "intermediate",
      "q": "ServiceAccount?",
      "a": "A ServiceAccount is the pod's identity to the API. automountServiceAccountToken false means no badge if you do not call the API.\nIf the app talks to the API, mount the token and bind a tight Role. The default SA in a namespace is often over-privileged in old clusters.\nIn the code:\nserviceAccountName api-sa, automountServiceAccountToken false no badge if we do not call the API. if the app talks to the API, mount the token and bind a tight Role.\nA common mistake is every pod using default SA with cluster-admin leftover from a tutorial.",
      "code": "apiVersion: v1\nkind: Pod\nmetadata: { name: api }\nspec:\n  serviceAccountName: api-sa\n  automountServiceAccountToken: false   # no badge if we do not call the API\n  containers:\n    - name: api\n      image: myapp:1.0.2\n# if the app talks to the API, mount the token and bind a tight Role"
    },
    {
      "id": 40,
      "level": "intermediate",
      "q": "RBAC?",
      "a": "RBAC is Role (what) plus RoleBinding (who in this namespace). ClusterRole is cluster-wide.\nverbs get list on configmaps is not delete nodes. Least privilege is the point.\nIn the code:\nRole api-read-config rules configmaps get list. RoleBinding subjects ServiceAccount api-sa roleRef that Role. this badge may read configmaps in team-a, not delete nodes.\nA common mistake is ClusterRoleBinding a deploy SA to cluster-admin 'temporarily.'",
      "code": "apiVersion: rbac.authorization.k8s.io/v1\nkind: Role\nmetadata: { name: api-read-config, namespace: team-a }\nrules:\n  - apiGroups: [\"\"]\n    resources: [\"configmaps\"]\n    verbs: [\"get\", \"list\"]\n---\nkind: RoleBinding\nmetadata: { name: api-read-config, namespace: team-a }\nsubjects: [{ kind: ServiceAccount, name: api-sa }]\nroleRef: { kind: Role, name: api-read-config, apiGroup: rbac.authorization.k8s.io }\n# this badge may read configmaps in team-a, not delete nodes"
    },
    {
      "id": 41,
      "level": "intermediate",
      "q": "Ingress vs Service vs Deployment?",
      "a": "Three stacked layers: Deployment creates pods with labels. Service selects those labels and has a stable name. Ingress routes HTTP to that Service.\nThey are separate papers. Deleting the Ingress does not delete the Deployment.\nIn the code:\nComments Ingress host /api -> Service api:80, Service selector app=api -> Pod IPs :3000, Deployment -> pods with that label. Service yaml selector app api. Deployment and Ingress are separate papers.\nA common mistake is one YAML kind that people call 'the ingress deployment service.' Draw the three boxes.",
      "code": "# three layers stacked\n# Ingress  host shop.example.com /api  ->  Service api:80\n# Service  selector app=api            ->  Pod IPs :3000\n# Deployment                           ->  Pods with that label\napiVersion: v1\nkind: Service\nmetadata: { name: api }\nspec:\n  selector: { app: api }\n  ports: [{ port: 80, targetPort: 3000 }]\n# Deployment and Ingress are separate papers"
    },
    {
      "id": 42,
      "level": "intermediate",
      "q": "CNI?",
      "a": "CNI is the plugin that hands out pod IPs and wires the cluster network: Calico, Cilium, aws-vpc-cni, and others.\nWithout a plugin, pods have no cluster network. NetworkPolicy is often enforced here too.\nIn the code:\ncni_plugin calico | cilium | aws-vpc-cni. pod ip 10.1.2.5 from the plugin, not from Compose. NetworkPolicy is often enforced here. without a plugin, pods have no cluster network.\nA common mistake is installing NetworkPolicy objects with a CNI that ignores them, then thinking you are isolated.",
      "code": "# who hands out pod phone numbers\ncni_plugin: \"calico | cilium | aws-vpc-cni | ...\"\npod:\n  ip: 10.1.2.5                 # from the plugin, not from Compose\n# NetworkPolicy is often enforced here too\n# without a plugin, pods have no cluster network"
    },
    {
      "id": 43,
      "level": "intermediate",
      "q": "NetworkPolicy?",
      "a": "A NetworkPolicy is a firewall for pods. This example: only pods labeled app=api may connect to db on 5432.\nWithout any policy, everyone in the cluster may knock. Isolation is opt-in on many clusters.\nIn the code:\npodSelector app db, policyTypes Ingress, from podSelector app api, port 5432. only api rooms may knock on db:5432. without any policy, everyone may knock.\nA common mistake is a policy that forgets DNS or health probes, then 'the db is down' but it is the policy.",
      "code": "apiVersion: networking.k8s.io/v1\nkind: NetworkPolicy\nmetadata: { name: db-allow-api }\nspec:\n  podSelector: { matchLabels: { app: db } }\n  policyTypes: [Ingress]\n  ingress:\n    - from:\n        - podSelector: { matchLabels: { app: api } }\n      ports: [{ protocol: TCP, port: 5432 }]\n# only api rooms may knock on db:5432\n# without any policy, everyone in the cluster may knock"
    },
    {
      "id": 44,
      "level": "intermediate",
      "q": "StatefulSet?",
      "a": "A StatefulSet gives stable pod names (pg-0, pg-1) and a volume per identity via volumeClaimTemplates.\nReplicas are not interchangeable like Deployment copies. Use this when identity and disk matter (databases). Still not magic HA Postgres by itself.\nIn the code:\nserviceName pg-headless, replicas 3, volumeClaimTemplates data 20Gi ReadWriteOnce. pods pg-0, pg-1, pg-2 each with their own PVC.\nA common mistake is a Deployment with one PVC ReadWriteOnce and replicas 3, then attach conflicts.",
      "code": "apiVersion: apps/v1\nkind: StatefulSet\nmetadata: { name: pg }\nspec:\n  serviceName: pg-headless\n  replicas: 3\n  selector: { matchLabels: { app: pg } }\n  template:\n    metadata: { labels: { app: pg } }\n    spec:\n      containers:\n        - name: postgres\n          image: postgres:16\n          volumeMounts: [{ name: data, mountPath: /var/lib/postgresql/data }]\n  volumeClaimTemplates:\n    - metadata: { name: data }\n      spec:\n        accessModes: [\"ReadWriteOnce\"]\n        resources: { requests: { storage: 20Gi } }\n# pods: pg-0, pg-1, pg-2 each with their own PVC"
    },
    {
      "id": 45,
      "level": "intermediate",
      "q": "DaemonSet?",
      "a": "A DaemonSet wants one pod per node (or per matching node): log agents, node metrics, CNI helpers.\nAdd a node, get another agent. It is not for scaling an API to 50 copies on one fat node.\nIn the code:\nDaemonSet log-agent, container log-agent:1, comments nodeSelector/tolerations for special floors. 5 nodes -> 5 agents; add a node -> 6th agent.\nA common mistake is DaemonSet for the web API because 'we want it on every machine.' Use a Deployment.",
      "code": "apiVersion: apps/v1\nkind: DaemonSet\nmetadata: { name: log-agent }\nspec:\n  selector: { matchLabels: { app: log-agent } }\n  template:\n    metadata: { labels: { app: log-agent } }\n    spec:\n      containers:\n        - name: agent\n          image: log-agent:1\n      # nodeSelector / tolerations to skip or include special floors\n# 5 nodes -> 5 agents; add a node -> 6th agent"
    },
    {
      "id": 46,
      "level": "intermediate",
      "q": "Job vs CronJob?",
      "a": "A Job runs pods until a success count. CronJob creates Jobs on a schedule.\nbackoffLimit caps retries. restartPolicy Never or OnFailure, not Always. concurrencyPolicy Forbid avoids overlapping nightly jobs.\nIn the code:\nJob migrate command node migrate.js backoffLimit 4 restartPolicy Never. CronJob nightly-report schedule 0 3 * * * Forbid, command node report.js.\nA common mistake is a Deployment for migrate.js so it runs forever and reapplies migrations on every crash loop.",
      "code": "apiVersion: batch/v1\nkind: Job\nmetadata: { name: migrate }\nspec:\n  backoffLimit: 4\n  template:\n    spec:\n      restartPolicy: Never\n      containers:\n        - name: migrate\n          image: myapp:1.0.2\n          command: [\"node\", \"migrate.js\"]\n---\napiVersion: batch/v1\nkind: CronJob\nmetadata: { name: nightly-report }\nspec:\n  schedule: \"0 3 * * *\"\n  concurrencyPolicy: Forbid\n  jobTemplate:\n    spec:\n      template:\n        spec:\n          restartPolicy: OnFailure\n          containers: [{ name: report, image: myapp:1.0.2, command: [\"node\", \"report.js\"] }]"
    },
    {
      "id": 47,
      "level": "intermediate",
      "q": "PVC and PV?",
      "a": "A PVC is a ticket: I need 20Gi of this storage class. A PV is the real locker the ticket binds to.\nThe pod mounts the PVC. The cluster provisions the disk (dynamic) or you pre-created the PV.\nIn the code:\nPVC photos 20Gi gp3 ReadWriteOnce. container volumeMount /data claimName photos. the ticket PVC binds to a real locker PV.\nA common mistake is deleting the PVC thinking the pod still holds the files. The volume claim is the ticket; delete it and the disk policy may wipe data.",
      "code": "apiVersion: v1\nkind: PersistentVolumeClaim\nmetadata: { name: photos }\nspec:\n  accessModes: [\"ReadWriteOnce\"]\n  storageClassName: gp3\n  resources: { requests: { storage: 20Gi } }\n---\nspec:\n  containers:\n    - name: api\n      volumeMounts: [{ name: photos, mountPath: /data }]\n  volumes:\n    - name: photos\n      persistentVolumeClaim: { claimName: photos }\n# the ticket (PVC) binds to a real locker (PV)"
    },
    {
      "id": 48,
      "level": "intermediate",
      "q": "emptyDir?",
      "a": "emptyDir is a whiteboard on the pod: shared among containers in that pod, empty when the pod is rescheduled.\nNot a PVC locker. Good for scratch and sidecar log sharing. Bad for customer uploads you must keep.\nIn the code:\napi and warmer both mount cache. volumes cache emptyDir. pod reschedule -> empty whiteboard.\nA common mistake is emptyDir for a database because it was the default example.",
      "code": "spec:\n  containers:\n    - name: api\n      volumeMounts: [{ name: cache, mountPath: /cache }]\n    - name: warmer\n      volumeMounts: [{ name: cache, mountPath: /cache }]\n  volumes:\n    - name: cache\n      emptyDir: {}            # whiteboard, not a PVC locker\n# pod reschedule -> empty whiteboard"
    },
    {
      "id": 49,
      "level": "advanced",
      "q": "storage access modes?",
      "a": "Access modes: ReadWriteOnce one node may attach (typical cloud disks). ReadOnlyMany many readers. ReadWriteMany many writers, needs a filesystem that allows it.\nA second replica on another node plus RWO is an attach conflict.\nIn the code:\naccessModes ReadWriteOnce EBS-like, commented ReadOnlyMany and ReadWriteMany. a second replica on another node + RWO = attach conflict.\nA common mistake is scaling a Deployment to 3 with one RWO PVC.",
      "code": "apiVersion: v1\nkind: PersistentVolumeClaim\nmetadata: { name: photos }\nspec:\n  accessModes:\n    - ReadWriteOnce           # one node may attach (EBS-like)\n    # ReadOnlyMany            # many readers\n    # ReadWriteMany           # many writers — need a filesystem that allows it\n  resources: { requests: { storage: 20Gi } }\n# a second replica on another node + RWO = attach conflict"
    },
    {
      "id": 50,
      "level": "intermediate",
      "q": "HPA?",
      "a": "HPA (Horizontal Pod Autoscaler) changes Deployment replicas from min to max based on metrics, often CPU utilization.\nThe Deployment must set cpu requests or that utilization number is a lie. HPA does not add nodes by itself.\nIn the code:\nscaleTargetRef Deployment api, minReplicas 2 maxReplicas 10, metric cpu averageUtilization 70. Deployment must set cpu requests or this number is a lie.\nA common mistake is HPA on CPU with no requests, then it scales on junk math.",
      "code": "apiVersion: autoscaling/v2\nkind: HorizontalPodAutoscaler\nmetadata: { name: api }\nspec:\n  scaleTargetRef:\n    apiVersion: apps/v1\n    kind: Deployment\n    name: api\n  minReplicas: 2\n  maxReplicas: 10\n  metrics:\n    - type: Resource\n      resource:\n        name: cpu\n        target: { type: Utilization, averageUtilization: 70 }\n# Deployment must set cpu requests or this number is a lie"
    },
    {
      "id": 51,
      "level": "intermediate",
      "q": "VPA and cluster autoscaler?",
      "a": "HPA adds more rooms of the same size. VPA (Vertical) changes the backpack per room (requests). Cluster autoscaler adds a node when a pod is Pending for insufficient CPU.\nPending plus a small HPA max is still Pending if no floor fits.\nIn the code:\nhpa replicas 2 to 10. vpa requests 128Mi to 512Mi. cluster_autoscaler reason pod Pending insufficient cpu, action add a node. Pending + small HPA max is still Pending if no floor fits.\nA common mistake is turning on HPA only, with a full cluster and no cluster autoscaler, then wondering why replicas stay at min.",
      "code": "# three knobs\nhpa: { replicas: \"2 -> 10\" }           # more rooms of the same size\nvpa: { requests: \"128Mi -> 512Mi\" }    # bigger backpack per room\ncluster_autoscaler:\n  reason: \"pod Pending, insufficient cpu\"\n  action: \"add a node\"\n# Pending + small HPA max is still Pending if no floor fits"
    },
    {
      "id": 52,
      "level": "intermediate",
      "q": "taints and tolerations?",
      "a": "A taint on a node repels pods unless they have a matching toleration (staff badge). GPU nodes often taint so only trainers sit there.\nNoSchedule means the receptionist will not use that floor without the badge. Existing pods may still sit until evicted.\nIn the code:\ncomment node worker-gpu taint gpu=true:NoSchedule. pod train tolerations key gpu Equal true NoSchedule. limits nvidia.com/gpu 1. without the badge, the receptionist will not use that floor.\nA common mistake is tainting all nodes and forgetting to tolerate the DaemonSet that collects logs, so agents vanish.",
      "code": "# floor sign\n# node worker-gpu has taint: gpu=true:NoSchedule\napiVersion: v1\nkind: Pod\nmetadata: { name: train }\nspec:\n  tolerations:\n    - key: gpu\n      operator: Equal\n      value: \"true\"\n      effect: NoSchedule          # staff badge\n  containers:\n    - name: train\n      image: trainer:1\n      resources: { limits: { nvidia.com/gpu: 1 } }\n# without the badge, the receptionist will not use that floor"
    },
    {
      "id": 53,
      "level": "intermediate",
      "q": "affinity / anti-affinity?",
      "a": "Affinity prefers (or requires) packing pods near something. Anti-affinity prefers not putting two api pods on the same hostname.\npreferred can ignore if impossible. required can leave pods Pending.\nIn the code:\npodAntiAffinity preferred weight 100 matchLabels app api topologyKey hostname. prefer not to put two api pods on the same hostname. requiredDuringScheduling would refuse instead of prefer.\nA common mistake is required anti-affinity on hostname with 10 replicas and 3 nodes, so 7 sit Pending.",
      "code": "spec:\n  affinity:\n    podAntiAffinity:\n      preferredDuringSchedulingIgnoredDuringExecution:\n        - weight: 100\n          podAffinityTerm:\n            labelSelector: { matchLabels: { app: api } }\n            topologyKey: kubernetes.io/hostname\n# prefer not to put two api pods on the same hostname\n# requiredDuringScheduling... would refuse instead of prefer"
    },
    {
      "id": 54,
      "level": "intermediate",
      "q": "nodeSelector?",
      "a": "nodeSelector is an exact label match: node must have disktype=ssd.\nAffinity can say IN, NOT IN, prefer. This knob is only exact match. Simple and easy to forget to label the nodes.\nIn the code:\nnodeSelector disktype ssd. container image myapp:1.0.2. node must have label disktype=ssd. affinity can say IN, NOT IN, prefer — this is only exact match.\nA common mistake is nodeSelector on a typo label, then Pending forever with FailedScheduling.",
      "code": "spec:\n  nodeSelector:\n    disktype: ssd\n  containers:\n    - name: api\n      image: myapp:1.0.2\n# node must have label disktype=ssd\n# affinity can say IN, NOT IN, prefer — this is only exact match"
    },
    {
      "id": 55,
      "level": "intermediate",
      "q": "PDB?",
      "a": "A PodDisruptionBudget (PDB) says minAvailable (or maxUnavailable) during voluntary disruption like drain.\ndrain will wait if evicting would leave fewer than 2. replicas 3 plus minAvailable 2 means one can leave at a time.\nIn the code:\nkind PodDisruptionBudget api minAvailable 2 selector app api. drain will wait if evicting would leave fewer than 2. replicas 3 plus this PDB = one can leave at a time.\nA common mistake is minAvailable 100% with 1 replica, then you can never drain that node.",
      "code": "apiVersion: policy/v1\nkind: PodDisruptionBudget\nmetadata: { name: api }\nspec:\n  minAvailable: 2\n  selector: { matchLabels: { app: api } }\n# drain will wait if evicting would leave fewer than 2\n# replicas: 3 plus this PDB = one can leave at a time"
    },
    {
      "id": 56,
      "level": "intermediate",
      "q": "drain?",
      "a": "drain is two steps: cordon (no new pods) then evict existing pods, honoring PDBs.\nAfter drain the floor is empty for a kubelet upgrade. uncordon later reopens the floor.\nIn the code:\n1 cordon node unschedulable no new pods. 2 evict existing pods, PDBs apply. after drain the floor is empty for kubelet upgrade. uncordon later reopens the floor.\nA common mistake is drain without a PDB on a 1-replica API, taking production down for a node upgrade.",
      "code": "# drain is a two-step story\n# 1. cordon: node unschedulable (no new pods)\n# 2. evict: existing pods leave, PDBs apply\n#\n# after drain, the floor is empty for kubelet upgrade\n# uncordon later reopens the floor"
    },
    {
      "id": 57,
      "level": "intermediate",
      "q": "cordon?",
      "a": "cordon marks a node unschedulable: no vacancy, current guests stay. drain also moves guests. NotReady means kubelet is not reporting well.\nReady plus schedulable means new guests welcome.\nIn the code:\nReady + schedulable new guests welcome. Ready + cordoned no vacancy, current guests stay. drain no vacancy AND guests moved. NotReady floor manager kubelet not reporting well.\nA common mistake is cordon and then wondering why a new Deployment's pods never land on that big empty node. You asked for no vacancy.",
      "code": "# node statuses (ideas)\n# Ready + schedulable: new guests welcome\n# Ready + cordoned:    no vacancy, current guests stay\n# drain:               no vacancy AND guests moved\n# NotReady:            floor manager (kubelet) not reporting well"
    },
    {
      "id": 58,
      "level": "advanced",
      "q": "resource quota and limit range?",
      "a": "ResourceQuota caps a namespace: total requests, pod count. LimitRange fills default requests/limits when a container omitted them.\nNew containers without resources get these breakers so BestEffort does not take over the floor.\nIn the code:\nResourceQuota team-a hard requests.cpu 8 memory 16Gi pods 40. LimitRange defaultRequest 100m/128Mi default 500m/256Mi. new containers without resources get these breakers.\nA common mistake is a Quota on limits while developers set only requests, then creates fail with a message nobody reads.",
      "code": "apiVersion: v1\nkind: ResourceQuota\nmetadata: { name: team-a, namespace: team-a }\nspec:\n  hard:\n    requests.cpu: \"8\"\n    requests.memory: 16Gi\n    pods: \"40\"\n---\napiVersion: v1\nkind: LimitRange\nmetadata: { name: defaults, namespace: team-a }\nspec:\n  limits:\n    - type: Container\n      defaultRequest: { cpu: \"100m\", memory: 128Mi }\n      default: { cpu: \"500m\", memory: 256Mi }\n# new containers without resources get these breakers"
    },
    {
      "id": 59,
      "level": "intermediate",
      "q": "init container?",
      "a": "Init containers run in order, to completion, before the app container starts. wait-for-db then migrate then api.\nCareful: migrate in every replica races. One Job for migrate is often safer than five inits.\nIn the code:\ninitContainers wait-for-db busybox until nc -z db 5432, then migrate node migrate.js careful one pod not five replicas racing. containers api. inits in order, then api.\nA common mistake is a long init that needs a secret you only mounted on the main container.",
      "code": "spec:\n  initContainers:\n    - name: wait-for-db\n      image: busybox:1.36\n      command: [\"sh\", \"-c\", \"until nc -z db 5432; do sleep 2; done\"]\n    - name: migrate\n      image: myapp:1.0.2\n      command: [\"node\", \"migrate.js\"]   # careful: one pod, not five replicas racing\n  containers:\n    - name: api\n      image: myapp:1.0.2\n# inits in order, then api"
    },
    {
      "id": 60,
      "level": "intermediate",
      "q": "sidecar?",
      "a": "A sidecar is a second container in the same pod, often a proxy. They share network. Their CPU and memory requests add up on the floor.\nlocalhost:15001 might be the mesh. The sidecar dies if the pod dies.\nIn the code:\ncontainers api port 3000 and envoy sidecar port 15001. localhost:15001 might be the mesh. requests.cpu of both add up on the floor.\nA common mistake is sizing the pod for the api only, then Pending because envoy's requests were forgotten.",
      "code": "spec:\n  containers:\n    - name: api\n      image: myapp:1.0.2\n      ports: [{ containerPort: 3000 }]\n    - name: envoy                   # sidecar\n      image: envoy:v1.29\n      ports: [{ containerPort: 15001 }]\n# localhost:15001 might be the mesh\n# requests.cpu of both add up on the floor"
    },
    {
      "id": 61,
      "level": "intermediate",
      "q": "service mesh in one sentence?",
      "a": "A service mesh injects a sidecar proxy next to each app so mTLS, retries, and telemetry can live between proxies instead of only in Express.\nYour code stays simpler. The mesh config becomes another control plane to learn.\nIn the code:\ncontainers api and istio-proxy. mTLS happens between proxies, not in your Express code. retries/timeouts can live in mesh config, not only in the app.\nA common mistake is adding a mesh to fix one timeout, then spending a month on sidecar memory.",
      "code": "# every app room gets a radio operator\nspec:\n  containers:\n    - name: api\n      image: myapp:1.0.2\n    - name: istio-proxy\n      image: proxyv2:1.20\n# mTLS happens between proxies, not in your Express code\n# retries/timeouts can live in mesh config, not only in the app"
    },
    {
      "id": 62,
      "level": "beginner",
      "q": "How does a browser reach a pod?",
      "a": "A browser path: DNS to the host, cloud LoadBalancer to the Ingress controller, Ingress rule to a Service, kube-proxy to a Ready pod IP:targetPort. NetworkPolicy may drop the packet.\nThe Service selector is the last internal name tag hop.\nIn the code:\nComments steps 1-5 DNS, LB, Ingress /api, Service api:80, kube-proxy to Pod 10.1.2.5:3000 if Ready, NetworkPolicy may drop. Service selector app api port 80 targetPort 3000.\nA common mistake is curling the pod IP from your laptop. That IP is inside the cluster network, not on the internet.",
      "code": "# path of a request\n# 1. browser -> shop.example.com (DNS)\n# 2. cloud LoadBalancer -> Ingress controller Service\n# 3. Ingress rule /api -> Service api:80\n# 4. kube-proxy -> Pod 10.1.2.5:3000 (if Ready)\n# 5. NetworkPolicy may drop the packet\napiVersion: v1\nkind: Service\nmetadata: { name: api }\nspec:\n  selector: { app: api }\n  ports: [{ port: 80, targetPort: 3000 }]"
    },
    {
      "id": 63,
      "level": "intermediate",
      "q": "Endpoints vs EndpointSlice?",
      "a": "Endpoints / EndpointSlice are the switchboard list of pod IPs behind a Service. Ready false means reception will not transfer.\n0 ready endpoints means client timeouts. Readiness probe failures empty this list on purpose.\nIn the code:\nservice api, endpointSlices api-aaa ready true, api-bbb ready false not in the live list. ready false -> reception will not transfer. 0 ready endpoints -> connection timeout from clients.\nA common mistake is Service selector matching zero pods, then 'the service is down' while Deployments look fine under a different label.",
      "code": "# switchboard list (idea)\nservice: api\nendpointSlices:\n  - { pod: api-aaa, ip: 10.1.2.5, port: 3000, ready: true }\n  - { pod: api-bbb, ip: 10.1.2.6, port: 3000, ready: false }  # not in the live list\n# ready false -> reception will not transfer\n# 0 ready endpoints -> connection timeout from clients"
    },
    {
      "id": 64,
      "level": "intermediate",
      "q": "headless service?",
      "a": "A headless Service has clusterIP None: no virtual desk number. DNS returns pod IPs (and StatefulSet names like pg-0.pg-headless...).\nUsed with StatefulSet serviceName so each identity has a DNS name.\nIn the code:\nService pg-headless clusterIP None selector app pg port 5432. DNS pg-0.pg-headless.ns.svc.cluster.local -> that pod's IP. used with StatefulSet serviceName.\nA common mistake is pointing a normal web client at a headless Service expecting load balancing through a VIP. There is no VIP.",
      "code": "apiVersion: v1\nkind: Service\nmetadata: { name: pg-headless }\nspec:\n  clusterIP: None             # no virtual desk number\n  selector: { app: pg }\n  ports: [{ port: 5432 }]\n# DNS: pg-0.pg-headless.ns.svc.cluster.local -> that pod's IP\n# used with StatefulSet serviceName"
    },
    {
      "id": 65,
      "level": "intermediate",
      "q": "ExternalName service?",
      "a": "ExternalName is a Service that is only a DNS CNAME to an outside name. No pods, no endpoints.\nInside the cluster, payments.ns.svc.cluster.local becomes payments.example.com. Useful as a stable in-cluster name for an external API.\nIn the code:\ntype ExternalName externalName payments.example.com. inside the cluster, payments.ns.svc.cluster.local is a CNAME. no endpoints, no pods.\nA common mistake is expecting NetworkPolicy podSelector to apply to ExternalName. There is no pod.",
      "code": "apiVersion: v1\nkind: Service\nmetadata: { name: payments }\nspec:\n  type: ExternalName\n  externalName: payments.example.com\n# inside the cluster, payments.ns.svc.cluster.local is a CNAME\n# no endpoints, no pods"
    },
    {
      "id": 66,
      "level": "advanced",
      "q": "kube-proxy iptables vs ipvs?",
      "a": "kube-proxy can use iptables or ipvs mode. Both implement VIP -> pod IPs. ipvs can behave better with huge numbers of Services.\nThis is a cluster setting, not app YAML. Your Service object looks the same.\nIn the code:\nkube_proxy_mode iptables common default, commented ipvs better with huge numbers of Services. service clusterIP and endpoints two pods. both modes VIP -> pod IPs.\nA common mistake is switching to ipvs to 'fix' an Ingress 404. Wrong layer.",
      "code": "# two sorting machines (cluster setting, not app YAML)\nkube_proxy_mode: \"iptables\"   # common default\n# kube_proxy_mode: \"ipvs\"     # better with huge numbers of Services\nservice:\n  clusterIP: 10.96.10.20\n  endpoints: [\"10.1.2.5:3000\", \"10.1.2.6:3000\"]\n# both modes implement the same idea: VIP -> pod IPs"
    },
    {
      "id": 67,
      "level": "intermediate",
      "q": "CoreDNS?",
      "a": "CoreDNS is the cluster phone book. api.team-a.svc.cluster.local to ClusterIP. Short names work in the same namespace. kubernetes.default.svc is the API.\nIf CoreDNS pods are down, names stop resolving. Apps say getaddrinfo failed. Look at kube-system first.\nIn the code:\nphone book comments api.team-a.svc.cluster.local -> ClusterIP, short name in the same ns, kubernetes.default.svc the API. if CoreDNS pods are down, those names stop resolving.\nA common mistake is changing the app URL to an IP to 'fix DNS' and then breaking the next deploy when the ClusterIP changes.",
      "code": "# phone book entries CoreDNS serves\n# api.team-a.svc.cluster.local      -> ClusterIP\n# api.team-a.svc                    -> short name in the same ns\n# kubernetes.default.svc            -> the API\n#\n# if CoreDNS pods are down, those names stop resolving\n# apps will say \"getaddrinfo failed\" — look at kube-system first"
    },
    {
      "id": 68,
      "level": "beginner",
      "q": "kubectl port-forward?",
      "a": "port-forward is a private straw from your laptop to one pod (or service) for this session only.\nWhen the straw ends, the public internet still cannot enter. Production doors are Service and Ingress papers.\nIn the code:\nlaptop localhost:8080 tunnel this session only target pod api-xyz:3000. browser -> straw -> that one room. when the straw ends, the public internet still cannot enter.\nA common mistake is port-forward as the production expose method, then the deploy laptop sleeps.",
      "code": "# a private straw (idea)\nlaptop: localhost:8080\ntunnel: \"this session only\"\ntarget: \"pod api-xyz:3000\"\n# your browser -> straw -> that one room\n# when the straw session ends, the public internet still cannot enter\n# production doors are Service / Ingress papers"
    },
    {
      "id": 69,
      "level": "intermediate",
      "q": "Helm?",
      "a": "Helm is a furniture kit: charts plus values.yaml knobs (replicas, image tag, service type). Helm renders Deployment and Service YAML. A Release is this kit, these values, in this namespace.\nYou still must understand the YAML it emits.\nIn the code:\nvalues replicaCount 3, image repository myapp tag 1.0.2, service ClusterIP port 80. Helm renders Deployment + Service YAML from these knobs. a Release is this kit, these knob values, in this namespace.\nA common mistake is helm upgrade --reuse-values forever and not knowing which image tag is live.",
      "code": "# values.yaml — knobs on a furniture kit\nreplicaCount: 3\nimage:\n  repository: myapp\n  tag: \"1.0.2\"\nservice:\n  type: ClusterIP\n  port: 80\n# Helm renders Deployment + Service YAML from these knobs\n# a Release is \"this kit, these knob values, in this namespace\""
    },
    {
      "id": 70,
      "level": "intermediate",
      "q": "Kustomize?",
      "a": "Kustomize is tracing paper: a base YAML plus overlays that patch replicas and image for prod.\nNo templating language required. kubectl apply -k is built in. Overlays should stay small or they become a second Helm.\nIn the code:\nbase deployment replicas 1. overlays/prod kustomization resources ../../base, patches replace replicas 5 and image myapp:1.0.2. prod tracing paper changes count and image.\nA common mistake is forking the whole base per env instead of patches, then three copies of the same bug.",
      "code": "# base/deployment.yaml has replicas: 1\n# overlays/prod/kustomization.yaml\nresources:\n  - ../../base\npatches:\n  - target: { kind: Deployment, name: api }\n    patch: |-\n      - op: replace\n        path: /spec/replicas\n        value: 5\n      - op: replace\n        path: /spec/template/spec/containers/0/image\n        value: myapp:1.0.2\n# prod tracing paper changes count and image"
    },
    {
      "id": 71,
      "level": "intermediate",
      "q": "GitOps?",
      "a": "GitOps means git is the flight plan. Argo or Flux watches the repo and apply until the cluster matches. If someone live-edits replicas to 10, the robot sets it back to 3 (or shows drift).\nkubectl edit prod is not the process.\nIn the code:\nrepo apps/api/deployment.yaml replicas 3 image 1.0.2. Argo/Flux watches git, apply until cluster matches, live-edit replicas 10 gets set back to 3 or shows drift.\nA common mistake is GitOps plus random kubectl edit, then a fight every three minutes.",
      "code": "# git is the flight plan\n# repo:\n#   apps/api/deployment.yaml   replicas: 3  image: myapp:1.0.2\n#\n# Argo/Flux:\n#   watches git\n#   apply until cluster matches\n#   if someone live-edits replicas to 10, the robot sets it back to 3\n#   (or shows drift — depending on policy)"
    },
    {
      "id": 72,
      "level": "intermediate",
      "q": "operators?",
      "a": "An operator is a controller for a Custom Resource. You write PostgresCluster spec instances 3. The operator creates StatefulSets, Services, backups.\nYou did not write those objects by hand. You must still understand what it created when it breaks.\nIn the code:\nkind PostgresCluster name shop spec instances 3 storage 50Gi backup schedule 0 2 * * *. you did not write the StatefulSet by hand. the operator watches this CR and creates the real k8s objects.\nA common mistake is kubectl delete pod on an operator-managed database and fighting the operator's idea of identity.",
      "code": "apiVersion: postgres.example.com/v1\nkind: PostgresCluster\nmetadata: { name: shop }\nspec:\n  instances: 3\n  storage: 50Gi\n  backup:\n    schedule: \"0 2 * * *\"\n# you did not write the StatefulSet by hand\n# the operator watches this CR and creates the real k8s objects"
    },
    {
      "id": 73,
      "level": "intermediate",
      "q": "CRD?",
      "a": "A CRD (CustomResourceDefinition) teaches the API a new kind, such as PostgresCluster. After this, the API accepts that kind. Without a CRD, apply says no matches.\nThe CRD is the schema. The operator is the brain that acts on objects of that kind.\nIn the code:\nkind CustomResourceDefinition postgresclusters.postgres.example.com, group, names kind PostgresCluster, scope Namespaced, versions v1 served storage. after this, the API accepts kind PostgresCluster.\nA common mistake is installing the operator without the CRD, or the CRD without the operator. You need both.",
      "code": "apiVersion: apiextensions.k8s.io/v1\nkind: CustomResourceDefinition\nmetadata: { name: postgresclusters.postgres.example.com }\nspec:\n  group: postgres.example.com\n  names: { kind: PostgresCluster, plural: postgresclusters }\n  scope: Namespaced\n  versions:\n    - name: v1\n      served: true\n      storage: true\n# after this, the API accepts kind: PostgresCluster"
    },
    {
      "id": 74,
      "level": "advanced",
      "q": "admission controllers / webhooks?",
      "a": "Admission webhooks sit on create/update. Mutating injects a sidecar. Validating rejects privileged: true.\nIf the webhook Service is down and failurePolicy is Fail, the front desk rejects ALL matching papers. Webhook HA matters.\nIn the code:\nMutatingWebhook inject istio-proxy. ValidatingWebhook reject privileged true. if the webhook Service is down and failurePolicy is Fail, the front desk rejects ALL matching papers.\nA common mistake is a validating webhook in a namespace that cannot reach the webhook pod, then nobody can deploy.",
      "code": "# every Deployment create goes past a guard\n# MutatingWebhook: inject istio-proxy container\n# ValidatingWebhook: reject privileged: true\n#\n# if the webhook Service is down and failurePolicy is Fail\n# the front desk rejects ALL matching papers\n# that is why webhook HA matters"
    },
    {
      "id": 75,
      "level": "intermediate",
      "q": "Pod Security / PSS?",
      "a": "Pod Security Standards (PSS) are namespace labels: privileged, baseline, restricted. enforce restricted rejects root, privileged, host namespaces.\nA YAML with runAsUser 0 is rejected at the desk. warn vs enforce is how you roll it out.\nIn the code:\nNamespace team-a labels pod-security enforce restricted and warn restricted. pods in team-a must not be privileged, must not be root. a YAML with runAsUser 0 is rejected at the desk.\nA common mistake is enforce restricted on a namespace full of old images that require root, then a Friday outage of creates.",
      "code": "apiVersion: v1\nkind: Namespace\nmetadata:\n  name: team-a\n  labels:\n    pod-security.kubernetes.io/enforce: restricted\n    pod-security.kubernetes.io/warn: restricted\n# pods in team-a must not be privileged, must not be root, etc.\n# a YAML with runAsUser: 0 is rejected at the desk"
    },
    {
      "id": 76,
      "level": "intermediate",
      "q": "securityContext?",
      "a": "securityContext is the lock on the pod and container: non-root user, no privilege escalation, drop capabilities, read-only root, seccomp.\nreadOnlyRootFilesystem needs a writable /tmp emptyDir if the app writes temp files.\nIn the code:\npod securityContext runAsNonRoot runAsUser 1000 seccomp RuntimeDefault. container allowPrivilegeEscalation false readOnlyRootFilesystem drop ALL. volumeMount tmp emptyDir.\nA common mistake is readOnlyRootFilesystem without /tmp, then the app crashes creating a socket file.",
      "code": "spec:\n  securityContext:\n    runAsNonRoot: true\n    runAsUser: 1000\n    seccompProfile: { type: RuntimeDefault }\n  containers:\n    - name: api\n      image: myapp:1.0.2\n      securityContext:\n        allowPrivilegeEscalation: false\n        readOnlyRootFilesystem: true\n        capabilities: { drop: [\"ALL\"] }\n      volumeMounts: [{ name: tmp, mountPath: /tmp }]\n  volumes: [{ name: tmp, emptyDir: {} }]"
    },
    {
      "id": 77,
      "level": "beginner",
      "q": "How do you update an app?",
      "a": "Update an app by changing the image tag on the Deployment template to a unique version, then apply. ReplicaSets shift. The Service stays. Rolling update keeps some old copies until new ones are Ready.\nimagePullPolicy IfNotPresent is fine with unique tags. latest is the trap.\nIn the code:\nreplicas 3, image myapp:1.0.3 was 1.0.2 unique tag, imagePullPolicy IfNotPresent. apply this paper; ReplicaSets shift; Service stays.\nA common mistake is changing only an env value you forgot to include in the pod template hash mental model — actually env changes do roll. Changing a Secret file may not, unless you also bump the pod template.",
      "code": "apiVersion: apps/v1\nkind: Deployment\nmetadata: { name: api }\nspec:\n  replicas: 3\n  selector: { matchLabels: { app: api } }\n  template:\n    metadata: { labels: { app: api } }\n    spec:\n      containers:\n        - name: api\n          image: myapp:1.0.3          # was 1.0.2 — unique tag\n          imagePullPolicy: IfNotPresent\n# apply this paper; ReplicaSets shift; Service stays"
    },
    {
      "id": 78,
      "level": "intermediate",
      "q": "Why is latest a problem in k8s?",
      "a": ":latest is a problem because the word in the YAML never changes, so Kubernetes may think nothing changed, and IfNotPresent keeps yesterday's cake on the node.\nUse myapp:1.0.4 or a digest. Unique tags make the node fetch.\nIn the code:\nimage myapp:latest the word never changes, imagePullPolicy IfNotPresent node keeps yesterday's cake. better myapp:1.0.4 or sha256. Always / unique tags make the node fetch.\nA common mistake is Always plus latest, which still does not record which bytes you wanted in git.",
      "code": "spec:\n  containers:\n    - name: api\n      image: myapp:latest           # the word never changes\n      imagePullPolicy: IfNotPresent # node keeps yesterday's cake\n# better:\n#   image: myapp:1.0.4\n#   # or myapp@sha256:abc...\n# Always / unique tags make the node fetch"
    },
    {
      "id": 79,
      "level": "intermediate",
      "q": "blue/green and canary on k8s?",
      "a": "Blue/green: two Deployments, Service selector flips version: blue to version: green. Canary: a small extra Deployment sharing the Service selector, or Ingress weights.\nThe Service is the switchboard. Pods keep their labels honest.\nIn the code:\nService selector app api version green, flip this label. canary: a second Deployment with 1 replica, same Service selector, or Ingress weights.\nA common mistake is flipping the Service before the green pods are Ready, so the switchboard points at an empty list.",
      "code": "# blue/green: two factories, one switchboard\n# Service selector: version: blue   then flip to version: green\napiVersion: v1\nkind: Service\nmetadata: { name: api }\nspec:\n  selector: { app: api, version: green }   # flip this label\n  ports: [{ port: 80, targetPort: 3000 }]\n# canary: a second Deployment with 1 replica, same Service selector, or Ingress weights"
    },
    {
      "id": 80,
      "level": "advanced",
      "q": "ingress controller vs cloud LB?",
      "a": "One cloud LoadBalancer in front of an Ingress controller, then many Ingress objects for many hosts, is cheaper than a LoadBalancer Service per app.\nIngressClassName picks the controller. Many Ingress papers, one LB.\nIn the code:\ncomments Service ingress-nginx type LoadBalancer one cloud LB. Ingress shop host shop.example.com path / backend shop:80. many Ingress papers, one LB.\nA common mistake is a LoadBalancer Service per microservice and a surprise cloud bill.",
      "code": "# cheaper city plan\n# Service ingress-nginx type LoadBalancer  -> one cloud LB\n# Ingress objects: shop.example.com, blog.example.com\napiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata: { name: shop }\nspec:\n  ingressClassName: nginx\n  rules:\n    - host: shop.example.com\n      http:\n        paths:\n          - path: /\n            pathType: Prefix\n            backend: { service: { name: shop, port: { number: 80 } } }\n# many Ingress papers, one LB"
    },
    {
      "id": 81,
      "level": "intermediate",
      "q": "HPA flapping?",
      "a": "HPA flapping is scale up and down every minute on noisy CPU. stabilizationWindowSeconds on scaleDown waits before closing tills.\nTune windows and target utilization. Also fix CPU requests so the metric is real.\nIn the code:\nmin 3 max 20, behavior scaleDown stabilizationWindowSeconds 300 wait before closing tills, cpu averageUtilization 65.\nA common mistake is target 90% CPU so you scale only when users already feel pain, then scaleDown immediately when a blip passes.",
      "code": "apiVersion: autoscaling/v2\nkind: HorizontalPodAutoscaler\nmetadata: { name: api }\nspec:\n  scaleTargetRef:\n    apiVersion: apps/v1\n    kind: Deployment\n    name: api\n  minReplicas: 3\n  maxReplicas: 20\n  behavior:\n    scaleDown:\n      stabilizationWindowSeconds: 300   # wait before closing tills\n  metrics:\n    - type: Resource\n      resource:\n        name: cpu\n        target: { type: Utilization, averageUtilization: 65 }"
    },
    {
      "id": 82,
      "level": "intermediate",
      "q": "liveness that hits the database?",
      "a": "Liveness that hits the database turns a DB blip into a restart storm. Liveness should ask 'is Node wedged?' Readiness may check the DB and close the till.\nA DB blip should close the till (readiness), not fire the cashier (liveness).\nIn the code:\nlivenessProbe /livez only is Node wedged. readinessProbe /readyz may check DB. /livez must not SELECT 1 from Postgres.\nA common mistake is one /health that does both, used as liveness.",
      "code": "spec:\n  containers:\n    - name: api\n      livenessProbe:\n        httpGet: { path: /livez, port: 3000 }   # only \"is Node wedged?\"\n      readinessProbe:\n        httpGet: { path: /readyz, port: 3000 }  # may check DB\n# /livez must not SELECT 1 from Postgres\n# a DB blip should close the till (readiness), not fire the cashier (liveness)"
    },
    {
      "id": 83,
      "level": "beginner",
      "q": "How do you run a one-off command?",
      "a": "A one-off command belongs in a Job: recorded janitor, restartPolicy Never, command node scripts/repair.js.\nexec is a whisper — fine for debug, not the migration process. Jobs show up in git and in kubectl get jobs.\nIn the code:\nJob once-repair restartPolicy Never, image myapp:1.0.2, command node scripts/repair.js. a recorded janitor. exec is a whisper — fine for debug, not the migration process.\nA common mistake is exec node migrate.js on a random replica during deploy.",
      "code": "apiVersion: batch/v1\nkind: Job\nmetadata: { name: once-repair }\nspec:\n  template:\n    spec:\n      restartPolicy: Never\n      containers:\n        - name: repair\n          image: myapp:1.0.2\n          command: [\"node\", \"scripts/repair.js\"]\n# a recorded janitor\n# exec is a whisper — fine for debug, not the migration process"
    },
    {
      "id": 84,
      "level": "intermediate",
      "q": "ephemeral debug container?",
      "a": "An ephemeral debug container (or a sidecar with a shell) visits a distroless app that has no sh. shareProcessNamespace can let you see the api pid.\nVisitor has wget/sh. api stays sealed. Do not leave sleep 3600 in production YAML.\nIn the code:\ncontainers api distroless no shell, debugger busybox sleep 3600, shareProcessNamespace true optional see the api pid. visitor has wget/sh; api stays sealed.\nA common mistake is switching the production image to ubuntu 'so we can debug' and shipping that.",
      "code": "# distroless app room + visitor\nspec:\n  containers:\n    - name: api\n      image: gcr.io/distroless/nodejs20\n      # no shell in api\n    - name: debugger                 # ephemeral visitor\n      image: busybox:1.36\n      command: [\"sleep\", \"3600\"]\n      shareProcessNamespace: true    # optional: see the api pid\n# visitor has wget/sh; api stays sealed"
    },
    {
      "id": 85,
      "level": "intermediate",
      "q": "metrics-server?",
      "a": "metrics-server is the bathroom scale for kubectl top and for HPA cpu/memory. Prometheus is a different world for Grafana, custom metrics, alerts.\nIf HPA says unknown metrics, the bathroom scale is missing, not Prometheus.\nIn the code:\nmetrics_server used_by kubectl top and HPA cpu/memory, where kube-system. prometheus used_by Grafana custom HPA alerts, usually another namespace. if HPA says unknown metrics, the bathroom scale is missing.\nA common mistake is installing Prometheus and expecting kubectl top to work.",
      "code": "# two metric worlds\nmetrics_server:\n  used_by: [\"kubectl top\", \"HPA cpu/memory\"]\n  where: \"kube-system\"\nprometheus:\n  used_by: [\"Grafana\", \"custom HPA metrics\", \"alerts\"]\n  where: \"usually another namespace\"\n# if HPA says \"unknown metrics\", the bathroom scale is missing"
    },
    {
      "id": 86,
      "level": "intermediate",
      "q": "Prometheus in k8s?",
      "a": "Prometheus scrapes /metrics. The app exports samples. A ServiceMonitor (operator) can point at a named port metrics.\nGrafana reads Prometheus. This is not metrics-server.\nIn the code:\ncontainer ports http 3000 and metrics 9090. Prometheus scrape /metrics on 9090. ServiceMonitor points at port name metrics. Grafana reads Prometheus.\nA common mistake is scraping the Service ClusterIP once and missing new pods because you did not use pod discovery.",
      "code": "# app exports samples\nspec:\n  containers:\n    - name: api\n      image: myapp:1.0.2\n      ports:\n        - { name: http, containerPort: 3000 }\n        - { name: metrics, containerPort: 9090 }\n# Prometheus scrape: /metrics on 9090\n# ServiceMonitor (operator) points at port name metrics\n# Grafana reads Prometheus"
    },
    {
      "id": 87,
      "level": "beginner",
      "q": "kubectl config / kubeconfig?",
      "a": "kubeconfig is a keyring file: clusters (API URLs), users (tokens or certs), contexts (cluster + user + default namespace), current-context which building you are about to talk to.\nThe current-context is easy to get wrong.\nIn the code:\nclusters prod-eks and minikube. users nitin-prod and minikube. contexts prod and local. current-context local. the current-context is which building you are about to talk to.\nA common mistake is kubectl delete on prod because current-context was prod while you thought local.",
      "code": "# a keyring file (idea)\nclusters:\n  - { name: prod-eks,  server: https://k8s.example.com }\n  - { name: minikube,  server: https://127.0.0.1:8443 }\nusers:\n  - { name: nitin-prod, token: \"***\" }\ncontexts:\n  - { name: prod, cluster: prod-eks, user: nitin-prod, namespace: team-a }\n  - { name: local, cluster: minikube, user: minikube }\ncurrent-context: local\n# the current-context is which building you are about to talk to"
    },
    {
      "id": 88,
      "level": "intermediate",
      "q": "context vs namespace?",
      "a": "Context picks cluster and user (and a default namespace). -n overrides namespace only, still the same cluster.\nDisaster: current-context prod while you thought local. Smaller miss: right cluster, wrong namespace, object not found.\nIn the code:\ncontext cluster prod-eks user nitin default_namespace team-a. -n team-b overrides only the building name (namespace), still prod-eks. disaster prod while you thought local.\nA common mistake is exporting KUBECONFIG to a file you emailed, which contains user keys.",
      "code": "# two independent knobs\ncontext: { cluster: prod-eks, user: nitin, default_namespace: team-a }\n# -n team-b overrides only the building, still prod-eks\n#\n# disaster: current-context prod while you thought local\n# smaller miss: right cluster, wrong namespace, object not found"
    },
    {
      "id": 89,
      "level": "advanced",
      "q": "API versioning (apps/v1)?",
      "a": "apiVersion is group plus version: apps/v1 is the stable Deployment API. Old papers with extensions/v1beta1 must be rewritten before you upgrade the cluster.\nkind plus apiVersion together name the schema. kubectl explain uses that.\nIn the code:\napiVersion apps/v1 kind Deployment, replicas 3, image myapp:1.0.2. old papers with extensions/v1beta1 must be rewritten before upgrade.\nA common mistake is copy-pasting v1beta1 YAML from a 2018 blog onto a new cluster that already removed it.",
      "code": "apiVersion: apps/v1          # group apps, version v1 — stable Deployment\nkind: Deployment\nmetadata: { name: api }\nspec:\n  replicas: 3\n  selector: { matchLabels: { app: api } }\n  template:\n    metadata: { labels: { app: api } }\n    spec:\n      containers: [{ name: api, image: myapp:1.0.2 }]\n# old papers with extensions/v1beta1 must be rewritten before upgrade"
    },
    {
      "id": 90,
      "level": "intermediate",
      "q": "cluster upgrade strategy?",
      "a": "Upgrade order: control plane first, then drain a node, upgrade kubelet, uncordon, repeat. Watch PDBs so not all api pods leave at once. Grep YAML for removed apiVersions before you jump two versions.\nSkipping drain is how you surprise-kill pods on a node that just stopped.\nIn the code:\n1 control plane to v1.(N+1). 2 drain node A, upgrade kubelet, uncordon. 3 repeat floors. 4 watch PDBs. 5 grep YAML for removed apiVersions before you jump two versions.\nA common mistake is upgrading workers before the control plane, or jumping 1.27 to 1.31 in one afternoon.",
      "code": "# renovation order\n# 1. control plane (front desk + filing cabinet) to v1.(N+1)\n# 2. drain node A, upgrade kubelet, uncordon\n# 3. repeat floors\n# 4. watch PDBs so not all api pods leave at once\n# 5. grep YAML for removed apiVersions before you jump two versions"
    },
    {
      "id": 91,
      "level": "intermediate",
      "q": "multi-container pod vs two deployments?",
      "a": "Roommates (same pod) share fate and localhost: log shipper + api. Neighbors (two Deployments) scale independently: api 3 copies, worker 10 copies.\nA worker crash should not restart api. If they scale differently, they are neighbors.\nIn the code:\nDeployment worker replicas 10 independent from api's 3, selector app worker, command node worker.js. worker crash should not restart api.\nA common mistake is one pod with api and worker so HPA on CPU scales both for the wrong reason.",
      "code": "# roommates (same pod): log shipper + api\n# neighbors (two Deployments): api + worker\napiVersion: apps/v1\nkind: Deployment\nmetadata: { name: worker }\nspec:\n  replicas: 10                 # independent from api's 3\n  selector: { matchLabels: { app: worker } }\n  template:\n    metadata: { labels: { app: worker } }\n    spec:\n      containers: [{ name: worker, image: myapp:1.0.2, command: [\"node\", \"worker.js\"] }]\n# worker crash should not restart api"
    },
    {
      "id": 92,
      "level": "advanced",
      "q": "sidecars and shared volumes?",
      "a": "Sidecars that share an emptyDir add their requests together for scheduling. emptyDir dies with the pod.\nFloor must fit 150m CPU and 192Mi together in the example. Size both containers.\nIn the code:\napi requests 100m/128Mi mount logs. shipper 50m/64Mi mount logs. volumes logs emptyDir. floor must fit 150m CPU and 192Mi together. emptyDir dies with the pod.\nA common mistake is a 1Gi emptyDir of logs on a memory-backed emptyDir medium, then node memory blows up.",
      "code": "spec:\n  containers:\n    - name: api\n      resources: { requests: { cpu: \"100m\", memory: 128Mi } }\n      volumeMounts: [{ name: logs, mountPath: /var/log/app }]\n    - name: shipper\n      resources: { requests: { cpu: \"50m\", memory: 64Mi } }\n      volumeMounts: [{ name: logs, mountPath: /var/log/app }]\n  volumes: [{ name: logs, emptyDir: {} }]\n# floor must fit 150m CPU and 192Mi together\n# emptyDir dies with the pod"
    },
    {
      "id": 93,
      "level": "intermediate",
      "q": "resource units?",
      "a": "CPU: 100m is 0.1 of one core. 1 is 1000m. Memory: 128Mi is mebibytes, not a casual 128M mixup you should ignore.\n1 vs 1m is a thousand-times surprise. Measure real usage, then set requests and limits.\nIn the code:\nrequests cpu 100m memory 128Mi, limits cpu 1 (1000m) memory 256Mi. 1 cpu vs 1m cpu is a thousand-times surprise. measure real usage, then set these.\nA common mistake is copying limits from a laptop Docker stats number that included a one-time compile.",
      "code": "resources:\n  requests:\n    cpu: \"100m\"               # 0.1 of one core\n    memory: 128Mi             # mebibytes, not 128 million bytes as a casual 128M mixup\n  limits:\n    cpu: \"1\"                  # 1000m\n    memory: 256Mi\n# \"1\" cpu vs \"1m\" cpu is a thousand-times surprise\n# measure real usage, then set these"
    },
    {
      "id": 94,
      "level": "beginner",
      "q": "What is minikube / kind / k3s?",
      "a": "minikube, kind, and k3s are model airports: a tiny cluster on your machine. kind runs nodes as containers. k3s is a slim distribution. Your Deployment YAML is the same paper.\nEKS still adds IAM, load balancers, and real failure weather.\nIn the code:\nminikube a VM or container that is a tiny cluster. kind Kubernetes IN Docker nodes are containers. k3s a slim distribution often one binary. your Deployment YAML is the same paper. EKS still adds IAM, LBs, and real failure weather.\nA common mistake is 'it worked on kind' as proof of production IAM and storage classes.",
      "code": "# model airports\nminikube: \"a VM or container that is a tiny cluster\"\nkind: \"Kubernetes IN Docker — nodes are containers\"\nk3s: \"a slim distribution, often one binary\"\n# your Deployment YAML is the same paper\n# EKS still adds IAM, LBs, and real failure weather"
    },
    {
      "id": 95,
      "level": "intermediate",
      "q": "EKS/GKE/AKS difference in one line?",
      "a": "EKS, GKE, and AKS speak the same Kubernetes papers for Deployments. Cloud glue differs: IRSA vs Workload Identity vs Entra, ALB vs GCE vs Azure disks.\nYou still drain node groups (or use their upgrade UX). The YAML is portable-ish. The IAM is not.\nIn the code:\nworkload kind Deployment portable-ish. cloud_glue eks irsa and alb, gke workload_identity and gce_pd, aks aad_workload_id and azure_disk. you still drain node groups yourself or via their upgrade UX.\nA common mistake is copying an EKS annotation onto GKE and expecting AWS roles.",
      "code": "# same papers, different airports\nworkload:\n  apiVersion: apps/v1\n  kind: Deployment           # portable-ish\ncloud_glue:\n  eks: { irsa: \"ServiceAccount -> AWS role\", alb: \"Ingress\" }\n  gke: { workload_identity: \"GSA\", gce_pd: \"disks\" }\n  aks: { aad_workload_id: \"Entra\", azure_disk: \"disks\" }\n# you still drain node groups yourself (or via their upgrade UX)"
    },
    {
      "id": 96,
      "level": "advanced",
      "q": "IAM Roles for Service Accounts (IRSA)?",
      "a": "IRSA binds a Kubernetes ServiceAccount to an AWS IAM role via an annotation. The SDK finds temporary AWS creds from a projected token.\nNo long-lived AWS_ACCESS_KEY_ID in a Secret. The role trust must allow that SA in that namespace.\nIn the code:\nServiceAccount api-sa annotation eks.amazonaws.com/role-arn arn:aws:iam::123:role/api-s3-reader. pod serviceAccountName api-sa. the SDK finds temporary AWS creds from the projected token. no AWS_ACCESS_KEY_ID in a Secret.\nA common mistake is the annotation on the Deployment instead of the ServiceAccount, so the role never binds.",
      "code": "apiVersion: v1\nkind: ServiceAccount\nmetadata:\n  name: api-sa\n  annotations:\n    eks.amazonaws.com/role-arn: arn:aws:iam::123:role/api-s3-reader\n---\nspec:\n  serviceAccountName: api-sa\n  containers:\n    - name: api\n      image: myapp:1.0.2\n# the SDK finds temporary AWS creds from the projected token\n# no AWS_ACCESS_KEY_ID in a Secret"
    },
    {
      "id": 97,
      "level": "intermediate",
      "q": "How do you handle migrations on k8s?",
      "a": "Run migrations as a Job with the new image before switching the Deployment image. Helm hooks or GitOps can order that Job.\nNot: command migrate && server on the Deployment, which races N replicas. Give the Job the same Secret env as the app.\nIn the code:\nJob migrate-1-0-3 restartPolicy Never, image myapp:1.0.3, command node migrate.js, envFrom secret api-db. Helm hook / GitOps runs this Job before switching the Deployment image. not migrate && server on the Deployment.\nA common mistake is an initContainer migrate on a 10-replica Deployment, ten writers on schema_migrations.",
      "code": "apiVersion: batch/v1\nkind: Job\nmetadata: { name: migrate-1-0-3 }\nspec:\n  template:\n    spec:\n      restartPolicy: Never\n      containers:\n        - name: migrate\n          image: myapp:1.0.3\n          command: [\"node\", \"migrate.js\"]\n          envFrom: [{ secretRef: { name: api-db } }]\n# Helm hook / GitOps runs this Job before switching the Deployment image\n# not: command migrate && server on the Deployment"
    },
    {
      "id": 98,
      "level": "advanced",
      "q": "leader election?",
      "a": "Leader election uses a Lease (talking stick): only holderIdentity should run the singleton loop. Others wait or serve read-only.\nThis is the Kubernetes coordination API, not a homemade Redis key you forget to expire.\nIn the code:\nkind Lease api-controller holderIdentity pod-api-aaa leaseDurationSeconds 15. only holderIdentity should run the singleton loop. others wait or serve read-only. this is the talking stick, not a homemade Redis key.\nA common mistake is two replicas of a controller without a lease, both writing the same objects.",
      "code": "apiVersion: coordination.k8s.io/v1\nkind: Lease\nmetadata:\n  name: api-controller\n  namespace: kube-system\nspec:\n  holderIdentity: pod-api-aaa\n  leaseDurationSeconds: 15\n# only holderIdentity should run the singleton loop\n# others wait or serve read-only\n# this is the talking stick, not a homemade Redis key"
    },
    {
      "id": 99,
      "level": "intermediate",
      "q": "common kubectl debug loop?",
      "a": "Debug loop: roster (get pods), chart (describe events), last words (logs, previous), switchboard (Ready endpoints), medicine list (image tag on the Deployment).\nPending FailedScheduling Insufficient cpu is a floor problem, not Express.\nIn the code:\ndoctor order 1 roster 2 describe events Pending Pull CrashLoop 3 logs previous 4 Ready endpoints 5 image tag shipped. pod events FailedScheduling Insufficient cpu. you now know it is a floor problem, not Express.\nA common mistake is restarting the Deployment at step 0, which can hide the event that named the cause.",
      "code": "# doctor order (ideas, not a command dump)\n# 1. roster: which pods, which status\n# 2. chart: describe events (Pending, Pull, CrashLoop)\n# 3. last words: logs, previous if it just died\n# 4. switchboard: are there Ready endpoints behind the Service?\n# 5. medicine list: what image tag shipped in the last Deployment\npod:\n  events: [\"FailedScheduling\", \"Insufficient cpu\"]\n  # you now know it is a floor problem, not Express"
    },
    {
      "id": 100,
      "level": "advanced",
      "q": "How do you explain Kubernetes in an interview?",
      "a": "In an interview, explain Kubernetes as desired-state copies. A pod is a room with a phone (ephemeral IP). A Deployment is the hiring manager for N rooms. A Service is reception by labels. Ingress is the street HTTP receptionist. Probes are smoke alarm vs closed sign. Resources are reservation plus ceiling.\nAdd one war story: ImagePull, OOM 137, or liveness hitting the DB.\nIn the code:\ndesired_state YAML pictures, controllers reconcile. pod a room with a phone. deployment hiring manager. service reception desk by name tags. ingress street receptionist. probes smoke alarm vs closed sign. resources reservation + ceiling. add one war story.\nA common mistake is a kubectl flag dump with no story of copies and reconciliation.",
      "code": "# one-minute map\ndesired_state: \"YAML pictures, controllers reconcile\"\npod: \"a room with a phone (ephemeral IP)\"\ndeployment: \"hiring manager for N rooms\"\nservice: \"reception desk by name tags (labels)\"\ningress: \"street receptionist for HTTP\"\nprobes: \"smoke alarm vs closed sign\"\nresources: \"reservation + ceiling\"\n# add one war story: ImagePull, OOM 137, or liveness hitting the DB"
    }
  ]
};
