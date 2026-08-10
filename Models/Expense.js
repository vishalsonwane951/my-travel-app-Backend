import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ['operations', 'marketing', 'salaries', 'commissions', 'vendor', 'refunds', 'misc'],
    },
    description: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', default: null }, // optional link, e.g. vendor cost for a specific trip
    vendor: { type: String, trim: true },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    attachmentUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

expenseSchema.index({ date: -1 });

export default mongoose.model('Expense', expenseSchema);
