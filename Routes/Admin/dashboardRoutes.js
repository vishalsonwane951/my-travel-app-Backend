import express from 'express';
import { protect } from '../../Middlewares/authMiddleware.js';
import { authorize } from '../../Middlewares/authorize.js';
import {
  getKpis, getRevenueBookingTrend, getTopDestinations, getConversionFunnel, getOverview,
} from '../../Controllers/Admin/dashboardController.js';

const router = express.Router();

// Dashboard is read-only KPI data — visible to all staff roles.
const anyStaff = authorize('superadmin', 'operations', 'sales', 'finance', 'content', 'support');

router.get('/overview', protect, anyStaff, getOverview);
router.get('/kpis', protect, anyStaff, getKpis);
router.get('/trend', protect, anyStaff, getRevenueBookingTrend);
router.get('/top-destinations', protect, anyStaff, getTopDestinations);
router.get('/funnel', protect, anyStaff, getConversionFunnel);

export default router;
