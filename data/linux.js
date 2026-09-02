window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA.linux = {
  "notes": [
    {
      "title": "Why Linux",
      "body": "Linux is the kernel plus a distro of tools that most servers, containers, and CI machines run. A kernel is the core program that talks to CPU, memory, and disk. A distro is the full package: Ubuntu, Debian, Alpine, and others. You work through a shell, not through desktop icons. Learn files, processes, permissions, and logs first. Those four show up in almost every outage."
    },
    {
      "title": "Filesystem",
      "body": "The filesystem starts at / which is called root, the top of the tree. Everything looks like a file: disks, printers, and even process info. /etc holds config, /var often holds logs, /home holds user folders, /tmp is scratch space. Paths are case-sensitive: App.js and app.js are different papers. An absolute path starts at /. A relative path starts from the folder you are in."
    },
    {
      "title": "Permissions",
      "body": "Permissions are three letters, three times: rwx for the owner, the group, and everyone else. r means read, w means write, x means execute. On a file, x means 'run this program.' On a directory, x means 'walk into this folder.' chmod changes the bits. chown changes the owner. sudo runs one action as a more powerful user."
    },
    {
      "title": "Processes",
      "body": "A process is a running program with a PID, a process id number, and usually a parent process. ps and top list who is alive. kill sends a signal, a message such as 'please stop.' TERM is the polite stop. KILL is the force stop. Background jobs and systemd services are two ways to keep work running after you close the window."
    },
    {
      "title": "Pipes",
      "body": "A pipe connects stdout of one program to stdin of the next. stdout is the normal output stream. stdin is the input stream. 2> sends stderr, the error stream, somewhere else. > overwrites a file. >> appends. Small tools combine: list, filter, count. You are building a factory line of text, not one giant custom app."
    },
    {
      "title": "Text tools",
      "body": "Text tools read lines of files. cat dumps a short file; less pages a long one; tail shows the end of a growing log. grep keeps matching lines. sed and awk edit text or pick columns. sort, uniq, and wc tidy lists. Interviews rarely need every flag. They need read, filter, and count."
    },
    {
      "title": "Networking",
      "body": "Networking on Linux is interfaces, ports, and DNS. An interface is a door such as eth0. A port is a numbered waiting room on that door. curl talks HTTP. ping asks if ICMP echo returns, which firewalls often block. DNS turns names into addresses. ss shows who is listening. Debug 'cannot connect' by asking: name, address, port, firewall."
    },
    {
      "title": "systemd",
      "body": "systemd is the service manager on many distros, often running as PID 1. A unit file describes how to start a service: user, working directory, command, restart policy. systemctl starts, stops, and enables on boot. journalctl reads that service's diary. After you edit a unit file, the manager must reload, then the service restart."
    },
    {
      "title": "Packages",
      "body": "A package manager installs OS programs from the distro store: apt on Ubuntu, dnf on Fedora, apk on Alpine. That is different from npm or pip, which install language libraries. A deb or rpm file is one crate; the manager also fetches crates that crate needs. Update the index, then install. Know which store you used when something is missing."
    },
    {
      "title": "SSH",
      "body": "SSH is an encrypted remote shell: you type on your laptop, the commands run on another machine. Keys are safer than passwords. The public key goes on the server. The private key stays with you. scp and rsync copy files over that same locked line. Do not turn off host checks 'to make it work' without knowing why they failed."
    },
    {
      "title": "Disk",
      "body": "Disk fills silently until creates fail. df shows space per filesystem. du shows which folder is heavy. inodes are slots for file names; a million tiny files can exhaust inodes while bytes still look free. lsblk lists devices. mount attaches a device to a folder. Full disk is a common outage. Check both bytes and inodes."
    },
    {
      "title": "Safety",
      "body": "Safety is looking before you delete. Tab-complete paths. ls a folder before rm. Linux has no recycle bin by default. rm -rf is permanent. Prefer a dry run or a trash tool when you are unsure. man and --help are the manual. Read them for the command you are about to run, especially anything that writes or deletes."
    }
  ],
  "questions": [
    {
      "id": 1,
      "level": "beginner",
      "q": "What is Linux?",
      "a": "Linux is a kernel: the core that talks to hardware. People also say 'Linux' for a distro, which is that kernel plus apps and layout.\nYou rarely talk to the kernel yourself. You type in a shell, which is a program that reads your words and starts other programs. Ubuntu, Debian, RHEL, and Alpine are different distros around a Linux kernel.\nIn the code:\nThe sandwich comments name the layers: hardware, kernel as filling, distro tools as plate, shell as napkin. echo says Linux is the filling, not the whole lunch by itself.\nA common mistake is calling the black window 'Linux.' That window is a terminal running a shell.",
      "code": "#!/usr/bin/env bash\n# a computer is layers, like a sandwich\n# bread  = hardware (CPU, disk)\n# filling = kernel (Linux) — talks to hardware\n# plate  = distro tools (files, users, networking)\n# napkin = shell (bash) — the words you type\n\necho \"Linux is the filling, not the whole lunch by itself\""
    },
    {
      "id": 2,
      "level": "beginner",
      "q": "kernel vs distro vs shell?",
      "a": "Kernel, distro, and shell are three jobs. The kernel talks to CPU, memory, and disk. A distro is the full OS package. The shell is the program that reads a line and runs a program.\nYou can change the shell (bash, zsh) without changing the distro. You can install another distro and still use bash.\nIn the code:\nkernel, distro, and shell are three strings with those jobs. The last comment says this file is read by a shell, not by the kernel directly.\nA common mistake is using 'Linux' for all three and then being unable to debug which layer broke.",
      "code": "#!/usr/bin/env bash\n# three different jobs\nkernel=\"talks to CPU, memory, disk\"     # engine\ndistro=\"Ubuntu: kernel + apps + layout\" # the whole car\nshell=\"bash: reads a line, runs a program\"  # steering wheel\n\n# this file is read by a SHELL, not by the kernel directly"
    },
    {
      "id": 3,
      "level": "beginner",
      "q": "What is a terminal vs a shell?",
      "a": "A terminal is the window or text screen. A shell is the program inside that understands commands.\nYou can run the same bash in many terminal windows. The terminal shows letters. The shell parses them.\nIn the code:\nterminal is the box of text. shell is bash or zsh. The comments say this script is shell code and the terminal only shows the letters.\nA common mistake is thinking a prettier terminal app is a different operating system. It is still a handset.",
      "code": "#!/usr/bin/env bash\n# window vs brain\nterminal=\"the box of text on screen\"   # the telephone\nshell=\"bash (or zsh)\"                  # the person who understands words\n\n# this script is shell code\n# the terminal only shows the letters"
    },
    {
      "id": 4,
      "level": "beginner",
      "q": "absolute vs relative path?",
      "a": "An absolute path starts at / and names every folder down to the file. A relative path starts from the folder you are standing in.\n. is this folder. .. is the parent. ~ is your home folder. Linux names are case-sensitive.\nIn the code:\nyou_are_in is /home/nitin/project. absolute is the full path to app.js. relative is app.js. parent is ../notes.txt. The last comment says App.js is a different paper.\nA common mistake is copying a relative path into a cron job that starts in a different folder, so the file is 'missing.'",
      "code": "#!/usr/bin/env bash\n# same paper, two ways to point at it\nyou_are_in=\"/home/nitin/project\"\n\nabsolute=\"/home/nitin/project/app.js\"  # full map from city hall (/)\nrelative=\"app.js\"                      # \"the paper in THIS room\"\nparent=\"../notes.txt\"                  # one door back, then that paper\n\n# Linux names are case-sensitive: App.js is a different paper"
    },
    {
      "id": 5,
      "level": "beginner",
      "q": "pwd, cd, ls?",
      "a": "You always have a current directory. pwd is the idea of reading that room name. cd walks to another folder. ls lists names in this folder.\nWalking does not copy files. Hidden names start with a dot and a short list may hide them.\nIn the code:\nhere is /home/nitin/project. papers are the visible names. hidden are .gitignore and .env. parent is /home/nitin. The last comment says you moved yourself, not the papers.\nA common mistake is rm * without ls first. Look at the table before you shred.",
      "code": "#!/usr/bin/env bash\n# a tiny walk through a house of folders\nhere=\"/home/nitin/project\"     # the room you stand in (pwd idea)\npapers=\"app.js README.md\"      # what a list of this room would show\nhidden=\".gitignore .env\"       # names starting with a dot\n\n# \"going to parent\" is walking through the door named ..\nparent=\"/home/nitin\"\n# you did not move the papers; you moved yourself"
    },
    {
      "id": 6,
      "level": "beginner",
      "q": "What are hidden files?",
      "a": "A hidden file is a normal file whose name starts with a dot. Listing tools hide those names by default to reduce clutter.\n.git, .ssh, and .env are common. They are not invisible magic.\nIn the code:\ntable_visible is app.js and README.md. table_hidden is .gitignore, .env, .ssh. all concatenates both. The last comment says .env is just named to stay off the tidy list.\nA common mistake is thinking a hidden file is gone because a short ls omitted it.",
      "code": "#!/usr/bin/env bash\n# dotted names are still real files\ntable_visible=\"app.js README.md\"\ntable_hidden=\".gitignore .env .ssh\"\n\n# a \"full glance\" includes both\nall=\"$table_visible $table_hidden\"\n# .env is not magic — it is just named to stay off the tidy list"
    },
    {
      "id": 7,
      "level": "beginner",
      "q": "cp, mv, rm, mkdir, touch?",
      "a": "Copy makes a second file. Move changes the name or folder. Remove deletes. mkdir creates a folder. touch can create an empty file or update a timestamp.\nLinux folders have no recycle bin by default. Remove is permanent.\nIn the code:\noriginal is notes.txt. copy is notes.bak, a second paper. Comments describe move as rename or change rooms, remove as shredding, mkdir as an empty room, touch as a blank paper.\nA common mistake is rm -rf on a mistyped path. Look first.",
      "code": "#!/usr/bin/env bash\n# a desk story (ideas, not a cheat sheet)\noriginal=\"notes.txt\"           # a paper\ncopy=\"notes.bak\"               # photocopy: now two papers\n# move is renaming or changing rooms: notes.txt -> archive/notes.txt\n# remove is shredding — no trash can in the default story\n# mkdir makes an empty room\n# touch can create a blank paper named ideas.txt"
    },
    {
      "id": 8,
      "level": "beginner",
      "q": "cat vs less vs tail?",
      "a": "cat dumps a whole file into the window, fine when it is short. less (paging) shows a screen at a time. tail shows the last lines, and can follow a log as it grows.\nA huge log will flood the window if you dump it all.\nIn the code:\nfile_text is four lines. Comments name dump, page, and last_lines. last_two is line3 and line4, the end of the notebook.\nA common mistake is cat on a multi-gigabyte log and freezing the session.",
      "code": "#!/usr/bin/env bash\n# three ways to read a notebook\nfile_text=\"line1\nline2\nline3\nline4\"\n\n# dump = pour every line into the window (ok if short)\n# page = show a screen at a time (ok if long)\n# last_lines = only the end (ok for logs)\nlast_two=\"line3\nline4\""
    },
    {
      "id": 9,
      "level": "beginner",
      "q": "What is a pipe?",
      "a": "A pipe sends the outgoing text of one program into the incoming text of the next.\nUnix tools stay small and combine. The first program does not need to know about the second.\nIn the code:\nprogram_a_output is three log lines. program_b keeps lines containing error. kept is the two error lines. The comment says A's stdout became B's stdin.\nA common mistake is thinking a pipe copies a file on disk. It is a stream between processes.",
      "code": "#!/usr/bin/env bash\n# a pipe is a funnel between two programs\nprogram_a_output=\"error disk\ninfo login\nerror timeout\"\n\n# program_b keeps lines that contain \"error\"\nprogram_b_input=\"$program_a_output\"\nkept=\"error disk\nerror timeout\"\n# A's stdout became B's stdin — that is the whole idea"
    },
    {
      "id": 10,
      "level": "beginner",
      "q": ">, >>, 2>?",
      "a": "Every program has two outgoing streams: stdout (normal notes) and stderr (complaints).\n> writes stdout to a file, wiping it first. >> appends. 2> sends stderr to a file. 2>&1 clips stderr onto stdout's destination.\nIn the code:\nstdout is normal notes, stderr is something broke. The comments map >, >>, 2>, and 2>&1 to those hoses.\nA common mistake is redirecting stdout and wondering why error messages still hit the screen. Those used stderr.",
      "code": "#!/usr/bin/env bash\n# two outgoing hoses from every program\nstdout=\"normal notes\"     # hose 1\nstderr=\"something broke\"  # hose 2\n\n# >  notes.txt     -> wipe the board, write hose 1\n# >> notes.txt     -> add a line under old text\n# 2> errors.txt    -> hose 2 goes to a different paper\n# 2>&1             -> clip hose 2 onto hose 1's destination"
    },
    {
      "id": 11,
      "level": "beginner",
      "q": "What is stderr vs stdout?",
      "a": "stdout is the answer stream you might pipe into the next tool. stderr is the complaint stream, so errors can stay on screen while data flows through the pipe.\nThey are two mouths on one program.\nIn the code:\ncount_lines echoes 42 on stdout and 'file missing' on stderr (hose 2). You can funnel 42 onward and still read the complaint.\nA common mistake is treating all printed text as stdout. Status messages often belong on stderr on purpose.",
      "code": "#!/usr/bin/env bash\n# one program, two mouths\ncount_lines() {\n  echo \"42\"           # stdout: the answer you might pipe\n  echo \"file missing\" >&2  # stderr: a complaint (idea: hose 2)\n}\n# you can funnel \"42\" into another tool\n# and still read \"file missing\" on the screen"
    },
    {
      "id": 12,
      "level": "beginner",
      "q": "grep?",
      "a": "grep keeps lines that match a pattern. It is a highlighter, not a full programming language.\nYou can invert and keep the non-matching lines instead.\nIn the code:\nlog has info and error lines. kept is the two error lines. The comment says invert would keep the info lines.\nA common mistake is grepping a binary or a huge directory without limits and drowning in noise.",
      "code": "#!/usr/bin/env bash\n# highlighter: keep matching lines\nlog=\"info started\nerror disk full\ninfo ok\nerror timeout\"\n\n# idea: keep lines that contain the word error\nkept=\"error disk full\nerror timeout\"\n# invert would keep the info lines instead"
    },
    {
      "id": 13,
      "level": "beginner",
      "q": "find vs ls?",
      "a": "ls lists one folder. find walks a tree of folders and can filter by name, type, or time.\nUse ls when you are in the room. Use find when you need the whole house.\nIn the code:\nroom_project is one room's names. house_walk is a tree of paths. js_only keeps paths that end with .js.\nA common mistake is ls -R on a huge tree when you needed a filtered find, or the opposite: find when you only needed this folder.",
      "code": "#!/usr/bin/env bash\n# one room vs a whole house\nroom_project=\"app.js src/ README.md\"\nhouse_walk=\"\n./app.js\n./src/login.js\n./src/db.js\n./README.md\n\"\n# filter idea: keep paths that end with .js\njs_only=\"./app.js\n./src/login.js\n./src/db.js\""
    },
    {
      "id": 14,
      "level": "beginner",
      "q": "Which command shows disk space?",
      "a": "Disk space has two common questions. Filesystem free space is 'how full is this disk.' Folder weight is 'which box is heavy.'\nA full /home with free / does not help you write in /home.\nIn the code:\nfilesystems shows / with 10G free and /home with 2G free. boxes shows src at 20M and logs at 15G eating the house.\nA common mistake is checking only the root filesystem when the app writes to a full separate mount.",
      "code": "#!/usr/bin/env bash\n# two different questions about \"space\"\nfilesystems=\"\n/      40G used  10G free\n/home  80G used   2G free\n\"\n# folder weight is \"how heavy is this box?\"\nboxes=\"\nsrc/   20M\nlogs/  15G   # this box is eating the house\n\""
    },
    {
      "id": 15,
      "level": "beginner",
      "q": "Who am I / where?",
      "a": "Your session has a user name, a numeric uid, groups, and a machine name.\nA web app often runs as a different user, so it does not wear your badge or your sudo rights.\nIn the code:\nuser is nitin, uid 1000, groups include sudo and docker, machine web-01, os Linux. The last comment says if the app runs as www, it does not get your badge.\nA common mistake is debugging permissions as yourself when the crashing process is another user.",
      "code": "#!/usr/bin/env bash\n# a name badge for this session\nuser=\"nitin\"\nuid=1000                 # employee number\ngroups=\"nitin sudo docker\"\nmachine=\"web-01\"\nos=\"Linux\"\n\n# if the app runs as user \"www\", it does not get your badge"
    },
    {
      "id": 16,
      "level": "intermediate",
      "q": "What do rwx mean on a file vs directory?",
      "a": "rwx means different things on a file versus a directory.\nOn a file: r read bytes, w change bytes, x run as a program. On a directory: r list names, w create or delete names, x walk in (cd). Without x on a folder, you cannot enter even if you know the filename inside.\nIn the code:\nThe table maps r, w, x for FILE versus DIRECTORY. The last comment says a room without x cannot be entered.\nA common mistake is chmod on the file only, while a parent folder has no x for that user.",
      "code": "# permissions table (file vs room)\n# letter | on a FILE              | on a DIRECTORY (room)\n# r      | read bytes             | list names on the table\n# w      | change bytes           | create/delete names\n# x      | run as a program       | walk in (cd / traverse)\n#\n# room without x: you cannot enter, even with the filename"
    },
    {
      "id": 17,
      "level": "intermediate",
      "q": "chmod 755 vs 644?",
      "a": "chmod numbers are octal: r=4, w=2, x=1, added per role.\n755 is rwx for owner, r-x for group and others, typical for folders and programs. 644 is rw- for owner, r-- for others, typical for text files. 600 is owner only, typical for private keys.\nIn the code:\nThe comments add 7, 5, 4 from the bits, then show 755, 644, and 600 with those meanings.\nA common mistake is chmod 777 'to make it work.' That gives everyone write, which is a hole, not a fix.",
      "code": "# octal is addition of bits\n# r=4  w=2  x=1\n#\n# 7 = 4+2+1 = rwx\n# 5 = 4+0+1 = r-x\n# 4 = 4+0+0 = r--\n#\n# 755 = owner rwx, group r-x, others r-x   typical folder/program\n# 644 = owner rw-, group r--, others r--   typical text file\n# 600 = owner rw- only                   typical private key"
    },
    {
      "id": 18,
      "level": "intermediate",
      "q": "chown and chgrp?",
      "a": "chown sets the owner (first rwx column). chgrp or chown :group sets the group (second column).\nThe file text can be fine while the label is wrong, so the app user cannot write.\nIn the code:\nfile is app.log, owner and group www-data, others anyone else. The deploy bug is owner=root while the app user is www-data, so write fails.\nA common mistake is fixing code for a permission error that was only an owner label.",
      "code": "#!/usr/bin/env bash\n# a locker label\nfile=\"app.log\"\nowner=\"www-data\"     # first rwx column\ngroup=\"www-data\"     # second rwx column\nothers=\"anyone else\" # third column\n\n# deploy bug: owner=root, app user=www-data -> write fails\n# the text of the file can be fine; the label is wrong"
    },
    {
      "id": 19,
      "level": "intermediate",
      "q": "umask?",
      "a": "umask is a subtract mask applied when a new file or folder is created. It does not rewrite old files.\nA typical file start is 666. umask 022 turns off group and other write, result 644. Folders start from 777, same umask gives 755.\nIn the code:\nThe comments walk 666 minus 022 to 644, and 777 minus 022 to 755. The last line says umask is a stamp on NEW papers.\nA common mistake is changing umask and expecting existing secret files to tighten. chmod those files.",
      "code": "# new file default minus umask\n# typical file starting point: 666 (rw-rw-rw-)\n# umask 022 turns off group-write and other-write\n# result: 644 (rw-r--r--)\n#\n# typical folder starting point: 777\n# umask 022 -> 755\n#\n# umask is a stamp on NEW papers, not a rewrite of the library"
    },
    {
      "id": 20,
      "level": "intermediate",
      "q": "What is sudo?",
      "a": "sudo runs one allowed action as another user, often root, then you are yourself again.\nPolicy says who may do what. A full root shell is staying in the glass case all day.\nIn the code:\nwho is nitin, wanted_action install nginx, as_user root. If policy allows, one privileged action then back to nitin. The last comment warns about a full root shell.\nA common mistake is sudo su for every little task, so every typo is a root typo.",
      "code": "#!/usr/bin/env bash\n# policy: nitin may install packages, not live as root all day\nwho=\"nitin\"\nwanted_action=\"install nginx\"\nas_user=\"root\"\n\nif policy_allows \"$who\" \"$wanted_action\"; then\n  echo \"one privileged action, then back to being nitin\"\nfi\n# a full root shell is staying inside the glass case"
    },
    {
      "id": 21,
      "level": "intermediate",
      "q": "root vs regular user?",
      "a": "root is uid 0, the master key that can ignore most rwx signs. A regular user has a uid and only the folders they own or are allowed.\nIf a website process wears the master key, a bug is a building-wide problem.\nIn the code:\nroot_user is uid 0. app_user is uid 1001 limited to /var/app. The comments say wear the app badge on purpose.\nA common mistake is running the app as root 'because permission denied.' Fix the labels instead.",
      "code": "#!/usr/bin/env bash\n# two badges\nroot_user=\"uid 0, master key, can ignore most rwx signs\"\napp_user=\"uid 1001, only /var/app and its logs\"\n\n# if the website process wears the master key, a bug is a building-wide problem\n# wear the app badge on purpose"
    },
    {
      "id": 22,
      "level": "intermediate",
      "q": "SUID bit?",
      "a": "SUID on a program means while it runs, it may wear the file owner's badge. passwd needs that to edit a root-owned password file.\nSticky on a directory like /tmp means you may only delete your own names, even if the folder is world-writable.\nIn the code:\nComments describe SUID as wearing the owner's badge, sticky as a public table where you cannot throw away someone else's notes. Both sit on top of rwx.\nA common mistake is copying SUID binaries around or leaving SUID on a script you wrote. That is a privilege bug.",
      "code": "# special extra bits (ideas)\n# SUID on a program: while it runs, it may wear the OWNER's badge\n#   example idea: passwd must edit a root-owned password file\n#\n# sticky on a directory (/tmp): you may only remove YOUR papers\n#   a public table where you cannot throw away someone else's notes\n#\n# both are extra rules on top of rwx"
    },
    {
      "id": 23,
      "level": "intermediate",
      "q": "What is a process?",
      "a": "A process is a living program: pid, parent, name, memory, open files (fds).\nWhen it exits, the parent should collect the exit status. A zombie is a finished process whose parent never signed the slip.\nIn the code:\nprocess lists pid 4412, parent 1, name node, memory 180M, fds including a log and a socket. The last comment defines a zombie.\nA common mistake is killing pid 1 or a random pid from an old note. Recheck who is alive.",
      "code": "#!/usr/bin/env bash\n# a living program is a card like this\nprocess=(\n  \"pid=4412\"\n  \"parent=1\"           # often systemd adopted it\n  \"name=node\"\n  \"memory=180M\"\n  \"fds=stdin,stdout,log.txt,socket\"\n)\n# a zombie is a card that says \"exited\" but the parent never signed it off"
    },
    {
      "id": 24,
      "level": "intermediate",
      "q": "ps aux vs ps -ef?",
      "a": "ps prints an attendance sheet of processes. aux and -ef are two flag dialects for a similar table: user, pid, command.\nYou are reading who is alive, not learning two magic spells.\nIn the code:\nThe comment table shows nitin 4412 node server.js and root 1 systemd. Two flag dialects print a similar sheet.\nA common mistake is memorizing flags and not reading the COMMAND column to see what the process actually is.",
      "code": "#!/usr/bin/env bash\n# an attendance sheet of living programs (idea of the table)\n# USER   PID  CPU MEM  COMMAND\n# nitin  4412 2.0 1.2  node server.js\n# root   1    0.1 0.3  systemd\n\n# two flag dialects print a similar sheet\n# you are reading who is alive, not learning two magic spells"
    },
    {
      "id": 25,
      "level": "intermediate",
      "q": "top / htop?",
      "a": "top and htop are live dashboards: load, CPU per process, memory. The numbers keep changing.\nYou are watching live cooks, not a saved photo. htop is often easier to read; the idea is the same.\nIn the code:\nload is 1.2 0.8 0.4. cpu shows node 40% and nginx 5%. mem is 8G used / 16G. Comments say the numbers keep changing.\nA common mistake is taking one spike as proof the machine is dying. Watch a minute and see if it stays hot.",
      "code": "#!/usr/bin/env bash\n# a dashboard snapshot\nload=\"1.2  0.8  0.4\"    # 1, 5, 15 minute queues\ncpu=\"node  40%   nginx  5%\"\nmem=\"8G used / 16G\"\n\n# the numbers keep changing\n# you are watching live cooks, not a saved photo"
    },
    {
      "id": 26,
      "level": "intermediate",
      "q": "What is load average?",
      "a": "Load average is the length of the run queue over 1, 5, and 15 minutes, not a CPU percent.\nCompare it to the number of cores. A high load with idle CPU often means wait on disk or network, not 'CPU is 800%.'\nIn the code:\ncores is 4, load_1min is 8.0. Eight people in line, four cashiers. The last comment says idle CPU with a long line may be waiting on disk.\nA common mistake is treating load 1.0 as '100% CPU' on an 8-core box. On 8 cores, 1.0 is quiet.",
      "code": "#!/usr/bin/env bash\n# load is line length, not a percent\ncores=4\nload_1min=8.0\n\n# 8 people in line, 4 cashiers -> the kitchen is overcrowded\n# if CPU looks idle, many in line may be waiting on the disk oven (I/O)"
    },
    {
      "id": 27,
      "level": "intermediate",
      "q": "kill vs kill -9?",
      "a": "kill by default sends TERM: please pack and exit, so the program can save files. kill -9 sends KILL: vanish now, cannot pack.\nKILL is last resort. A careful story is polite tap, wait, then force.\nIn the code:\npid 4412. Comments contrast TERM 15 and KILL 9. A careful story: polite tap, wait, only then force.\nA common mistake is -9 first, then wondering why the database left a dirty file.",
      "code": "#!/usr/bin/env bash\n# two kinds of taps on a process's shoulder\npid=4412\n\n# TERM (15): \"please pack your bag and go\" — can save files\n# KILL (9):  \"vanish now\" — cannot pack, last resort\n\n# a careful story: polite tap, wait, only then force"
    },
    {
      "id": 28,
      "level": "intermediate",
      "q": "signals you should know?",
      "a": "Signals are doorbells. INT is Ctrl+C. TERM is shutdown and clean up. HUP often means reread config. STOP pauses, CONT continues. KILL cannot be caught.\nA server should listen for TERM and close connections politely.\nIn the code:\nThe comments list INT, TERM, HUP, STOP, CONT, KILL. The last line says a Node server should listen for TERM.\nA common mistake is catching TERM and never exiting, so the supervisor waits then KILLs you anyway.",
      "code": "#!/usr/bin/env bash\n# doorbells a program might hear\n# INT  = Ctrl+C, \"stop now please\" from the keyboard\n# TERM = \"shut down and clean up\"\n# HUP  = \"reread your config\" for some services\n# STOP = pause, CONT = continue\n# KILL = cannot hear it, just ends\n\n# a Node server should listen for TERM and close the door politely"
    },
    {
      "id": 29,
      "level": "intermediate",
      "q": "background jobs?",
      "a": "A foreground job owns the terminal. A background job runs while you type something else.\nClosing the window can hang up those jobs unless they were detached (nohup, systemd, a multiplexer).\nIn the code:\njobs_table has build.sh running and editor stopped. Comments define foreground vs background and warn that closing the window can hang up jobs.\nA common mistake is starting a long build in the foreground, disconnecting SSH, and killing it by accident.",
      "code": "#!/usr/bin/env bash\n# the shell's little job board\njobs_table=(\n  \"1  running  build.sh\"\n  \"2  stopped  editor\"\n)\n\n# foreground = you are watching job 1 in this window\n# background = job 1 cooks while you type something else\n# closing the window can hang up those jobs unless they were detached"
    },
    {
      "id": 30,
      "level": "intermediate",
      "q": "nohup vs systemd service?",
      "a": "nohup means ignore hangup so a process can outlive the SSH session. A systemd service is a real job contract: user, directory, start command, restart, logs.\nnohup is a camping tent. systemd is an employment contract with a boss and a diary.\nIn the code:\nThe unit-file comments show User, WorkingDirectory, ExecStart node, Restart on-failure. Comments contrast nohup with the unit.\nA common mistake is nohup in a loop on a VM that reboots, then wondering why the app is down. Enable a service.",
      "code": "# a real service is a unit file (story of a receptionist)\n# [Service]\n# User=app\n# WorkingDirectory=/var/app\n# ExecStart=/usr/bin/node server.js\n# Restart=on-failure\n#\n# nohup is \"please keep going if I hang up the phone\"\n# the unit is \"this is your job, with a boss and a diary\""
    },
    {
      "id": 31,
      "level": "intermediate",
      "q": "What is systemd?",
      "a": "systemd is the building manager on many Linux systems, often PID 1 after the kernel.\nIt starts networking and your app units in order and keeps a journal of their logs.\nIn the code:\nBoot order comments: kernel, systemd pid 1, networking, your app unit. The manager also holds a diary of tenant noise.\nA common mistake is putting startup in rc.local on a systemd distro and fighting the real manager.",
      "code": "# systemd is the building manager\n# boot order (idea):\n#   1. kernel\n#   2. systemd (pid 1)\n#   3. networking\n#   4. your app unit\n#\n# the manager also holds a diary (the journal) of tenant noise"
    },
    {
      "id": 32,
      "level": "intermediate",
      "q": "systemctl commands?",
      "a": "start/stop/restart change running_now, whether the shop is open this minute. enable/disable change on_boot, whether it opens every morning.\nAfter you edit a unit file, the manager must reread papers, then you restart the tenant if the recipe changed.\nIn the code:\nrunning_now vs on_boot. Comments mention daemon-reload after editing /etc/systemd/system, then restart if the recipe changed.\nA common mistake is enable without start, or editing the unit and never reloading, so the old recipe still runs.",
      "code": "# two different switches\nrunning_now=\"shop is open this minute\"     # start/stop/restart\non_boot=\"open every morning automatically\" # enable/disable\n\n# after you edit the unit paper in /etc/systemd/system\n# the manager must reread papers (daemon-reload idea)\n# then restart the tenant if the recipe changed"
    },
    {
      "id": 33,
      "level": "intermediate",
      "q": "journalctl?",
      "a": "journalctl reads systemd's diary. You can slice by unit, follow the end, or filter by priority.\nThe diary is not always a file in /var/log. It is the journal database.\nIn the code:\nunit is nginx. pages show started then error bind port 80. Comments mention follow and priority filter.\nA common mistake is grepping an old /var/log/messages while the service only logs to the journal.",
      "code": "#!/usr/bin/env bash\n# a diary slice for one tenant\nunit=\"nginx\"\npages=\"\nMar 01 10:00 nginx: started\nMar 01 10:01 nginx: error bind port 80\n\"\n\n# follow = wait at the end of the diary\n# priority filter = only the angry pages"
    },
    {
      "id": 34,
      "level": "beginner",
      "q": "Where are logs?",
      "a": "Logs live in different diaries. syslog and nginx often use files under /var/log. systemd units use the journal. Apps may write wherever their config says.\nFirst question in an outage: which diary is this service using?\nIn the code:\nsys_files lists syslog, auth.log, nginx. journal is per unit. app is often /var/log/myapp. The last comment asks which diary.\nA common mistake is rotating one file while the app writes to another path, so you tail an empty notebook.",
      "code": "#!/usr/bin/env bash\n# a map of diaries\nsys_files=\"/var/log/syslog  /var/log/auth.log  /var/log/nginx\"\njournal=\"systemd journal per unit\"\napp=\"wherever the app config points, often /var/log/myapp\"\n\n# first question in an outage: which diary is this service using?"
    },
    {
      "id": 35,
      "level": "intermediate",
      "q": "logrotate?",
      "a": "logrotate renames and compresses growing logs so disks do not fill. Old files get numbered and eventually deleted.\nA trap: a process still writes to a deleted inode. df stays full until that process reopens the file (often restart).\nIn the code:\ntoday is app.log. rotated is app.log.1.gz. gone is app.log.8 after max count. The trap comment is writing into a deleted inode.\nA common mistake is deleting a huge log with rm while the process is running, then seeing no free space until restart.",
      "code": "#!/usr/bin/env bash\n# notebooks over time\ntoday=\"app.log\"           # the live notebook\nrotated=\"app.log.1.gz\"    # last month, compressed\ngone=\"app.log.8\"          # deleted after a max count\n\n# trap: process still writing into a deleted inode\n# df stays full until that process lets go (restart)"
    },
    {
      "id": 36,
      "level": "intermediate",
      "q": "lsof and open files?",
      "a": "lsof lists open files and sockets for a process. 'Who uses port 3000?' is reading that table.\nFile descriptors are tickets: 0 stdin, 1 stdout, 2 stderr, then files and sockets.\nIn the code:\npid 4412 fds 0 keyboard, 1 screen, 2 errors, 3 app.log, 4 TCP :3000. The last comment says who uses port 3000 is ticket 4.\nA common mistake is killing the wrong process because you grepped the port in the wrong table.",
      "code": "#!/usr/bin/env bash\n# a process coat-check\npid=4412\nfds=(\n  \"0 -> keyboard\"\n  \"1 -> screen\"\n  \"2 -> screen errors\"\n  \"3 -> /var/log/app.log\"\n  \"4 -> TCP :3000\"\n)\n# \"who uses port 3000?\" is reading this table for ticket 4"
    },
    {
      "id": 37,
      "level": "intermediate",
      "q": "ss vs netstat?",
      "a": "ss (and older netstat) print the socket table: listen ports and established connections.\nss is today's printout. The idea is occupied phone lines, not the flag names.\nIn the code:\nThe table shows LISTEN 80 nginx, LISTEN 3000 node, ESTAB 443. The last comment says ss is today's printout, netstat yesterday's.\nA common mistake is assuming a LISTEN on 127.0.0.1 is reachable from the internet. That is localhost only.",
      "code": "#!/usr/bin/env bash\n# occupied phone lines (idea of the socket table)\n# STATE   PORT  PROGRAM\n# LISTEN  80    nginx\n# LISTEN  3000  node\n# ESTAB   443   nginx <-> a browser\n\n# ss is today's printout; netstat is yesterday's printout of the same idea"
    },
    {
      "id": 38,
      "level": "intermediate",
      "q": "How do you see who listens on a port?",
      "a": "To see who listens on a port, read the reservation book: port, program, pid.\n'8080 already in use' means that pid already sat at that table.\nIn the code:\nPORT 8080 is node pid 4412. PORT 80 is nginx pid 990. The last comments say you now know WHO.\nA common mistake is starting a second copy of the app and treating 'address in use' as a mystery.",
      "code": "#!/usr/bin/env bash\n# reservation book\n# PORT  GUEST\n# 8080  node (pid 4412)\n# 80    nginx (pid 990)\n\n# \"8080 already in use\" means pid 4412 already sat at that table\n# you now know WHO, which is the real answer"
    },
    {
      "id": 39,
      "level": "beginner",
      "q": "ping, curl, wget?",
      "a": "ping tests ICMP echo, which many clouds block on purpose. curl tests HTTP. wget downloads a file to disk.\nA 200 from curl can happen even if ping is blocked. They are not the same test.\nIn the code:\ndoorbell is ICMP. web_page is GET /api/health -> 200. download is save report.pdf. The last comment says they are not the same test.\nA common mistake is 'the server is down' because ping failed, while HTTPS still works.",
      "code": "#!/usr/bin/env bash\n# three different questions\ndoorbell=\"did ICMP echo return? (may be blocked on purpose)\"\nweb_page=\"GET /api/health -> 200 { ok: true }\"\ndownload=\"save report.pdf onto disk\"\n\n# a 200 from the web_page can happen even if doorbell is blocked\n# they are not the same test"
    },
    {
      "id": 40,
      "level": "intermediate",
      "q": "dig / nslookup?",
      "a": "dig and nslookup query DNS: name to records such as A (IPv4) and AAAA (IPv6).\nThis machine's /etc/hosts can override DNS for this computer only.\nIn the code:\nname is api.example.com. records are A 203.0.113.10 and AAAA 2001:db8::10. The last comment says a leftover /etc/hosts line wins on THIS computer.\nA common mistake is debugging DNS on a laptop that has an old hosts override nobody else has.",
      "code": "#!/usr/bin/env bash\n# a phone book lookup (idea)\nname=\"api.example.com\"\nrecords=(\n  \"A     203.0.113.10\"\n  \"AAAA  2001:db8::10\"\n)\n# if this machine's /etc/hosts has a leftover line, it wins for THIS computer only"
    },
    {
      "id": 41,
      "level": "intermediate",
      "q": "/etc/hosts?",
      "a": "/etc/hosts is a sticky note on this computer mapping names to IPs.\nlocalhost is usually 127.0.0.1. A leftover test line can pin a production name to the wrong box forever on that machine.\nIn the code:\n127.0.0.1 localhost, and a leftover 203.0.113.5 for api.example.com. This computer will not ask DNS for that name. Other computers still use the real phone book.\nA common mistake is adding a hosts line for a test and forgetting it, then 'DNS is broken' only on your VM.",
      "code": "#!/usr/bin/env bash\n# a sticky note on THIS computer\n# IP            name\n# 127.0.0.1     localhost\n# 203.0.113.5   api.example.com   # leftover test — dangerous\n\n# this computer will not ask DNS for api.example.com\n# other computers still use the real phone book"
    },
    {
      "id": 42,
      "level": "intermediate",
      "q": "What is DNS at a high level?",
      "a": "DNS maps a name to records, with a TTL (time to live) saying how long copies may remember the answer.\nA cutover can look broken until old memories expire.\nIn the code:\nlookup www.example.com, answer A 203.0.113.10, ttl_seconds 300. For 300 seconds many computers remember the old number.\nA common mistake is changing DNS and testing from a machine that still caches the old A record.",
      "code": "#!/usr/bin/env bash\n# name -> records, with a memory timeout\nlookup=\"www.example.com\"\nanswer=\"A 203.0.113.10\"\nttl_seconds=300\n\n# for 300 seconds, many computers remember the old number\n# a cutover can look \"broken\" until memories expire"
    },
    {
      "id": 43,
      "level": "intermediate",
      "q": "ip addr vs ifconfig?",
      "a": "ip addr lists network interfaces: name, up/down, addresses. ifconfig is the older printout of a similar table.\nlo is loopback 127.0.0.1. eth0 might be the main ethernet door.\nIn the code:\nThe table shows lo up 127.0.0.1, eth0 up 10.0.0.8/24, wlan0 down. ip addr is modern, ifconfig vintage.\nA common mistake is configuring the Wi‑Fi door while the server only has ethernet, or vice versa.",
      "code": "#!/usr/bin/env bash\n# doors on this machine (idea)\n# NAME   STATE  ADDRESS\n# lo     up     127.0.0.1\n# eth0   up     10.0.0.8/24\n# wlan0  down   -\n\n# ip addr is the modern printout of this table\n# ifconfig is the vintage printout"
    },
    {
      "id": 44,
      "level": "beginner",
      "q": "What is SSH?",
      "a": "SSH is an encrypted remote login. Your laptop is local. user@host is the other house. Both sides prove who they are.\nOnce the line is open, you have a shell on that machine. File copy uses the same locked line.\nIn the code:\nlocal is your laptop, remote is user@web-01, tunnel is encrypted with proof. The comments say you have a shell IN that other house.\nA common mistake is SSHing as root with a password on the open internet. Use keys and a regular user plus sudo.",
      "code": "#!/usr/bin/env bash\n# a locked phone line (idea)\nlocal=\"your laptop\"\nremote=\"user@web-01\"\ntunnel=\"encrypted, both sides prove who they are\"\n\n# once the line is open, you have a shell IN that other house\n# file copy is using the same locked line, not a second magic protocol you must mythologize"
    },
    {
      "id": 45,
      "level": "intermediate",
      "q": "SSH keys?",
      "a": "An SSH key pair: the private file stays on your machine. The public line goes in the server's authorized_keys.\nThe server challenges you. Your private key answers. A leaked private file is a stolen badge.\nIn the code:\nprivate is ~/.ssh/id_ed25519. public is the .pub file. server_authorized_keys holds the public line. The last comment says a leaked private file is a stolen badge.\nA common mistake is copying the private key to the server 'so SSH works both ways.' Only the public line belongs there.",
      "code": "#!/usr/bin/env bash\n# two halves\nprivate=\"~/.ssh/id_ed25519\"          # NEVER copy this to the server as a login secret to share\npublic=\"~/.ssh/id_ed25519.pub\"       # this line goes into authorized_keys\n\nserver_authorized_keys=\"ssh-ed25519 AAAA... nitin@laptop\"\n# the server challenges you; your private key answers\n# a leaked private file is a stolen badge"
    },
    {
      "id": 46,
      "level": "intermediate",
      "q": "ssh-agent and ssh config?",
      "a": "ssh config is an address book of nicknames: Host, HostName, User, IdentityFile. ssh-agent holds unlocked keys in memory so you are not typing the passphrase every time.\nHost is the short name you type.\nIn the code:\nThe teaching config maps Host web to HostName web-01, User nitin, IdentityFile. The agent is a keychain in memory.\nA common mistake is a typo in IdentityFile so SSH silently tries the wrong key and you think the server is down.",
      "code": "# ~/.ssh/config is an address book (teaching file)\n# Host web\n#   HostName web-01.example.com\n#   User nitin\n#   IdentityFile ~/.ssh/id_ed25519\n#\n# Host is the nickname you type\n# the agent is a keychain holding the unlocked private key in memory"
    },
    {
      "id": 47,
      "level": "intermediate",
      "q": "scp vs rsync?",
      "a": "scp copies files through SSH, often the whole set every time. rsync compares both sides and sends only missing or changed files.\nA second rsync is cheap if almost nothing changed.\nIn the code:\nscp_idea is copy every paper every time. rsync_idea is compare and send only changes. The last comments say the second run is cheap.\nA common mistake is scp of a huge tree in a loop every minute. Use rsync or you will melt the link.",
      "code": "#!/usr/bin/env bash\n# two ways to move a folder of papers\nscp_idea=\"copy every paper every time through the locked line\"\nrsync_idea=\"compare both sides, send only missing or changed papers\"\n\n# second run of rsync is cheap if almost nothing changed\n# that is the idea, not a flag dump"
    },
    {
      "id": 48,
      "level": "intermediate",
      "q": "What is a shebang?",
      "a": "A shebang is the first line #! telling the kernel which program should run this text file.\nWithout execute permission, it is still a text file, not a launchable app by name.\nIn the code:\nThe first line is #!/usr/bin/env bash. echo says the kernel read the label and handed the file to bash. The last comment is about +x.\nA common mistake is writing a shebang and then running bash script.sh anyway, or forgetting chmod +x when you wanted ./script.sh.",
      "code": "#!/usr/bin/env bash\n# the first line is a label: \"please cook this with bash\"\n# #! is the shebang (hash-bang)\n\necho \"the kernel read the label, then handed this file to bash\"\n# without +x, it is still a text file, not an \"app\" you can launch by name"
    },
    {
      "id": 49,
      "level": "intermediate",
      "q": "exit codes?",
      "a": "An exit code is a number a program returns. 0 means success by convention. Non-zero means failure. 127 often means command not found.\nCI robots just read these numbers.\nIn the code:\ncopy_ok is 0, copy_fail is 1, not_found is 127. The if checks copy_ok -eq 0. The last comment says CI reads these numbers.\nA common mistake is ignoring a non-zero in a script and continuing, so a failed copy still 'succeeds' overall.",
      "code": "#!/usr/bin/env bash\n# every program returns a number\ncopy_ok=0\ncopy_fail=1\nnot_found=127\n\nif [[ $copy_ok -eq 0 ]]; then\n  echo \"the last step claimed success\"\nfi\n# CI is just a robot reading these numbers"
    },
    {
      "id": 50,
      "level": "intermediate",
      "q": "set -euo pipefail?",
      "a": "set -euo pipefail makes bash stricter. -e stops on a failing step. -u errors on unset names. pipefail makes a pipe fail if any stage fails, not only the last.\nYou stop instead of copying nothing forever.\nIn the code:\nset -euo pipefail with comments for each flag. src is /data/a. The last comment says if src is missing, you stop.\nA common mistake is enabling -e and then using a command whose non-zero is normal (grep no match), so the script exits early.",
      "code": "#!/usr/bin/env bash\nset -euo pipefail\n# -e  if any step returns non-zero, stop (do not keep driving)\n# -u  using an unset name is an error (no silent empty string)\n# -o pipefail  a pipe fails if ANY stage fails, not only the last\n\nsrc=\"/data/a\"\n# if src is missing, -e/-u help you stop instead of copying nothing forever"
    },
    {
      "id": 51,
      "level": "beginner",
      "q": "environment variables?",
      "a": "Environment variables are named values clipped onto a process and its children. The child can read PORT. A program you did not export to will not see your private shell names.\nThey are a form, not a file, unless you write them into one.\nIn the code:\nNODE_ENV production, PORT 3000, PATH listed. Comments say this script's children can read PORT. A program you did not export to will not see your private names.\nA common mistake is setting a variable in one terminal and expecting a systemd service to see it. The service has its own environment.",
      "code": "#!/usr/bin/env bash\n# a form clipped to child programs\nexport NODE_ENV=\"production\"\nexport PORT=\"3000\"\nexport PATH=\"/usr/bin:/bin\"\n\n# this script's children can read PORT\n# a program you did not export to will not see your private shell names"
    },
    {
      "id": 52,
      "level": "intermediate",
      "q": "PATH?",
      "a": "PATH is a colon-separated list of folders the shell searches, left to right, for a program name.\nThe first match wins. Putting . first would also look at ./node, which is dangerous if a stranger left a file there.\nIn the code:\nPATH is /usr/local/bin:/usr/bin:/bin. wanted is node. Comments search those three rooms in order. The last comment warns about . first.\nA common mistake is having two node binaries and wondering why --version disagrees. which/type tell you which PATH hit won.",
      "code": "#!/usr/bin/env bash\n# search rooms from left to right\nPATH=\"/usr/local/bin:/usr/bin:/bin\"\nwanted=\"node\"\n\n# 1. look in /usr/local/bin/node\n# 2. else /usr/bin/node\n# 3. else /bin/node\n# putting \".\" first would also look at ./node — dangerous if a stranger left a file"
    },
    {
      "id": 53,
      "level": "beginner",
      "q": "which vs type vs whereis?",
      "a": "which, type, and whereis answer 'what is this name?' type is the one that tells KIND: a file on PATH, a builtin, an alias, or a function.\ncd is a builtin, not /bin/cd on many shells. ls is usually a file.\nIn the code:\nThe table lists ls as a file, cd as a builtin, ll as an alias, greet as a function. The last comment says type tells KIND.\nA common mistake is which cd and panicking when nothing prints. cd is not a separate file.",
      "code": "#!/usr/bin/env bash\n# the same letters can be different kinds of things\n# name     kind\n# ls       file on PATH (/bin/ls)\n# cd       shell builtin (not a separate file)\n# ll       alias for ls -l (in some configs)\n# greet    a function you defined\n\n# type is the tool that tells KIND, which is the real lesson"
    },
    {
      "id": 54,
      "level": "intermediate",
      "q": "alias vs function vs script?",
      "a": "An alias is a nickname in this interactive shell. A function is shell code in this shell. A script is a file other programs can launch.\ncron does not sit in your interactive shell, so aliases may vanish there.\nIn the code:\nalias_ll is ls -l. greet is a function. backup.sh is a file. The last comment says cron may not see aliases.\nA common mistake is putting logic only in an alias, then wondering why a scheduled job cannot find it. Use a script.",
      "code": "#!/usr/bin/env bash\n# three shortcut styles\nalias_ll=\"ls -l\"                 # nickname, often interactive only\ngreet() { echo \"hi $1\"; }        # function in this shell\n# /usr/local/bin/backup.sh       # a file other programs can launch\n\n# cron does not sit in your interactive shell, so aliases may vanish"
    },
    {
      "id": 55,
      "level": "intermediate",
      "q": "source vs executing a script?",
      "a": "Executing a script starts a child shell. When the child exits, its directory and exports vanish. source (dot) runs the file in THIS shell, so cd and export stay.\nThat is why 'activate' scripts are sourced.\nIn the code:\nhere is /home/nitin. source walks this shell to project. ./go-project.sh makes a child walk there then die; you stay in nitin. export in a child is thrown away.\nA common mistake is ./activate and wondering why PATH did not change. You needed source.",
      "code": "#!/usr/bin/env bash\n# two rooms\nhere=\"/home/nitin\"\n# source ./go-project.sh   -> this shell walks to /home/nitin/project\n# ./go-project.sh          -> a child walks there, then dies; you stay in /home/nitin\n\n# export in a child is thrown away when the child exits\n# export in a sourced file stays in your badge"
    },
    {
      "id": 56,
      "level": "beginner",
      "q": "package managers: apt vs yum vs apk?",
      "a": "OS package managers depend on the distro: apt on Ubuntu, dnf on Fedora, apk on Alpine. They install system programs such as nginx.\nnpm and pip are other shops for language libraries. Do not mix those ideas.\nIn the code:\nThe table maps Ubuntu apt, Fedora dnf, Alpine apk. package is nginx. The last comment warns not to mix npm/pip with the OS shop.\nA common mistake is apt installing a Node that fights the version nvm installed, and not knowing which PATH won.",
      "code": "#!/usr/bin/env bash\n# which grocery store depends on the distro\n# distro     manager\n# Ubuntu     apt\n# Fedora     dnf\n# Alpine     apk\n\npackage=\"nginx\"   # a system program\n# npm/pip are other shops for language libraries — do not mix the idea"
    },
    {
      "id": 57,
      "level": "intermediate",
      "q": "What is a .deb / .rpm?",
      "a": "A .deb or .rpm is one crate on disk: binaries, docs, scripts, version. dpkg/rpm apply one crate. apt/dnf also fetch missing crates that crate needs.\nThe file is the package. The manager is the store plus dependency solver.\nIn the code:\ncrate is nginx_1.24.deb. contents lists binaries, man pages, scripts, version. Comments contrast dpkg/rpm vs apt/dnf fetching needs.\nA common mistake is installing a random .deb from a blog and skipping the distro store, then never getting security updates.",
      "code": "#!/usr/bin/env bash\n# a crate on disk\ncrate=\"nginx_1.24.deb\"   # or .rpm on the other grocery chain\ncontents=\"binaries, man pages, scripts, version number\"\n\n# dpkg/rpm apply ONE crate\n# apt/dnf also fetch missing crates the first crate needs"
    },
    {
      "id": 58,
      "level": "intermediate",
      "q": "How do you find which package owns a file?",
      "a": "Package databases remember which crate owns which file. If /usr/sbin/nginx is missing, the ledger tells you which package to reinstall.\nThat is 'who owns this file,' not a mystery permission.\nIn the code:\nThe ledger maps /usr/sbin/nginx to nginx and /bin/ls to coreutils. The last comments say the ledger tells you which crate to reinstall.\nA common mistake is copying a binary by hand into /usr/local and then asking the package manager who owns it. It may own nothing.",
      "code": "#!/usr/bin/env bash\n# ledger idea\n# PATH              PACKAGE\n# /usr/sbin/nginx   nginx\n# /bin/ls           coreutils\n\n# if /usr/sbin/nginx is missing, the ledger tells you which crate to reinstall\n# that is the idea of \"who owns this file\""
    },
    {
      "id": 59,
      "level": "beginner",
      "q": "tar and gzip?",
      "a": "tar packs many files into one suitcase. gzip squeezes that suitcase. .tar.gz is pack then squeeze.\nListing reads the table of contents. Extracting unpacks into a folder.\nIn the code:\nfiles are src, app.js, README. archive is project.tar. squeezed is project.tar.gz. Comments describe listing vs extracting.\nA common mistake is extracting as root in / and overwriting system files from a tarball that used absolute paths.",
      "code": "#!/usr/bin/env bash\n# suitcase then squeeze\nfiles=\"src/ app.js README.md\"\narchive=\"project.tar\"        # suitcase: many files, one blob\nsqueezed=\"project.tar.gz\"    # sitting on the suitcase\n\n# listing is reading the table of contents inside\n# extracting is unpacking into a room"
    },
    {
      "id": 60,
      "level": "intermediate",
      "q": "zip vs tar.gz?",
      "a": "zip squeezes each file then binds them. tar.gz stacks files first, then squeezes the stack. Windows friends often expect zip. Linux servers often expect tar.gz.\nSame idea: many files, one blob. Different customs.\nIn the code:\nzip_idea is each paper squeezed then a binder. targz_idea is suitcase then squeeze. Comments mention Windows vs Linux servers.\nA common mistake is emailing a .tar.gz to someone who can only open zip, or the reverse on a server without unzip.",
      "code": "#!/usr/bin/env bash\n# two packing customs\nzip_idea=\"each paper can be squeezed on its own, then put in a binder\"\ntargz_idea=\"stack papers into a suitcase, then squeeze the suitcase\"\n\n# Windows friends often expect the binder\n# Linux servers often expect the suitcase"
    },
    {
      "id": 61,
      "level": "intermediate",
      "q": "cron?",
      "a": "cron runs a recipe on a schedule. A crontab line is minute, hour, day of month, month, day of week, then the command.\ncron's PATH is small, so the full path to the script is part of the idea.\nIn the code:\nThe alarm card is 0 3 * * * /usr/local/bin/backup.sh, at 03:00 every day. The last comment says cron's PATH is small.\nA common mistake is using a relative path or an alias in cron, then the job fails at 3am with 'command not found.'",
      "code": "# a crontab line is an alarm card\n# m  h  dom mon dow   recipe\n# 0  3  *   *   *     /usr/local/bin/backup.sh\n#\n# at 03:00 every day, run that file\n# cron's PATH is small — the full path is part of the idea"
    },
    {
      "id": 62,
      "level": "intermediate",
      "q": "at vs cron?",
      "a": "at is a one-ticket alarm. cron is a standing class that repeats. Leftover repeat alarms are how surprise jobs appear in six months.\nChoose once vs repeat on purpose.\nIn the code:\nonce is at 22:00 tonight restart the report. repeat is every day at 03:00 backup. The last comment warns about leftover repeats.\nA common mistake is installing the same cron line twice, so backups double and lock each other.",
      "code": "#!/usr/bin/env bash\n# two clocks\nonce=\"at 22:00 tonight, restart the report job\"   # one ticket\nrepeat=\"every day at 03:00, backup\"               # a standing class\n\n# leftover repeat alarms are how surprise jobs appear in six months"
    },
    {
      "id": 63,
      "level": "intermediate",
      "q": "nice and ionice?",
      "a": "nice lowers CPU priority so other processes go first. ionice lowers disk priority so a heavy compress does not block the website's disk hallway.\nThe heavy job still runs. It waddles.\nIn the code:\njob is compress yesterday's logs. cpu_politeness is high nice. disk_politeness is ionice. The website keeps serving.\nA common mistake is a backup at full priority at noon that makes the API look 'randomly slow.'",
      "code": "#!/usr/bin/env bash\n# a polite heavy job (idea)\njob=\"compress yesterday's logs\"\ncpu_politeness=\"high nice value -> other cooks go first\"\ndisk_politeness=\"ionice -> do not block the website's disk hallway\"\n\n# the website keeps serving while the archive waddles"
    },
    {
      "id": 64,
      "level": "advanced",
      "q": "OOM killer?",
      "a": "The OOM killer is the kernel choosing a process to kill when RAM is exhausted.\nThe app log may only say died. The kernel diary (dmesg) names Out of memory and the victim pid.\nIn the code:\nram 2G, processes nginx 100M, node 1.8G, batch 500M. Backpack bursts, kernel chooses a victim (often node). dmesg line idea kills pid 4412.\nA common mistake is restarting Node in a loop without adding RAM or a memory limit, so OOM repeats.",
      "code": "#!/usr/bin/env bash\n# memory is a too-small backpack\nram=\"2G\"\nprocesses=\"nginx 100M, node 1.8G, batch 500M\"\n# backpack bursts -> kernel chooses a victim (often node)\n# dmesg line idea: \"Out of memory: Kill process 4412 (node)\"\n\n# the app log may only show \"died\", the kernel diary has the reason"
    },
    {
      "id": 65,
      "level": "intermediate",
      "q": "free -h and memory?",
      "a": "free shows RAM: total, used, cache, available, swap. Cache can often be reclaimed. available is the number to trust more than a tiny 'free' field.\nSwap used often means slowness, disk pretending to be RAM.\nIn the code:\ntotal 16G, used_app 6G, cache 8G, available 9G, swap_used 2G. Comments say trust available more than tiny free.\nA common mistake is panicking because 'free' is 200MB while 8G is cache that can be given back.",
      "code": "#!/usr/bin/env bash\n# a memory report (idea)\ntotal=\"16G\"\nused_app=\"6G\"\ncache=\"8G\"          # can be reclaimed\navailable=\"9G\"      # the number to trust more than tiny \"free\"\nswap_used=\"2G\"      # disk pretending to be RAM — often slowness"
    },
    {
      "id": 66,
      "level": "intermediate",
      "q": "swap?",
      "a": "Swap is disk space used as overflow RAM. It is slower. When RAM is full, the kernel lays pages in that hallway.\nThe process is not dead; it is shuffling boxes slowly. Too much swap feels like a freeze.\nIn the code:\nram_closet is fast and limited. swap_hallway is slow disk pages. Comments say the process is shuffling, not dead.\nA common mistake is adding huge swap to hide a leak. You get a slow box instead of a clear OOM.",
      "code": "#!/usr/bin/env bash\n# closet vs hallway\nram_closet=\"fast, limited\"\nswap_hallway=\"slow disk pages\"\n\n# when the closet is full, the kernel lays pages in the hallway\n# the process is not dead; it is shuffling boxes slowly"
    },
    {
      "id": 67,
      "level": "intermediate",
      "q": "inode exhaustion?",
      "a": "Inodes are slots for file metadata. You can run out of inodes with millions of tiny files while byte space still looks free.\nNew files cannot be created: no ticket numbers left.\nIn the code:\nbytes 20G free, inodes 0 free. Millions of 1KB cache files. New file cannot be created.\nA common mistake is only watching df -h and ignoring df -i, then 'no space' with 20G free.",
      "code": "#!/usr/bin/env bash\n# two fullness meters\nbytes=\"20G free\"      # floor space left\ninodes=\"0 free\"       # no ticket numbers left\n\n# millions of 1KB cache files -> inodes=0, bytes still look fine\n# new file cannot be created: no ticket"
    },
    {
      "id": 68,
      "level": "beginner",
      "q": "ln vs cp?",
      "a": "cp copies bytes into a new file. A symlink is a sticky note with a path. A hard link is two names for one inode, one pile of bytes.\nChanging bytes through either hard name changes the same pile. A symlink can dangle if the path goes missing.\nIn the code:\ncopy is two papers. symlink is see /opt/app/current/app.js. hardlink is two names, one inode. Comments describe dangling vs shared bytes.\nA common mistake is cp when you meant a symlink, then updating one file and leaving the other stale.",
      "code": "#!/usr/bin/env bash\n# three relationships to a paper\ncopy=\"two separate papers with the same text (for now)\"\nsymlink=\"a sticky note: 'see /opt/app/current/app.js'\"\nhardlink=\"two names, one inode, one pile of bytes\"\n\n# changing the sticky note's target path can dangle\n# changing bytes through either hard name changes the same pile"
    },
    {
      "id": 69,
      "level": "intermediate",
      "q": "symlink vs hard link?",
      "a": "A symlink points at a PATH string; that path can vanish (dangle). A hard link points at an inode; data lives until the last name is unlinked.\nHard links cannot cross filesystems. Symlinks can point anywhere, including missing targets.\nIn the code:\nsymlink points at a PATH. hard points at an INODE. Different disks: symlink can still point; hard link cannot be created across.\nA common mistake is a relative symlink that worked in one folder and dangles when you move the link file.",
      "code": "#!/usr/bin/env bash\n# forwarding address vs two doorbells\nsymlink=\"points at a PATH string; the path can go missing (dangle)\"\nhard=\"points at an INODE; last unlink frees the data\"\n\n# different disks: symlink can still point; hard link cannot be created across"
    },
    {
      "id": 70,
      "level": "intermediate",
      "q": "inode?",
      "a": "An inode is the student card: permissions, size, data blocks. A directory entry is a roster name pointing at that card.\nTwo names can point at the same inode (hard link). Deleting one name leaves the card if another name remains.\nIn the code:\ninode_1234 has mode and size. dir_entry app.js -> 1234. other_entry app.js.bak -> 1234. Deleting app.js removes one roster line; the card lives if bak remains.\nA common mistake is thinking the filename is the file. The inode is the file. The name is a label.",
      "code": "#!/usr/bin/env bash\n# roster name vs student card\ninode_1234=\"rw-r--r--, size 20, data blocks [...]\"\ndir_entry=\"app.js -> inode 1234\"\nother_entry=\"app.js.bak -> inode 1234\"   # hard link: same card\n\n# deleting app.js removes one roster line; the card lives if app.js.bak remains"
    },
    {
      "id": 71,
      "level": "beginner",
      "q": "What is /tmp vs /var/tmp?",
      "a": "/tmp is often a RAM disk erased on reboot. /var/tmp is usually on disk and lives longer.\nA build file in /tmp can disappear when the machine restarts. That disappearance is a feature.\nIn the code:\ntmp is /tmp, often RAM, erased on reboot. var_tmp is /var/tmp, on disk, lives longer. Comments say a build file in /tmp can disappear.\nA common mistake is putting a database in /tmp because it looked empty and fast, then losing it on reboot.",
      "code": "#!/usr/bin/env bash\n# two junk places\ntmp=\"/tmp\"            # often a RAM disk, erased on reboot\nvar_tmp=\"/var/tmp\"    # usually on disk, lives longer\n\n# a build file in /tmp can disappear when the machine restarts\n# that disappearance is a feature, not a bug"
    },
    {
      "id": 72,
      "level": "intermediate",
      "q": "tmpfs?",
      "a": "tmpfs is a filesystem backed by RAM. Files there are not on spinning disk. Reboot empties it. Writing 2G here is writing 2G of memory.\n/tmp is often tmpfs with a size cap.\nIn the code:\nmount_point /tmp, kind tmpfs, limit 2G. Comments say reboot -> empty table, and 2G here is 2G of memory.\nA common mistake is filling tmpfs until RAM is gone and the OOM killer starts, thinking you only used 'disk.'",
      "code": "#!/usr/bin/env bash\n# a folder that is really RAM\nmount_point=\"/tmp\"\nkind=\"tmpfs\"\nlimit=\"2G\"\n\n# files here are not on the spinning disk (usually)\n# reboot -> empty table\n# writing 2G here is writing 2G of memory"
    },
    {
      "id": 73,
      "level": "intermediate",
      "q": "mount and fstab?",
      "a": "mount attaches a device or tmpfs to a folder (a door). fstab is the morning checklist of those attachments at boot.\nA typo in fstab can stop the machine from opening cleanly.\nIn the code:\nThe table maps /dev/sda1 to /, sda2 to /home, tmpfs to /tmp size 2G. The last comment says a typo can stop the house from opening.\nA common mistake is editing fstab and rebooting without testing mount -a first.",
      "code": "# /etc/fstab is a morning checklist (idea)\n# DEVICE     DOOR     TYPE   OPTIONS\n# /dev/sda1  /        ext4   defaults\n# /dev/sda2  /home    ext4   defaults\n# tmpfs      /tmp     tmpfs  size=2G\n\n# a typo on this list can stop the house from opening"
    },
    {
      "id": 74,
      "level": "beginner",
      "q": "What is a file descriptor?",
      "a": "A file descriptor is a ticket number a process holds for an open file, socket, or pipe. 0 stdin, 1 stdout, 2 stderr, then 3+.\nulimit -n caps how many tickets one process may hold.\nIn the code:\nfd0 stdin, fd1 stdout, fd2 stderr, fd3 maybe a log or TCP socket. The last comment is ulimit -n as max tickets.\nA common mistake is leaking sockets until 'too many open files' and blaming the network instead of the ticket cap.",
      "code": "#!/usr/bin/env bash\n# tickets in one process\nfd0=\"stdin  (keyboard or a piped file)\"\nfd1=\"stdout (screen or a pipe)\"\nfd2=\"stderr (error screen)\"\nfd3=\"maybe a log file or a TCP socket\"\n\n# ulimit -n is the max tickets this process may hold"
    },
    {
      "id": 75,
      "level": "intermediate",
      "q": "ulimit?",
      "a": "ulimit is a rule card on a process: open files, CPU time, stack size, and more.\nNode with many sockets hits open_files and dies with too many open files. The rule card was the ceiling.\nIn the code:\nlimits open_files 1024, cpu unlimited, stack 8M. The last comments describe Node hitting open_files.\nA common mistake is raising the limit without fixing a leak, so you only delay the crash.",
      "code": "#!/usr/bin/env bash\n# a rule card on the process\nlimits=(\n  \"open_files=1024\"\n  \"cpu_seconds=unlimited\"\n  \"stack_size=8M\"\n)\n\n# Node with many sockets hits open_files and dies with \"too many open files\"\n# the rule card was the ceiling"
    },
    {
      "id": 76,
      "level": "advanced",
      "q": "cgroups?",
      "a": "cgroups (control groups) are a playpen with resource rules: memory max, CPU max, pid count.\nExceed memory.max and the processes in that pen get killed. Docker and Kubernetes use this family of limits.\nIn the code:\ncgroup_app memory.max 512M, cpu.max 50% of one core, pids 100. Comments say kill is OOM scoped to the pen.\nA common mistake is setting a tiny memory.max and calling it a Node bug when the pen fuse blows (exit 137).",
      "code": "#!/usr/bin/env bash\n# a playpen with rules\ncgroup_app=(\n  \"memory.max=512M\"\n  \"cpu.max=50% of one core\"\n  \"pids=100\"\n)\n# processes in this pen get killed if they exceed memory.max\n# that kill is the same family as OOM, scoped to the pen"
    },
    {
      "id": 77,
      "level": "advanced",
      "q": "namespaces?",
      "a": "Namespaces give a process VR goggles: its own pid tree, network, mounts, hostname.\nInside, it may look like pid 1. On the host it is still pid 4412. Containers are namespaces plus cgroups.\nIn the code:\nnamespaces pid, net, mnt, uts with those meanings. The last comment says the host still has the real pid 4412.\nA common mistake is thinking a container has a separate kernel. The goggles are not a second kernel.",
      "code": "#!/usr/bin/env bash\n# VR goggles for a process\nnamespaces=(\n  \"pid:  you only see your tree; you look like pid 1\"\n  \"net:  your own interfaces and ports\"\n  \"mnt:  your own filesystem tree\"\n  \"uts:  your own hostname\"\n)\n# the host still has the real pid 4412 behind the goggles"
    },
    {
      "id": 78,
      "level": "intermediate",
      "q": "chroot?",
      "a": "chroot changes what / means for a process: a fake city hall. /etc/passwd inside becomes box/etc/passwd.\nIt is a costume, not a full container. No namespaces, no cgroups unless you add them.\nIn the code:\nreal_root is /. box is /rescue/rootfs. After chroot, /etc/passwd means /rescue/rootfs/etc/passwd. The last comment says costume, not a full container.\nA common mistake is using chroot as a security boundary. It is easy to leave if you still have root.",
      "code": "#!/usr/bin/env bash\n# fake city hall\nreal_root=\"/\"\nbox=\"/rescue/rootfs\"\n\n# after chroot into the box, path /etc/passwd means /rescue/rootfs/etc/passwd\n# it is a costume, not a full container"
    },
    {
      "id": 79,
      "level": "beginner",
      "q": "head, tail, wc, sort, uniq?",
      "a": "head is the first lines. tail is the last. wc counts. sort orders. uniq merges neighbor duplicates, so sort first is part of the idea.\nThese are line tools, not spreadsheets.\nIn the code:\nlines banana apple apple carrot. sorted puts apples together. unique is apple banana carrot. The comment says uniq only merges neighbors.\nA common mistake is uniq without sort and thinking duplicates are gone. They were not neighbors.",
      "code": "#!/usr/bin/env bash\n# flashcards\nlines=\"banana\napple\napple\ncarrot\"\n\nsorted=\"apple\napple\nbanana\ncarrot\"\nunique=\"apple\nbanana\ncarrot\"\n# uniq only merges neighbors, so sort first is part of the idea"
    },
    {
      "id": 80,
      "level": "intermediate",
      "q": "awk and sed in one line each?",
      "a": "awk splits a line into columns and can print one column. sed is a stream editor: search and replace on the way through.\nBoth are read line, write line, not IDEs.\nIn the code:\nline is date, nginx, IP, 200. awk idea prints column 4 -> 200. sed idea stamps the IP into localhost. Both are stream tools.\nA common mistake is writing a 40-line sed when a real script would be clearer. One-liners are for filters.",
      "code": "#!/usr/bin/env bash\n# a log line with columns\nline=\"2026-03-01  nginx  127.0.0.1  200\"\n\n# awk idea: print column 4 -> 200\n# sed idea: stamp 127.0.0.1 into \"localhost\" on the stream\n\n# both are \"read line, write line\", not IDEs"
    },
    {
      "id": 81,
      "level": "intermediate",
      "q": "xargs?",
      "a": "xargs turns lines on stdin into extra arguments on a program. Spaces in names split unless you use null-separated names.\nNaive xargs on My File.js becomes two fake names.\nIn the code:\nstdin_lines a.js and b.js. naive program a.js b.js. Comments warn that My File.js would split. Null-separated names keep it as one word.\nA common mistake is xargs rm on a list that included a file with a space, and deleting the wrong path.",
      "code": "#!/usr/bin/env bash\n# lines on stdin become extra words on a program\nstdin_lines=\"a.js\nb.js\"\n\n# naive: program a.js b.js\n# space in \"My File.js\" would split into two fake names\n# null-separated names keep \"My File.js\" as ONE word"
    },
    {
      "id": 82,
      "level": "intermediate",
      "q": "quotes in bash?",
      "a": "Quotes change how the shell splits words. Unquoted My Notes.txt is two words. Quoted is one word.\nDouble quotes still expand variables. Single quotes keep $HOME as letters.\nIn the code:\nfile is My Notes.txt. Comments contrast unquoted two words vs quoted one. echo double quotes expand HOME. single quotes keep the letters.\nA common mistake is forgetting quotes around a path with a space, so the command sees two arguments.",
      "code": "#!/usr/bin/env bash\nfile=\"My Notes.txt\"\n\n# unquoted: the shell sees two words: My   Notes.txt\n# quoted:   one word: My Notes.txt\n\necho \"double quotes expand HOME=$HOME\"\necho 'single quotes keep $HOME as letters'"
    },
    {
      "id": 83,
      "level": "advanced",
      "q": "glob vs regex?",
      "a": "A glob is expanded by the shell before the program starts: *.js becomes app.js lib.js. A regex is the program's language: . means any character.\nThey look similar and are not the same star.\nIn the code:\nfiles app.js lib.js README.md. glob star is any name in this room. regex dot is any single character, not the same star.\nA common mistake is grep *.js and letting the shell expand the glob, so grep sees filenames as patterns.",
      "code": "#!/usr/bin/env bash\n# receptionist vs detective\n# glob *.js  -> shell expands to app.js lib.js BEFORE grep starts\n# regex .js  -> grep's language: \"any char then js\" (different meaning!)\n\nfiles=\"app.js lib.js README.md\"\n# glob star is \"any name in this room\"\n# regex dot is \"any single character\" — not the same star"
    },
    {
      "id": 84,
      "level": "intermediate",
      "q": "What is a zombie process?",
      "a": "A zombie is a finished child waiting for the parent to wait() and collect the exit code. The work is done. The pid number is still occupied.\nFix the parent, not kill -9 the zombie (KILL does not reap it).\nIn the code:\nchild pid 5001 state Z defunct. parent 4412 forgot to wait(). pid 5001 still occupies a number. The work is done; the register is not ticked.\nA common mistake is hunting zombies with kill -9. Only the parent (or init after the parent dies) can reap them.",
      "code": "#!/usr/bin/env bash\n# a finished child waiting for a signature\nchild=\"pid 5001, state=Z (defunct), exit_code=0\"\nparent=\"pid 4412, forgot to wait()\"\n\n# pid 5001 still occupies a number\n# the work is done; the register is not ticked"
    },
    {
      "id": 85,
      "level": "intermediate",
      "q": "orphan process?",
      "a": "An orphan is a child still running after the parent died. PID 1 (often systemd) adopts it. The child is alive and working.\nThat is different from a zombie, which already finished.\nIn the code:\nzombie is child finished, parent never signed. orphan is parent died, child still runs, pid 1 becomes parent. orphan.pid_parent becomes 1.\nA common mistake is killing pid 1's adopted workers thinking they are leftovers. Check what they still do.",
      "code": "#!/usr/bin/env bash\n# two sad stories\nzombie=\"child finished, parent never signed\"\norphan=\"parent died, child still runs, pid 1 becomes parent\"\n\n# orphan.pid_parent becomes 1\n# that child is alive and working"
    },
    {
      "id": 86,
      "level": "beginner",
      "q": "date and timezones?",
      "a": "A moment in time can be written as UTC or as a local timezone costume. Same instant, different labels.\nStore UTC. Show the user's zone in the UI. Mixing costumes in logs makes 'what time did it die?' hard.\nIn the code:\nutc is 2026-03-01 12:00:00Z. ist is 17:30 the same day +05:30, same moment. Comments say store UTC, show IST in the UI.\nA common mistake is comparing a log in IST to a metric in UTC and thinking the spike happened five and a half hours apart.",
      "code": "#!/usr/bin/env bash\n# one metronome, many costumes\nutc=\"2026-03-01 12:00:00Z\"\nist=\"2026-03-01 17:30:00+05:30\"   # same moment\n\n# store UTC, show IST in the UI\n# mixing costumes in logs makes \"what time did it die?\" hard"
    },
    {
      "id": 87,
      "level": "intermediate",
      "q": "NTP / time sync?",
      "a": "NTP (or cloud time) keeps the machine clock from drifting. TLS certificates and Kerberos care about 'now.'\nA clock slow by minutes can fail TLS date checks even when the network is fine.\nIn the code:\nmachine_clock slow by 12 seconds. sync_source NTP pool / cloud time. After sync, TLS date checks pass. Kerberos and certs are picky about now.\nA common mistake is disabling TLS checks because of a clock instead of fixing time sync.",
      "code": "#!/usr/bin/env bash\n# watches drift\nmachine_clock=\"slow by 12 seconds\"\nsync_source=\"NTP pool / cloud time\"\n\n# after sync, TLS date checks pass again\n# Kerberos and certs are picky about \"now\""
    },
    {
      "id": 88,
      "level": "intermediate",
      "q": "How do you debug 'permission denied'?",
      "a": "permission denied on a path means walk every door from / down. You need x on each directory and the right rwx on the last file.\nIf a parent has no x, the treasure filename does not help. Later checks: ACLs, SELinux, noexec mounts.\nIn the code:\ndoors list /, /var, /var/app, /var/app/data with x and owner questions. If /var/app has no x for you, the filename does not help.\nA common mistake is chmod 777 on the file while a parent directory still blocks traverse.",
      "code": "#!/usr/bin/env bash\n# walk the doors to /var/app/data/file.txt\ndoors=(\n  \"/            x for everyone? \"\n  \"/var         x?\"\n  \"/var/app     owner www-data, x for group?\"\n  \"/var/app/data  w for the app user?\"\n)\n# if /var/app has no x for you, the treasure filename does not help\n# later: ACLs, SELinux, noexec"
    },
    {
      "id": 89,
      "level": "advanced",
      "q": "SELinux in one sentence?",
      "a": "SELinux is extra labels: even if Unix rwx allow a read, a policy may deny httpd writing that folder.\nA 644 file can still be denied. The audit log tells that story. Disabling SELinux is not the design.\nIn the code:\nrwx is the Unix ticket. selinux is the staff pass: is httpd allowed to write this labeled folder? A 644 file can still be denied. ausearch tells that story.\nA common mistake is setenforce 0 as the first fix and leaving it off in production.",
      "code": "#!/usr/bin/env bash\n# extra museum passes\nrwx=\"ticket: can you read this file by Unix bits?\"\nselinux=\"staff pass: is httpd allowed to write this labeled folder?\"\n\n# a 644 file can still be denied by a missing staff pass\n# ausearch/audit log tells that story — disabling SELinux is not the design"
    },
    {
      "id": 90,
      "level": "intermediate",
      "q": "firewall ufw/firewalld?",
      "a": "A host firewall (ufw, firewalld) allows ports on this VM. A cloud security group is a second bouncer in front of the VM.\nnginx can listen on 80 and still be dark if either bouncer says no.\nIn the code:\nhost_firewall allows 22, 80, 443. cloud_group allows 80, 443 from internet and 22 from office IP. nginx listening is not enough.\nA common mistake is opening ufw and forgetting the cloud group, or the reverse.",
      "code": "#!/usr/bin/env bash\n# two bouncers\nhost_firewall=\"allow 22, 80, 443 on this VM\"\ncloud_group=\"allow 80, 443 from internet; 22 from office IP\"\n\n# nginx can listen on 80 and still be dark if either bouncer says no"
    },
    {
      "id": 91,
      "level": "beginner",
      "q": "How do you add a user?",
      "a": "Adding a user creates a name, a uid, a home folder, and group memberships. authorized_keys in that home is the SSH door key.\nPassword SSH can be turned off once the key works.\nIn the code:\nname ada, home /home/ada, groups ada sudo. authorized_keys is the door key. Password SSH can be turned off once the key works.\nA common mistake is creating a user without a home or without the .ssh directory permissions, so key login fails.",
      "code": "#!/usr/bin/env bash\n# issuing a badge\nname=\"ada\"\nhome=\"/home/ada\"\ngroups=\"ada sudo\"\n\n# authorized_keys in home is the door key\n# password SSH can be turned off once the key works"
    },
    {
      "id": 92,
      "level": "intermediate",
      "q": "sudoers?",
      "a": "sudoers is the permission slip for sudo. A line can allow nitin to restart nginx as root, not every possible action.\nvisudo checks spelling before saving. A syntax error can lock out sudo.\nIn the code:\nnitin ALL=(root) /usr/bin/systemctl restart nginx. nitin may restart nginx as root, not every action. visudo is the teacher who checks spelling.\nA common mistake is editing sudoers with a normal editor, saving a typo, and losing sudo until rescue.",
      "code": "# a permission slip (idea of sudoers)\n# nitin ALL=(root) /usr/bin/systemctl restart nginx\n#\n# nitin may restart nginx as root, not every possible action\n# visudo is the teacher who checks spelling before saving"
    },
    {
      "id": 93,
      "level": "intermediate",
      "q": "How do you inspect a binary's version?",
      "a": "A binary's version can come from --version output, the package database, and the real path on disk.\nA surprise copy in /usr/local can shadow the packaged one via PATH.\nIn the code:\nprints_itself nginx 1.24.0, package_db nginx 1.24.0-2ubuntu, real_path /usr/sbin/nginx not a surprise copy. Shared libs: which libc is it holding hands with?\nA common mistake is upgrading the package while PATH still runs an old binary from /usr/local/bin.",
      "code": "#!/usr/bin/env bash\n# three labels on the same tool\nprints_itself=\"nginx 1.24.0\"\npackage_db=\"nginx 1.24.0-2ubuntu\"\nreal_path=\"/usr/sbin/nginx\"     # not a surprise copy in /usr/local\n\n# shared libs: which libc is this binary holding hands with?"
    },
    {
      "id": 94,
      "level": "advanced",
      "q": "strace?",
      "a": "strace prints system calls: open, read, connect. Subtitles for what the process asks the kernel.\nA hang on connect to a database is 'waiting on the database door,' not Node is slow in the abstract.\nIn the code:\nopenat app.conf, read port=3000, connect 10.0.0.5:5432 hanging. The hang is waiting on the database door.\nA common mistake is strace on a busy process in production without limits, flooding the disk with logs.",
      "code": "#!/usr/bin/env bash\n# subtitles (idea)\n# openat(\"/etc/app.conf\") = 3\n# read(3, \"port=3000\") = 9\n# connect(4, 10.0.0.5:5432) = hanging...\n\n# the hang is waiting on the database door, not \"Node is slow\" in the abstract"
    },
    {
      "id": 95,
      "level": "advanced",
      "q": "dmesg?",
      "a": "dmesg is the kernel's basement diary: OOM kills, disk I/O errors, NIC link down.\nThe app log may only say connection reset. The basement names the hardware or memory event.\nIn the code:\nSnippets: Out of memory kill node, I/O error on sda, NIC link down. The tenant guestbook may only say connection reset.\nA common mistake is never reading dmesg during a 'random reboot' or freeze.",
      "code": "#!/usr/bin/env bash\n# basement diary snippets\n# Out of memory: Kill process 4412 (node)\n# I/O error on /dev/sda\n# NIC link down\n\n# the tenant guestbook (app.log) may only say \"connection reset\""
    },
    {
      "id": 96,
      "level": "intermediate",
      "q": "How do you copy a folder over the network safely?",
      "a": "Copying a folder over the network safely means keep times, permissions, and names, and verify arrival.\nrsync -a is that museum move. Extra letters keep hard links, ACLs, xattrs when you need full frame labels.\nIn the code:\nsrc /data/photos, dst user@other:/data/photos. rsync -a keeps times, permissions, names. checksum later: did every painting arrive?\nA common mistake is tar over ssh without checking the exit code, so a cut transfer looks 'done.'",
      "code": "#!/usr/bin/env bash\n# a museum move (idea)\nsrc=\"/data/photos\"\ndst=\"user@other:/data/photos\"\n\n# rsync -a  -> keep times, permissions, names\n# extra letters (H,A,X) keep hard links, ACLs, xattrs when you need the full frame labels\n# checksum later: did every painting arrive?"
    },
    {
      "id": 97,
      "level": "beginner",
      "q": "man and --help?",
      "a": "man is the textbook. --help is a flyer of common flags. tldr-style pages are community short examples.\nYou are expected to open the book for the command you are using, not recite every flag.\nIn the code:\nflyer --help, textbook man, cheat tldr. The last comment says you are expected to open the book.\nA common mistake is guessing rm flags from memory instead of reading the one paragraph about -r.",
      "code": "#!/usr/bin/env bash\n# three layers of a recipe book\nflyer=\"--help: a few common flags\"\ntextbook=\"man: every section, including the weird ones\"\ncheat=\"tldr: community short examples\"\n\n# you are expected to open the book, not recite the whole kitchen"
    },
    {
      "id": 98,
      "level": "intermediate",
      "q": "What is a runlevel / target?",
      "a": "Old Unix used runlevels (3 text, 5 graphical). systemd uses targets such as multi-user.target and graphical.target.\nget-default is which card the building manager draws at sunrise. Changing the card changes what starts at boot.\nIn the code:\nComments map old runlevels to new targets. get-default is the sunrise card.\nA common mistake is enabling a graphical target on a server VM and wondering why a desktop stack installed.",
      "code": "# boot mode cards\n# old: runlevel 3 ~ text multi-user, 5 ~ graphical\n# now: multi-user.target, graphical.target\n\n# get-default is which card the building manager draws at sunrise\n# changing the card changes what starts at boot"
    },
    {
      "id": 99,
      "level": "intermediate",
      "q": "how do you keep a Node app running on a VM?",
      "a": "Keep a Node app running with a systemd unit: User, WorkingDirectory, EnvironmentFile, ExecStart node, Restart on-failure. nginx can reverse-proxy to PORT.\ntmux is a camping tent, not this contract. A reboot should start the unit, not wait for you to attach.\nIn the code:\nThe teaching unit has User app, WorkingDirectory /var/app, EnvironmentFile, ExecStart node, Restart on-failure. nginx reverse-proxies. tmux is a tent.\nA common mistake is nohup node & in an SSH session and calling it production.",
      "code": "# job contract for Node (teaching unit)\n# [Service]\n# User=app\n# WorkingDirectory=/var/app\n# EnvironmentFile=/etc/app.env\n# ExecStart=/usr/bin/node server.js\n# Restart=on-failure\n#\n# nginx reverse-proxies to PORT from the env file\n# tmux is a camping tent, not this contract"
    },
    {
      "id": 100,
      "level": "advanced",
      "q": "How do you approach a 'server is slow' ticket?",
      "a": "A slow server ticket is vitals first: load vs cores, RAM vs swap, disk bytes and inodes, disk wait, network. Then which process is hot, what its diary says, what shipped yesterday.\nChange one thing and write it down. Restart is medicine, not the diagnosis.\nIn the code:\nvitals list load, RAM, disk, wait. then which process, diary, what shipped. rule change one thing, write it down. restart is medicine, not diagnosis.\nA common mistake is rebooting first, which can clear the crime scene (logs, load) before you learn the cause.",
      "code": "#!/usr/bin/env bash\n# a doctor's checklist (ideas, not a command dump)\nvitals=(\n  \"load vs CPU cores\"\n  \"RAM available vs swap\"\n  \"disk free and inode free\"\n  \"disk wait / network\"\n)\nthen=\"which process is hot, what its diary says, what shipped yesterday\"\nrule=\"change one thing, write it down\"\n# restart is a medicine, not the diagnosis"
    }
  ]
};
