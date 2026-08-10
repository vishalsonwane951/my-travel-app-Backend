import mongoose from 'mongoose';

const addOnSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: {
      type: String,
      enum: ['insurance', 'transfer', 'guide', 'activity', 'meal', 'accessibility', 'other'],
      default: 'other',
    },
    price: { type: Number, required: true },
    priceUnit: { type: String, enum: ['per_person', 'per_booking'], default: 'per_person' },
    icon: { type: String, default: '' }, // simple emoji/icon key for the UI
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('AddOn', addOnSchema);
