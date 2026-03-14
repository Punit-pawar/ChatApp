import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const Protect = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      const error = new Error("Unauthorized");
      error.statusCode = 401;
      throw error;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    next(error);
  }
};