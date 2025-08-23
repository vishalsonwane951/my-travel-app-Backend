import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String },
  city: { type: String },
  otp: String,
  otpExpires: Date,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  isAdmin: { type: Boolean, default: false }, 
avatar: { 
    type: Buffer, // Store raw image bytes
    maxLength: 2 * 1024 * 1024 // 2MB max
  },
  avatarType: { type: String } 
}, { timestamps: true });

export default mongoose.model("User", userSchema);


// const loginSchema = new mongoose.Schema({
//   email: { type: String, required: true },
//   password: { type: String, required: true },
// });
// export const Login = mongoose.model("Login", loginSchema);
// Exporting the User model