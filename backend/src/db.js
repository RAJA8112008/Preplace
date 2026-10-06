"use strict";

const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/preplace";

async function connectDB() {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 8000
    });
    console.log(`🍃 MongoDB Connected successfully: ${conn.connection.host}/${conn.connection.name}`);

    // Ensure collections exist so MongoDB Atlas & Compass display the preplace database immediately
    try {
      require("./models/User");
      require("./models/Otp");
      require("./models/Progress");
      require("./models/Message");

      const db = conn.connection.db;
      const collections = await db.listCollections().toArray();
      const existingNames = collections.map((c) => c.name);

      const requiredCollections = ["users", "otps", "progresses", "messages"];
      for (const name of requiredCollections) {
        if (!existingNames.includes(name)) {
          await db.createCollection(name);
        }
      }
      console.log(`📁 Initialized database collections in Compass: [${requiredCollections.join(", ")}]`);
    } catch (collErr) {
      // Collections might already exist or will be created on first write
    }
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
