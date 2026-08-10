import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', default: null, index: true },
    giftCard: { type: mongoose.Schema.Types.ObjectId, ref: 'GiftCard', default: null, index: true },
    invoice: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    type: {
      type: String,
      enum: ['full', 'advance', 'emi_installment', 'refund', 'gift_card_purchase'],
      default: 'full',
    },

    // Razorpay linkage
    razorpayOrderId: { type: String, index: true },
    razorpayPaymentId: { type: String, index: true },
    razorpaySignature: { type: String },

    method: { type: String, trim: true }, // card, upi, netbanking, wallet ...
    status: {
      type: String,
      enum: ['created', 'pending', 'success', 'failed', 'refunded'],
      default: 'created',
    },

    // EMI plan metadata, only relevant when type === 'emi_installment'
    emiPlan: {
      totalInstallments: { type: Number },
      installmentNumber: { type: Number },
    },

    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

paymentSchema.index({ createdAt: -1 });

export default mongoose.model('Payment', paymentSchema);
