import dotenv from "dotenv";
dotenv.config();
import connectDB from "./src/config/db.js";
import Message from "./src/models/messageModel.js";

const run = async () => {
  try {
    await connectDB();
    const messages = await Message.find({}).limit(1);
    console.log("Messages found:", messages);
    process.exit(0);
  } catch (err) {
    console.log("Database connection or query error:", err);
    process.exit(1);
  }
};
run();
