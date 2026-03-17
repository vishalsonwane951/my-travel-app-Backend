import express from 'express';
import { protect, admin } from '../Middlewares/authMiddleware.js';
import { uploaders } from '../utils/cloudinary.js';
import  { getPackageCards, getPackageByType, getByDestination,getPackageById, getAllPackages, createByDestination,
    createPackage, updatePackage, uploadGallery,deletePackage
} from '../Controllers/PackagesController.js';

const router = express.Router();
const mw = uploaders.packages;

// ── Card/type queries (public) ────────────────────────────────
router.get('/cards',getPackageCards);
router.get('/:type',getPackageByType);
router.get('/:type/:destination',getByDestination);
router.get('/:id',getPackageById);
router.get('/',getAllPackages);

// ── Destination bulk insert (admin) ──────────────────────────
// Matches existing pattern: POST /packages/destination/:dest with array body
router.post('/destination/:dest', protect, admin,createByDestination);

// ── CRUD (admin) ──────────────────────────────────────────────
router.post('/', protect, admin, mw.single('images'),createPackage);
router.put('/:id', protect, admin, mw.single('images'),updatePackage);
router.delete('/:id', protect, admin, deletePackage);
router.post('/:id/gallery', protect, admin, mw.array('gallery', 10), uploadGallery);

export default router;
