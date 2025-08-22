// import Booking from "../Models/Booking.js";
import User from "../Models/UserModel.js";
// import nodemailer from "nodemailer";


// export const createBooking = async (req, res) => {
//   try {
//     const userId = req.user?.id;
//     if (!userId) return res.status(401).json({ message: "Unauthorized" });

//     const {
//        packageId,
//       fullName,
//       email,
//       mobile,
//       startDate,
//       days,
//       adults,
//       children,
//       notes,
//       quotedPrice,
//     } = req.body;

//     if (!packageId || !fullName || !email || !mobile || !startDate || !days || !quotedPrice) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const booking = await Booking.create({
//        userId,
//       packageId,
//       fullName,
//       email,
//       mobile,
//       startDate,
//       days,
//       adults,
//       children,
//       notes,
//       quotedPrice,
//     });
    
//     await booking.save();
    
//     // send confirmation email
//     // const transporter = nodemailer.createTransport({
//     //   service: "gmail",
//     //   auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
//     // });

//     // await transporter.sendMail({
//     //   from: `"Desi VDesi Tours" <${process.env.SMTP_USER}>`,
//     //   to: booking.email,
//     //   subject: "Booking Confirmation",
//     //   html: `<h2>Booking Confirmed</h2>
//     //          <p>Dear ${booking.name},</p>
//     //          <p>Your enquiry is confirmed for package <b>${booking.packageId}</b>.</p>
//     //          <p>We will contact you soon.</p>`
//     // });

//     res.status(201).json({success: true, message: "Booking saved", booking });
//   } catch (err) {
//     console.error("createBooking", err);
//     res.status(500).json({ message: "Could not save booking" });
//   }
// };


// export const createBooking = async (req, res) => {
//   try {
//     const userId = req.user?._id; // protect middleware should add this
//     console.log("👉 Incoming Booking Data:", req.body);

//     const {
//       packageId,
//       fullName,
//       email,
//       mobile,
//       startDate,
//       days,
//       adults,
//       children,
//       notes,
//       quotedPrice,
//     } = req.body;

//     // Collect missing fields
//     const missingFields = [];
//     if (!fullName) missingFields.push("fullName");
//     if (!email) missingFields.push("email");
//     if (!mobile) missingFields.push("mobile");
//     if (!startDate) missingFields.push("startDate");
//     if (!days) missingFields.push("days");

//     if (missingFields.length > 0) {
//       console.warn("❌ Missing fields:", missingFields);
//       return res.status(400).json({
//         message: "Missing required fields",
//         missing: missingFields,
//       });
//     }

//     const booking = new Booking({
//       userId,
//       packageId,
//       fullName,
//       email,
//       mobile,
//       startDate,
//       days,
//       adults,
//       children,
//       notes,
//       quotedPrice,
//     });

//     await booking.save();

//     console.log("✅ Booking Saved:", booking);

//     res.status(201).json({ message: "Booking successful", booking });
//   } catch (error) {
//     console.error("❌ Booking Error:", error.message);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };




// Create Booking Controller

// export const createBooking = async (req, res) => {
//   try {
//     // Simply create booking from request body
//     const booking = new Booking(req.body);

//     const savedBooking = await booking.save();
//     res.status(201).json({ success: true, booking: savedBooking });
//   } catch (err) {
//     console.error("Booking creation error:", err);
//     res.status(500).json({ message: "Error creating booking", error: err.message });
//   }
// };



// export const createBooking = async (req, res) => {
//   const userId = req.user.id;
//   try {
//     const newBooking = new Booking({
//       ...req.body,
//       userId,
//       status: "pending",
//     });
//     const saved = await newBooking.save();
//     res.status(201).json({ success: true, booking: saved });
//   } catch (err) {
//     console.error("Error creating booking:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // Optional: Get all bookings

