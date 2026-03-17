import mongoose from "mongoose";

// Base fields for all tour cards
const baseCardFields = {
  images: { type: String, required: true },
  title: { type: String, required: true },
  active: { type: Boolean, default: true },      // For admin toggle
  featured: { type: Boolean, default: false },   // For sorting featured packages
};

// Schema for first International collection
const InternationalToursSchema = new mongoose.Schema(baseCardFields, { timestamps: true });
const International = mongoose.model('International', InternationalToursSchema);

// Schema for second International collection (if you need two separate collections)
const International2ToursSchema = new mongoose.Schema(baseCardFields, { timestamps: true });
const International2 = mongoose.model('International2', International2ToursSchema);

export { International, International2 };