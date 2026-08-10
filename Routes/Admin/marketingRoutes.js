import express from 'express';
import { protect } from '../../Middlewares/authMiddleware.js';
import { authorize } from '../../Middlewares/authorize.js';
import {
  listCoupons, createCoupon, updateCoupon, deleteCoupon,
  listSubscribers, exportSubscribersCsv,
} from '../../Controllers/Admin/marketingController.js';

const router = express.Router();
router.use(protect, authorize('superadmin', 'sales', 'content'));

router.get('/coupons', listCoupons);
router.post('/coupons', createCoupon);
router.put('/coupons/:id', updateCoupon);
router.delete('/coupons/:id', deleteCoupon);

router.get('/newsletter/subscribers', listSubscribers);
router.get('/newsletter/export', exportSubscribersCsv);

export default router;
