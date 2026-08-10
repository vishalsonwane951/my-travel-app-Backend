import express from 'express';
import { protect } from '../../Middlewares/authMiddleware.js';
import { authorize } from '../../Middlewares/authorize.js';
import {
  getCustomerGrowth, getPackagePerformance, getRepeatCustomerRate, getReportsSummary,
} from '../../Controllers/Admin/reportsController.js';

const router = express.Router();
router.use(protect, authorize('superadmin', 'operations', 'finance', 'sales'));

router.get('/summary', getReportsSummary);
router.get('/customer-growth', getCustomerGrowth);
router.get('/package-performance', getPackagePerformance);
router.get('/repeat-customers', getRepeatCustomerRate);

export default router;
