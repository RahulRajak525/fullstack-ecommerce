import express from "express";
import cors from "cors";
import compression from "compression";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoutes.js";
import orderRouter from "./routes/orderRoute.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

// App config

const app = express();
const port = process.env.PORT || 4000;

// middlewares

app.use(compression()); // gzip responses - product/order lists shrink a lot
app.use(express.json({ limit: "10kb" }));
app.use(cors());

// api endpoints

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
  res.send("APi working");
});

// error handling - must come after every route
app.use(notFound);
app.use(errorHandler);

// Connect to the DB *before* accepting traffic, so we never serve requests
// against a database that isn't there.
const startServer = async () => {
  try {
    await connectDB();
    connectCloudinary();

    const server = app.listen(port, () => {
      console.log("Server started on :" + port);
    });

    // Finish in-flight requests instead of dropping them on deploy/restart
    const shutdown = (signal) => {
      console.log(`${signal} received, shutting down`);
      server.close(() => process.exit(0));
    };
    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);
});

startServer();
