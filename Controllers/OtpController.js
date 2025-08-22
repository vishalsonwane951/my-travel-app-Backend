// // import Otp from "../Models/OtpModel.js";
// // import { generateOtp } from "../utils/generateOtp.js";
// // import { isValidEmail, isValidMobileIN } from "../utils/validators.js";
// // import { sendEmail } from "../Config/mailer.js";

// // /** common: create or update OTP with cooldown & expiry */
// // const UPSERT_OTP = async ({ identifier, channel }) => {
// //   const existing = await Otp.findOne({ identifier, channel }).sort({ createdAt: -1 });
// //   const now = new Date();

// //   // 60s cooldown
// //   if (existing && existing.lastSentAt && now - existing.lastSentAt < 60 * 1000) {
// //     const wait = Math.ceil((60 * 1000 - (now - existing.lastSentAt)) / 1000);
// //     const err = new Error(`Please wait ${wait}s before requesting again`);
// //     err.status = 429;
// //     throw err;
// //   }

// //   const code = generateOtp(6);
// //   const codeHash = await Otp.hash(code);
// //   const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

// //   if (existing) {
// //     existing.codeHash = codeHash;
// //     existing.expiresAt = expiresAt;
// //     existing.consumed = false;
// //     existing.lastSentAt = now;
// //     await existing.save();
// //   } else {
// //     await Otp.create({ identifier, channel, codeHash, expiresAt, lastSentAt: now });
// //   }

// //   return code;
// // };

// // export const sendOtpEmail = async (req, res) => {
// //   try {
// //     const { email } = req.body;
// //     if (!isValidEmail(email)) return res.status(400).json({ message: "Invalid email" });

// //     const code = await UPSERT_OTP({ identifier: email.toLowerCase(), channel: "email" });
// //     await sendEmail({
// //       to: email,
// //       subject: "Your OTP Code",
// //       html: `<p>Your OTP is <b>${code}</b>. It expires in 10 minutes.</p>`
// //     });

// //     res.json({ message: "OTP sent to email" });
// //   } catch (e) {
// //     console.error("sendOtpEmail", e);
// //     res.status(e.status || 500).json({ message: e.message || "Failed to send email OTP" });
// //   }
// // };

// // export const verifyOtpEmail = async (req, res) => {
// //   try {
// //     const { email, otp } = req.body;
// //     if (!isValidEmail(email)) return res.status(400).json({ message: "Invalid email" });
// //     const rec = await Otp.findOne({ identifier: email.toLowerCase(), channel: "email" })
// //       .sort({ createdAt: -1 });
// //     if (!rec) return res.status(400).json({ message: "OTP not found, please request again" });
// //     if (rec.consumed) return res.status(400).json({ message: "OTP already used" });
// //     if (rec.expiresAt < new Date()) return res.status(400).json({ message: "OTP expired" });
// //     const ok = await rec.matches(String(otp));
// //     if (!ok) return res.status(400).json({ message: "Invalid OTP" });

// //     rec.consumed = true;
// //     await rec.save();
// //     res.json({ message: "Email verified" });
// //   } catch (e) {
// //     console.error("verifyOtpEmail", e);
// //     res.status(500).json({ message: "Verification failed" });
// //   }
// // };

// // export const sendOtpMobile = async (req, res) => {
// //   try {
// //     const { mobile } = req.body;
// //     if (!isValidMobileIN(mobile)) return res.status(400).json({ message: "Invalid mobile number" });

// //     const code = await UPSERT_OTP({ identifier: mobile, channel: "mobile" });

// //     // TODO: integrate SMS provider here
// //     console.log(`[SMS] Sending OTP ${code} to ${mobile}`);

// //     res.json({ message: "OTP sent to mobile" });
// //   } catch (e) {
// //     console.error("sendOtpMobile", e);
// //     res.status(e.status || 500).json({ message: e.message || "Failed to send mobile OTP" });
// //   }
// // };

// // export const verifyOtpMobile = async (req, res) => {
// //   try {
// //     const { mobile, otp } = req.body;
// //     if (!isValidMobileIN(mobile)) return res.status(400).json({ message: "Invalid mobile number" });
// //     const rec = await Otp.findOne({ identifier: mobile, channel: "mobile" })
// //       .sort({ createdAt: -1 });
// //     if (!rec) return res.status(400).json({ message: "OTP not found, please request again" });
// //     if (rec.consumed) return res.status(400).json({ message: "OTP already used" });
// //     if (rec.expiresAt < new Date()) return res.status(400).json({ message: "OTP expired" });
// //     const ok = await rec.matches(String(otp));
// //     if (!ok) return res.status(400).json({ message: "Invalid OTP" });

// //     rec.consumed = true;
// //     await rec.save();
// //     res.json({ message: "Mobile verified" });
// //   } catch (e) {
// //     console.error("verifyOtpMobile", e);
// //     res.status(500).json({ message: "Verification failed" });
// //   }
// // };



// // controllers/authController.js'
// import User from '../Models/UserModel.js'
// import OTPService from '../utils/generateOtp.js'
// import {protect} from '../Middlewares/authMiddleware.js';


// export const sendLoginOTP = async (req, res) => {
//   try {
//     const { email } = req.body || {};
//     if (!email) {
//       return res.status(400).json({ message: 'Email is required' });
//     }

//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     if (user.mobile === undefined || user.mobile === null || String(user.mobile).trim() === '') {
//       return res.status(400).json({ message: 'No mobile number registered' });
//     }

//     // Will normalize inside service (handles number or string)
//     await OTPService.sendMobileOTP(email, user.mobile, 'login');

