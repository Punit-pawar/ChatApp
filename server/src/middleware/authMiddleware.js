import jwt from "jsonwebtoken";

const Protect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;

    if (!auth) {
      return res.status(401).json({
        message: "No token",
      });
    }

    const token = auth.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch (err) {
    console.log("Auth error:", err);

    res.status(401).json({
      message: "Unauthorized",
    });
  }
};

export default Protect;