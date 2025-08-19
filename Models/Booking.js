// import mongoose from "mongoose";

// const bookingSchema = new mongoose.Schema(
//   {
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     packageId: { type: String},
//     fullName: { type: String, required: true },
//     email: { type: String, required: true },
//     mobile: { type: String, required: true },
//     status: {
//       type: String,
//       enum: ["pending", "confirmed", "cancelled"],
//       default: "pending"
//     },
//     startDate: { type: Date, required: true },
//     days: { type: Number, required: true, min: 1 },
//     adults: { type: Number, default: 1, min: 1 },
//     children: { type: Number, default: 0, min: 0 },
//     quotedPrice: { type: Number }
//   },
//   { timestamps: true }
// );

// bookingSchema.index({ userId: 1 });

// export default mongoose.model("Booking", bookingSchema);

import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  // Basic Information
  bookingId: {
    type: String,
    required: true,
    unique: true,
    default: () => `BOOK-${Math.random().toString(36).substr(2, 8).toUpperCase()}`
  },
  packageId: {
    type: String,
    default: () => `PKG-${Math.random().toString(36).substr(2, 8).toUpperCase()}`
  },
  packageName: { type: String, required: false },
  packageCode: String,
  destination: { type: String, required: true },

  // Customer Info
  fullName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    validate: {
      validator: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: props => `${props.value} is not a valid email!`
    }
  },
  mobile: {
    type: String,
    required: true,
    validate: {
      validator: v => /^[+]?[0-9]{10,15}$/.test(v),
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  alternateMobile: String,
  acceptTerms: { type: Boolean, default: false },

  // Travel Details
  startDate: { type: Date, required: true },
  endDate: Date,
  duration: { type: Number, required: true, min: 1 },
  adults: { type: Number, required: true, min: 1 },
  children: { type: Number, default: 0, min: 0 },
  seniors: { type: Number, default: 0, min: 0 },
  accommodationPreference: {
    type: String,
    enum: ['Standard', 'Deluxe', 'Luxury', 'Budget', 'Homestay'],
    default: 'Standard',
    set: v => v.charAt(0).toUpperCase() + v.slice(1).toLowerCase()
  },
  travelMode: String,

  // Pricing
  quotedPrice: { type: Number, required: true, min: 0 },
  paymentMethod: String,

  // Booking Status
  status: {
    type: String,
    enum: ['Draft', 'Confirmed', 'Cancelled', 'Completed'],
    default: 'Draft'
  },
  enquiryType: {
    type: String,
    enum: ['Package Enquiry', 'Custom Request', 'Price Enquiry', 'Availability Check', 'General Query'],
    default: 'Package Enquiry'
  },

  // System Info
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  notes: String
});

// Indexes
bookingSchema.index({ bookingId: 1 });
bookingSchema.index({ email: 1 });
bookingSchema.index({ mobile: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ createdAt: -1 });

// Update updatedAt
bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Booking', bookingSchema);

