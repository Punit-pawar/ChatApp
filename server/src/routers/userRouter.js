import express from "express";
import {
  getAllUsers,
  updateProfile,
  fetchMessages,
  sendMessage,
} from "../controllers/userController.js";
import { Protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all users
router.get("/allUsers", Protect, getAllUsers);

// Update current user profile
router.put("/profile", Protect, updateProfile);

// fetch all old Messages between 2 users
router.get("/fetchMessages/:receiverId", Protect, fetchMessages);

// send new Messages between 2 users
router.post("/sendMessage/:receiverId", Protect, sendMessage);

export default router;