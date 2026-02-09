import express from "express";
import cors from "cors";
import connectDB from "./src/config/db.js";
import userRoutes from "./src/routes/userRoutes.js"

const app = express();

// connect database
connectDB();

app.use(cors());
app.use(express.json());

// routes
app.use("/api/user", userRoutes);

const PORT = 4500;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
