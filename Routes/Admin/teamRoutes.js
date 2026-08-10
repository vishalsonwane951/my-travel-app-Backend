import express from 'express';
import { protect } from '../../Middlewares/authMiddleware.js';
import { authorize } from '../../Middlewares/authorize.js';
import {
  listStaff, createStaff, updateStaff, removeStaff, revokeSession,
} from '../../Controllers/Admin/teamController.js';

const router = express.Router();

// Only superadmin manages staff accounts/roles.
router.use(protect, authorize('superadmin'));

router.get('/', listStaff);
router.post('/', createStaff);
router.put('/:id', updateStaff);
router.delete('/:id', removeStaff);
router.put('/:id/session', revokeSession);

export default router;
