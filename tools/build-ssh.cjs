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
    title: "The problem before SSH",
    body: story({
      problem:
        "You needed a shell on a machine across the city, but Telnet and FTP sent the password in the clear on the wire. Anyone on the café Wi‑Fi could read ada / secret123 from lobby traffic and walk straight into the server like an unlocked hotel street door. There was no clerk checking a key card, only a keypad guests could watch you type.",
      what:
        "SSH (Secure Shell) is an encrypted phone line from your laptop to the hotel staff room. You type commands here; they run on the other machine. Port 22 is the usual numbered street door. Both sides prove who they are with keys before anyone walks the corridor. Think of a sealed staff hallway, not a shouted order across the lobby: every keystroke, password, and copied file rides as noise a café snoop cannot read.",
      solves:
        "A stranger on the wire sees scrambled bytes, not your password or the file you copy through the staff corridor. The same encrypted line also carries scp, rsync, and git@github.com so you do not open a second postcard door for guests in the lobby. One badge, one corridor, login and copy stay private instead of splitting secrets across extra street doors.",
      example:
        "A hotel: you do not shout the room number across the lobby. You show a key card at the desk (your private key). The desk checks the card on file (authorized_keys). Then you walk the staff corridor while guests in the lobby hear nothing useful. The clerk never asks you to spell the PIN out loud for people waiting by the fountain.",
      uses:
        "Login to a VPS, copy a build with scp or rsync, push Git over git@github.com, and tunnel localhost to a remote database through the same hotel corridor instead of opening extra street doors on the building for every service. Interviewers want this picture first: remote shell plus a sealed hallway, not a browser console or a VPN by another name.",
      watch:
        "SSH is not a magic vault. A stolen private key is a stolen hotel badge. Do not open port 22 to 0.0.0.0/0 if you can use a VPN, a bastion, or AWS SSM and keep the street door closed to strangers wandering the lobby. A sealed corridor still fails if you hand out the master key card in Slack."
    })
  },
  {
    title: "Two halves of one key",
    body: story({
      problem:
        "Password login sat on the open internet like a keypad on the hotel street door. People reused Admin@123 on every box. Brute force bots knocked on port 22 all night, trying every room number until one clerk said yes and handed over the building. A café guest who watched you type the PIN could walk the staff corridor as if they owned the master suite.",
      what:
        "ssh-keygen makes a pair. The public line (.pub) goes in the server's ~/.ssh/authorized_keys, which is the hotel desk book of photocopied badges. The private file stays on your laptop like the metal key in your pocket. The server challenges you with a puzzle only that matching private file can answer. Guests may photograph the padlock on the staff door; they still cannot walk the corridor without the metal in your pocket.",
      solves:
        "You never type the server password again on the wire, so a lobby snoop cannot steal the keypad code. GitHub works the same hotel trick: public half on the website desk, private half in ~/.ssh on your laptop, never in the guestbook that guests can flip through. Revoke means deleting a photocopy from the book, not shouting a new PIN across the fountain.",
      example:
        "A padlock and a key. You bolt the padlock on the hotel door (public). You keep the key in your pocket (private). Anyone may see the padlock hanging on the staff entrance. Nobody else has the matching key, so seeing the lock does not let a stranger into the corridor. Emailing both halves in one envelope is mailing the master to the lobby.",
      uses:
        "VPS login, GitHub, GitLab, and jump hosts all want this pair. Prefer ed25519 over old rsa-2048 when the box supports it, so the hotel cuts a modern key card instead of a worn brass key that older locks still accept by habit. First day on a team almost always starts with cutting this pair before anyone files your card.",
      watch:
        "Copying id_ed25519 (no .pub) into chat, Slack, or the repo is handing out the hotel master key in the lobby guestbook. Make a new pair, delete the old public line from every desk book, and treat the leaked private file as already used by a stranger. git rm does not unspread a metal key once forks and history hold it."
    })
  },
  {
    title: "The address book and the guest book",
    body: story({
      problem:
        "Every login was ssh -i ~/keys/prod.pem ubuntu@ec2-13-232-plus-a-long-name. You mistyped the user. The wrong key failed with Permission denied (publickey). You had no nickname for the hotel, so every morning you redialed the full street address and hoped the clerk still knew you. One sticky note mixed staging and prod cards until a mistyped pem looked like an outage.",
      what:
        "~/.ssh/config is nicknames: Host web, HostName, User, IdentityFile — a contacts list for hotels so one word expands the street, guest name, and which pocket holds the key card. known_hosts is the guest book of server fingerprints you already trusted, like a photo of the real receptionist taped beside the desk phone so you notice a new face at that hotel tomorrow.",
      solves:
        "You type ssh web and the right badge and room go with you. The first time a host key is new, SSH asks you to check the fingerprint. Next time a different fingerprint is a warning — someone may be pretending to be that hotel and sitting at the desk. Staging and prod stop sharing a mistyped pem because each hotel has its own Host block.",
      example:
        "A contacts list (config) plus a photo of the real receptionist (known_hosts). If a stranger sits at the desk tomorrow wearing the same badge lanyard, you notice because the face does not match the photo you filed after the first honest visit to that hotel. You tap the nickname; you do not retype the lobby directory from a sticky note.",
      uses:
        "Many servers, one jump box, and GitHub as Host github.com with a dedicated key all live in this address book. One laptop can keep prod, staging, and the git hotel in separate Host blocks so you never flash the wrong card at the wrong desk. ProxyJump can live under the same nickname when the building has a public front door.",
      watch:
        "ssh -o StrictHostKeyChecking=no to make it work means you just agreed to follow any stranger in a receptionist badge. CI that disables the check is the same lobby mistake: you stop comparing faces and walk upstairs with whoever smiled first at the desk. A typo in IdentityFile is flashing the gym card and blaming the hotel."
    })
  }
];

