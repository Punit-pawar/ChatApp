import User from "../models/userModel.js";
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    // const currentUser = req.user;
    // if (!currentUser) {
    //   const error = new Error("Unauthorized");
    //   error.statusCode = 401;
    //   return next(error);
    // }

    // const filteredUsers = users.filter(
    //   (user) => user._id.toString() !== currentUser._id.toString(),
    // );
    res.status(200).json({ data: users });
  } catch (error) {
    next(error);
  }
};