import express from 'express';
import { protect, admin } from '../../Middlewares/authMiddleware.js';
import { authorize } from '../../Middlewares/authorize.js';
import { uploaders } from '../../utils/cloudinary.js';
import {
  listAllPackagesForCms, toggleActive, toggleFeatured, updateItinerary, bulkImportPackages,
} from '../../Controllers/Admin/packageCmsController.js';
import {
  createPackage, updatePackage, deletePackage, uploadGallery, removeGalleryImage,
} from '../../Controllers/PackagesController.js';

const router = express.Router();
const mw = uploaders.packages;

router.use(protect, authorize('superadmin', 'content', 'operations'));

// Full CRUD (thin wrapper around the existing public PackagesController so
// there's exactly one implementation of package create/update/delete logic)
router.get('/', listAllPackagesForCms);
router.post('/', mw.single('images'), createPackage);
router.put('/:id', mw.single('images'), updatePackage);
router.delete('/:id', deletePackage);
router.post('/:id/gallery', mw.array('gallery', 10), uploadGallery);
router.delete('/:id/gallery', removeGalleryImage);

// CMS-specific extras
router.put('/:id/toggle-active', toggleActive);
router.put('/:id/toggle-featured', toggleFeatured);
router.put('/:id/itinerary', updateItinerary);
router.post('/bulk-import', bulkImportPackages);

export default router;
