import express from 'express';
import { adminLogin, getAdminMe } from '../../Controllers/Admin/adminAuthController.js';
import { protect } from '../../Middlewares/authMiddleware.js';
import { requireStaff } from '../../Middlewares/authorize.js';

const router = express.Router();

router.post('/login', adminLogin);
router.get('/me', protect, requireStaff, getAdminMe);

export default router;
