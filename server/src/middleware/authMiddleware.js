import jwt from "jsonwebtoken";

const Protect = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    // Fallback to Bearer token if not in cookies
    if (!token) {
      const auth = req.headers.authorization;
      if (auth && auth.startsWith("Bearer ")) {
        token = auth.split(" ")[1];
      }
    }

    if (!token) {
      return res.status(401).json({
        message: "No token",
      });
    }

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