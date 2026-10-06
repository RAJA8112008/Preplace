"use strict";

const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/preplace";

async function connectDB() {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`🍃 MongoDB Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    console.error(`\n❌ MongoDB Connection Error: ${err.message}`);
    console.error(`👉 Ensure MongoDB is running locally (e.g. mongodb://127.0.0.1:27017/preplace)`);
    console.error(`👉 Or provide a valid MONGODB_URI in backend/.env (e.g. MongoDB Atlas connection string)\n`);
  }
}

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️  MongoDB disconnected.");
});

module.exports = {
  connectDB,
  mongoose
};
