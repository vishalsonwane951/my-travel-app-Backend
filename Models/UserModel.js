import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contact: { type: String },
  city: { type: String },
  otp: String,
  otpExpires: Date,
  avatar: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("User", userSchema);


// const loginSchema = new mongoose.Schema({
//   email: { type: String, required: true },
//   password: { type: String, required: true },
// });
// export const Login = mongoose.model("Login", loginSchema);
// Exporting the User model