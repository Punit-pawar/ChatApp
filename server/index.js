import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./src/routes/userRoutes.js"; // adjust if needed

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173", // or 3000 depending on Vite/CRA
  credentials: true,
}));

app.use(express.json()); // 🔥 REQUIRED

app.use("/api/user", userRoutes);

const PORT = 4500;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
