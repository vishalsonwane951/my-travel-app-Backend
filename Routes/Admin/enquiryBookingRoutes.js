import express from 'express';
import { protect } from '../../Middlewares/authMiddleware.js';
import { authorize } from '../../Middlewares/authorize.js';
import {
  getUnifiedInbox, assignAgent, updateInboxStatus, addNote, bulkAction,
} from '../../Controllers/Admin/enquiryBookingController.js';

const router = express.Router();

// Operations and sales run the inbox day-to-day; superadmin always has access via authorize().
router.use(protect, authorize('superadmin', 'operations', 'sales'));

router.get('/', getUnifiedInbox);
router.post('/bulk', bulkAction);
router.put('/:source/:id/assign', assignAgent);
router.put('/:source/:id/status', updateInboxStatus);
router.post('/:source/:id/notes', addNote);

export default router;
