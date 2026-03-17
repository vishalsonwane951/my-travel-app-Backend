import mongoose from 'mongoose';
import { deleteFromCloudinary } from '../utils/cloudinary.js';

const tourCardSchema = new mongoose.Schema(
  {
    title       : { type: String, required: true, trim: true },
    category    : { type: String, trim: true, default: 'Popular Destination' },
    img         : { type: String, default: '' },      // Cloudinary URL
    imgPublicId : { type: String, default: '' },      // for deletion
    active      : { type: Boolean, default: true },  // only one active field
    sortOrder   : { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('TourCard', tourCardSchema);