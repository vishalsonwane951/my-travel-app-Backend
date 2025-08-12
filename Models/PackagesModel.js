import mongoose from "mongoose";

// Reusable schema fields
const baseCardFields = {
  location: { type: String, required: true },
  caption: { type: String, required: true },
  link: { type: String, required: true },
  images: { type: [String], required: true }
};

const AdventureTourPackage1CardSchema = new mongoose.Schema(baseCardFields, { timestamps: true });
const AdventureTourPackage1 = mongoose.model('AdventureTourPackage1', AdventureTourPackage1CardSchema);

const AdventureTourPackage2CardSchema = new mongoose.Schema(baseCardFields, { timestamps: true });
const AdventureTourPackage2 = mongoose.model('AdventureTourPackage2', AdventureTourPackage2CardSchema);

// City Tour
// const CityTourPackage1CardSchema = new mongoose.Schema(baseCardFields, { timestamps: true });
// const CityTourPackage1 = mongoose.model('CityTourPackage1', CityTourPackage1CardSchema);

export  {AdventureTourPackage1,AdventureTourPackage2};
