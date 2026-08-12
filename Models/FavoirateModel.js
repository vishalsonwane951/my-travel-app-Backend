import mongoose from "mongoose";
const favouriteSchema = new mongoose.Schema(
  {
    user    : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // Exactly one of these two is set per document — Package is the site's
    // main content type (packages/itineraries); TourCard is the older
    // homepage-carousel content type. Both are supported so nothing that
    // already relied on TourCard favouriting breaks.
    tourCard: { type: mongoose.Schema.Types.ObjectId, ref: 'TourCard', default: null },
    package : { type: mongoose.Schema.Types.ObjectId, ref: 'Package', default: null },
    status  : { type: String, enum: ['like', 'unlike'], default: 'like' },
  },
  { timestamps: true }
);

// Unique per user+tourCard and per user+package (sparse — only enforced when
// that field is actually set, so the two reference types don't collide).
favouriteSchema.index({ user: 1, tourCard: 1 }, { unique: true, sparse: true });
favouriteSchema.index({ user: 1, package: 1 }, { unique: true, sparse: true });

export default mongoose.model('Favourite', favouriteSchema);