// export const getBookings = async (req, res) => {
//   const userId = req.user.id; // get from auth middleware
//   try {
//     const bookings = await Booking.find({ userId });
//     res.status(200).json({
//       success: true,
//       message: "User bookings fetched successfully",
//       bookings,
//     });
//   } catch (err) {
//     console.error("Error fetching bookings:", err);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching bookings",
//       error: err.message,
//     });
//   }
// };



// // Delete booking/enquiry - only admin
// export const deleteBooking = async (req, res) => {
//   if (req.user.role !== "admin") {
//     return res.status(403).json({ success: false, message: "Unauthorized" });
//   }
//   try {
//     await Booking.findByIdAndDelete(req.params.id);
//     res.status(200).json({ success: true, message: "Booking deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // Update booking status - only admin
// export const updateBookingStatus = async (req, res) => {
//   if (req.user.role !== "admin") {
//     return res.status(403).json({ success: false, message: "Unauthorized" });
//   }
//   const validStatuses = ["pending", "responded", "closed", "confirmed"];
//   const { status, response } = req.body;
//   if (!validStatuses.includes(status)) {
//     return res.status(400).json({ success: false, message: "Invalid status" });
//   }
//   try {
//     const booking = await Booking.findByIdAndUpdate(
//       req.params.id,
//       { status, response, updatedAt: new Date() },
//       { new: true }
//     );
//     res.status(200).json({ success: true, booking });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };














// // Update Booking Controller
// export const updateBooking = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updateData = req.body;

//     const booking = await Booking.findById(id);
//     if (!booking) return res.status(404).json({ message: "Booking not found" });

//     // Merge nested objects
//     if (updateData.customer) {
//       booking.customer = { ...booking.customer.toObject(), ...updateData.customer };
//     }
//     if (updateData.travelDetails) {
//       booking.travelDetails = { ...booking.travelDetails.toObject(), ...updateData.travelDetails };
//     }
//     if (updateData.pricing) {
//       booking.pricing = { ...booking.pricing.toObject(), ...updateData.pricing };
//       booking.pricing.quotedPrice = booking.pricing.quotedPrice || 0;
//       booking.pricing.totalAmount = booking.pricing.totalAmount || 0;
//     }

//     // Merge top-level fields
//     const topFields = ['packageId', 'packageName', 'packageCode', 'destination', 'status', 'enquiryType', 'notes'];
//     topFields.forEach(field => {
//       if (updateData[field] !== undefined) booking[field] = updateData[field];
//     });

//     await booking.save();
//     res.json({ success: true, booking });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error updating booking", error: err.message });
//   }
// };

// // get my bookings
// export const getMyBookings = async (req, res) => {
//   try {
//      console.time("getMyBookings"); // ⏱ start timer

//     const bookings = await Booking.find({ userId: req.user._id })

//     console.timeEnd("getMyBookings"); // ⏱ end timer

//     res.json(bookings);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch bookings" });
//   }
// };



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
    const allowedStatuses = ["confirmed", "responded", "closed", "rejected"];
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
    if (status === "confirmed") {
      const existing = await MyBooking.findOne({ enquiryId: booking._id });
      if (!existing) {
        const myBooking = new MyBooking({
          user: booking.user,
          enquiryId: booking._id,
          bookingId: booking.bookingId,
          packageId: booking.packageId,
          packageName: booking.packageName,
          packageCode: booking.packageCode,
          destination: booking.destination,
          fullName: booking.fullName,
          email: booking.email,
          mobile: booking.mobile,
          alternateMobile: booking.alternateMobile,
          startDate: booking.startDate,
          endDate: booking.endDate,
          duration: booking.duration,
          adults: booking.adults,
          children: booking.children,
          seniors: booking.seniors,
          accommodationPreference: booking.accommodationPreference,
          travelMode: booking.travelMode,
          quotedPrice: booking.quotedPrice,
          paymentMethod: booking.paymentMethod
        });
        await myBooking.save();
      }
    }

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
