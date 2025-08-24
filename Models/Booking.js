import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bookingId: {
    type: String,
    unique: false,
    default: () => `BNG-${uuidv4().split("-")[0].toUpperCase()}`
  },
  budget:{
    type:Number,
    required:false
  },
  Message :{
    type:String,
    default:"NA"
  },
  packageId: {
  type: String,
  required: false ,
  default: () => `PKG-${Math.random().toString(36).substr(2, 8).toUpperCase()}`
},

  packageName: String,
  destination: { type: String, required: true },

  fullName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  mobile: {
    type: String,
    required: true,
    match: /^[+]?[0-9\s-]{10,15}$/
  },

  startDate: { type: Date, required: true },
  endDate: Date,
  duration: { type: Number, required: true, min: 1 },
  adults: { type: Number, required: true, min: 1 },
  children: { type: Number, default: 0 },
  seniors: { type: Number, default: 0 },

  quotedPrice: { type: Number, default: 0, min: 0 },
  status: {
    type: String,
    enum: ["pending", "confirmed", "responded", "closed", "rejected"],
    default: "pending"
  },
  enquiryType: {
    type: String,
    enum: [
      "Package Enquiry",
      "Custom Request",
      "Price Enquiry",
      "Availability Check",
      "General Query"
    ],
    default: "Package Enquiry"
  },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  notes: String
}, { timestamps: true });

// indexes
bookingSchema.index({ bookingId: 1 });
bookingSchema.index({ user: 1 });
bookingSchema.index({ email: 1 });
bookingSchema.index({ mobile: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ createdAt: -1 });

bookingSchema.index({ user: 1, packageId: 1 }, { unique: true });

export default mongoose.model("Booking", bookingSchema);
