// utils/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

export const uploaders = {
  international: createUploader('international-tours'),
};

export { cloudinary };