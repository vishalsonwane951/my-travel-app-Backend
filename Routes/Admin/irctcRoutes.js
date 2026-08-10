import express from 'express';
import { protect } from '../../Middlewares/authMiddleware.js';
import { authorize } from '../../Middlewares/authorize.js';
import { listSearchLogs, getSearchStats } from '../../Controllers/Admin/irctcOversightController.js';

const router = express.Router();
router.use(protect, authorize('superadmin', 'operations', 'support'));

router.get('/logs', listSearchLogs);
router.get('/stats', getSearchStats);

export default router;
