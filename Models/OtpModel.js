import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
  mobile: { type: String, required: true }, // use mobile as key
  email: { type: String }, // optional
  otp: { type: String, required: true },
  type: { type: String, default: "login" },
  createdAt: { type: Date, default: Date.now, expires: 300 } // auto-delete after 5 min
});
export default mongoose.model("Otp", OtpSchema);




