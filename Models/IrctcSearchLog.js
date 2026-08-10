import mongoose from 'mongoose';

const irctcSearchLogSchema = new mongoose.Schema(
  {
    fromStationCode: { type: String, trim: true, uppercase: true },
    toStationCode: { type: String, trim: true, uppercase: true },
    hours: { type: Number },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    success: { type: Boolean, default: true },
    errorMessage: { type: String, trim: true },
  },
  { timestamps: true }
);

irctcSearchLogSchema.index({ createdAt: -1 });

export default mongoose.model('IrctcSearchLog', irctcSearchLogSchema);
