import mongoose from "mongoose";

const myBookingSchema = new mongoose.Schema(
  {
    // 🔹 Linked User
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🔹 Reference to original enquiry
    enquiryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true, // one enquiry → one confirmed booking
      index: true,
    },

    // 🔹 Booking identifiers
    bookingId: { type: String, required: true, index: true },
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
    children: { type: Number, default: 0 },
    seniors: { type: Number, default: 0 },
    accommodationPreference: { type: String },
    travelMode: { type: String },

    // 🔹 Payment details
    quotedPrice: { type: Number, required: true },
    paymentMethod: { type: String },

    // 🔹 Status (only confirmed bookings live here)
    status: {
      type: String,
      enum: ["confirmed"],
      default: "confirmed",
    },

    // 🔹 Confirmation metadata
    confirmedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // ✅ createdAt + updatedAt
  }
);

// Indexes
myBookingSchema.index({ user: 1, confirmedAt: -1 });

export default mongoose.model("MyBooking", myBookingSchema);
