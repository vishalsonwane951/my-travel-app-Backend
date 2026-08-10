import mongoose from 'mongoose';

const roomTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // e.g. "Deluxe Room"
    pricePerNight: { type: Number, required: true },
    capacity: { type: Number, default: 2 },
    totalRooms: { type: Number, default: 1 },
    amenities: [{ type: String, trim: true }],
  },
  { _id: false }
);

const hotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    starRating: { type: Number, min: 1, max: 5, default: 3 },
    description: { type: String, trim: true, maxlength: 2000 },
    images: [{ type: String }],
    imagePublicIds: [{ type: String }],
    roomTypes: [roomTypeSchema],
    amenities: [{ type: String, trim: true }],
    contactPhone: { type: String, trim: true },
    contactEmail: { type: String, trim: true },
    partnerCommissionRate: { type: Number, default: 10 }, // %
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

hotelSchema.index({ destination: 1 });

export default mongoose.model('Hotel', hotelSchema);
