import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./src/config/db.js";
import AuthRouter from "./src/routers/authRouter.js";
import UserRouter from "./src/routers/userRouter.js";
import morgan from "morgan";
import http from "http";
import { Server } from "socket.io";
import WebSocket from "./src/config/websocket.js";

dotenv.config();

const app = express();

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173", // frontend port
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// Routes
app.use("/auth", AuthRouter);
app.use("/user", UserRouter);

// Health check (optional but recommended)
app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running 🚀" });
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error("❌ Error:", err);

  res.status(statusCode).json({
    success: false,
    message,
  });
});

// Start server ONLY after DB connects
const PORT = process.env.PORT || 4500;

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173","https://chatapp.dropsofchange.in"],
    credentials: true,
    methods: ["GET", "POST"],
  },
});

WebSocket(io);

httpServer.listen(PORT, async () => {
  await connectDB();
  console.log("🔗 Server Started at : ", PORT);
});