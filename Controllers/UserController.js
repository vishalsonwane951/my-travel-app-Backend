  import asyncHandler from 'express-async-handler';
  import jwt from 'jsonwebtoken'
  import User from '../Models/UserModel.js';
  import bcrypt from 'bcryptjs';
  import Otp from '../Models/OtpModel.js';
  import { deleteFromCloudinary, uploaders } from '../utils/cloudinary.js';
  // const { sendOtpEmail } = require('../utils/email');

  const signToken = (id, isAdmin = false) =>
    jwt.sign({ id, isAdmin }, process.env.JWT_SECRET || 'fallback_secret', {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

  const genOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

  // POST /auth/register
  export const register = asyncHandler(async (req, res) => {
    const { name, email, password, mobile, city } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'name, email and password are required' });

    if (await User.findOne({ email: email.toLowerCase() }))
      return res.status(409).json({ success: false, message: 'Email already registered' });

    const user  = await User.create({ name, email, password, mobile, city });
    const token = signToken(user._id, user.isAdmin);
    res.status(201).json({ success: true, message: 'User registered successfully', token, user });
  });

  // POST /auth/login  (password OR OTP)
  // export const login = asyncHandler(async (req, res) => {
  //   const { email, password, mobile, otp } = req.body;

  //   // OTP login
  //   if (otp && mobile) {
  //     const user = await User.findOne({ mobile });
  //     if (!user) return res.status(400).json({ success: false, message: 'Mobile not registered' });

  //     const record = await Otp.findOne({ identifier: mobile, type: 'mobile' });
  //     if (!record || record.otp !== otp)
  //       return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
  //     if (record.expiresAt < new Date())
  //       return res.status(400).json({ success: false, message: 'OTP expired' });

  //     await Otp.deleteOne({ _id: record._id });
  //     const token = signToken(user._id, user.isAdmin);
  //     return res.json({ success: true, message: 'Login successful via OTP', token, user });
  //   }

  //   // Password login
  //   if (!email || !password)
  //     return res.status(400).json({ success: false, message: 'Email and password required' });

  //   const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  //   if (!user || !(await user.comparePassword(password)))
  //     return res.status(401).json({ success: false, message: 'Invalid email or password' });

  //   const token = signToken(user._id, user.isAdmin);
  //   res.json({ success: true, message: 'Login successful', token, user });
  // });



  export const login = async (req, res) => {
  try {
    const { email, password, otp } = req.body;

    // MUST load user including hashed password
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) return res.status(400).json({ message: "User not found" });

    // 1️⃣ OTP login
    if (otp) {
      const otpRecord = await Otp.findOne({ mobile: user.mobile, otp });
      if (!otpRecord) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }
      await Otp.deleteOne({ _id: otpRecord._id });

      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.status(200).json({
        success: true,
        message: "Login successful via OTP",
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      });
    }

    // 2️⃣ Password login
    if (password) {
      // Compare using bcrypt properly (await because it's async)
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.status(200).json({
        success: true,
        message: "Login successful via password",
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      });
    }

    // Neither OTP nor password provided
    return res.status(400).json({ message: "Please provide OTP or password" });
  } catch (error) {
    console.error("loginUser Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


  // GET /auth/me
  export const getMe = asyncHandler(async (req, res) => {
    res.json({ success: true, data: { user: req.user } });
  });

  // GET /auth/profile  (alias)
  export const getUserProfile = asyncHandler(async (req, res) => {
    res.json({ success: true, user: req.user });
  });

  // PUT /auth/update-profile
  export const updateProfile = asyncHandler(async (req, res) => {
    const { name, phone, mobile, city } = req.body;
    const updates = {};
    if (name)   updates.name   = name;
    if (phone)  updates.mobile = phone;
    if (mobile) updates.mobile = mobile;
    if (city)   updates.city   = city;
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json({ success: true, data: { user } });
  });

  // PUT /auth/change-password
  export const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ success: false, message: 'Both passwords required' });

    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(currentPassword)))
      return res.status(401).json({ success: false, message: 'Current password incorrect' });

    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password updated successfully' });
  });

  // PUT /auth/avatar  — Cloudinary upload
  export const updateAvatar = asyncHandler(async (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const user = await User.findById(req.user._id);

    // Delete old avatar from Cloudinary
    if (user.avatarPublicId) await deleteFromCloudinary(user.avatarPublicId);

    user.avatar          = req.file.path;       // Cloudinary secure_url
    user.avatarPublicId  = req.file.filename;   // Cloudinary public_id
    await user.save();

    res.json({ success: true, message: 'Avatar updated', avatar: user.avatar });
  });

  // GET /auth/avatar/:id  (returns URL, not buffer)
  export const getAvatar = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('avatar');
    if (!user || !user.avatar)
      return res.status(404).json({ success: false, message: 'No avatar found' });
    res.json({ success: true, avatar: user.avatar });
  });

  // POST /auth/send-otp-email
  export const sendOtpEmail = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ success: false, message: 'Email not registered' });

    const otp       = genOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await Otp.findOneAndUpdate(
      { identifier: email, type: 'email' },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    sendOtpEmail(email, otp);
    res.json({ success: true, message: 'OTP sent to email' });
  });

  // POST /auth/send-otp-mobile
  export const sendOtpMobile = asyncHandler(async (req, res) => {
    const { mobile } = req.body;
    if (!mobile) return res.status(400).json({ success: false, message: 'Mobile required' });

    const user = await User.findOne({ mobile });
    if (!user) return res.status(400).json({ success: false, message: 'Mobile not registered' });

    const otp       = genOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await Otp.findOneAndUpdate(
      { identifier: mobile, type: 'mobile' },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    // TODO: integrate SMS provider (Twilio / MSG91)
    console.log(`[OTP] Mobile OTP for ${mobile}: ${otp}`);
    res.json({ success: true, message: 'OTP sent to mobile' });
  });

  // POST /auth/verify-otp
  export const verifyOtp = asyncHandler(async (req, res) => {
    const { mobile, email, otp } = req.body;
    if (!otp) return res.status(400).json({ success: false, message: 'OTP required' });

    const identifier = mobile || email;
    const type       = mobile ? 'mobile' : 'email';
    if (!identifier) return res.status(400).json({ success: false, message: 'Mobile or email required' });

    const record = await Otp.findOne({ identifier, type });
    if (!record)               return res.status(400).json({ success: false, message: 'OTP not found or expired' });
    if (record.expiresAt < new Date()) return res.status(400).json({ success: false, message: 'OTP expired' });
    if (record.otp !== otp)    return res.status(400).json({ success: false, message: 'Invalid OTP' });

    await Otp.deleteOne({ _id: record._id });
    res.json({ success: true, message: 'OTP verified successfully' });
  });

  // GET /auth/users  (admin)
  export const getAllUsers = asyncHandler(async (_req, res) => {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  });

  // DELETE /auth/users/:id  (admin)
  export const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.avatarPublicId) await deleteFromCloudinary(user.avatarPublicId);
    res.json({ success: true, message: 'User deleted' });
  });
