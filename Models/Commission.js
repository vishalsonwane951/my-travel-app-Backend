import mongoose from 'mongoose';

const commissionSchema = new mongoose.Schema(
  {
    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    bookingAmount: { type: Number, required: true },
    commissionRate: { type: Number, required: true, default: 10 }, // %
    commissionAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'paid', 'rejected'],
      default: 'pending',
    },
    paidAt: { type: Date },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

commissionSchema.pre('save', function (next) {
  if (this.isModified('bookingAmount') || this.isModified('commissionRate')) {
    this.commissionAmount = +((this.bookingAmount * this.commissionRate) / 100).toFixed(2);
  }
  next();
});

export default mongoose.model('Commission', commissionSchema);
