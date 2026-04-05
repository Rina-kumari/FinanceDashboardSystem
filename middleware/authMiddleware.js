import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized", code: "NO_TOKEN" });
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      if (jwtError.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired", code: "TOKEN_EXPIRED" });
      }
      return res.status(401).json({ message: "Invalid token", code: "INVALID_TOKEN" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found", code: "USER_NOT_FOUND" });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ message: "Internal server error", code: "SERVER_ERROR" });
  }
};

export default authMiddleware;