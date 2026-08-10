import mongoose from "mongoose";
const favouriteSchema = new mongoose.Schema(
  {
    user    : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tourCard: { type: mongoose.Schema.Types.ObjectId, ref: 'TourCard', required: true },
    status  : { type: String, enum: ['like', 'unlike'], default: 'like' },
  },
  { timestamps: true }
);

// Unique: one record per user-tourCard pair
favouriteSchema.index({ user: 1, tourCard: 1 }, { unique: true });

export default mongoose.model('Favourite', favouriteSchema);
