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
