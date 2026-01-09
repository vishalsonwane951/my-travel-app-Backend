import User from "../Models/UserModel.js";
import Booking from "../Models/Booking.js";
import BookingOtp from "../Models/tempotpModel.js";


// Update booking/enquiry status (Admin only)
export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, response } = req.body;

    // Only admin can update
    if (!req.user?.isAdmin) {
      return res.status(403).json({ success: false, message: "Only admin can update status" });
    }

    // Validate status
    const allowedStatuses = ["pending", "responded", "confirmed", "closed"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    // Update booking status
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status, response,  confirmedAt: status === "Confirmed" ? new Date() : undefined },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }


    res.json({ success: true, message: "Booking status updated successfully", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};  


// Create new enquiry / booking
export const createBooking = async (req, res) => {
  try {
    const userId = req.user._id; // from auth middleware
    const data = { ...req.body, user: userId, status: 'pending' };
    const newBooking = await Booking.create(data);
    res.status(201).json({ success: true, booking: newBooking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to create booking" });
  }
};


// Get all enquiries for a user
import mongoose from "mongoose";

export const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params; 

    let bookings;

    // check if userId is a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(userId)) {
      bookings = await Booking.find({ user: userId });
    } else {
      // fallback: maybe userId is username
      const user = await User.findOne({ username: userId });
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      bookings = await Booking.find({ user: user._id });
    }

    res.json({ success: true, bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// admit use only
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("user", "-password");
    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



// Fetch confirmed bookings for logged-in user

export const getUserConfirmedBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await Booking.find({
      user: userId,
      status: 'Confirmed', 
    })
      .select(
        "_id bookingId packageId packageName packageCode destination fullName email mobile alternateMobile startDate endDate duration adults children seniors accommodationPreference travelMode quotedPrice paymentMethod status enquiryType createdAt updatedAt confirmedAt"
      )
      .sort({ updatedAt: -1, createdAt: -1 }); 

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get Confirmed Bookings Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


// Delete booking/enquiry (Admin only
export const deleteBooking = async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ success: false, message: "Unauthorized" });
    const { bookingId } = req.params;
    await Booking.findByIdAndDelete(bookingId);
    res.status(200).json({ success: true, message: "Booking deleted" });
    alert("Booking deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete booking" });
  }
};


// Generate Tep OTP


// Generate random 6-digit OTP
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// 📌 1. Send OTP to Mobile
export const sendMobileOtp = async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile) return res.status(400).json({ message: "Mobile required" });

    // ✅ Check user exists
    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(400).json({ message: "Mobile must be registered" });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    await BookingOtp.findOneAndUpdate(
      { identifier: mobile, type: "mobile" },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    console.log(`📱 Mobile OTP for ${mobile}: ${otp}`);

    // TODO: send SMS using provider

    res.status(200).json({ success: true, message: "OTP sent to mobile", otp });
  } catch (err) {
    console.error("Send Mobile OTP Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 2. Send OTP to Email
export const sendEmailOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    // ✅ Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email must be registered" });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await BookingOtp.findOneAndUpdate(
      { identifier: email, type: "email" },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    console.log(`📧 Email OTP for ${email}: ${otp}`);

    // TODO: send Email using provider

    res.status(200).json({ success: true, message: "OTP sent to email", otp });
  } catch (err) {
    console.error("Send Email OTP Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 3. Verify OTP (works for both mobile/email)
export const verifyBookingOtp = async (req, res) => {
  try {
    const { mobile, email, otp } = req.body;
    if (!otp) return res.status(400).json({ message: "OTP required" });

    let identifier, type;
    if (mobile) {
      identifier = mobile;
      type = "mobile";
    } else if (email) {
      identifier = email;
      type = "email";
    } else {
      return res.status(400).json({ message: "Mobile or Email required" });
    }

    const record = await BookingOtp.findOne({ identifier, type });

    if (!record) return res.status(400).json({ message: "OTP not found" });
    if (record.expiresAt < new Date())
      return res.status(400).json({ message: "OTP expired" });
    if (record.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    // ✅ OTP verified → delete from DB
    await BookingOtp.deleteOne({ identifier, type });

    res.status(200).json({ success: true, message: "OTP verified successfully" });
  } catch (err) {
    console.error("Verify Booking OTP Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
