import express from 'express';
import { protect, admin } from '../Middlewares/authMiddleware.js';
import { uploaders } from '../utils/cloudinary.js';
import  { getPackageCards, getByDestination, getAllPackages, createByDestination,
    createPackage, updatePackage, uploadGallery, deletePackage, getPackageByTypeOrId, getNewestPackages, removeGalleryImage,
} from '../Controllers/PackagesController.js';
import  MaharashtraCard  from '../Models/MaharashtraCategoryModel.js';

const router = express.Router();
const mw = uploaders.packages;

// ── Card/type queries (public) ────────────────────────────────
router.get('/cards',getPackageCards);
router.get('/newest',getNewestPackages);
router.get('/:type/:destination',getByDestination);
router.get('/:typeOrId',getPackageByTypeOrId); // resolves to getPackageById if typeOrId is a Mongo ObjectId, else getPackageByType
router.get('/',getAllPackages);


// ── Destination bulk insert (admin) ──────────────────────────
// Matches existing pattern: POST /packages/destination/:dest with array body
router.post('/destination/:dest', protect, admin,createByDestination);

// ── CRUD (admin) ──────────────────────────────────────────────
router.post('/', protect, admin, mw.single('images'),createPackage);
router.put('/:id', protect, admin, mw.single('images'),updatePackage);
router.delete('/:id', protect, admin, deletePackage);
router.post('/:id/gallery', protect, admin, mw.array('gallery', 10), uploadGallery);
router.delete('/:id/gallery', protect, admin, removeGalleryImage);

export default router;
