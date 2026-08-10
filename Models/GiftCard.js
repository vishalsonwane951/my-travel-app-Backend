import mongoose from 'mongoose';

const giftCardSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    initialValue: { type: Number, required: true },
    balance: { type: Number, required: true },
    purchasedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    recipientEmail: { type: String, trim: true, lowercase: true },
    recipientName: { type: String, trim: true },
    message: { type: String, trim: true, maxlength: 300 },
    expiresAt: { type: Date },
    // A gift card is only spendable once its purchase payment actually succeeds
    // (Controllers/paymentController.js activates it on 'payment.captured').
    status: { type: String, enum: ['pending_payment', 'active', 'depleted', 'expired'], default: 'pending_payment' },
    active: { type: Boolean, default: false },
  },
  { timestamps: true }
);

giftCardSchema.methods.isRedeemable = function () {
  return this.status === 'active' && this.balance > 0 && (!this.expiresAt || this.expiresAt > new Date());
};

export default mongoose.model('GiftCard', giftCardSchema);
