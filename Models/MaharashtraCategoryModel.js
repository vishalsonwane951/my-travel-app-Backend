import mongoose from 'mongoose';

/**
 * Generic category card schema shared by all Maharashtra sub-collections:
 *   EssentialCards, TravellerChoice, FamilyFriendly, HiddenGems,
 *   Outdoors, ArtsTheatre, NightLife, Museums
 */
const categoryCardSchema = new mongoose.Schema(
  {
    title      : { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    location   : { type: String, trim: true },
    rating     : { type: Number, default: 4.5, min: 1, max: 5 },
    price      : { type: String, trim: true },
    duration   : { type: String, trim: true },
    timings    : { type: String, trim: true },
    entryFee   : { type: String, trim: true },
    category   : { type: String, trim: true },
    tags       : [String],
    images     : { type: String, default: '' },        // Cloudinary URL
    imagePublicId: { type: String, default: '' },
    active     : { type: Boolean, default: true },
  },
  { timestamps: true, collection: undefined } // collection set per model
);

/**
 * Factory – prevents OverwriteModelError on hot-reload
 */
export default function createCategoryModel(modelName) {
  if (mongoose.models[modelName]) return mongoose.model(modelName);
  const schema = categoryCardSchema.clone();
  schema.set('collection', modelName.toLowerCase());
  return mongoose.model(modelName, schema);
}

