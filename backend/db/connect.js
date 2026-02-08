const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/carlease");
    console.log("📌 MongoDB connected successfully");
  } catch (err) {
    console.log("❌ MongoDB connection failed", err);
  }
}

module.exports = connectDB;