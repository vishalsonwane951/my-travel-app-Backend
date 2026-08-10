import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema(
  {
    // Enforced singleton via a fixed key
    key: { type: String, default: 'site_settings', unique: true },

    siteName: { type: String, default: 'Desivdesi' },
    contactEmail: { type: String, trim: true },
    contactPhone: { type: String, trim: true },
    address: { type: String, trim: true },
    socialLinks: {
      facebook: { type: String, trim: true, default: '' },
      instagram: { type: String, trim: true, default: '' },
      twitter: { type: String, trim: true, default: '' },
      youtube: { type: String, trim: true, default: '' },
    },
    gstPercent: { type: Number, default: 5 },
    maintenanceMode: { type: Boolean, default: false },
    bookingPolicy: { type: String, trim: true, default: '' },
    cancellationPolicy: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('SiteSettings', siteSettingsSchema);
