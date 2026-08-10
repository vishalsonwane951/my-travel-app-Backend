import express from 'express';
import { protect } from '../../Middlewares/authMiddleware.js';
import { authorize } from '../../Middlewares/authorize.js';
import { listCustomers, getCustomerProfile, toggleCustomerBlock } from '../../Controllers/Admin/customerController.js';

const router = express.Router();
router.use(protect, authorize('superadmin', 'operations', 'sales', 'support'));

router.get('/', listCustomers);
router.get('/:id', getCustomerProfile);
router.put('/:id/block', authorize('superadmin', 'operations'), toggleCustomerBlock);

export default router;
