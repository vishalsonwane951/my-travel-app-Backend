// import mongoose from "mongoose";
// const otpSchema = new mongoose.Schema({
//   identifier: { type: String, required: true },   // email or mobile
//   type      : { type: String, enum: ['email', 'mobile'], required: true },
//   otp       : { type: String, required: true },
//   expiresAt : { type: Date, required: true },
// });

// // Compound unique index – one OTP per identifier+type at a time
// otpSchema.index({ identifier: 1, type: 1 }, { unique: true });
// // Auto-delete expired docs (MongoDB TTL)
// otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// export default mongoose.model('Otp', otpSchema);

import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
  mobile: { type: String, required: true }, // use mobile as key
  email: { type: String }, // optional
  otp: { type: String, required: true },
  type: { type: String, default: "login" },
  createdAt: { type: Date, default: Date.now, expires: 300 } // auto-delete after 5 min
});
export default mongoose.model("Otp", OtpSchema);

