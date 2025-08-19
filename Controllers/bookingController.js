import Booking from "../Models/Booking.js";
import User from "../Models/UserModel.js";
import nodemailer from "nodemailer";


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

export const createBooking = async (req, res) => {
  try {
    // Simply create booking from request body
    const booking = new Booking(req.body);

    const savedBooking = await booking.save();
    res.status(201).json({ success: true, booking: savedBooking });
  } catch (err) {
    console.error("Booking creation error:", err);
    res.status(500).json({ message: "Error creating booking", error: err.message });
  }
};

// Optional: Get all bookings
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, bookings });
  } catch (err) {
    console.error("Get bookings error:", err);
    res.status(500).json({ message: "Error fetching bookings", error: err.message });
  }
};


// Update Booking Controller
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Merge nested objects
    if (updateData.customer) {
      booking.customer = { ...booking.customer.toObject(), ...updateData.customer };
    }
    if (updateData.travelDetails) {
      booking.travelDetails = { ...booking.travelDetails.toObject(), ...updateData.travelDetails };
    }
    if (updateData.pricing) {
      booking.pricing = { ...booking.pricing.toObject(), ...updateData.pricing };
      booking.pricing.quotedPrice = booking.pricing.quotedPrice || 0;
      booking.pricing.totalAmount = booking.pricing.totalAmount || 0;
    }

    // Merge top-level fields
    const topFields = ['packageId', 'packageName', 'packageCode', 'destination', 'status', 'enquiryType', 'notes'];
    topFields.forEach(field => {
      if (updateData[field] !== undefined) booking[field] = updateData[field];
    });

    await booking.save();
    res.json({ success: true, booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating booking", error: err.message });
  }
};

// get my bookings
export const getMyBookings = async (req, res) => {
  try {
     console.time("getMyBookings"); // ⏱ start timer

    const bookings = await Booking.find({ userId: req.user._id })

    console.timeEnd("getMyBookings"); // ⏱ end timer

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookings" });
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
