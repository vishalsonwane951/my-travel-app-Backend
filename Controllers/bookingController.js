import User from "../Models/UserModel.js";
import Booking from "../Models/Booking.js";
import MyBooking from "../Models/MyBookings.js";

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
    const allowedStatuses = ["Pending", "Responded", "Confirmed", "Closed"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    // Update booking status
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status, response, updatedAt: new Date() },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // ✅ If confirmed, store into MyBookings
    // if (status === "Confirmed") {
    //   const existing = await MyBooking.findOne({ enquiryId: booking._id });
    //   if (!existing) {
    //     const myBooking = new MyBooking({
    //       user: booking.user,
    //       enquiryId: booking._id,
    //       bookingId: booking.bookingId,
    //       packageId: booking.packageId,
    //       packageName: booking.packageName,
    //       packageCode: booking.packageCode,
    //       destination: booking.destination,
    //       fullName: booking.fullName,
    //       email: booking.email,
    //       mobile: booking.mobile,
    //       alternateMobile: booking.alternateMobile,
    //       startDate: booking.startDate,
    //       endDate: booking.endDate,
    //       duration: booking.duration,
    //       adults: booking.adults,
    //       children: booking.children,
    //       seniors: booking.seniors,
    //       accommodationPreference: booking.accommodationPreference,
    //       travelMode: booking.travelMode,
    //       quotedPrice: booking.quotedPrice,
    //       paymentMethod: booking.paymentMethod
    //     });
    //     await myBooking.save();
    //   }
    // }

    res.json({ success: true, message: "Booking status updated successfully", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};  



// import Booking from "../Models/Booking.js";

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

// // Fetch only confirmed bookings for a user (by userId or username)
// export const getConfirmedBookings = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     let bookings = [];

//     if (mongoose.Types.ObjectId.isValid(userId)) {
//       bookings = await Booking.find({ user: userId, status: "Confirmed" }).select(
//         "_id package packageName packageCode destination status startDate endDate createdAt"
//       );
//     } else {
//       const user = await User.findOne({ username: userId });
//       if (!user) return res.status(404).json({ success: false, message: "User not found" });

//       bookings = await Booking.find({ user: user._id, status: "Confirmed" }).select(
//         "_id package packageName packageCode destination status startDate endDate createdAt"
//       );
//     }

//     res.json({ success: true, bookings });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

export const getConfirmedBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await Booking.find({
      user: userId,
      status: "Confirmed",
    })
      .populate("user", "fullName email mobile")
      .select(`
        _id
        bookingId
        packageName
        destination
        startDate
        status
        createdAt
        fullName
        email
        mobile
        quotedPrice
        duration
        adults
        children
        user
      `)
      .sort({ createdAt: -1 });

    console.log("CONFIRMED BOOKINGS API HIT");
    console.log(bookings[0]);

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










// Update booking status (admin only)
// export const updateBookingStatus = async (req, res) => {
//   try {
//     if (!req.user.isAdmin) return res.status(403).json({ success: false, message: "Unauthorized" });
//     const { bookingId } = req.params;
//     const { status, response } = req.body;

//     const booking = await Booking.findById(bookingId);
//     if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

//     booking.status = status;
//     if (response) booking.response = response;

//     await booking.save();
//     res.status(200).json({ success: true, booking });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Failed to update status" });
//   }
// };

// Delete booking (admin only)
export const deleteBooking = async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ success: false, message: "Unauthorized" });
    const { bookingId } = req.params;
    await Booking.findByIdAndDelete(bookingId);
    res.status(200).json({ success: true, message: "Booking deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete booking" });
  }
};


// 🔹 Fetch confirmed bookings for logged-in user



export const getUserConfirmedBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await Booking.find({
      user: userId,
      status: "confirmed", // only confirmed
    })
      .select(
        "_id bookingId packageName destination fullName email mobile startDate duration adults children quotedPrice status createdAt"
      )
      .sort({ createdAt: -1 }); // newest first

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






























// Generate Tep OTP

import BookingOtp from "../Models/tempotpModel.js";

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
