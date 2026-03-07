import express from "express";
import { getAllUsers } from "../controllers/userController.js";
import { Protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all users
router.get("/allUsers", getAllUsers);

export default router;