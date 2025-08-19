import express from "express";
import twilio from "twilio";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateAvatar,
} from "../Controllers/UserController.js";
import { generateOTP, verifyOTP,sendBookingOtp, verifyBookingOtp } from "../Controllers/OtpController.js";
import "dotenv/config";


import { protect } from "../Middlewares/authMiddleware.js";

const router = express.Router();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getUserProfile);
router.put("/me/avatar", protect, updateAvatar);

// OTP Login Routes
router.post('/generate-login-otp', generateOTP);
router.get('/verify-login-otp', verifyOTP);

router.post("/generate-booking-otp", sendBookingOtp);
router.post("/verify-booking-otp", verifyBookingOtp);

// Password Reset Routes

// router.post('/send-password-reset-otp', sendPasswordResetOTP);
// router.post('/reset-password-with-otp', resetPasswordWithOTP);


export default router;
