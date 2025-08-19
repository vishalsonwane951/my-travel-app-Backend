
import User from "../Models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "cloudinary";
import Otp from '../Models/OtpModel.js'


// Configure Cloudinary
cloudinary.config({
  cloud_name: "YOUR_CLOUD_NAME",
  api_key: "YOUR_API_KEY",
  api_secret: "YOUR_API_SECRET",
});

export const registerUser = async (req, res) => {
  const { name, email, password, mobile, city } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: "User already exists..." });


  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword, mobile, city });

  const token = jwt.sign({ id: user._id }, "JWT_SECRET", { expiresIn: "1d" });
  return res.status(201).json({ success: true, message: "User registered successfully", token, user });

};



// export const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//         console.log("Login ", email, password);


//     if (!email || !password) {
//       return res.status(400).json({ message: "Email and password are required" });
//     }

//     // Case-insensitive email lookup
//     const user = await User.findOne({ email: email.toLowerCase() });
//     if (!user) return res.status(400).json({ message: "User not found" });

//     // Compare password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

//     // Generate JWT token
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

//     // Send response
//     res.json({ token, user });
//     console.log("User logged in:", user.email);

//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };



// export const loginUser = async (req, res) => {
//   const { email, password, otp } = req.body;
//   console.log("Login ", email, password);

//   const user = await User.findOne({ email });
//   if (!user) return res.status(400).json({ message: "User not found" });

//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

//   const token = jwt.sign({ id: user._id }, "JWT_SECRET", { expiresIn: "1d" });
//   res.json({ token, user });
//   console.log("User logged in:", user);

// };


// import User from "../Models/UserModel.js";
// import Otp from "../Models/OtpModel.js";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
  try {
    const { email, password, otp } = req.body;
    console.log("Login attempt:", email, password, otp);

    // 1️⃣ Find the user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // 2️⃣ If OTP is provided, login with OTP
    if (otp) {
      const otpRecord = await Otp.findOne({ mobile: user.mobile, otp });
      if (!otpRecord) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      // OTP verified, delete it
      await Otp.deleteOne({ _id: otpRecord._id });

      // Generate JWT
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
      console.log("token:", token);
      return res.status(200).json({ success: true, message: "Login successful via OTP", token, user });
    }

    // 3️⃣ If password is provided, login with password
    if (password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "JWT_SECRET", { expiresIn: "1d" });
      return res.status(200).json({ success: true, message: "Login successful via password", token, user });
    }

    // 4️⃣ Neither OTP nor password provided
    return res.status(400).json({ message: "Please provide OTP or password" });

  } catch (error) {
    console.error("loginUser Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

export const updateAvatar = async (req, res) => {
  const fileStr = req.body.avatar;
  const uploadedResponse = await cloudinary.v2.uploader.upload(fileStr, { folder: "avatars" });

  const user = await User.findByIdAndUpdate(req.user.id, { avatar: uploadedResponse.secure_url }, { new: true });
  res.json(user);
};
