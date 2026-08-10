import mongoose from 'mongoose';

const walletTransactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      enum: ['referral_reward', 'gift_card_redeem', 'loyalty_redeem', 'loyalty_earn', 'refund', 'admin_credit', 'booking_debit'],
      required: true,
    },
    amount: { type: Number, required: true }, // positive = credit, negative = debit
    balanceAfter: { type: Number, required: true },
    relatedBooking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', default: null },
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

walletTransactionSchema.index({ createdAt: -1 });

export default mongoose.model('WalletTransaction', walletTransactionSchema);
