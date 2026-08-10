// utils/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// ── Configure Cloudinary ─────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Factory: create a multer uploader for any folder ─────────
function createUploader(folder, transformation = []) {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: transformation.length
        ? transformation
        : [{ width: 900, height: 600, crop: 'fill', quality: 'auto', fetch_format: 'auto' }],
    },
  });
  return multer({ storage });
}

// ── Uploaders — add a new entry here for each section ────────
export const uploaders = {
  international: createUploader('international-tours'),
  domesticStates: createUploader('domestic-states'),
  domesticStates2: createUploader('domestic-states-2'),
  maharashtra: createUploader('maharashtra'),
  packages: createUploader('packages'),
  avatars: createUploader('avatars'),
  tourCards: createUploader('tourCards'),
  hotels: createUploader('hotels'),
  blog: createUploader('blog'),
  reviews: createUploader('reviews'),

};

// ── Delete image by public_id (e.g. "international-tours/abc123") ───────────
export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error('Cloudinary delete error:', err.message);
  }
};

// ── Export cloudinary instance ───────────────────────────────
export { cloudinary };// utils/cloudinary.js
