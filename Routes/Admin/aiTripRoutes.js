import express from 'express';
import { protect } from '../../Middlewares/authMiddleware.js';
import { authorize } from '../../Middlewares/authorize.js';
import {
  listItineraries, getItinerary, getAiTripStats, deleteItinerary,
} from '../../Controllers/Admin/aiTripConsoleController.js';

const router = express.Router();
router.use(protect, authorize('superadmin', 'operations', 'content'));

router.get('/', listItineraries);
router.get('/stats', getAiTripStats);
router.get('/:id', getItinerary);
router.delete('/:id', deleteItinerary);

export default router;
