import express from "express";
import { 
  registerUser, 
  loginUser, 
  getUserProfile,  
} from "../Controllers/UserController.js";
import {
  generateOTP,verifyOTP
} from "../Controllers/OtpController.js";
import { protect } from "../Middlewares/authMiddleware.js";

const router = express.Router();

// Public Routes
router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/verify-login-otp", verifyOTP);
router.post("/generate-login-otp", generateOTP);



//OTP

// router.post("/send-otp-email", generateEmailOtp);
// router.post("/verify-otp-email", verifyEmailOtp);
// router.post("/send-otp-mobile", sendOtpMobile);
// router.post("/verify-otp-mobile", verifyOtpMobile);


// Private Routes (user must be logged in)
router.get("/profile", protect, getUserProfile);
// router.put("/profile", protect, updateUserProfile);

//OTP 



// Admin Routes
// router.get("/", protect, admin, getAllUsers);
// router.put("/:id", protect, admin, updateUser);
// router.delete("/:id", protect, admin, deleteUser);

export default router;

