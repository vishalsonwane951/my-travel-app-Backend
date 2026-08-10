import express from 'express';
import { protect } from '../../Middlewares/authMiddleware.js';
import { authorize } from '../../Middlewares/authorize.js';
import { uploaders } from '../../utils/cloudinary.js';
import {
  listHotels, getHotel, createHotel, updateHotel, deleteHotel, toggleHotelActive,
} from '../../Controllers/Admin/hotelController.js';

const router = express.Router();
router.use(protect, authorize('superadmin', 'operations'));

router.get('/', listHotels);
router.get('/:id', getHotel);
router.post('/', uploaders.hotels.array('images', 8), createHotel);
router.put('/:id', uploaders.hotels.array('images', 8), updateHotel);
router.delete('/:id', deleteHotel);
router.put('/:id/toggle-active', toggleHotelActive);

export default router;
