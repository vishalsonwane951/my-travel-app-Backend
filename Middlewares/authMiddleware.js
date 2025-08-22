import jwt from "jsonwebtoken";
import User from "../Models/UserModel.js";
import dotenv from "dotenv";  

dotenv.config();




// Protect routes - check if user is logged in

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ success: false, message: "User not found" });
      }

      return next(); // ✅ continue only if valid
    } catch (error) {
      console.error("JWT Verify Error:", error.message);
      return res.status(401).json({ success: false, message: "Not authorized, token invalid" });
    }
  }

  return res.status(401).json({ success: false, message: "Not authorized, no token" });
};

// Admin only middleware
export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next(); // allow
  } else {
    res.status(403).json({ message: "Admin access only" });
  }
};
