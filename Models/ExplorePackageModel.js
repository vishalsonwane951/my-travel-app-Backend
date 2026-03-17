import mongoose from "mongoose";

const explorePackageSchema = new mongoose.Schema(
  {
    // General package info
    title: { type: String, required: true },
    caption: { type: String },
    description: { type: String },
    overview: { type: String, required: true },
    location: { type: String, required: true, lowercase: true, index: true },
    images: [String],
    type:{type:String, required: true},
    highlights: [String],
    rating: { type: Number, default: 4.5 },
    groupSize: { type: Number },

    // Duration and pricing
    durations: [
      {
        duration: { type: String, required: true }, // e.g., 2N/3D
        price: { type: Number, required: true },
        discountedPrice: Number,

        // Day-wise itinerary inside each duration
        itinerary: [
          {
            day: { type: Number, required: true },
            activities: [String] // multiple activities per day
          }
        ]
      }
    ],

    // Other details
    inclusions: [String],
    exclusions: [String],
    isActive: { type: Boolean, default: true, index: true }
  },
  { timestamps: true }
);

export default mongoose.model("ExplorePackage", explorePackageSchema);


