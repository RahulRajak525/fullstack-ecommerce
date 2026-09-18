import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("DB connected");
  });
  mongoose.connection.on("error", (err) => {
    console.error("DB connection error:", err.message);
  });
  mongoose.connection.on("disconnected", () => {
    console.warn("DB disconnected");
  });

  await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce`, {
    // Keep a bounded pool so we don't exhaust the Atlas connection limit
    maxPoolSize: 20,
    minPoolSize: 2,
    // Fail fast instead of buffering requests for 30s when the DB is down
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
};

export default connectDB;
