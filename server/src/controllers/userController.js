import User from "../models/userModel.js";
import Message from "../models/messageModel.js";
import mongoose from "mongoose";


// ================= GET ALL USERS =================

export const getAllUsers = async (req, res, next) => {
  try {

    const currentUser = req.user;

    if (!currentUser) {
      const error = new Error("Unauthorized");
      error.statusCode = 401;
      return next(error);
    }

    const myId = currentUser.id || currentUser._id;

    const users = await User.find().select("-password");

    const filteredUsers = users.filter(
      (user) =>
        user._id.toString() !== myId?.toString()
    );

    res.status(200).json({
      data: filteredUsers,
    });

  } catch (error) {
    next(error);
  }
};



// ================= UPDATE PROFILE =================

export const updateProfile = async (req, res, next) => {
  try {

    const currentUser = req.user;

    if (!currentUser) {
      const error = new Error("Unauthorized");
      error.statusCode = 401;
      return next(error);
    }

    const myId = currentUser.id || currentUser._id;

    const { fullName, email, mobileNumber } = req.body;

    // check email duplicate
    if (email) {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: myId },
      });

      if (existingUser) {
        const error = new Error("Email already in use");
        error.statusCode = 400;
        return next(error);
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      myId,
      {
        ...(fullName && { fullName }),
        ...(email && { email }),
        ...(mobileNumber !== undefined && { mobileNumber }),
      },
      { new: true }
    ).select("-password");

    res.status(200).json({
      message: "Profile updated successfully",
      data: updatedUser,
    });

  } catch (error) {
    next(error);
  }
};



// ================= FETCH MESSAGES =================

export const fetchMessages = async (req, res) => {
  try {
    const senderId = req.user?.id || req.user?._id;
    const receiverId = req.params.id;

    if (!senderId || !receiverId) {
      return res.status(400).json({
        message: "Missing ids",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
       return res.status(400).json({
         message: "Invalid ID format: one or both IDs are not valid ObjectIds",
       });
    }

    const messages = await Message.find({
      $or: [
        {
          senderId: senderId,
          receiverId: receiverId,
        },
        {
          senderId: receiverId,
          receiverId: senderId,
        },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.log("fetchMessages error:", error);

    res.status(500).json({
      message: "Server Error: " + error.message,
      stack: error.stack
    });
  }
};



// ================= SEND MESSAGE =================

export const sendMessage = async (req, res, next) => {
  try {

    const currentUser = req.user;

    if (!currentUser) {
      const error = new Error("Unauthorized");
      error.statusCode = 401;
      return next(error);
    }

    const senderId =
      currentUser.id || currentUser._id;

    const receiverId = req.params.receiverId;

    const { inputMessage } = req.body;

    const verifyReceiver =
      await User.findById(receiverId);

    if (!verifyReceiver) {
      const error = new Error("Unknown Receiver");
      error.statusCode = 404;
      return next(error);
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message: inputMessage,
    });

    res.status(201).json({
      data: newMessage,
    });

  } catch (error) {
    next(error);
  }
};