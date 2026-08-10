// backend/models/Review.js
import { Schema, model } from "mongoose";

const reviewSchema = new Schema(
  {
    packageId: {
      type: Schema.Types.ObjectId,
      ref: "Package",
      required: true,
      index: true,
    },
    // Author — populated from JWT when logged-in, or guest fields otherwise
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    location: {
      type: String,
      trim: true,
      default: "India",
    },
    // Review body
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "My Experience",
    },
    text: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 3000,
    },
    tripType: {
      type: String,
      enum: ["Solo", "Couple", "Family", "Friends", "Business"],
      default: "Family",
    },
    // Helpful votes — store voter IDs / IPs to prevent duplicate votes
    helpful: {
      type: Number,
      default: 0,
    },
    helpfulVoters: {
      type: [String], // userId strings or anonymous IP hashes
      default: [],
      select: false,  // don't send this to the client
    },
    // Moderation
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved", // set to "pending" if you want manual approval
    },
  },
  { timestamps: true }
);

// Virtual: formatted date for the frontend
reviewSchema.virtual("date").get(function () {
  return this.createdAt.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
});

reviewSchema.set("toJSON", { virtuals: true });

export default model("Review", reviewSchema);