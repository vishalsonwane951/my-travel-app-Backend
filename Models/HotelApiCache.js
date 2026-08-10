import mongoose from 'mongoose';

// One shared collection for all three cached Xeni endpoints, distinguished by
// `type`. cacheKey is a deterministic hash of the normalized request
// parameters (see utils/hotelCacheKey.js) so identical searches — regardless
// of key ordering — always hit the same document.
const hotelApiCacheSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['autocomplete', 'properties', 'propertyDetails'], required: true },
    cacheKey: { type: String, required: true },
    // Human-readable copy of the params that produced this entry — purely
    // for debugging/admin visibility, not used for lookups.
    params: { type: mongoose.Schema.Types.Mixed },
    // The exact raw response Xeni returned, stored as-is so the existing
    // frontend normalize*() functions keep working unchanged on cache hits.
    response: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

hotelApiCacheSchema.index({ type: 1, cacheKey: 1 }, { unique: true });
// 30-day TTL, as requested — a document is auto-deleted by MongoDB 30 days
// after createdAt, at which point the next matching search will refetch from
// Xeni and re-cache automatically.
hotelApiCacheSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

export default mongoose.model('HotelApiCache', hotelApiCacheSchema);
