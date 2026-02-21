const mongoose = require("mongoose");
const logger = require("../services/logger");

async function connectMongo() {
  const url = process.env.MONGO_URL || "mongodb://localhost:27017/flowmaster";
  await mongoose.connect(url);
  logger.info("MongoDB connected");
}

module.exports = { connectMongo };
