import mongoose from "mongoose";

const maharashtraCardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    location: {
      type: String,
      trim: true
    },

    rating: {
      type: Number,
      default: 4.5,
      min: 1,
      max: 5
    },

    price: {
      type: String,
      trim: true
    },

    duration: {
      type: String,
      trim: true
    },

    category: {
      type: String,
      required: true,
      enum: ['essential', 'traveller', 'family', 'hidden', 'outdoors', 'arts', 'nightlife', 'museums'],
      index: true
    },

    tags: [
      {
        type: String,
        trim: true
      }
    ],

    images: {
      type: String,
      default: ""
    },

    imagePublicId: {
      type: String,
      default: ""
    },

    featured: {
      type: Boolean,
      default: false
    },

    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    collection: "maharashtracards"
  }
);


// 🔥 INDEXING

// Fast filtering by category
maharashtraCardSchema.index({ category: 1 });

// Fast filtering active data
maharashtraCardSchema.index({ active: 1 });

// Featured cards
maharashtraCardSchema.index({ featured: 1 });

// Search optimization
maharashtraCardSchema.index({
  title: "text",
  description: "text",
  location: "text"
});


// ✅ MODEL
const MaharashtraCard = mongoose.model("MaharashtraCard", maharashtraCardSchema);

export default MaharashtraCard;