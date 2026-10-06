"use strict";

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

const express = require("express");
const cors = require("cors");
const { connectDB } = require("./db");
const authRoutes = require("./routes/authRoutes");
const progressRoutes = require("./routes/progressRoutes");
const messageRoutes = require("./routes/messageRoutes");
const topicRoutes = require("./routes/topicRoutes");
const dataRoutes = require("./routes/dataRoutes");

// Initialize Database Connection
connectDB();

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const frontendPath = path.resolve(__dirname, "..", "..", "frontend");

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/data", dataRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Serve frontend static files
app.use(express.static(frontendPath));

// Fallback to index.html for single page client routing
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Start Server
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`\n=================================================`);
  console.log(`🚀 Preplace Server running at:`);
  console.log(`   Local Web & API: http://localhost:${PORT}`);
  console.log(`   Health Check:    http://localhost:${PORT}/api/health`);
  console.log(`=================================================\n`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`\n⚠️  Port ${PORT} is already in use by another running server instance.`);
    console.error(`👉 The website is already accessible at http://localhost:${PORT}`);
    console.error(`👉 To restart it, stop the previous terminal first (Ctrl + C).\n`);
  } else {
    console.error("Server error:", err);
  }
});
