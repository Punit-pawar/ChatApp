import express from "express";
import {
  UserRegister,
  UserLogin,
  GoogleUserLogin,
} from "../controllers/authController.js";

import { GoogleProtect } from "../middleware/googleMiddleware.js";

const router = express.Router();

router.post("/register", UserRegister);
router.post("/login", UserLogin);
router.post("/googleLogin", GoogleProtect, GoogleUserLogin);
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

export default router;