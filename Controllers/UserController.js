import User from "../Models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "cloudinary";


// Configure Cloudinary
cloudinary.config({
  cloud_name: "YOUR_CLOUD_NAME",
  api_key: "YOUR_API_KEY",
  api_secret: "YOUR_API_SECRET",
});

export const registerUser = async (req, res) => {
  const { name, email, password, contact, city } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: "User already exists" });
  

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword, contact, city });

  const token = jwt.sign({ id: user._id }, "JWT_SECRET", { expiresIn: "1d" });
  return res.status(201).json({ message: "User registered successfully", token, user });
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



export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login ", email, password);

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, "JWT_SECRET", { expiresIn: "1d" });
  res.json({ token, user });
  console.log("User logged in:", user);

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