const examples = [
  {
    title: "First login",
    lang: "txt",
    desc: story({
      problem:
        "The VPS is up and the browser can show a default page, but the browser cannot give you a shell. You still need to walk into the hotel staff room to install packages, read logs, and restart services without shouting commands across the public lobby. A cloud console window is a different door, not this encrypted staff corridor.",
      what:
        "ssh user@host opens an encrypted session through the usual street door on port 22. After the desk checks your key card against the staff book, you are now in that machine's home folder. You type here; the commands run there, inside the hotel, not on the café table. Both sides already proved who they are, so the lobby hears only scrambled noise while you work in the kitchen.",
      solves:
        "Install packages, read logs, restart nginx — on the real box — without putting a password on a postcard. The lobby hears scrambled noise. You get a real staff-room shell so debugging is not a guessing game from the outside of the building. The same knock later carries copy and git if you keep using this corridor.",
      example:
        "Knock on room 12. The desk already has your key card on file, so the clerk does not ask you to shout a PIN across the lobby. You walk the staff corridor into that room and work there while guests downstairs never see the door open. You did not mail the room number on a postcard for café tables to read.",
      uses:
        "Every VPS, campus lab, and CI debug box starts with this first knock. When an interviewer says connect to the instance, they mean this encrypted login, not opening the cloud console and hoping a browser terminal is enough for every hotel on the street. First-week EC2 tickets almost always begin here.",
      watch:
        "ssh root@host with a password on the public internet is a keypad on the street door of the penthouse. Bots try that door all night. Prefer a named user with a key card, then sudo inside, and keep root off the lobby entrance entirely. Timeout is a closed mall gate; Permission denied is a clerk who saw you and said no."
    }),
    code: `# replace user and host
ssh ada@192.168.1.20
ssh ada@web-01.example.com

# first time: check the fingerprint, then type yes
# you land in ada's home on that machine`
  },
  {
    title: "Make a key (ed25519)",
    lang: "txt",
    desc: story({
      problem:
        "Password SSH was slow and bots guessed it by trying every keypad code on the hotel street door. A new laptop had no badge at all, so GitHub and the VPS kept asking you to shout a secret across the lobby like a postcard with the PIN written on the back. First day on the team blocked on a locksmith step nobody had written beside the desk.",
      what:
        "ssh-keygen writes a private file and a .pub line under ~/.ssh. -C is a label (your email) stamped on the fob so the desk can tell cards apart. A passphrase encrypts the private file at rest, which is a PIN on the badge so a stolen laptop is not an open hotel master. Prefer ed25519 unless an ancient lock still demands RSA. The metal stays in your pocket; only the photocopy travels.",
      solves:
        "You have a badge the hotel can photocopy into the staff book. The passphrase is the PIN on the badge, so daily work is one unlock, not a password on every knock. The public line can sit at many desks; the private half never leaves your pocket. GitHub and a VPS can file the same style of photocopy without ever holding your metal key.",
      example:
        "Cut a new hotel key. Stamp your name on it so the clerk files the right photocopy. Put a PIN on the fob so a pickpocket who grabs the card still cannot walk the staff corridor until they also know the code you set at the locksmith counter. Overwriting an old fob without telling the desks is melting the only master they already filed.",
      uses:
        "New laptop, new GitHub account, a key just for prod so one stolen fob does not open every hotel you visit. First day on a team almost always starts with cutting this pair before anyone will photocopy your card into the production desk book. Interviewers often ask you to name ssh-keygen, ed25519, and the passphrase PIN.",
      watch:
        "Empty passphrase on a laptop that gets stolen is a hotel badge left on the café table. Sharing one key for the whole team is one master that nobody can revoke per person. Cut pairs per human, and put a PIN on every fob you carry. Do not email both files to yourself as a clear-text backup."
    }),
    code: `ssh-keygen -t ed25519 -C "ada@company.com"
# Enter file: (Enter = ~/.ssh/id_ed25519)
# passphrase: pick one you will remember

ls ~/.ssh
# id_ed25519      private — never copy this
# id_ed25519.pub  public  — this line goes on servers / GitHub`
  },
  {
    title: "Put the public line on the server",
    lang: "txt",
    desc: story({
      problem:
        "The server still asked for a password. Your laptop had a key. The hotel had no card on file, so the clerk kept treating you like a walk-in guest. You could prove you owned a badge at home, but the staff book on that floor was still blank beside your name. One more PIN on the wire was the only knock that worked until someone filed the photocopy.",
      what:
        "authorized_keys is a list of public lines — photocopies of badges, not the metal keys — kept in that user's ~/.ssh folder. ssh-copy-id appends yours after one last password visit or a console session. One line per laptop, so two machines are two cards in the same desk book for that user. Folder modes must stay tight or sshd treats the book as a lobby binder and ignores it.",
      solves:
        "Next ssh uses the key and the clerk waves you through the staff door. You can turn password login off so the street keypad goes dark. The hotel now recognizes your card; you stop shouting a PIN across the lobby every morning just to reach your own room. Adding a teammate is appending their .pub, not lending them the metal in your pocket.",
      example:
        "The clerk photocopies your badge into the staff book. They do not keep the metal key in the drawer. Tomorrow you flash the same card; they match the photocopy. A stranger with a lookalike lanyard still fails because their card is not the line in that book. Pasting the private file into the book is leaving the metal where night staff can copy it.",
      uses:
        "First setup of a VPS and adding a second laptop both mean appending one public line. When a teammate joins, you add their .pub, not yours, so their badge is in the book and yours stays yours. Offboarding is deleting their line, not rotating a shared master. GitHub is the same filing under Settings, just a different hotel desk.",
      watch:
        ".ssh must be 700. authorized_keys must be 600. Group-writable folders make sshd ignore the file because the staff book sat in the lobby where anyone could add a line. Also never append the private file; the book wants the photocopy, not the metal key. Do not share one line for the whole team or you cannot revoke one leaver."
    }),
    code: `# from your laptop (needs one password login, or console)
ssh-copy-id ada@192.168.1.20

# same idea by hand:
# cat ~/.ssh/id_ed25519.pub
# on the server, append that ONE line to:
#   ~/.ssh/authorized_keys
# then:
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys`
  },
  {
    title: "~/.ssh/config nickname",
    lang: "txt",
    desc: story({
      problem:
        "Long ssh -i path ubuntu@ec2-plus-flags every morning, and the wrong pem went to staging. You redialed the full hotel street address, picked a user from memory, and hoped the clerk still expected that badge. One typo meant Permission denied and a wasted coffee. Two hotels shared one card by accident because nothing in a contacts list forced a split.",
      what:
        "A Host block is a short name in your contacts list under ~/.ssh/config. ssh web expands User, HostName, and IdentityFile so the desk already knows which hotel, which guest name, and which key card to flash. Port and ProxyJump can live under the same nickname when the building has a front door. Mode 600 on that file keeps the list from becoming a lobby flyer that also names where the metal keys live.",
      solves:
        "One word. The right user and the right key walk with you every time, like saving web in your phone instead of the full address and room number. Staging and prod stop sharing a mistyped pem because each hotel has its own Host block and its own card. GitHub can pin its own IdentityFile so the git building never sees the prod master.",
      example:
        "Saving web in your phone instead of the full address, guest name, and which pocket holds the key card. You tap the nickname; the desk still sees the real street, the real user, and the real badge. You do not retype the lobby directory from a sticky note. A typo lives in one file you can read, not in yesterday's shell history.",
      uses:
        "Prod, staging, GitHub, and a bastion all become Host nicknames on one laptop. A dedicated IdentityFile per hotel means the git building never sees the prod master, and the jump box has its own card so one lost fob does not open every corridor. Include files can split work hotels from home hotels.",
      watch:
        "Typo in IdentityFile — SSH tries the default key and you think the server is down. The clerk is not broken; you flashed the gym card at the hotel desk. chmod 600 on the config file, and keep private key modes tight so the contacts list is not a lobby flyer. Wildcards in Host can send the wrong card to github.com if you are careless."
    }),
    code: `# ~/.ssh/config   (this file should be 600)
Host web
  HostName 192.168.1.20
  User ada
  IdentityFile ~/.ssh/id_ed25519

Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519

# now:
ssh web
ssh -T git@github.com`
  },
  {
    title: "Copy files (scp and rsync)",
    lang: "txt",
    desc: story({
      problem:
        "USB sticks and WeTransfer for a .env and a build folder. The password went with them on a postcard through the street. A second upload sent the whole tree again. The hotel runner was walking the public sidewalk with the envelope unsealed while guests could glance at the paper. A chat drop of secrets was the same lobby table with a different stamp.",
      what:
        "scp copies through the same SSH door, whole file, like one sealed envelope down the staff corridor. rsync sends only what changed, like a runner who only carries new pages. Both use your key card; neither opens a separate FTP street door with a password on the postcard. They honor ~/.ssh/config nicknames, so web means the same hotel as ssh web. Trailing slashes on rsync change which binder you meant.",
      solves:
        "The file never sits in a public chat or a café USB. A second rsync is cheap because only diffs walk the corridor. You keep using the same hotel badge you already use for login, so copy is not a second insecure protocol bolted onto the building. Interviews want that you stayed on the encrypted hallway instead of FTP.",
      example:
        "The hotel runner takes the envelope through the staff corridor, not the street. Guests in the lobby never hold the .env. If you send the folder again tomorrow, a good runner (rsync) only carries the pages that changed, not the whole binder through the kitchen again. scp is the one-envelope job; rsync is the repeating binder job.",
      uses:
        "Upload a release tarball, pull logs, and sync a folder to /var/www without FTP. Prefer rsync -avz for a tree you update often. Use scp for one artefact. Both talk to the same desk with the same card you already photocopied into authorized_keys. CI often rsyncs a build through this same corridor.",
      watch:
        "scp in a cron every minute on a huge tree wastes the corridor; use rsync and check the exit code. Trailing slashes on rsync change shape: dist versus dist/ is a different binder. Do not scp secrets into a world-readable drop folder on the far side. Do not fall back to ftp:// because the names sound similar at the desk."
    }),
    code: `# one file to the server
scp ./app.tar.gz ada@192.168.1.20:/tmp/

# one file back
scp ada@192.168.1.20:/var/log/nginx/error.log ./

# folder — only changes (prefer this)
rsync -avz ./dist/ ada@192.168.1.20:/var/www/app/`
  },
  {
    title: "GitHub over SSH",
    lang: "txt",
    desc: story({
      problem:
        "git push asked for a password. GitHub killed password Git. HTTPS tokens expired and broke Friday deploys while the envelope sat in the lobby with last month's stamp. You needed a badge the git hotel would honor without putting a token in the remote URL for guests to copy from screenshots, logs, or a pasted remote string.",
      what:
        "Remote git@github.com:you/app.git uses your SSH key. GitHub stores the public line under Settings → SSH keys, which is their desk book. User is git; the account is whichever public line matched. ssh -T git@github.com is a knock that only checks the badge, not a clone. A Host github.com block can pin IdentityFile so the git building never sees a prod-only card.",
      solves:
        "Push and pull with no token in the URL, so the remote string is not a postcard with a password. The same hotel key you use for a VPS can open GitHub's building if you photocopied the public line there. Friday deploys stop dying because a PAT expired in a saved remote. Personal machines use a user key; a server that must pull one repo gets a deploy key.",
      example:
        "The same hotel key, but the building is GitHub's. You do not get a new metal key; you give their clerk a photocopy of the public side. They file it under your account. Next git push is a knock at their staff door with the private half still in your pocket. You reused SSH with a different hotel name on the street.",
      uses:
        "Every laptop you keep. CI usually uses a deploy key or a token, not your personal key, because a shared runner is a shared pocket. Personal machines add the user key; a server that must git pull one repo gets a deploy key limited to that building. GitLab and similar hosts file the photocopy the same way.",
      watch:
        "Adding the private file to GitHub. Only the .pub line belongs in their desk book. Test with ssh -T before you blame git. Do not put your user private key on a shared deploy server; that is leaving your personal hotel master in the staff kitchen. If ssh -T fails, fix the desk book before rewriting remotes."
    }),
    code: `# copy the public line, paste in GitHub → Settings → SSH keys
cat ~/.ssh/id_ed25519.pub

ssh -T git@github.com
# Hi ada! You've successfully authenticated...

git remote set-url origin git@github.com:ada/app.git
git push`
  },
  {
    title: "Tunnel a port (-L)",
    lang: "txt",
    desc: story({
      problem:
        "Postgres listened on 5432 but only on the server's localhost. Your laptop could not reach it. Opening 5432 to the world was the wrong fix: that is a kitchen door on the street so café guests can walk into the fridge. You needed a private lift, not a public loading bay, and you already had a key card for the building desk.",
      what:
        "ssh -L local:host:remote forwards a laptop port through the SSH line to a port on the far side. Your GUI talks to localhost; the bytes ride inside the already-encrypted hotel corridor. -R is the other direction, useful when the far side must knock back. -D is a SOCKS proxy, a different kind of staff lift. All of them reuse the same key card you already filed at the desk.",
      solves:
        "A GUI on your machine talks to localhost:5432. The bytes travel inside SSH. The database stays private on the server's loopback, like a kitchen that still has no street door. You debug with the same key card you already use to enter the building, without exposing Postgres to the lobby. Binding the local end to localhost keeps the café off your lift buttons.",
      example:
        "A private staff lift. Guests still cannot walk into the kitchen. You can, because you already passed the desk with a key card. The lift opens at localhost on your laptop and at the kitchen on the far floor; nobody in the lobby gets a button for that elevator. Wiring the buttons to 0.0.0.0 invites the whole café into the fridge.",
      uses:
        "Remote DB, Redis, a staging admin UI, Jupyter — any service bound to the server's localhost that you want on your laptop without a public security-group hole. Keep the tunnel up while you work, then close it so the lift is not an all-night café share. LocalForward in ~/.ssh/config can make that lift automatic for a nickname.",
      watch:
        "Leaving -L 0.0.0.0:5432 so the whole café shares your tunnel is wiring the staff lift to the lobby buttons. Bind to localhost unless you truly mean to share. Do not leave a forwarded admin UI up on a laptop in an airport after you walk away from the desk. The lift is as trusted as the machine that holds the local port."
    }),
    code: `# laptop:5432  →  (ssh)  →  server's 127.0.0.1:5432
ssh -L 5432:127.0.0.1:5432 ada@192.168.1.20

# now on the laptop:
# psql postgres://ada@127.0.0.1:5432/app`
  },
  {
    title: "Fix Permission denied (publickey)",
    lang: "txt",
    desc: story({
      problem:
        "ssh web failed. The key existed. You were sure the server was broken, so people rebooted the VM. Ping worked. The hotel street door was open; the clerk still said this badge is not in my book. Guessing wasted the morning that a short checklist would have saved. First-week EC2 tickets are full of this panic because ubuntu versus ec2-user looks like an outage.",
      what:
        "sshd only accepts a public line that is in authorized_keys, with tight folder permissions, using the user you named. Wrong floor (ubuntu versus ada), wrong card file, missing photocopy, or a staff book left in a public hallway (mode 777) all look like the same Permission denied (publickey) at the desk. Timeout would have meant the mall gate never opened. This error means you reached the clerk and failed the book check.",
      solves:
        "A short checklist beats guessing: user, IdentityFile, authorized_keys line, 700/600, then ssh -vvv. You stop rebooting a healthy hotel because the clerk rejected a gym card. Interviews love this error because it separates people who read the desk log from people who restart the building. Amazon images use different default users, so the first line is whose name the clerk expects.",
      example:
        "Wrong floor, wrong name on the badge, or the clerk's book is in a public hallway (mode 777) so they refuse to use it. The mall gate opened. The clerk said this badge is not in my book. You do not blow up the hotel; you check which card you flashed and whose name you gave. Maybe you asked for the penthouse as root when the reservation is ada.",
      uses:
        "Every first-week VPS. Interviews love this error because Amazon images use ubuntu or ec2-user and students type root. Campus labs hit the same desk refusal when ~/.ssh is group-writable after a well-meant chmod. Keep the checklist on a sticky note beside the laptop. Jump hosts fail the same way when the nickname points at the wrong IdentityFile.",
      watch:
        "ssh -vvv is noisy but the last Offering public key line tells you which file was tried. If it never offers your ed25519, the nickname pointed at the wrong IdentityFile. Do not chmod 777 ~ to fix npm; that puts the staff book in the lobby and sshd will ignore it. Do not disable StrictHostKeyChecking to make the error go away; that is a different clerk."
    }),
    code: `# 1) are you the user you think?
ssh ada@192.168.1.20   # not root, not ubuntu, unless that is the user

# 2) is this the key the server has?
ssh-add -l
ssh -i ~/.ssh/id_ed25519 -vvv ada@192.168.1.20
# look for: Offering public key

# 3) on the server (console / old password session)
ls -ld ~/.ssh ~/.ssh/authorized_keys
# drwx------  .ssh
# -rw-------  authorized_keys
# one line in authorized_keys must match your .pub`
  }
];

