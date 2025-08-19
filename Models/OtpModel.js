// // import mongoose from "mongoose";
// // import bcrypt from "bcryptjs";

// // /**
// //  * For email or mobile OTP
// //  * identifier: email or mobile number
// //  * channel: 'email' | 'mobile'
// //  */
// // const otpSchema = new mongoose.Schema(
// //   {
// //     identifier: { type: String, required: true, index: true },
// //     channel: { type: String, enum: ["email", "mobile"], required: true },
// //     codeHash: { type: String, required: true },
// //     expiresAt: { type: Date, required: true },
// //     consumed: { type: Boolean, default: false },
// //     lastSentAt: { type: Date, default: Date.now }
// //   },
// //   { timestamps: true }
// // );

// // otpSchema.statics.hash = async function (code) {
// //   const salt = await bcrypt.genSalt(10);
// //   return bcrypt.hash(code, salt);
// // };

// // otpSchema.methods.matches = function (code) {
// //   return bcrypt.compare(code, this.codeHash);
// // };

// // export default mongoose.model("Otp", otpSchema);



// // models/otpModel.js
// import mongoose from 'mongoose';

// const otpSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: true,
//     index: true
//   },
//   mobile: {
//     type: String,
//     index: true
//   },
//   otp: {
//     type: String,
//     required: true
//   },
//   purpose: {
//     type: String,
//     required: true,
//     enum: ['login', 'password-reset', 'verification', 'transaction'],
//     default: 'login'
//   },
//   expiresAt: {
//     type: Date,
//     required: true,
//     index: { expires: '1m' } // Auto-delete 1 minute after expiry
//   },
//   verified: {
//     type: Boolean,
//     default: false
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // Compound index for faster lookups
// otpSchema.index({ email: 1, purpose: 1 });

// export default mongoose.model("Otp", otpSchema);

// Models/OtpModel.js
// Models/OtpModel.js
import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
  mobile: { type: String, required: true }, // use mobile as key
  email: { type: String }, // optional
  otp: { type: String, required: true },
  type: { type: String, default: "login" },
  createdAt: { type: Date, default: Date.now, expires: 300 } // auto-delete after 5 min
});
export default mongoose.model("Otp", OtpSchema);

// Models/TempBookingOtpModel.js
// Models/BookingOtpModel.js


