window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA["cn"] = {
  "kind": "topic",
  "notes": [
    {
      "title": "OSI 7-Layer vs TCP/IP 4-Layer Model",
      "flow": [
        "Application (HTTP/DNS/FTP) -> Data",
        "Transport (TCP/UDP) -> Segment",
        "Network (IP/ICMP) -> Packet",
        "Data Link (Ethernet/MAC) -> Frame",
        "Physical (Cables/Radio) -> Bits"
      ],
      "body": "The problem before\nEarly network equipment from IBM could not speak to hardware from DEC or Xerox. Without an open layered standard, changing a physical network wire meant rewriting every application on the mainframe.\n\nWhat this is\nThe OSI (Open Systems Interconnection) 7-Layer Reference Model and the practical TCP/IP 4-Layer Internet Architecture standardize how data travels from an app down through physical wires and back up.\n\nOSI Layers:\n7. Application: User-facing network protocols (HTTP, HTTPS, DNS, SMTP, SSH, FTP).\n6. Presentation: Encryption, compression, data format translation (TLS, JSON, JPEG).\n5. Session: Establishes, manages, and terminates sessions (RPC, NetBIOS, Sockets).\n4. Transport: End-to-end communication, reliability, flow control, port addressing (TCP, UDP). Data Unit = Segment.\n3. Network: Logical addressing and routing across networks (IPv4, IPv6, ICMP, OSPF, BGP). Data Unit = Packet.\n2. Data Link: Physical addressing (MAC), node-to-node hop, error detection (Ethernet, Wi-Fi, ARP). Data Unit = Frame.\n1. Physical: Raw bit transmission over physical media (Cables, fiber optics, radio frequencies). Data Unit = Bits.\n\nTCP/IP 4 Layers: Application (7,6,5), Transport (4), Internet (3), Network Access (2,1).\n\nWhat it solves\nModularity and encapsulation. An app can switch from Wi-Fi to Ethernet or 5G without changing a single line of HTTP code.\n\nReal-life example\nSending a parcel. You write a letter (Application), put it in an envelope (Presentation/Session), specify sender/receiver phone numbers (Transport/Ports), write street address (Network/IP), put it in local courier truck (Data Link/MAC), and the truck drives on the asphalt road (Physical/Bits).\n\nUses\nEvery web API, cloud architecture, VPN, socket connection, and distributed system.\n\nWatch out\nRouters operate at Layer 3 (IP Packets); Switches operate at Layer 2 (MAC Frames); Hubs operate at Layer 1 (Electrical Bits)."
    },
    {
      "title": "TCP vs UDP & The 3-Way Handshake",
      "flow": [
        "Client --- SYN (seq=x) ---> Server",
        "Client <--- SYN-ACK (seq=y, ack=x+1) --- Server",
        "Client --- ACK (ack=y+1) ---> Server",
        "[Connection Established: Bi-directional Data Stream]"
      ],
      "body": "The problem before\nIf all packets were fire-and-forget, lost packets would corrupt downloaded files, payments, or HTML pages. But if all packets required strict acknowledgments and retransmissions, live video games and audio streams would lag uncontrollably.\n\nWhat this is\nTwo core Transport Layer protocols with different trade-offs:\n\n1. TCP (Transmission Control Protocol):\n   - Connection-oriented (requires 3-way handshake before sending data).\n   - Reliable: Guarantees delivery via sequence numbers and ACKs. Lost packets are retransmitted.\n   - Ordered: Reassembles out-of-order packets.\n   - Features: Flow control (Sliding Window) & Congestion control (Slow Start, AIMD).\n   - Teardown: 4-way handshake (FIN, ACK, FIN, ACK).\n   - Use cases: Web browsing (HTTP/HTTPS), file transfer (FTP), email (SMTP), database queries.\n\n2. UDP (User Datagram Protocol):\n   - Connectionless (no handshake, sends datagrams immediately).\n   - Unreliable: Best-effort delivery. No ACKs, no retransmissions.\n   - Unordered: Packets can arrive in any order or get dropped.\n   - Extremely low overhead (8-byte header vs 20-60 byte TCP header).\n   - Use cases: DNS queries, video streaming (VoIP, Zoom), online gaming, live broadcasts, HTTP/3 (QUIC).\n\nWhat it solves\nTCP gives reliable byte streams for transactions and files; UDP gives low-latency, real-time transmission where a dropped frame is better than a delayed frame.\n\nReal-life example\nTCP is a registered courier with delivery confirmation signature. UDP is shouting out a score to a stadium crowd.\n\nUses\nMicroservices, gRPC (HTTP/2 over TCP), WebRTC (UDP/RTP), DNS lookup.\n\nWatch out\nTCP SYN Flood attack: Sending thousands of SYN packets with spoofed IPs to exhaust server backlog queue. Mitigated with SYN Cookies."
    },
    {
      "title": "DNS Resolution Flow (What happens when you type a URL)",
      "flow": [
        "Browser / OS DNS Cache",
        "Recursive Resolver (ISP / 8.8.8.8)",
        "Root Nameserver ('.')",
        "TLD Nameserver ('.com')",
        "Authoritative Nameserver ('example.com')",
        "Returns IP (93.184.216.34)"
      ],
      "body": "The problem before\nHumans cannot remember 32-bit (142.250.190.46) or 128-bit IPv6 numbers for millions of websites. A centralized list of all hosts crashed the original ARPANET whenever millions looked up hostnames.\n\nWhat this is\nDNS (Domain Name System) is a globally distributed, hierarchical database that translates human-readable hostnames (e.g. google.com) into IP addresses.\n\nDNS Resolution Step-by-step:\n1. Browser checks local browser cache, then OS hosts file & cache.\n2. Request sent to Recursive Resolver (ISP or 1.1.1.1 / 8.8.8.8).\n3. Resolver queries Root Nameserver ('.') -> returns TLD server IP for '.com'.\n4. Resolver queries TLD Nameserver ('.com') -> returns Authoritative server IP for 'google.com'.\n5. Resolver queries Authoritative Nameserver -> returns final A/AAAA record (IP address) with a TTL (Time-To-Live).\n6. Resolver returns IP to browser and caches it.\n\nKey DNS Records:\n- A Record: Maps domain to IPv4.\n- AAAA Record: Maps domain to IPv6.\n- CNAME: Canonical Name (Alias to another domain).\n- MX: Mail Exchange server for email.\n- TXT: Text record (SPF, DKIM, domain verification).\n- NS: Nameserver delegation.\n\nWhat it solves\nScalable, cached, fault-tolerant global name resolution for billions of web requests daily.\n\nReal-life example\nA phonebook directory. You know the name 'Raj Kumar', but need his telephone number to dial the call.\n\nUses\nCDN edge routing (Geo-DNS), load balancing, zero-downtime blue-green deployments.\n\nWatch out\nDNS Propagation delay: Changes to DNS records take time to spread across global resolvers based on the record's TTL."
    },
    {
      "title": "IP Addressing, Subnetting & CIDR",
      "flow": [
        "IP: 192.168.1.50 /24",
        "Subnet Mask: 255.255.255.0",
        "Network ID: 192.168.1.0 (First IP)",
        "Usable Hosts: 192.168.1.1 to 192.168.1.254",
        "Broadcast IP: 192.168.1.255 (Last IP)"
      ],
      "body": "The problem before\nClassful addressing (Class A, B, C) wasted millions of IP addresses. A company needing 300 IPs had to take a Class B block with 65,536 addresses, rapidly exhausting IPv4 space.\n\nWhat this is\nCIDR (Classless Inter-Domain Routing) uses variable-length subnet masking denoted as `/n` where `n` is the number of network prefix bits.\n\nSubnet Calculation Formula:\n- Total IPs in `/n` subnet = 2^(32 - n)\n- Usable host IPs = 2^(32 - n) - 2 (subtract 1 for Network ID and 1 for Broadcast ID).\n\nCommon Subnet Table:\n- /24 -> 256 total IPs, 254 usable hosts (Mask: 255.255.255.0)\n- /28 -> 16 total IPs, 14 usable hosts (Mask: 255.255.255.240)\n- /30 -> 4 total IPs, 2 usable hosts (Point-to-point router links)\n- /32 -> 1 single IP address host route.\n\nPrivate IP Ranges (RFC 1918 - Non-routable on public internet):\n- 10.0.0.0 to 10.255.255.255 (/8)\n- 172.16.0.0 to 172.31.255.255 (/12)\n- 192.168.0.0 to 192.168.255.255 (/16)\n\nNAT (Network Address Translation):\nAllows thousands of private devices in a local LAN to share a single public IP address using PAT (Port Address Translation / NAT Overload).\n\nWhat it solves\nEfficient allocation of IP address space and isolation of internal private enterprise networks.\n\nReal-life example\nAn apartment building. The street address is the public IP. The apartment numbers (101, 102) are private IP addresses. The front desk mailroom is NAT.\n\nUses\nAWS VPC configuration, Kubernetes pod CIDR blocks, enterprise networking.\n\nWatch out\nForgetting to subtract 2 from total IPs when asked for usable host capacity in campus tests."
    },
    {
      "title": "HTTPS & SSL/TLS Handshake",
      "flow": [
        "Client Hello (Cipher Suites + Random)",
        "Server Hello (Chosen Cipher + Certificate + Public Key)",
        "Client verifies Certificate with CA Root",
        "Client generates Pre-Master Secret encrypted with Server Public Key",
        "Both derive Symmetric Session Key",
        "Secure Encrypted HTTP Traffic Begins"
      ],
      "body": "The problem before\nPlain HTTP sends data as clear text. Anyone on the same Wi-Fi network (Man-In-The-Middle / MITM) could intercept passwords, credit cards, and session cookies with packet sniffers like Wireshark.\n\nWhat this is\nHTTPS is HTTP running over an encrypted TLS (Transport Layer Security) connection (Port 443).\n\nTLS 1.2 / 1.3 Handshake Steps:\n1. Client Hello: Sends supported TLS versions, cipher suites, and a random number (Client Random).\n2. Server Hello: Server selects TLS version, cipher suite, sends Server Random, and presents its SSL/TLS Certificate containing the Server's Public Key.\n3. Certificate Verification: Client verifies certificate chain against trusted Certificate Authorities (CAs) pre-installed in the OS/browser.\n4. Key Exchange:\n   - Asymmetric Encryption (RSA or Diffie-Hellman) is used to securely establish a shared secret without eavesdroppers learning it.\n   - In TLS 1.3, Diffie-Hellman ephemeral keys provide Perfect Forward Secrecy (PFS).\n5. Symmetric Encryption:\n   - Both sides compute identical symmetric session keys (e.g., AES-256-GCM).\n   - All subsequent HTTP requests and responses are encrypted using this fast symmetric key.\n\nWhat it solves\nConfidentiality (encryption stops eavesdropping), Integrity (hashing stops tampering), and Authentication (certificates prove identity).\n\nReal-life example\nLocking a message with someone's public padlock, mailing it across the country, and only the receiver has the private key to unlock it.\n\nUses\nEvery modern website, bank API, payment gateway, OAuth2 authentication flow.\n\nWatch out\nSymmetric encryption is fast; Asymmetric encryption is slow. TLS uses asymmetric encryption only during the handshake to exchange the symmetric session key."
    }
  ],
  "examples": [
    {
      "title": "Simple TCP Echo Server (Node.js)",
      "lang": "js",
      "desc": "A basic reliable TCP socket server listening for incoming connections.",
      "code": "const net = require('net');\n\n// Create TCP Socket Server\nconst server = net.createServer((socket) => {\n  console.log('Client connected from:', socket.remoteAddress);\n\n  socket.write('Welcome to the TCP Echo Server!\\r\\n');\n\n  // Echo back any received data\n  socket.on('data', (data) => {\n    socket.write('Echo: ' + data);\n  });\n\n  socket.on('end', () => {\n    console.log('Client disconnected');\n  });\n});\n\nserver.listen(4000, () => {\n  console.log('TCP Server listening on port 4000');\n});"
    },
    {
      "title": "Subnet Host Calculator (JavaScript)",
      "lang": "js",
      "desc": "Calculate total IPs, usable hosts, and subnet mask from CIDR prefix.",
      "code": "function calculateSubnet(cidrPrefix) {\n  const hostBits = 32 - cidrPrefix;\n  const totalIPs = Math.pow(2, hostBits);\n  const usableHosts = cidrPrefix >= 31 ? 0 : totalIPs - 2;\n\n  return {\n    cidr: `/${cidrPrefix}`,\n    totalIPs,\n    usableHosts,\n    networkID: 'First IP (Reserved)',\n    broadcastIP: 'Last IP (Reserved)'\n  };\n}\n\nconsole.log(calculateSubnet(24)); // 256 total, 254 usable hosts\nconsole.log(calculateSubnet(28)); // 16 total, 14 usable hosts"
    }
  ],
  "questions": [
    {
      "id": 1,
      "level": "beginner",
      "q": "What happens in complete detail when you type https://www.google.com in a browser and press Enter?",
      "a": "Summary\nQuestion: Complete flow of typing a URL in browser\n\nPlain answer:\nThis is the #1 most asked networking question in tech interviews (Amazon, Google, Microsoft, TCS, Infosys). Walk through all layers:\n\n1. URL Parsing & HSTS Check: Browser parses protocol (https), domain (www.google.com), and port (443). Checks HSTS list to force HTTPS.\n2. DNS Lookup: Browser checks cache -> OS cache -> hosts file -> Resolver (ISP) -> Root -> TLD (.com) -> Authoritative Nameserver. Returns IP (e.g., 142.250.190.46).\n3. ARP Resolution (if local gateway MAC unknown): Resolves router IP to MAC address using Address Resolution Protocol.\n4. TCP 3-Way Handshake: Client sends SYN -> Server responds SYN-ACK -> Client sends ACK. Connection is established on port 443.\n5. TLS Handshake: Client Hello -> Server Hello + Certificate -> CA validation -> Key exchange (ECDHE) -> Symmetric session key generated.\n6. HTTP Request: Browser sends `GET / HTTP/2` with headers (User-Agent, Accept, Cookies).\n7. Server Processing & Response: Load balancer / Reverse Proxy (Nginx) routes to app server -> Database query -> Returns `HTTP/2 200 OK` with HTML body.\n8. Browser Rendering: HTML parser builds DOM tree -> CSS parser builds CSSOM -> Render Tree constructed -> Layout -> Paint (pixels rendered on screen).\n\nCompanies that ask this: Google, Amazon, Microsoft, Meta, Apple, TCS, Wipro.",
      "code": "// Summary Flow of URL Request:\n// 1. DNS: www.google.com -> 142.250.190.46\n// 2. TCP: [SYN] -> [SYN+ACK] -> [ACK]\n// 3. TLS: ClientHello -> ServerCertificate -> MasterKeyDerived\n// 4. HTTP: GET / HTTP/2 -> 200 OK (text/html)\n// 5. DOM/CSSOM: Render pipeline paints pixels"
    },
    {
      "id": 2,
      "level": "beginner",
      "q": "What is the difference between TCP and UDP? When would you use each?",
      "a": "Summary\nQuestion: TCP vs UDP Comparison\n\nPlain answer:\n\n1. Connection: TCP is connection-oriented (requires 3-way handshake); UDP is connectionless (fire-and-forget).\n2. Reliability: TCP guarantees delivery using sequence numbers, acknowledgments, and retransmission of lost packets; UDP offers best-effort delivery with no retransmissions.\n3. Ordering: TCP guarantees packets arrive in exact order (reconstructs byte stream); UDP packets may arrive out of order or duplicated.\n4. Header Size: TCP header is 20-60 bytes (includes sequence, ack, window, flags); UDP header is always 8 bytes (source port, dest port, length, checksum).\n5. Speed & Overhead: TCP is slower due to handshakes, flow control, and ACKs; UDP is extremely fast and lightweight.\n6. Flow & Congestion Control: TCP implements sliding window flow control and congestion avoidance (AIMD); UDP has none.\n\nWhen to use TCP: Web browsing (HTTP/HTTPS), file download (FTP), emails (SMTP), database queries, financial transactions.\nWhen to use UDP: Real-time gaming, live video streaming (Zoom, Twitch), VoIP calls, DNS queries, broadcast/multicast.\n\nCompanies that ask this: Amazon, Microsoft, Cisco, Uber, TCS, Infosys.",
      "code": "// Simple Node.js TCP vs UDP creation comparison\n\n// TCP Server (Reliable stream)\nconst net = require('net');\nconst tcpServer = net.createServer((socket) => {\n  socket.write('Hello via TCP\\n');\n  socket.on('data', (data) => console.log('TCP Data:', data.toString()));\n}).listen(8080);\n\n// UDP Server (Fast datagram)\nconst dgram = require('dgram');\nconst udpServer = dgram.createSocket('udp4');\nudpServer.on('message', (msg, rinfo) => {\n  console.log(`UDP from ${rinfo.address}:${rinfo.port} - ${msg}`);\n});\nudpServer.bind(8081);"
    },
    {
      "id": 3,
      "level": "intermediate",
      "q": "Explain the TCP 3-Way Handshake and 4-Way Termination Handshake.",
      "a": "Summary\nQuestion: TCP Connection Establishment & Teardown\n\nPlain answer:\n\nTCP 3-Way Handshake (Connection Establishment):\n1. Step 1 (SYN): Client picks a random Initial Sequence Number (ISN) `x` and sends a packet with the SYN flag set: `SYN(seq=x)`. Client enters `SYN_SENT` state.\n2. Step 2 (SYN-ACK): Server receives SYN, picks its own ISN `y`, acknowledges client's sequence with `ack = x + 1`, and sends `SYN-ACK(seq=y, ack=x+1)`. Server enters `SYN_RCVD` state.\n3. Step 3 (ACK): Client receives SYN-ACK and sends an acknowledgment packet `ACK(ack=y+1)`. Client enters `ESTABLISHED` state. When server receives ACK, it enters `ESTABLISHED` state.\n\nTCP 4-Way Handshake (Connection Termination):\nBecause TCP is full-duplex (two-way independent stream), each direction must close separately:\n1. Step 1 (FIN from Client): Client sends `FIN` when done sending data -> enters `FIN_WAIT_1`.\n2. Step 2 (ACK from Server): Server acknowledges `ACK` -> enters `CLOSE_WAIT`. Client enters `FIN_WAIT_2`.\n3. Step 3 (FIN from Server): When server finishes sending remaining data, it sends its own `FIN` -> enters `LAST_ACK`.\n4. Step 4 (ACK from Client): Client sends `ACK` -> enters `TIME_WAIT` (waits for 2*MSL to ensure server received ACK) before closing. Server receives ACK and enters `CLOSED` state.\n\nCompanies that ask this: Microsoft, Amazon, Cisco, Qualcomm, Samsung.",
      "code": "// TCP Flags involved:\n// SYN (Synchronize sequence numbers)\n// ACK (Acknowledgment field valid)\n// FIN (No more data from sender)\n// RST (Reset connection immediately)\n// PSH (Push data to application immediately)\n// URG (Urgent pointer valid)"
    },
    {
      "id": 4,
      "level": "intermediate",
      "q": "What is Subnetting, and how do you calculate Network ID, Broadcast ID, and Usable Hosts for 192.168.10.65/26?",
      "a": "Summary\nQuestion: Subnetting calculation example\n\nPlain answer:\nSubnetting is the practice of dividing a large network into smaller sub-networks (subnets) to reduce broadcast traffic and improve routing efficiency.\n\nWorked Calculation for 192.168.10.65 /26:\n1. Prefix length: `/26` means 26 network bits and 32 - 26 = 6 host bits.\n2. Total IPs in subnet: 2^6 = 64 IP addresses.\n3. Subnet Mask: 11111111.11111111.11111111.11000000 = 255.255.255.192.\n4. Block size (magic number): 256 - 192 = 64.\n5. Subnet Ranges for the 4th octet:\n   - Subnet 0: 192.168.10.0 to 192.168.10.63\n   - Subnet 1: 192.168.10.64 to 192.168.10.127\n   - Subnet 2: 192.168.10.128 to 192.168.10.191\n   - Subnet 3: 192.168.10.192 to 192.168.10.255\n6. The IP `192.168.10.65` falls in Subnet 1:\n   - Network Address (First IP): `192.168.10.64`\n   - Broadcast Address (Last IP): `192.168.10.127`\n   - First Usable Host: `192.168.10.65`\n   - Last Usable Host: `192.168.10.126`\n   - Total Usable Hosts: 64 - 2 = 62 hosts.\n\nCompanies that ask this: Cisco, Juniper, AWS, Azure, TCS, Infosys.",
      "code": "// Quick Subnet Math formula:\n// Mask bits = n\n// Total IPs = 2^(32 - n)\n// Usable Hosts = 2^(32 - n) - 2\n// Example: /26 -> 2^(32-26) - 2 = 64 - 2 = 62 usable hosts"
    },
    {
      "id": 5,
      "level": "intermediate",
      "q": "What is the difference between HTTP/1.1, HTTP/2, and HTTP/3 (QUIC)?",
      "a": "Summary\nQuestion: Evolution of HTTP (1.1 vs 2 vs 3)\n\nPlain answer:\n\n1. HTTP/1.1:\n   - Text-based protocol.\n   - Head-of-Line (HoL) Blocking at Application Layer: Only 1 request/response at a time per TCP connection. Browsers opened 6 parallel TCP connections per domain to compensate.\n   - Headers sent uncompressed on every single request.\n\n2. HTTP/2:\n   - Binary protocol (frames & streams).\n   - Multiplexing: Multiple concurrent bidirectional streams over a single TCP connection.\n   - HPACK Header Compression: Eliminates redundant header overhead.\n   - Server Push: Server can proactively send assets to the client.\n   - Limitation: TCP-level Head-of-Line Blocking (if 1 packet drops, all multiplexed streams stall until TCP retransmits).\n\n3. HTTP/3 (QUIC):\n   - Uses QUIC protocol over UDP instead of TCP.\n   - Eliminates TCP Head-of-Line Blocking: Packet loss on Stream A does not stall Stream B.\n   - 0-RTT Connection Establishment (combines transport and TLS 1.3 handshake into 1 round trip).\n   - Connection Migration: Switching from Wi-Fi to cellular data retains connection without dropping.\n\nCompanies that ask this: Google, Cloudflare, Meta, Netflix, Amazon.",
      "code": "// HTTP Evolution Comparison:\n// HTTP/1.1: 1 TCP connection = 1 request at a time (Text)\n// HTTP/2:   1 TCP connection = Multiple multiplexed streams (Binary)\n// HTTP/3:   UDP (QUIC) = Multiplexed streams with zero TCP HoL blocking"
    },
    {
      "id": 6,
      "level": "intermediate",
      "q": "What is ARP (Address Resolution Protocol) and how does it work?",
      "a": "Summary\nQuestion: ARP (Address Resolution Protocol)\n\nPlain answer:\nARP operates between the Data Link Layer (Layer 2) and Network Layer (Layer 3). Its job is to translate a known logical IP Address into a physical MAC Address on a local network segment.\n\nARP Flow Step-by-Step:\n1. Host A (192.168.1.10) wants to send a packet to Host B (192.168.1.20) on the same subnet.\n2. Host A checks its local ARP Cache table.\n3. If no entry exists, Host A broadcasts an ARP Request frame: 'Who has 192.168.1.20? Tell 192.168.1.10' (Destination MAC: `FF:FF:FF:FF:FF:FF`).\n4. Every device on the local switch receives the broadcast, but only Host B matches the IP.\n5. Host B sends a unicast ARP Reply frame directly to Host A: '192.168.1.20 is at MAC AA:BB:CC:DD:EE:FF'.\n6. Host A stores the entry in its ARP Cache and transmits the original IP packet inside the Ethernet frame.\n\nWhat is ARP Spoofing/Poisoning?\nA security attack on a LAN where an attacker sends fake ARP replies claiming their MAC belongs to the default gateway router, intercepting all outbound traffic (Man-In-The-Middle).\n\nCompanies that ask this: Cisco, Palo Alto Networks, Fortinet, TCS, Infosys.",
      "code": "// View ARP Table on Linux/Windows:\n// Windows: arp -a\n// Linux: ip neigh show  OR  arp -n\n// Output: 192.168.1.1 -> 00:1a:2b:3c:4d:5e (dynamic)"
    },
    {
      "id": 7,
      "level": "beginner",
      "q": "What are Port Numbers and Common Default Ports every developer must know?",
      "a": "Summary\nQuestion: Well-Known Network Port Numbers\n\nPlain answer:\nA Port Number is a 16-bit integer (0 to 65535) in the Transport Layer (TCP/UDP header) that identifies a specific application or process on a host machine.\n\nMust-Know Ports Table:\n- 20/21: FTP (File Transfer Protocol)\n- 22: SSH (Secure Shell) & SFTP\n- 25: SMTP (Simple Mail Transfer Protocol - Email send)\n- 53: DNS (Domain Name System - UDP/TCP)\n- 80: HTTP (Unencrypted Web Traffic)\n- 443: HTTPS (Encrypted Web Traffic over TLS)\n- 3306: MySQL Database\n- 5432: PostgreSQL Database\n- 6379: Redis In-Memory Cache\n- 27017: MongoDB Database\n\nPort Ranges:\n1. Well-Known Ports: 0 to 1023 (Reserved for system/root services).\n2. Registered Ports: 1024 to 49151 (Used by databases and custom services).\n3. Dynamic / Ephemeral Ports: 49152 to 65535 (Temporary client outbound ports).\n\nCompanies that ask this: Amazon, Red Hat, TCS, Cognizant, AWS.",
      "code": "// Linux command to view listening ports:\n// sudo netstat -tuln  OR  ss -tuln\n// Check if port 443 is open: nc -zv example.com 443"
    },
    {
      "id": 8,
      "level": "intermediate",
      "q": "How does Traceroute work using ICMP and the IP TTL (Time To Live) field?",
      "a": "Summary\nQuestion: Traceroute & ICMP TTL Expiry\n\nPlain answer:\nTraceroute is a network diagnostic tool that maps the complete hop-by-hop path packets take across intermediate routers to reach a destination.\n\nHow it uses the IP TTL field:\n1. Every IP packet has an 8-bit `TTL` (Time To Live) field. Every router that forwards the packet decrements the TTL by 1.\n2. If a router receives a packet with `TTL = 1`, it decrements it to 0, drops the packet, and sends back an `ICMP Type 11 (Time Exceeded)` message with its own IP address.\n3. Step 1: Traceroute sends packet with `TTL = 1`. First router drops it and replies -> First hop discovered!\n4. Step 2: Traceroute sends packet with `TTL = 2`. Second router drops it -> Second hop discovered!\n5. Traceroute repeats incrementing TTL (3, 4, 5...) until the destination host receives the packet and replies with an `ICMP Echo Reply` or `Port Unreachable` message.\n\nCompanies that ask this: Google, Cisco, Cloudflare, Microsoft.",
      "code": "// Windows: tracert google.com\n// Linux/Mac: traceroute google.com\n// Output shows round-trip time (RTT) for each router hop"
    },
    {
      "id": 9,
      "level": "intermediate",
      "q": "What is the difference between Flow Control and Congestion Control in TCP?",
      "a": "Summary\nQuestion: TCP Flow Control vs Congestion Control\n\nPlain answer:\n\n1. Flow Control (Preventing Receiver Overwhelm):\n   - Purpose: Ensures a fast sender does not overwhelm a slow receiver's buffer space.\n   - Mechanism: Sliding Window Protocol. The receiver advertises its available buffer size in the `Receive Window (rwnd)` field of every TCP ACK packet. Sender never transmits more bytes than `rwnd`.\n\n2. Congestion Control (Preventing Network Overwhelm):\n   - Purpose: Ensures senders do not overload intermediate routers and network bandwidth.\n   - Mechanism: Congestion Window (`cwnd`) managed by sender algorithms:\n     - Slow Start: Starts with `cwnd = 1 MSS`, doubles exponentially every RTT until `ssthresh` (Slow Start Threshold).\n     - Congestion Avoidance: Increases `cwnd` linearly by +1 MSS per RTT (Additive Increase).\n     - Fast Retransmit: 3 duplicate ACKs trigger immediate retransmission of missing packet.\n     - Fast Recovery / Multiplicative Decrease: Halves `cwnd` on packet loss.",
      "code": "// TCP Window Calculation:\n// Effective Window = min(ReceiveWindow_rwnd, CongestionWindow_cwnd)"
    },
    {
      "id": 10,
      "level": "intermediate",
      "q": "What is NAT (Network Address Translation) and PAT (Port Address Translation)?",
      "a": "Summary\nQuestion: NAT and PAT\n\nPlain answer:\nNAT translates private (RFC 1918) non-routable IP addresses within an internal LAN into a single public globally routable IP address for internet communication.\n\nTypes of NAT:\n1. Static NAT: 1-to-1 permanent mapping between private IP and public IP (used for hosting internal web servers).\n2. Dynamic NAT: Maps private IPs to a pool of available public IPs on demand.\n3. PAT (Port Address Translation / NAT Overload):\n   - The most widely used form of NAT.\n   - Multiple internal devices share ONE public IP address by assigning unique source port numbers to each connection session in the NAT Translation Table.\n\nExample: Laptop A (`192.168.1.10:45000`) and Phone B (`192.168.1.20:45000`) both visit google.com. The router translates them to `203.0.113.5:50001` and `203.0.113.5:50002` respectively.",
      "code": "// NAT Translation Table on Router:\n// Internal Source      -> External Mapped Source  -> Destination\n// 192.168.1.10:45000   -> 203.0.113.5:50001       -> 142.250.190.46:443\n// 192.168.1.20:45000   -> 203.0.113.5:50002       -> 142.250.190.46:443"
    },
    {
      "id": 11,
      "level": "intermediate",
      "q": "What is Symmetric vs Asymmetric Encryption, and how are both used in HTTPS?",
      "a": "Summary\nQuestion: Symmetric vs Asymmetric Encryption in TLS\n\nPlain answer:\n\n1. Symmetric Encryption (Shared Secret):\n   - Same key used for both encryption and decryption.\n   - Algorithms: AES-128, AES-256, ChaCha20.\n   - Pros: Extremely fast with hardware CPU acceleration; low computational overhead.\n   - Cons: Key distribution problem (how to share the secret key across the insecure internet without eavesdroppers capturing it).\n\n2. Asymmetric Encryption (Public-Private Key Pair):\n   - Two mathematically linked keys: Public Key (shared with everyone for encryption) and Private Key (kept secret for decryption).\n   - Algorithms: RSA, ECC (Elliptic Curve Cryptography), Diffie-Hellman.\n   - Pros: Solves key exchange problem securely.\n   - Cons: ~1,000x slower computationally than symmetric encryption.\n\nHow HTTPS uses BOTH:\n- Asymmetric Encryption is used ONLY during the initial TLS handshake to authenticate the server and securely exchange a random symmetric Session Key.\n- Symmetric Encryption is used for all subsequent bulk HTTP requests/responses for blazing speed.",
      "code": "// Hybrid Encryption in HTTPS:\n// 1. Handshake: Asymmetric (RSA/ECDHE) exchanges SessionKey\n// 2. Data Transfer: Symmetric (AES-256) encrypts actual HTML/JSON payload"
    },
    {
      "id": 12,
      "level": "beginner",
      "q": "What are the common DNS Record types: A, AAAA, CNAME, MX, TXT, and NS?",
      "a": "Summary\nQuestion: DNS Record Types\n\nPlain answer:\n\n1. A Record (Address): Maps a domain name directly to a 32-bit IPv4 address (`example.com -> 93.184.216.34`).\n2. AAAA Record (Quad-A): Maps a domain name to a 128-bit IPv6 address (`example.com -> 2606:2800:220:1:248:1893:25c8:1946`).\n3. CNAME Record (Canonical Name): Alias that points one domain name to another domain name (`blog.example.com -> example.com`). Cannot point to an IP.\n4. MX Record (Mail Exchange): Directs emails to the destination mail server (e.g., `google.com -> aspmx.l.google.com` with priority).\n5. TXT Record (Text): Holds human/machine-readable arbitrary text. Used for domain ownership verification, SPF, and DKIM anti-spam records.\n6. NS Record (Name Server): Specifies the authoritative DNS servers delegated to handle DNS queries for the domain.\n7. PTR Record (Pointer): Reverse DNS lookup (maps an IP address back to its hostname).",
      "code": "# Linux DNS Lookup with dig:\ndig example.com A      # Query IPv4\ndig example.com CNAME  # Query Alias\ndig example.com MX     # Query Mail Servers"
    },
    {
      "id": 13,
      "level": "intermediate",
      "q": "What is the difference between Cookies, LocalStorage, and JWT across HTTP requests?",
      "a": "Summary\nQuestion: Cookies vs LocalStorage vs JWT\n\nPlain answer:\n\n1. HTTP Cookie:\n   - Automatically attached by browser in the `Cookie:` header of every matching HTTP request.\n   - Capacity: 4KB.\n   - Security: If configured with `HttpOnly`, JavaScript cannot read it (immune to XSS stealing). If `Secure`, sent only over HTTPS. If `SameSite=Strict`, prevents CSRF attacks.\n\n2. LocalStorage:\n   - Client-side key-value store with ~5-10MB capacity.\n   - NEVER sent automatically in HTTP headers.\n   - Vulnerable to XSS: Any rogue JS script or malicious npm package can read `localStorage.getItem('token')`.\n\n3. JWT (JSON Web Token):\n   - Stateless signed token containing claims (`{ id, role, exp }`).\n   - Can be sent in `Authorization: Bearer <token>` header or stored in an `HttpOnly` cookie.\n\nBest Practice: Store authentication JWTs in `HttpOnly, Secure, SameSite=Strict` cookies to block both XSS and CSRF.",
      "code": "// Secure Cookie Setting in Express:\nres.cookie('token', jwtToken, {\n  httpOnly: true, // Blocks XSS\n  secure: true,   // HTTPS only\n  sameSite: 'strict', // Blocks CSRF\n  maxAge: 24 * 60 * 60 * 1000 // 1 day\n});"
    },
    {
      "id": 14,
      "level": "beginner",
      "q": "What is the difference between IPv4 and IPv6?",
      "a": "Summary\nQuestion: IPv4 vs IPv6\n\nPlain answer:\n\n1. Address Space:\n   - IPv4: 32-bit addresses (2^32 = ~4.3 billion addresses). Format: Dotted decimal `192.168.1.1`.\n   - IPv6: 128-bit addresses (2^128 = ~340 undecillion addresses, practically infinite). Format: Hexadecimal colon-separated `2001:0db8:85a3::8a2e:0370:7334`.\n\n2. Header Complexity:\n   - IPv4: Variable length header (20-60 bytes) with checksum calculated at every router hop.\n   - IPv6: Fixed length header (40 bytes), no router checksum (faster routing processing).\n\n3. NAT Requirement:\n   - IPv4 relies heavily on NAT to conserve scarce public IP addresses.\n   - IPv6 eliminates the need for NAT; every IoT device and phone can have its own globally unique public IPv6 address.\n\n4. Security:\n   - IPv4: IPSec is optional.\n   - IPv6: IPSec support is built-in by design.",
      "code": "// IPv4: 192.168.1.1 (32 bits = 4 bytes)\n// IPv6: 2001:0db8:0000:0000:0000:ff00:0042:8329 (128 bits = 16 bytes)"
    },
    {
      "id": 15,
      "level": "beginner",
      "q": "What is the difference between a Hub, a Switch, and a Router?",
      "a": "Summary\nQuestion: Hub vs Switch vs Router\n\nPlain answer:\n\n1. Hub (Layer 1 - Physical):\n   - Dumb broadcasting device. Any signal received on one port is blindly repeated to ALL other ports.\n   - Shared collision domain (high collisions and packet sniffing vulnerability).\n\n2. Switch (Layer 2 - Data Link):\n   - Intelligent multiport bridge that maintains a MAC Address Table (CAM table).\n   - Forwards frames only to the specific destination port matching the destination MAC address.\n   - Each port has its own dedicated collision domain, but shares the same broadcast domain.\n\n3. Router (Layer 3 - Network):\n   - Connects distinct subnets and networks (e.g., your home LAN to the public Internet).\n   - Inspects IP packets, consults Routing Tables, and determines optimal path to destination.\n   - Breaks both collision domains and broadcast domains.",
      "code": "// Layer Comparison:\n// Hub:    Layer 1 (Bits)   - Blind broadcast\n// Switch: Layer 2 (Frames) - MAC Address unicast\n// Router: Layer 3 (Packets)- IP Routing across subnets"
    },
    {
      "id": 16,
      "level": "intermediate",
      "q": "What is DHCP and explain the DORA process for acquiring an IP address?",
      "a": "Summary\nQuestion: DHCP and DORA Process\n\nPlain answer:\nDHCP (Dynamic Host Configuration Protocol) automatically assigns IP addresses, subnet masks, default gateways, and DNS servers to client devices on a local network (UDP Port 67 server, Port 68 client).\n\nThe 4-Step DORA Process:\n1. Discover (D): Client boots up and broadcasts `DHCPDISCOVER` packet: 'Is there a DHCP server? I need an IP' (Src: `0.0.0.0`, Dst: `255.255.255.255`).\n2. Offer (O): DHCP server receives discover and broadcasts `DHCPOFFER` proposing an unallocated IP (e.g. `192.168.1.50`) with a lease time.\n3. Request (R): Client accepts and broadcasts `DHCPREQUEST`: 'I would like to take IP 192.168.1.50 from Server A'.\n4. Acknowledge (A): DHCP server broadcasts `DHCPACK` confirming the lease and sending Subnet Mask, Gateway IP, and DNS IPs.",
      "code": "// DORA Acronym Summary:\n// D - Discover  (Client -> Broadcast)\n// O - Offer     (Server -> Broadcast/Unicast)\n// R - Request   (Client -> Broadcast)\n// A - Acknowledge (Server -> Broadcast/Unicast)"
    },
    {
      "id": 17,
      "level": "intermediate",
      "q": "Compare WebSocket, HTTP Long Polling, and Server-Sent Events (SSE).",
      "a": "Summary\nQuestion: Real-Time Web Communication\n\nPlain answer:\n\n1. WebSocket:\n   - Full-Duplex (bi-directional), persistent TCP connection.\n   - Starts with an HTTP Upgrade handshake (`Upgrade: websocket`), then switches to binary WebSocket framing with minimal 2-byte header overhead.\n   - Best for: Chat apps, multiplayer online games, live stock tickers.\n\n2. Server-Sent Events (SSE):\n   - Half-Duplex (Unidirectional server-to-client stream over standard HTTP).\n   - Uses `Content-Type: text/event-stream`. Auto-reconnects natively in browsers.\n   - Best for: Live news feeds, LLM ChatGPT stream responses, notifications.\n\n3. HTTP Long Polling:\n   - Client makes regular HTTP request; server holds connection open until new data arrives, then responds and closes. Client immediately opens another request.\n   - High HTTP header overhead. Legacy fallback.",
      "code": "// Client-side WebSocket vs SSE:\n// WebSocket:\nconst ws = new WebSocket('wss://api.example.com/live');\nws.onmessage = (e) => console.log(e.data);\n\n// SSE:\nconst sse = new EventSource('/api/stream');\nsse.onmessage = (e) => console.log(e.data);"
    },
    {
      "id": 18,
      "level": "intermediate",
      "q": "What is a SYN Flood Attack and how do SYN Cookies defend against it?",
      "a": "Summary\nQuestion: SYN Flood & SYN Cookies\n\nPlain answer:\n\nA SYN Flood is a Denial-of-Service (DoS) attack targeting the TCP 3-way handshake.\n1. Attack: Attacker sends thousands of `SYN` packets with spoofed source IP addresses.\n2. Vulnerability: For each SYN, the server allocates memory in its SYN Backlog Queue and sends `SYN-ACK`, waiting for the final `ACK` that never comes.\n3. Result: The server's backlog queue fills up, causing it to reject legitimate connections from real users.\n\nDefense using SYN Cookies:\n- When under attack, the server does NOT allocate any memory or state in the backlog queue upon receiving a SYN.\n- Instead, the server encodes the connection state (client IP, port, timestamp) into a cryptographic hash stored inside the Initial Sequence Number (ISN) of the `SYN-ACK` packet.\n- When the legitimate client sends back `ACK(ack=ISN+1)`, the server reconstructs the state mathematically from the ACK sequence number and creates the connection socket on the fly.",
      "code": "// Enable SYN Cookies on Linux kernel:\n// sysctl -w net.ipv4.tcp_syncookies=1"
    },
    {
      "id": 19,
      "level": "intermediate",
      "q": "What is CORS (Cross-Origin Resource Sharing) and what is a Preflight OPTIONS request?",
      "a": "Summary\nQuestion: CORS & Preflight OPTIONS\n\nPlain answer:\nCORS is a browser security mechanism that restricts a web page on Origin A (`http://localhost:5173`) from making AJAX/Fetch requests to Origin B (`https://api.example.com`) unless Origin B explicitly grants permission.\n\nWhat is a Preflight Request?\nFor non-simple HTTP requests (requests using `PUT`, `DELETE`, `PATCH` or custom headers like `Authorization: Bearer` or `Content-Type: application/json`):\n1. The browser automatically sends a preflight `OPTIONS` request before sending the actual request.\n2. The server must respond with CORS approval headers:\n   - `Access-Control-Allow-Origin: https://app.example.com`\n   - `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`\n   - `Access-Control-Allow-Headers: Content-Type, Authorization`\n   - `Access-Control-Allow-Credentials: true`\n3. If the server approves, the browser proceeds to fire the actual `POST/PUT` request.",
      "code": "// Express.js CORS configuration:\nconst cors = require('cors');\napp.use(cors({\n  origin: 'https://myfrontend.com',\n  methods: ['GET', 'POST', 'PUT', 'DELETE'],\n  credentials: true\n}));"
    },
    {
      "id": 20,
      "level": "intermediate",
      "q": "How does SSL/TLS Certificate Verification and the Certificate Authority (CA) Chain work?",
      "a": "Summary\nQuestion: SSL Certificate Chain of Trust\n\nPlain answer:\nWhen connecting to `https://google.com`, the browser validates the server's identity using a Chain of Trust:\n\n1. Leaf Certificate (Server Cert): Issued to `*.google.com`. Contains Google's Public Key and is signed by an Intermediate CA's private key.\n2. Intermediate Certificate: Issued to the Intermediate CA and signed by a Root CA.\n3. Root Certificate: Pre-installed in the operating system / browser Root Trust Store (e.g. DigiCert, Let's Encrypt). The Root CA's public key decrypts and verifies the intermediate signature.\n\nIf any signature in the chain is invalid, expired, or self-signed without trust, the browser displays a red warning: `NET::ERR_CERT_AUTHORITY_INVALID`.",
      "code": "// Certificate Verification Chain:\n// [Root CA (Built into OS)] -> signs -> [Intermediate CA] -> signs -> [google.com (Leaf Cert)]"
    },
    {
      "id": 21,
      "level": "intermediate",
      "q": "What is the difference between Bandwidth, Throughput, and Latency?",
      "a": "Summary\nQuestion: Bandwidth vs Throughput vs Latency\n\nPlain answer:\n\n1. Bandwidth: The theoretical maximum data carrying capacity of a network link (e.g., a 100 Mbps fiber optic line).\n2. Throughput: The actual rate of successfully delivered payload data per second over the network in practice (e.g., 65 Mbps due to TCP ACKs, retransmissions, and headers).\n3. Latency (Delay): The time it takes for a single data packet to travel from the sender to the destination (measured in milliseconds, e.g., 25ms RTT).\n\nWater Pipe Analogy:\n- Bandwidth is the width of the pipe.\n- Latency is how fast the water flows from one end to the other.\n- Throughput is the actual volume of water coming out of the tap per minute.",
      "code": "// Performance Relationship:\n// Throughput <= Bandwidth\n// Max TCP Throughput = WindowSize / RoundTripTime(Latency)"
    }
  ]
};
