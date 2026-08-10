import express from 'express';
import { protect } from '../../Middlewares/authMiddleware.js';
import { authorize } from '../../Middlewares/authorize.js';
import {
  listNotifications, createNotification, sendNotification, deleteNotification,
} from '../../Controllers/Admin/notificationController.js';

const router = express.Router();
router.use(protect, authorize('superadmin', 'sales', 'support'));

router.get('/', listNotifications);
router.post('/', createNotification);
router.post('/:id/send', sendNotification);
router.delete('/:id', deleteNotification);

export default router;
