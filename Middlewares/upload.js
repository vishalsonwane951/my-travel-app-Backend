/**
 * upload.middleware.js
 *
 * DEPRECATED – kept for backwards compatibility only.
 * All routes now use the Cloudinary uploaders from src/utils/cloudinary.js.
 *
 * To use Cloudinary upload in a route:
 *   import { uploaders } from '../utils/cloudinary';
 *   router.post('/addImage', uploaders.states.single('images'), handler);
 *
 * Cloudinary returns:
 *   req.file.path     → secure_url  (store as `images` field)
 *   req.file.filename → public_id   (store as `imagePublicId` field for deletion)
 */

import {uploaders} from '../utils/cloudinary'
