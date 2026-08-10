import mongoose from 'mongoose';

const replySchema = new mongoose.Schema(
  {
    from: { type: String, enum: ['customer', 'staff'], required: true },
    authorName: { type: String, trim: true },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const supportTicketSchema = new mongoose.Schema(
  {
    ticketNumber: { type: String, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    category: { type: String, enum: ['booking', 'payment', 'general', 'complaint', 'technical'], default: 'general' },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    status: { type: String, enum: ['open', 'in_progress', 'resolved', 'closed'], default: 'open' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    replies: [replySchema],
  },
  { timestamps: true }
);

supportTicketSchema.pre('save', function (next) {
  if (!this.ticketNumber) {
    const rand = Math.random().toString(36).substr(2, 6).toUpperCase();
    this.ticketNumber = `TKT-${rand}`;
  }
  next();
});

supportTicketSchema.index({ createdAt: -1 });

export default mongoose.model('SupportTicket', supportTicketSchema);
