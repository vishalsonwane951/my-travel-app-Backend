import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, trim: true },
    discountType: { type: String, enum: ['percent', 'flat'], default: 'percent' },
    discountValue: { type: Number, required: true },
    maxDiscount: { type: Number }, // caps a percent discount
    minBookingAmount: { type: Number, default: 0 },
    validFrom: { type: Date, default: Date.now },
    validTill: { type: Date, required: true },
    usageLimit: { type: Number, default: 0 }, // 0 = unlimited
    usedCount: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

couponSchema.methods.isValidNow = function () {
  const now = new Date();
  return (
    this.active &&
    now >= this.validFrom &&
    now <= this.validTill &&
    (this.usageLimit === 0 || this.usedCount < this.usageLimit)
  );
};

export default mongoose.model('Coupon', couponSchema);
