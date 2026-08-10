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

    // ── Admin inbox additions (Part B, Module 3) ────────────────────────────
    assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    timeline: [
      {
        _id: false,
        status: { type: String },
        note: { type: String, default: '' },
        by: { type: String, default: 'system' },
        at: { type: Date, default: Date.now },
      },
    ],

    // ── Part C: client-side business enhancements ───────────────────────────
    // Add-on marketplace (Module: add-on marketplace)
    addOns: [
      {
        _id: false,
        addOnId: { type: mongoose.Schema.Types.ObjectId, ref: 'AddOn' },
        name: { type: String },
        price: { type: Number },
        quantity: { type: Number, default: 1 },
      },
    ],
    addOnsTotal: { type: Number, default: 0 },

    // Dynamic pricing snapshot (so the price a customer paid is never lost
    // even if the underlying package's dynamic price later changes)
    basePriceAtBooking: { type: Number },
    dynamicPriceAtBooking: { type: Number },

    // Coupons / gift cards / loyalty (all settle against the same Payment/Invoice records)
    couponCode: { type: String, trim: true, uppercase: true },
    couponDiscount: { type: Number, default: 0 },
    giftCardCode: { type: String, trim: true, uppercase: true },
    giftCardAmountApplied: { type: Number, default: 0 },
    loyaltyPointsRedeemed: { type: Number, default: 0 },
    loyaltyDiscountApplied: { type: Number, default: 0 },
    loyaltyPointsEarned: { type: Number, default: 0 },

    // Corporate / group bookings
    bookingType: { type: String, enum: ['individual', 'corporate', 'group'], default: 'individual' },
    companyName: { type: String, trim: true },
    groupSize: { type: Number },
    gstNumber: { type: String, trim: true },

    // Referral / agent attribution
    referredByCode: { type: String, trim: true, uppercase: true }, // referral or agent code used at booking time
    referredByUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    finalAmount: { type: Number }, // (basePriceAtBooking*travelers) + addOnsTotal - couponDiscount - giftCardAmountApplied - loyaltyDiscountApplied

    // Part C: abandoned-enquiry automation
    reminderSentAt: { type: Date, default: null },
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

export default mongoose.model('Booking', bookingSchema, 'bookings');