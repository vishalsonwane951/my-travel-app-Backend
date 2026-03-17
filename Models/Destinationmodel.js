import mongoose from "mongoose";
/**
 * Shared schema factory — one Mongoose model per collection.
 * All image fields now store Cloudinary URLs + public_ids.
 */
function createDestinationModel(modelName) {
  if (mongoose.models[modelName]) return mongoose.model(modelName);

  const schema = new mongoose.Schema(
    {
      title      : { type: String, required: [true, 'Title required'], trim: true, maxlength: 120 },
      description: { type: String, trim: true, maxlength: 2000 },
      location   : { type: String, trim: true },
      price      : { type: String, trim: true },
      duration   : { type: String, trim: true },
      rating     : { type: Number, min: 1, max: 5, default: 4.5 },
      category   : { type: String, trim: true },
      // Cloudinary
      images        : { type: String, default: '' },   // secure_url
      imagePublicId : { type: String, default: '' },   // public_id
      tags     : [{ type: String, trim: true }],
      featured : { type: Boolean, default: false },
      active   : { type: Boolean, default: true },
    },
    {
      timestamps: true,
      collection: modelName.toLowerCase().replace(/\s+/g, '_'),
    }
  );

  schema.index({ title: 'text', description: 'text', location: 'text' });
  return mongoose.model(modelName, schema);
}

export default createDestinationModel;
