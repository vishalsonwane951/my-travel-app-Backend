import express from 'express';
import { protect } from '../../Middlewares/authMiddleware.js';
import { authorize } from '../../Middlewares/authorize.js';
import { getSettings, updateSettings } from '../../Controllers/Admin/settingsController.js';

const router = express.Router();
router.use(protect, authorize('superadmin'));

router.get('/', getSettings);
router.put('/', updateSettings);

export default router;
