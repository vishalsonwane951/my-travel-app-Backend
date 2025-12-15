import mongoose from "mongoose";

const myBookingSchema = new mongoose.Schema({
  // 🔹 Linked User
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // 🔹 Reference to original enquiry
  enquiryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
    unique: true, // one enquiry can only be confirmed once
  },

  // 🔹 Booking details (snapshot of enquiry at confirmation time)
  bookingId: { type: String, required: true },
  packageId: { type: String },
  packageName: { type: String },
  packageCode: { type: String },
  destination: { type: String },

  // 🔹 Traveler info
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  alternateMobile: { type: String },

  // 🔹 Travel details
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  duration: { type: Number, required: true },
  adults: { type: Number, required: true },
  children: { type: Number },
  seniors: { type: Number },
  accommodationPreference: { type: String },
  travelMode: { type: String },

  // 🔹 Payment details
  quotedPrice: { type: Number, required: true },
  paymentMethod: { type: String },
  status: {
    type: String,
    enum: ["confirmed"],
    default: "confirmed",
  },

  // 🔹 Metadata
  confirmedAt: { type: Date, default: Date.now },
});

// Indexes
myBookingSchema.index({ user: 1 });
myBookingSchema.index({ enquiryId: 1 });
myBookingSchema.index({ bookingId: 1 });

export default mongoose.model("MyBooking", myBookingSchema);
