  import mongoose from 'mongoose';
  const daySchema = new mongoose.Schema({
    day: Number,
    title: String,
    description: String,
    meals: String,
  }, { _id: false });

  const inclExclSchema = new mongoose.Schema({
    inclusions: [String],
    exclusions: [String],
  }, { _id: false });

  const packageSchema = new mongoose.Schema(
    {
      title: { type: String, required: true, trim: true },
      location: { type: String, trim: true },
      type: { type: String, trim: true, lowercase: true },
      destination: { type: String, trim: true },
      rating: { type: Number, default: 4.5, min: 1, max: 5 },
      price: { type: Number, default: 0 },
      strikePrice: { type: Number },
      durations: { type: String, trim: true }, 
      groupSize: { type: String, trim: true },
      description: { type: String, trim: true, maxlength: 3000 },

      // Cloudinary
      images: { type: String, default: '' },
      imagePublicId: { type: String, default: '' },

      // Gallery: [{img, caption, publicId}]
      gallery: [
        {
          img: { type: String },
          caption: { type: String },
          publicId: { type: String },
        },
      ],

      itinerary: [daySchema],
      inclExcl: inclExclSchema,
      highlights: [String],
      tags: [String],
      featured: { type: Boolean, default: false },
      active: { type: Boolean, default: true },
    },
    { timestamps: true }
  );

  packageSchema.index({ title: 'text', location: 'text', type: 1 });

  export default mongoose.model('Package', packageSchema);