const Q = (id, level, q, a, code, ask) => ({
  id,
  level,
  q,
  a: story(a),
  lang: "txt",
  code,
  ask
});

const questions = [
  Q(1, "beginner", "What is SSH?", {
    problem: "You needed a shell on a machine you could not sit in front of. Telnet sent the password as plain text across the lobby like a postcard. Anyone on café Wi‑Fi could read the PIN and walk into the hotel staff room as if the street door had no clerk at all. There was no key card check, only a keypad guests could watch you type from the fountain.",
    what: "SSH is Secure Shell: an encrypted remote login from your laptop to a far machine. You type here. Commands run there. Usual door is port 22, the numbered staff entrance of that hotel. Both sides prove who they are with keys before the corridor opens, so the café table is not the same room as the kitchen. Every keystroke rides as noise; the clerk already checked a badge, not a shouted PIN.",
    solves: "A café Wi‑Fi snoop cannot read your password or the file you copy down the staff corridor. You still get a real shell on the far machine. Login, copy, and git@ can share that one sealed phone line instead of opening extra postcard doors on the building. Interviewers want this picture: remote shell plus a sealed hallway, not AnyDesk and not a cloud console.",
    example: "A locked phone line to the hotel staff room. You speak. The kitchen hears. The lobby does not. You did not shout the room number across the front desk. The clerk already checked a key card, then opened the corridor so only staff traffic uses that line. Guests by the fountain hear scrambled noise, not ada and secret123.",
    uses: "VPS, campus servers, git@github.com, and file copy all start with this encrypted knock. When an interviewer asks what SSH is, say remote shell plus a sealed corridor, port 22, keys at the desk — not AnyDesk, not a VPN, not a browser window on the cloud console. First-week EC2 almost always begins with this same knock.",
    watch: "Calling any remote desktop SSH. SSH is this protocol, not AnyDesk, RDP, or a web terminal in the cloud console. Those may also reach a machine, but they are different hotel doors with different clerks, keys, and logs. Use the word only for this encrypted shell protocol. A stolen private key is still a stolen badge even when the corridor is sealed."
  }, `# laptop → encrypted line → server shell
ssh ada@web-01.example.com
# default port 22`, "Most asked · Amazon · Google · Microsoft · TCS"),

  Q(2, "beginner", "Why not Telnet or FTP?", {
    problem: "Telnet and FTP were simple. Everyone on the wire could read the password and the files, like postcards on the lobby table. A café snoop learned ada / secret123 and then walked the hotel as staff. Simple was expensive once the street filled with people reading mail. The keypad on the street door had no clerk, only a PIN anyone could copy from traffic.",
    what: "SSH encrypts the session so the lobby hears noise instead of your PIN. SFTP is file transfer on that same encrypted line, still using the hotel corridor and the same key card. FTPS is old FTP plus TLS — a different thing, a different clerk, not the SSH desk. Interviews want you to name which envelope you actually sealed, and to keep login and copy on one badge instead of two protocols.",
    solves: "One port, one key, login and copy stay private. You do not keep a postcard protocol beside a sealed one. The same badge that opens a shell also carries files, so you are not running an extra FTP street door with a password on the back of the envelope. A café snoop sees scrambled bytes, not the kitchen order.",
    example: "A postcard (Telnet) versus a sealed envelope (SSH) carried down the staff corridor. Guests can read the postcard. They cannot read the envelope. FTP was another postcard for files. SFTP puts those files in the sealed envelope you already use to talk to the kitchen. You did not open a second street door just to move a tarball.",
    uses: "Replace FTP with sftp or scp. Interviews: is the password on the wire? Say Telnet yes, SSH no. Campus labs still have old ftp:// bookmarks; move them. Any script that still dials FTP in 2026 is sending the hotel PIN through the lobby on an open card. Prefer the same Host nickname you already use for ssh.",
    watch: "ftp:// in a script in 2026. Use sftp or HTTPS. Do not confuse FTPS (FTP plus TLS) with SFTP (SSH file transfer). They sound like cousins at the desk; they are different buildings. Also do not enable Telnet to debug and forget it on the street door overnight. Bots still knock on leftover postcard doors."
  }, `# bad:  telnet host          — password in the clear
# bad:  ftp host
# good: ssh ada@host
# good: sftp ada@host`, "Most asked · Amazon · TCS"),

  Q(3, "beginner", "What port does SSH use?", {
    problem: "The security group blocked everything. SSH hung, then timed out. People blamed the key, reissued pem files, and rebooted the VM. The hotel clerk never saw you because the mall gate was locked. You were debugging a badge while standing outside a closed street door. Guessing wasted the morning that splitting timeout from publickey would have saved.",
    what: "The usual SSH port is 22, the numbered staff entrance on the street. Timeout often means the door is closed (firewall or security group), so the knock never reaches the clerk. Permission denied means the door opened and the key failed at the desk. Those two failures are different hotel stories; do not mix them in an interview answer. Changing the room number without telling the mall guards just hides the entrance from you too.",
    solves: "You debug the network before you debug the key. If the knock never reaches the clerk, no amount of ssh-keygen will help. If the clerk answers and rejects the card, the security group is already doing its job. Split timeout from publickey so you stop rebuilding a reachable box. Interviewers ask this to hear door versus desk, mall gate versus badge book.",
    example: "Room 22 is the staff entrance. If the mall gate is locked, your key never gets a chance. If the gate opens and the clerk says wrong badge, that is a different problem. Changing the room number to 2222 without telling the mall guards just hides the entrance from you too. The clerk cannot photocopy a card they never see.",
    uses: "AWS security groups, ufw, campus firewalls, and docker published ports all decide whether room 22 is reachable. Interviewers ask timeout versus Permission denied to see if you know the door versus the desk. Cloud consoles still need the group to allow your IP or a bastion. If you move the door, update sshd_config, the firewall, and every Host block.",
    watch: "Changing to port 2222 for security and forgetting the security group. Security through a different number is thin; bots scan odd ports too. If you move the door, update sshd_config, the firewall, and every Host block, or the nickname still knocks on an empty room 22. Do not treat a timeout as a bad pem and cut a new pair while standing outside the gate."
  }, `# timeout = door closed
ssh -v ada@192.168.1.20
# connect to host port 22: Connection timed out

# if you moved the door:
ssh -p 2222 ada@192.168.1.20`, "Most asked · Amazon · Microsoft"),

  Q(4, "beginner", "Public key vs private key?", {
    problem: "People emailed the SSH key and attached both files, like mailing the hotel padlock and the pocket key in one envelope. The repo or Slack thread became a master-key shop. By morning a stranger had photocopied the metal and walked the staff corridor as if they owned the building. git rm does not unspread a secret once history and forks hold the metal.",
    what: "A pair cut by ssh-keygen. Public (.pub) may sit on every server and on GitHub; that is the padlock on the door, safe to photocopy into desk books. Private stays on one laptop; that is the key in your pocket, never mailed. Login proves you hold the private half. The server never needs the metal, only the lock it can challenge. Seeing the padlock does not open the staff corridor.",
    solves: "The server never stores your secret. It stores a lock. A café snoop who copies authorized_keys still cannot enter. GitHub can hold many public lines without holding your pocket key. Revoke means deleting a photocopy from the desk book, not asking the hotel to forget a password you typed. One person, one pair, so a leaver is one line gone, not a shared master hunt.",
    example: "Padlock on the door (public). Key in your pocket (private). Guests may photograph the padlock. That does not open the staff corridor. If you email the key with the padlock, you have handed a stranger the hotel master and should cut a new pair at the locksmith immediately. Then delete the old photocopy from every desk that filed it.",
    uses: "Every SSH and GitHub setup starts with this pair. ssh-keygen makes it. authorized_keys and GitHub Settings store only the public line. CI deploy keys are the same idea limited to one repo. Never invert the files when someone says send me your SSH key in Slack. They want the photocopy, not the metal in your pocket.",
    watch: "id_ed25519 in Git, Slack, or a screenshot. Revoke that line and make a new pair. History still has the private file after git rm. The .pub line is safe to paste; the file that says BEGIN OPENSSH PRIVATE KEY is the metal key and does not belong in a lobby guestbook. Assume a leaked key is already used by a stranger."
  }, `# private — pocket
#   ~/.ssh/id_ed25519
# public  — padlock
#   ~/.ssh/id_ed25519.pub
#
# server stores only the public line:
#   ~/.ssh/authorized_keys`, "Most asked · Amazon · Google · Microsoft"),

  Q(5, "beginner", "How do you create an SSH key?", {
    problem: "A new laptop had no badge. GitHub and the VPS asked for a password, which meant shouting a PIN across the lobby again. You could not photocopy a card that did not exist. First day on the team blocked on a locksmith step nobody had written down beside the desk. Bots still guessed keypad codes on port 22 while you waited for someone to cut a pair.",
    what: "ssh-keygen -t ed25519 -C \"you@mail\". It writes the pair under ~/.ssh: a private file in your pocket and a .pub photocopy for desks. A passphrase encrypts the private file on disk, the PIN on the fob, so a stolen laptop is not an open hotel master. -C is only a label so desks can tell cards apart. Prefer ed25519 unless an ancient hotel lock still demands RSA.",
    solves: "You own a badge. The passphrase is the PIN. Daily git push does not need a GitHub password on the wire. The public line is safe to paste at many hotels. One laptop, one pair, unless prod deserves a separate fob so a stolen café bag does not open every building. The metal never leaves your pocket; only the photocopy travels to clerks.",
    example: "The locksmith cuts a new key and asks for a code on the fob. You stamp your email on the tag. The metal stays in your pocket. The photocopy (.pub) can hang on any hotel door. If you overwrite an old id_ed25519, every desk that filed the previous photocopy suddenly rejects you. Back up the old pair before you melt it, or tell every clerk first.",
    uses: "First day on a team. A key only for prod. A new laptop after a theft. GitHub, GitLab, and a VPS all accept the same style of public line. Interviewers often ask you to name ssh-keygen, ed25519, and why a passphrase is not the same as the server password. Cut a pair before anyone will file your card in production.",
    watch: "Overwriting an existing id_ed25519 without a backup. You just broke every server that had the old public line, like melting the only master after desks already filed it. Empty passphrase on a travel laptop is a badge with no PIN. Do not email both files to yourself as backup in clear text. Sharing one team key is a master nobody can revoke per person."
  }, `ssh-keygen -t ed25519 -C "ada@company.com"
# default path ~/.ssh/id_ed25519
# set a passphrase
cat ~/.ssh/id_ed25519.pub   # this line is safe to share`, "Most asked · Amazon · Google · TCS"),

  Q(6, "beginner", "How does the server learn your key?", {
    problem: "You made a key. SSH still asked for a password because the hotel desk book was empty. The laptop had a badge; the clerk had no photocopy. You were a walk-in guest every morning. One more password on the wire was the only way in until someone filed the public line. The street keypad still worked for anyone who could guess or reuse a PIN.",
    what: "The public line must be in that user's ~/.ssh/authorized_keys, the staff book of photocopied badges, never the private metal. ssh-copy-id does it after one password or console login. Or you paste one line by hand. One line per laptop, so two machines are two cards. Permissions on the folder must stay tight — 700 on .ssh, 600 on the book — or sshd ignores a lobby binder.",
    solves: "The clerk has your card on file. Next visit is key-only. You can disable password login so the street keypad goes dark. Adding a teammate is appending their .pub, not lending them your pocket key. Offboarding is deleting their line from the book without recutting everyone else's badge. The hotel now waves you through instead of asking for a shouted PIN.",
    example: "Photocopy of the badge in the staff book — not the metal key itself. The clerk matches tomorrow's card to yesterday's photocopy. If you paste the private file into that book, you have put the metal in the drawer where night staff can copy it. Only the .pub line belongs there. A stranger with a lookalike lanyard still fails the match.",
    uses: "First VPS. Adding a teammate (their .pub, not yours). A second laptop for the same human. GitHub is the same filing, just under Settings → SSH keys instead of authorized_keys. Cloud-init can drop the line at boot so the first knock is already key-only. Offboarding is deleting their line, not rotating a shared master.",
    watch: "Appending the private file. authorized_keys wants the .pub line only. Also chmod 700 ~/.ssh and 600 authorized_keys or sshd treats the book as a lobby binder and refuses it. Do not share one line for the whole team; you cannot revoke one leaver without evicting everyone. Group-writable home after chmod 777 makes the clerk ignore a perfect photocopy."
  }, `ssh-copy-id ada@192.168.1.20

# or on the server:
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "ssh-ed25519 AAAA... ada@laptop" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys`, "Most asked · Amazon · Microsoft"),

  Q(7, "intermediate", "What does Permission denied (publickey) mean?", {
    problem: "The host was up. Ping worked. SSH said publickey and people rebooted the VM. The mall gate was open; the clerk rejected the badge. Restarting the hotel does not photocopy your card into the book. First-week EC2 tickets are full of this panic because ubuntu versus ec2-user looks like an outage. Guessing wasted a morning that a short desk checklist would have saved.",
    what: "The TCP door opened. sshd did not accept any key you offered. Wrong user, wrong key file, missing line in authorized_keys, or bad permissions on ~/.ssh all look the same at the desk. Timeout would have meant the door never opened. This error means you reached the clerk and failed the book check, which is a different story from a locked mall gate. ssh -vvv shows which card was flashed.",
    solves: "A checklist: user, IdentityFile, authorized_keys line, 700/600, ssh -vvv. You fix the badge instead of the building. Interviews want that order. Amazon images use different default users, so the first line of the checklist is are you the guest the clerk expects on this floor. You stop rebooting a healthy hotel because someone flashed a gym card.",
    example: "The mall gate opened. The clerk said this badge is not in my book. Maybe you asked for the penthouse as root when the reservation is ada. Maybe you flashed the gym card. Maybe the book sat in the hallway on mode 777 and the clerk will not trust it. Check those before calling demolition. The street door was never the problem.",
    uses: "Every intern's first EC2. Interviews. Campus labs after chmod -R 777. Jump hosts where the nickname points at the wrong IdentityFile. Anytime ssh -vvv never prints Offering public key for the file you thought you were using at that hotel desk. Keep the checklist on a sticky note beside the laptop for the first week.",
    watch: "ubuntu versus ec2-user versus ada. Amazon images use different default users. Also do not disable StrictHostKeyChecking to make the error go away; that is a different clerk problem. And do not chmod 777 the home directory to fix npm or sshd will keep ignoring a lobby-readable staff book. Read Offering public key before you recut a pair."
  }, `ssh -i ~/.ssh/id_ed25519 -vvv ada@192.168.1.20
# Offering public key: ...
# Permission denied (publickey)

# on the server:
# ls -ld ~/.ssh ~/.ssh/authorized_keys
# cat ~/.ssh/authorized_keys`, "Most asked · Amazon · Google · Microsoft"),

  Q(8, "intermediate", "What is ~/.ssh/config?", {
    problem: "Long -i and user@host strings. The wrong pem file went to staging. Every morning you redialed the full hotel address from a sticky note and hoped. One mistyped IdentityFile looked like an outage. Two hotels shared one card by accident because nothing in a contacts list forced a split. Permission denied and a wasted coffee followed one typo in the street name.",
    what: "A per-host address book in ~/.ssh/config. Host is the nickname you type. HostName, User, IdentityFile, Port, ProxyJump live under it. ssh web expands to the real street, guest name, and which pocket holds the key card. The file should be mode 600, like a contacts list that also names where the metal keys live. One block per hotel keeps prod, staging, and git from sharing a mistyped pem.",
    solves: "ssh web. The right key and user every time. Staging and prod stop swapping pem files. GitHub can have its own IdentityFile so the git hotel never sees the prod master. A bastion becomes Host bastion plus ProxyJump instead of a remembered ssh -J one-liner you will mistype on Friday. A typo lives in one file you can read, not in yesterday's shell history.",
    example: "Saved contacts instead of dialling the full number, room, and which badge to flash. You tap web; the desk still sees 192.168.1.20 and ada and the ed25519 fob. You do not retype the lobby directory. A typo lives in one file you can read, not in yesterday's shell history. The clerk still sees the real street; you only saved the nickname.",
    uses: "Many servers, GitHub, a bastion, and a laptop that must not mix prod and personal cards. Include files can split work and home hotels. Interviewers ask what Host versus HostName means: nickname versus real DNS or IP behind the front door of that building. LocalForward can live here too if you always need the staff lift.",
    watch: "chmod 600 on the file. A world-readable config with IdentityFile paths is sloppy; the private key mode matters more. A typo in IdentityFile makes SSH try the default key and you think the hotel is down. Wildcards in Host can send the wrong card to github.com if you are careless. You flashed the gym card; the clerk is not broken."
  }, `# ~/.ssh/config
Host web
  HostName 192.168.1.20
  User ada
  IdentityFile ~/.ssh/id_ed25519

ssh web`, "Most asked · Amazon · Google"),

  Q(9, "intermediate", "What is known_hosts? Why the fingerprint warning?", {
    problem: "The first SSH asked are you sure. People typed yes forever. Then one day the fingerprint changed and they typed yes again. A stranger had sat down at the receptionist desk. The guest book photo was ignored. That is how a lobby impostor becomes your staff corridor without anyone checking the face. Blind yes trains you to follow any new badge lanyard.",
    what: "known_hosts stores the server's host key (the hotel's own ID), not your user key card. First time you check the fingerprint out of band — console, runbook, or a pinned file — then you tape that face beside the desk phone. Later, a new fingerprint means the box was rebuilt — or someone is in the middle wearing a stolen receptionist badge. Your pocket key does not prove the building is the building you meant.",
    solves: "You notice a fake receptionist. The warning is the point, not an annoyance. Planned rebuilds get ssh-keygen -R host and a fresh check. Blind yes trains you to follow any new face. CI should pin known_hosts, not StrictHostKeyChecking=no, so pipelines do not hug impostors either. You update the photo after a rebuild you ordered; you do not smile and walk upstairs after a surprise new face.",
    example: "A photo of the real clerk. A new face should stop you. If the hotel rebuilt the desk on purpose, you update the photo. If you did not rebuild anything, you do not smile and walk upstairs. The user key in your pocket does not prove the building is the building you meant. The guest book is how you notice a stolen receptionist lanyard.",
    uses: "Every first connection. CI should pin or use a known_hosts file, not StrictHostKeyChecking=no. Jump hosts and GitHub have fingerprints you can verify. After an EC2 stop-start with a new host key, remove that one line, not the whole guest book of every hotel you ever visited. Out-of-band check means console or a runbook, not a blog comment.",
    watch: "ssh-keygen -R host after a planned rebuild. Blindly deleting the whole known_hosts. Also ssh -o StrictHostKeyChecking=no in a blog snippet you paste into prod scripts. That flag says you will follow any stranger in a receptionist badge because checking faces slowed you down. CI that disables the check is the same lobby mistake."
  }, `# first connect — read the fingerprint
ssh ada@192.168.1.20
# The authenticity of host '...' can't be established.
# ED25519 key fingerprint is SHA256:....
# are you sure? yes

# after you rebuild the VM on purpose:
ssh-keygen -R 192.168.1.20`, "Most asked · Amazon · Microsoft · Google"),

  Q(10, "intermediate", "What is ssh-agent? Why a passphrase?", {
    problem: "A private key with no passphrase is a badge on the desk. A passphrase on every git push is exhausting. People chose the unlocked fob and hoped the laptop never left the café. The hotel PIN was either always shouted or never set, and both choices hurt once a bag went missing. An empty passphrase on a travel laptop is a master left on the café table.",
    what: "The passphrase encrypts the private file on disk, a PIN on your own fob at rest, not the server password. ssh-agent holds the unlocked key in memory for the session so you type the PIN once. macOS and Windows often already run an agent. ssh-add loads a key into that pocket for the day. Forwarding the agent is lending your live badge to whatever floor you just entered.",
    solves: "Stolen disk is not a stolen badge if the agent is not still unlocked and the file is encrypted. Daily work stays one unlock. Git push and ssh web reuse the agent. You keep a PIN without typing it on every knock at every hotel that already has your photocopy. Interviewers want passphrase plus agent, not an empty fob and not a PIN on every push.",
    example: "A key fob with a PIN. You unlock it in the morning. You do not leave the PIN written on the fob. You also do not hand the unlocked fob to a stranger at a shared jump box. Forwarding the agent is lending your live badge to whatever floor you just entered. Walk away from an unlocked laptop in the lobby and the live master is still on the table.",
    uses: "Laptops. macOS and Windows have their own agents. ssh-add adds a key. CI machines usually use a file or a cloud identity instead of an interactive PIN. Interviewers ask why passphrase plus agent beats an empty passphrase, and why -A on an untrusted bastion is a bad loan of the fob. Daily git and ssh reuse one morning unlock.",
    watch: "Forwarding the agent (-A) to a box you do not trust. That box can use your GitHub key while you are connected, like a clerk borrowing your unlocked badge. Also an agent that holds keys after you walk away from an unlocked laptop in the lobby is still a live master on the table. Prefer ProxyJump over -A on a shared floor."
  }, `ssh-add ~/.ssh/id_ed25519
ssh-add -l    # list unlocked keys

# macOS often already has an agent
# do not: ssh -A to a shared jump box unless you mean it`, "Most asked · Amazon · Google"),

  Q(11, "beginner", "scp vs sftp vs rsync?", {
    problem: "People said FTP the file and meant four different tools. One teammate opened an unencrypted postcard. Another copied a whole tree every minute. A third wanted to browse the far drawer. The hotel runner got four tickets for the same envelope and the lobby still saw a password on one of them. Names that sound like cousins at the desk hid three jobs and one leftover postcard protocol.",
    what: "scp copies files over SSH (whole file), one sealed envelope down the staff corridor. sftp is an interactive FTP-like shell over SSH, a clerk you can ask what is in the drawer. rsync compares both sides and sends diffs, often through SSH, a runner who only carries new pages. All three can use the same key card and the same Host nickname. None of them is old FTP, and sftp is not FTPS.",
    solves: "Pick copy-once (scp), browse (sftp), or sync a tree (rsync). You stay on the encrypted corridor instead of FTP. A second rsync is cheap. Interviews want the trailing-slash warning and the reminder that sftp is not FTPS. One badge, three jobs, no postcard protocol beside them. The .env never sits on a café USB or in a public chat drop.",
    example: "Messenger with one envelope (scp). A clerk you can ask what is in the drawer (sftp). A runner who only carries new pages (rsync). All three walk the staff corridor with your key card. None of them should be the old FTP postcard that guests can read on the lobby table. dist versus dist/ is a binder versus the pages inside.",
    uses: "One artefact: scp. Home directory or a deploy folder: rsync -avz. Exploring a remote tree you do not want to pull whole: sftp. CI often rsyncs a build. All of them honor ~/.ssh/config nicknames so web means the same hotel as ssh web. Prefer rsync when you will send the tree again tomorrow.",
    watch: "rsync trailing slashes: dist versus dist/ copies different shapes, a binder versus the pages inside. scp in cron on a huge tree should be rsync. Check exit codes. Do not fall back to ftp:// because the names sound similar at the desk; that postcard still puts the PIN in the lobby. Do not drop secrets into a world-readable folder on the far side."
  }, `scp ./app.tar.gz ada@web:/tmp/
sftp ada@web
rsync -avz ./dist/ ada@web:/var/www/app/`, "Most asked · Amazon · TCS"),

  Q(12, "beginner", "How does GitHub SSH work?", {
    problem: "Password git push died. HTTPS tokens expired. Friday deploy failed because the remote URL still held last month's PAT like a stamp on a lobby envelope. You needed the git hotel to honor a badge that does not sit in the remote string where screenshots and logs can copy it. Guests could read a token the same way they once read a Telnet PIN.",
    what: "Remote user is git. Host is github.com. Your public line is saved on the GitHub account under Settings → SSH keys, their desk book of photocopied badges. ssh -T git@github.com tests the badge without cloning. A Host github.com block can pin IdentityFile so the git building never sees a prod-only card. The account is whichever public line matched, not a password in the URL.",
    solves: "Push and pull with no token in the URL. The remote is an address, not a password. Personal laptops use a user key. A server that must pull one repo uses a deploy key, a badge filed only for that building, so a shared kitchen does not hold your personal hotel master. Friday deploys stop dying because a PAT expired in a saved remote.",
    example: "Same hotel key, GitHub's building. You photocopy the public side at their desk. You keep the metal. Next git push knocks as git@github.com and their clerk matches the line. You did not invent a second protocol; you reused SSH with a different hotel name on the street. ssh -T is a knock that only checks the badge, not a clone.",
    uses: "Personal laptops. Deploy keys for one repo on a server. GitLab and similar hosts use the same pattern. Interviewers ask why user is git, why ssh -T, and why a deploy key is not your laptop key copied onto a shared runner in the staff kitchen. CI should not carry your personal pocket key.",
    watch: "A deploy key is per repo. Your user key is per person. Do not put your user private key on a shared server. Do not paste the private file into GitHub; only .pub. If ssh -T fails, fix the desk book before rewriting remotes and blaming git itself for a badge problem. Adding the metal to their book is leaving the master in the kitchen."
  }, `cat ~/.ssh/id_ed25519.pub
# GitHub → Settings → SSH and GPG keys → New SSH key

ssh -T git@github.com
git remote set-url origin git@github.com:ada/app.git`, "Most asked · Amazon · Google · Microsoft"),

  Q(13, "intermediate", "What is SSH port forwarding?", {
    problem: "The database listened only on the server's localhost. Opening 5432 to the world was the lazy fix, a kitchen door on the street so café guests could browse the fridge. Your GUI on the laptop had no path into that kitchen without either a public hole or a private staff lift. You already had a key card for the building; you needed a lift, not a loading bay.",
    what: "-L localPort:destHost:destPort carries that port through the SSH session, a lift from your localhost to a far port inside the already-encrypted hotel corridor. -R is the other direction, useful when the far side must knock back. -D is a SOCKS proxy, a general staff tunnel. All of them ride the same encrypted corridor as your shell and reuse the key card you already filed.",
    solves: "Your GUI talks to 127.0.0.1. The real service never faces the internet. Postgres, Redis, a staging admin, or Jupyter can stay bound to loopback. You reuse the key card you already filed. Binding the local end to localhost keeps the café from sharing your lift buttons. You debug without opening a kitchen door on the street for every service.",
    example: "A staff lift from the lobby to the kitchen. Guests still cannot enter. You already passed the desk with a key card, so the lift will take you. If you wire the lift buttons to 0.0.0.0, the whole café rides with you into the fridge, which defeats the private-kitchen design. Close the session when you walk away so the lift is not an all-night café share.",
    uses: "Remote Postgres, Redis, staging admin, Jupyter, and any localhost-only admin UI. Keep the session open while you work. Combine with ~/.ssh/config LocalForward if you always need that lift. Interviewers ask -L versus -R versus -D; answer with direction of the knock and whether it is one port or SOCKS. Then close the tunnel so the lift is not shared overnight.",
    watch: "Binding to 0.0.0.0 so the café shares your tunnel. Leaving a forwarded admin UI up in an airport. Forwarding prod databases onto a laptop that also browses random Wi‑Fi. The lift is as trusted as the machine that holds the local port; treat that like a kitchen door you opened on purpose. Do not leave -L 0.0.0.0:5432 as a café share."
  }, `# laptop 5432 → server's local Postgres
ssh -L 5432:127.0.0.1:5432 ada@web

# then: psql postgres://ada@127.0.0.1:5432/app`, "Most asked · Amazon · Google · Microsoft"),

  Q(14, "intermediate", "What is a jump host / bastion?", {
    problem: "Prod boxes sat in a private subnet. Your laptop could not route there. Opening every box to the internet was worse: a keypad on every kitchen door along the street. You needed one locked front door on the public side and a second key for the staff floor behind it. A bowl of pem files in Slack was not a front door; it was a doormat with extra copies.",
    what: "A bastion is one locked door on the public side of the hotel. You SSH to it with a key card, then to the inner host. ProxyJump (or -J) does that in one command so you do not hop shells by hand. ~/.ssh/config can name Host bastion and Host db with ProxyJump bastion, two hotels and one street entrance. Inner machines keep port 22 off the sidewalk; only the front desk faces the street.",
    solves: "One place to harden and audit. Inner machines stay private, no port 22 on every kitchen. A leaver loses bastion access and the inner floor stays dark. You still use key cards, not passwords on the street. Security groups allow 22 only to the bastion, not to the database hosts. Interviews at Amazon expect this or SSM as the answer to why 22 is not on 0.0.0.0/0 for every instance.",
    example: "Hotel street door, then a second key for the staff floor. Guests never see the kitchen corridor. If the street door is password root and open to the world, that is a doormat, not a door. The inner key does not help if anyone can already sit at the first desk. You knock once at the public clerk, then walk the inner hallway with the second card.",
    uses: "AWS private subnets, campus labs, and any VPC where app and database hosts have no public IP. Combine with ssh-agent carefully; prefer ProxyJump over -A to an untrusted box. Interviewers at Amazon expect bastion or SSM as the answer to why 22 is not on 0.0.0.0/0 for every instance. Keep the bastion patched, keyed, and logged like the only street entrance it is.",
    watch: "A bastion with password root and port 22 open to the world. That is a doormat, not a door. Also agent forwarding to a shared bastion can lend your GitHub badge to whoever shares that floor. Keep the bastion patched, keyed, and logged like the only street entrance it is. Prefer ProxyJump over -A unless you mean to loan the live fob."
  }, `# ~/.ssh/config
Host bastion
  HostName bastion.example.com
  User ada
Host db
  HostName 10.0.2.15
  User ada
  ProxyJump bastion

ssh db
# same idea: ssh -J ada@bastion ada@10.0.2.15`, "Most asked · Amazon · Microsoft · Google"),

  Q(15, "intermediate", "Why do .ssh permissions matter?", {
    problem: "authorized_keys looked correct. sshd ignored it. Logs said Permissions 0777 are too open. A teammate had chmod -R 777 on home to fix npm and left the staff book in the lobby. The clerk refused to trust a binder anyone could add a stranger's line to overnight. Permission denied (publickey) looked like a missing photocopy when the drawer lock was the real problem.",
    what: "sshd refuses keys if someone else could have edited them. ~/.ssh is 700. private key and authorized_keys are 600. Your home should not be writable by others. The public .pub file can be 644. This is not fussiness; it is the clerk refusing a guestbook that sat on the lobby table. StrictModes is how the hotel keeps the book honest instead of honoring a binder a night guest could have edited.",
    solves: "A shared folder cannot silently add a stranger's line. Permission denied (publickey) after a chmod becomes explainable. You restore 700/600 and the desk book counts again. Interviews ask this right after the publickey error because the photocopy was fine and the drawer lock was not. You fix modes, then retry ssh -vvv, instead of recutting a pair that was never the problem.",
    example: "The staff book sits in a locked drawer. If it sat in the lobby, the clerk would not trust it. A world-writable home is that lobby. sshd would rather reject your real badge than honor a book a night guest could have edited. Tight modes are how the hotel keeps the book honest. chmod 777 ~ to fix npm is how you move the drawer into the fountain area.",
    uses: "Every it works on my VPS after a teammate chmod -R 777 ~. Shared campus accounts. Copied .ssh folders from a USB stick that arrived mode 777. First-week EC2 when someone untars a home backup with the wrong modes and the clerk suddenly ignores a perfect public line. Fix 700 on the directory and 600 on private material, then retry.",
    watch: "chmod 777 ~ to fix npm. You just broke SSH. Also a group-writable .ssh after a well-meant umask. Fix with 700 on the directory and 600 on private material, then retry ssh -vvv. Do not disable StrictModes in sshd_config to silence the warning; that is leaving the book in the lobby on purpose. The photocopy can be 644; the metal and the book cannot."
  }, `chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub
chmod 600 ~/.ssh/authorized_keys
chmod 600 ~/.ssh/config`, "Most asked · Amazon · Google"),

  Q(16, "intermediate", "Should you allow password SSH and root login?", {
    problem: "Bots hammered root / Admin@123 on port 22. One lucky guess was a full box, penthouse included. The street door had a keypad and the master suite was the first room they tried. Key cards existed, but the keypad still worked for anyone who could guess or reuse a password from another hotel. A stolen password list from another site walked in as staff.",
    what: "After key login works: PasswordAuthentication no. PermitRootLogin no. Log in as a named user with a key card, then sudo inside. sshd_config on the hotel desk turns off the street keypad and moves the master suite off the sidewalk. Cloud-init can apply this once the public line is already in the user's book. The door is still numbered 22; it is just not guessable from the lobby.",
    solves: "Guessing a password no longer opens the door. Root is not the first account they try. A stolen password list from another site does not walk your VPS. You still have the cloud console or a bastion if you lock the keypad before the key works — which is the watch-out, not a reason to leave root on the street. Bots still knock; the clerk never offers a PIN pad.",
    example: "The street door has no keypad, only the badge reader. The master suite is not on the street. Staff enter as themselves, then use a second stamp (sudo) inside. Bots still knock; the clerk never offers a PIN pad. That is hardening, not hiding: the door is still numbered 22, just not guessable. You did not rename the room and hope scanners would get lost.",
    uses: "sshd_config on a VPS. Cloud-init. Packer or Ansible after first boot. Interviewers at Amazon and Microsoft ask this with security groups: keys, no root, no password, and 22 not 0.0.0.0/0 if a bastion or SSM exists. Cheap shared hosting may still need a console plan before you flip the flags. File the photocopy first, then darken the keypad.",
    watch: "Turning passwords off before the key works. You lock yourself out — keep the cloud console nearby. Also PermitRootLogin prohibit-password still lets root keys; prefer no and a sudo user. Do not leave PasswordAuthentication yes for a week because we will tighten later; bots do not wait for your later. Flip the flags only after ssh with the card already succeeds."
  }, `# /etc/ssh/sshd_config  (after the key works)
PasswordAuthentication no
PermitRootLogin no
# then: sudo systemctl reload sshd`, "Most asked · Amazon · Microsoft"),

  Q(17, "beginner", "Can you put an SSH private key in Git?", {
    problem: "A tutorial said commit the pem so the team can SSH. The repo went public. The VPS was mined by morning. You had photocopied the hotel master into the lobby guestbook and then advertised the guestbook. git rm does not unspread a secret; history and forks still hold the metal key. A zip on Drive with the same file is the same bowl of masters with a different stamp.",
    what: "Private keys are secrets. Git is a copy machine that photocopies every commit to every clone. Treat *.pem and id_* like .env: they do not belong in the lobby guestbook. The .pub line is the photocopy and may be stored; the private file is the metal. CI should use a deploy key, OIDC, or a vault, not your laptop fob committed so the pipeline can knock on prod.",
    solves: "One person, one key. Revoke a leaver by deleting their public line, not by rotating a shared pem that ten laptops copied. A leaked user key is a new pair plus deleting the old line everywhere. Shared masters cannot name who walked the corridor at 3 a.m. in the desk log. Secret scanners still miss renamed keys, so review what you add before you push.",
    example: "You do not photocopy the hotel master and leave it in the lobby guestbook. You also do not zip the metal key onto Drive as backup. If a tutorial says commit the pem, that tutorial is teaching you to staff the front desk with a bowl of master keys and a sign that says take one. Assume a leaked key is already used: cut a new pair, then delete the old photocopy everywhere.",
    uses: "Every repo. CI uses a deploy key or OIDC, not your laptop key. .gitignore should catch pem and private id files. Secret scanners still miss renamed keys, so review what you add. Interviewers ask this to hear revoke, rotate, and never commit, not a joke about it being only an internal repo. History still has the metal after you git rm.",
    watch: "id_ed25519 in a zip on Drive. History still has it after you git rm. The .pub is OK to share; the file with BEGIN OPENSSH PRIVATE KEY is not. Assume a leaked key is already used: cut a new pair, delete the old public line from every hotel desk, then treat the old metal as public. Do not commit the pem because the team needs to SSH."
  }, `# .gitignore
*.pem
id_rsa
id_ed25519
id_ed25519.pub
# wait — the .pub is OK to share; the private file is not
# never commit the file with BEGIN OPENSSH PRIVATE KEY`, "Most asked · Amazon · Google · Microsoft"),

  Q(18, "intermediate", "SSH vs AWS Systems Manager Session Manager?", {
    problem: "Port 22 on 0.0.0.0/0. Lost pem files. Shared keys in Slack. The hotel street door was a public keypad plus a bowl of master keys. Leavers still had copies. New AWS designs wanted a badge tied to the job title, not a metal key that photocopies in the lobby forever. Closing 22 without another door meant nobody could debug when the pem bowl went missing.",
    what: "SSM Session Manager is a shell through the AWS API and IAM, a badge the hotel issues from HR, not from a pem file in Slack. No inbound 22 on the security group. You start a session with your AWS identity. SSH still wins on a cheap VPS and on GitHub, where there is no IAM desk in front of the kitchen.",
    solves: "Revoke a leaver in IAM. The security group can stay closed. You stop shipping pem files in Slack. Audit sits in CloudTrail instead of a shared authorized_keys nobody trims. SSH remains the right corridor for git@ and for machines that are not in AWS or cannot run the agent. When you leave the company, HR takes the job badge; they do not hunt every USB copy of a brass key.",
    example: "A badge tied to your job title (IAM) versus a metal key that photocopies (pem). When you leave the company, HR takes the job badge; they do not hunt every USB copy of a brass key. On a cheap VPS there is no HR desk, so you still cut SSH keys and file public lines yourself. GitHub still speaks SSH at the desk, not Session Manager.",
    uses: "New AWS designs. SSH still wins on a cheap VPS and on GitHub. Hybrid shops use SSM on EC2 and SSH for Git and bastions. Interviewers at Amazon want you to say closed 22 plus IAM, then admit SSH is not obsolete: it is the protocol GitHub and most non-AWS boxes still speak at the desk. Do not answer a git@ question with Session Manager.",
    watch: "SSM needs the agent and IAM. We closed 22 without SSM or a bastion means nobody can debug. Also SSM is not GitHub SSH; do not answer a git@ question with Session Manager. Lost laptop still needs org offboarding. And an instance profile that is too wide is another master key, just wearing an IAM lanyard. Keep a door you can actually use."
  }, `# AWS: no 22 in the security group
# IAM: ssm:StartSession on that instance
# aws ssm start-session --target i-0abc

# cheap VPS / GitHub: still SSH keys`, "Most asked · Amazon · Microsoft")
];

const data = {
  kind: "practice",
  notes,
  examples,
  questions
};

const out = path.join(__dirname, "..", "frontend", "data", "ssh.js");
fs.writeFileSync(
  out,
  "window.PREP_DATA = window.PREP_DATA || {};\n" +
    'window.PREP_DATA["ssh"] = ' +
    JSON.stringify(data, null, 2) +
    ";\n"
);
console.log("wrote", out, "examples", examples.length, "questions", questions.length);
