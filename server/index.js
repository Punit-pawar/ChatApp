import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import connectDB from "./src/config/db.js";
import userRoutes from "./src/routes/userRoutes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/user", userRoutes);

console.log("Loaded HF Key:", process.env.HF_API_KEY);

/* ================= AI CHAT ROUTE ================= */
const MODEL_URL =
  "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const prompt = `<s>[INST] You are the ChatVerse System Construct, an advanced cyberpunk AI.
Respond concisely and coldly using tech terminology. Keep responses under 3 sentences.
Operator: ${message} [/INST]`;

  try {
    const response = await fetch(MODEL_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 100,
          temperature: 0.7,
        },
      }),
    });

    // Handle HTTP errors
    if (!response.ok) {
      const errorText = await response.text();
    
      console.log("====== HUGGING FACE ERROR ======");
      console.log("Status:", response.status);
      console.log("Response:", errorText);
      console.log("================================");
    
      return res.status(response.status).json({
        error: `HF API Error ${response.status}`,
      });
    }

    const data = await response.json();

    if (data[0]?.generated_text) {
      const fullText = data[0].generated_text;
      const reply =
        fullText.split("[/INST]")[1]?.trim() ||
        "Transmission corrupted. Retry.";

      return res.json({ reply });
    }

    if (data.error && data.estimated_time) {
      return res.json({
        reply: `System booting. Estimated time: ${Math.round(
          data.estimated_time
        )} seconds.`,
      });
    }

    res.json({ reply: "Neural link unstable. Retry." });
  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({ error: "Server failure" });
  }
});

/* ================= START SERVER ================= */
const PORT = 4500;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});