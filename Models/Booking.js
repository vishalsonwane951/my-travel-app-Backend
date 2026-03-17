import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    // Auto-generated human-readable ID
    bookingId: { type: String, unique: true },

    user      : { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    createdBy : { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    packageName : { type: String, default: 'Custom Package', trim: true },
    packageId   : { type: String, trim: true },
    destination : { type: String, required: [true, 'Destination required'], trim: true },

    // Customer info (for guest bookings)
    fullName : { type: String, required: [true, 'Full name required'], trim: true },
    email    : { type: String, required: [true, 'Email required'], lowercase: true, trim: true },
    mobile   : { type: String, required: [true, 'Mobile required'], trim: true },
    alternateMobile: { type: String, trim: true },

    startDate : { type: Date },
    endDate   : { type: Date },
    duration  : { type: Number, default: 1 },

    adults   : { type: Number, default: 1, min: 1 },
    children : { type: Number, default: 0 },
    seniors  : { type: Number, default: 0 },

    budget          : { type: Number, default: 0 },
    accommodationPreference: { type: String, trim: true },
    travelMode      : { type: String, trim: true },
    paymentMethod   : { type: String, trim: true },
    quotedPrice     : { type: Number },

    Message    : { type: String, trim: true, default: 'NA' },
    enquiryType: { type: String, default: 'Package Enquiry', trim: true },
    notes      : { type: String, trim: true },
    response   : { type: String, trim: true },  // admin response text

    status: {
      type   : String,
      enum   : ['pending', 'confirmed', 'responded', 'closed', 'rejected'],
      default: 'pending',
    },
    confirmedAt: { type: Date },
  },
  { timestamps: true }
);

// Auto-generate bookingId before first save
bookingSchema.pre('save', function (next) {
  if (!this.bookingId) {
    const rand = Math.random().toString(36).substr(2, 8).toUpperCase();
    this.bookingId = `DVD-${rand}`;
  }
  if (this.status === 'confirmed' && !this.confirmedAt) {
    this.confirmedAt = new Date();
  }
  next();
});

// Index for common queries
bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ email: 1 });
bookingSchema.index({ createdAt: -1 });

export default mongoose.model('Booking', bookingSchema);
