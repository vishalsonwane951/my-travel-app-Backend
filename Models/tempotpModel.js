import mongoose from "mongoose";

const bookingOtpSchema = new mongoose.Schema({
  identifier: { type: String, required: true }, // email or mobile
  type: { type: String, enum: ["mobile", "email"], required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

export default mongoose.model("BookingOtp", bookingOtpSchema);
