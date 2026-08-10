import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    channel: { type: String, enum: ['email', 'sms', 'in_app'], default: 'in_app' },
    audience: { type: String, enum: ['all_customers', 'specific_user', 'staff'], default: 'all_customers' },
    targetUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    status: { type: String, enum: ['draft', 'sent', 'failed'], default: 'draft' },
    sentAt: { type: Date },
    sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    recipientCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);
