import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Creates a multer instance backed by Cloudinary storage.
 * @param {string} folder - Cloudinary folder name
 */
function createCloudinaryUploader(folder) {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder,
      allowed_formats: ["jpg", "jpeg", "png", "gif", "webp", "avif"],
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    },
  });

  return multer({
    storage,
    limits: {
      fileSize: (Number(process.env.MAX_FILE_SIZE_MB) || 10) * 1024 * 1024,
    },
    fileFilter: (_req, file, cb) => {
      if (/jpeg|jpg|png|gif|webp|avif/i.test(file.mimetype)) {
        return cb(null, true);
      }
      cb(
        new multer.MulterError(
          "LIMIT_UNEXPECTED_FILE",
          "Only image files are allowed"
        )
      );
    },
  });
}

/**
 * Delete image from Cloudinary
 */
export async function deleteFromCloudinary(publicId) {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("[Cloudinary] delete error:", err.message);
  }
}

/**
 * Extract public_id from Cloudinary URL
 */
export function extractPublicId(url) {
  if (!url || !url.includes("cloudinary.com")) return null;

  const clean = url.split("?")[0];
  const match = clean.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);

  return match ? match[1] : null;
}

// Uploaders for different folders
export const uploaders = {
  animation: createCloudinaryUploader("desi-v-desi/animations"),
  states: createCloudinaryUploader("desi-v-desi/states"),
  states2: createCloudinaryUploader("desi-v-desi/states2"),
  international: createCloudinaryUploader("desi-v-desi/international"),
  international2: createCloudinaryUploader("desi-v-desi/international2"),
  tourCards: createCloudinaryUploader("desi-v-desi/tour-cards"),
  packages: createCloudinaryUploader("desi-v-desi/packages"),
  maharashtra: createCloudinaryUploader("desi-v-desi/maharashtra"),
  avatars: createCloudinaryUploader("desi-v-desi/avatars"),
};

export { cloudinary };