//     return res.json({
//       success: true,
//       message: 'OTP sent to registered mobile number'
//     });
//   } catch (error) {
//     console.error('sendLoginOTP Error:', error);
//     return res.status(500).json({
//       message: error.message || 'Failed to send OTP'
//     });
//   }
// };

// export const verifyLoginOTP = async (req, res) => {
//   try {
//     const { email, otp } = req.body;
    
//     const verification = await OTPService.verifyOTP(email, otp, 'login');
//     if (!verification.isValid) {
//       return res.status(400).json({ message: verification.message });
//     }

//     const user = await User.findOne({ email });
//     const token = protect(user);

//     res.json({
//       success: true,
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ 
//       message: error.message || 'Failed to verify OTP' 
//     });
//   }
// };

// // Password reset example
// export const sendPasswordResetOTP = async (req, res) => {
//   try {
//     const { email } = req.body;
    
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     await OTPService.sendMobileOTP(email, user.mobile, 'password-reset');
    
//     res.json({ 
//       success: true,
//       message: 'Password reset OTP sent to registered mobile number'
//     });
//   } catch (error) {
//     res.status(500).json({ 
//       message: error.message || 'Failed to send OTP' 
//     });
//   }
// };

// export const resetPasswordWithOTP = async (req, res) => {
//   try {
//     const { email, otp, newPassword } = req.body;
    
//     const verification = await OTPService.verifyOTP(email, otp, 'password-reset');
//     if (!verification.isValid) {
//       return res.status(400).json({ message: verification.message });
//     }

//     const user = await User.findOne({ email });
//     user.password = newPassword;
//     await user.save();

//     res.json({
//       success: true,
//       message: 'Password reset successfully'
//     });
//   } catch (error) {
//     res.status(500).json({ 
//       message: error.message || 'Failed to reset password' 
//     });
//   }
// };


// Temprory OTP



// Controllers/OtpController.js
import Otp from "../Models/OtpModel.js";
import User from "../Models/UserModel.js";

export const generateOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.mobile) return res.status(400).json({ message: "No mobile number registered" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in DB
    await Otp.create({
      mobile: user.mobile,
      email,
      otp,
      type: "login"
    });

    // For testing, log OTP in console (no paid SMS)
    console.log(`OTP for ${user.mobile}: ${otp}`);
    // Alert(`OTP: ${otp}`)

    res.status(200).json({ success: true, message: "OTP generated & stored",otp });
  } catch (error) {
    console.error("generateLoginOtp Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



export const verifyOTP = async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    if (!mobile || !otp) return res.status(400).json({ message: "Mobile and OTP are required" });

    const record = await Otp.findOne({ mobile, otp });
    if (!record) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // OTP is valid, delete it so it can’t be reused
    await Otp.deleteOne({ _id: record._id });

    // Proceed with next step (login/register/submit)
    res.status(200).json({ success: true, message: "OTP verified, proceed" });
  } catch (err) {
    console.error("verifyOTP error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// Email OTP


const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// ✅ Generate Email OTP
export const generateEmailOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const emailOtp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Save/Update in OTP model
    await Otp.findOneAndUpdate(
      { userId: user._id },
      { emailOtp, expiresAt },
      { upsert: true, new: true }
    );

    // TODO: send email via nodemailer
    console.log(`Email OTP for ${email}: ${emailOtp}`);

    res.status(200).json({
      success: true,
      message: "Email OTP generated & stored",
      emailOtp // ⚠️ For testing only, remove later
    });
  } catch (err) {
    console.error("Email OTP Generation Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ Verify Email OTP
export const verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otpDoc = await Otp.findOne({ userId: user._id });
    if (!otpDoc || otpDoc.expiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP expired or invalid" });
    }

    if (otpDoc.emailOtp !== otp) {
      return res.status(400).json({ message: "Invalid Email OTP" });
    }

    res.status(200).json({ success: true, message: "Email OTP verified" });
  } catch (err) {
    console.error("Email OTP Verify Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};





// Controllers/BookingOtpController.js
// Controllers/BookingOtpController.js
import BookingOtp from "../Models/tempotpModel.js";

// Generate 6-digit OTP
const generatebOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// ✅ Send OTP (mobile or email)
export const sendBookingOtp = async (req, res) => {
  try {
    const { identifier } = req.body;
    if (!identifier) return res.status(400).json({ message: "Identifier required" });

    const type = identifier.includes("@") ? "email" : "mobile";
    const otp = generatebOtp(); // use the correct function
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await BookingOtp.findOneAndUpdate(
      { identifier, type },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    console.log(`Booking OTP for ${identifier} (${type}): ${otp}`);

    // TODO: send SMS/Email here

    res.status(200).json({ success: true, message: "OTP sent", otp }); // show OTP in console/frontend for dev
  } catch (err) {
    console.error("Send Booking OTP Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ Verify OTP
export const verifyBookingOtp = async (req, res) => {
  try {
    const { identifier, otp } = req.body;
    if (!identifier || !otp) return res.status(400).json({ message: "All fields required" });

    const type = identifier.includes("@") ? "email" : "mobile";

    const otpDoc = await BookingOtp.findOne({ identifier, type });
    if (!otpDoc || otpDoc.expiresAt < Date.now() || otpDoc.otp !== otp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // OTP verified → delete it
    await BookingOtp.deleteOne({ identifier, type });

    res.status(200).json({ success: true, message: "OTP verified. You can proceed." });
  } catch (err) {
    console.error("Verify Booking OTP Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
