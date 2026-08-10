import express from 'express';
import { auditLogger } from '../../Middlewares/auditLogger.js';

import authRoutes from './authRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import teamRoutes from './teamRoutes.js';
import enquiryBookingRoutes from './enquiryBookingRoutes.js';
import financeRoutes from './financeRoutes.js';
import packagesRoutes from './packagesRoutes.js';
import hotelRoutes from './hotelRoutes.js';
import irctcRoutes from './irctcRoutes.js';
import moderationRoutes from './moderationRoutes.js';
import customerRoutes from './customerRoutes.js';
import marketingRoutes from './marketingRoutes.js';
import reportsRoutes from './reportsRoutes.js';
import blogRoutes from './blogRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import supportRoutes from './supportRoutes.js';
import settingsRoutes from './settingsRoutes.js';
import auditLogRoutes from './auditLogRoutes.js';
import aiTripRoutes from './aiTripRoutes.js';
import commerceRoutes from './commerceRoutes.js';

const router = express.Router();

// Attaches req.audit(...) for every admin request so mutating controllers
// can log to AuditLog without each route wiring it up individually.
router.use(auditLogger);

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/team', teamRoutes);
router.use('/enquiries', enquiryBookingRoutes);
router.use('/finance', financeRoutes);
router.use('/packages', packagesRoutes);
router.use('/hotels', hotelRoutes);
router.use('/irctc', irctcRoutes);
router.use('/moderation', moderationRoutes);
router.use('/customers', customerRoutes);
router.use('/marketing', marketingRoutes);
router.use('/reports', reportsRoutes);
router.use('/blog', blogRoutes);
router.use('/notifications', notificationRoutes);
router.use('/support', supportRoutes);
router.use('/settings', settingsRoutes);
router.use('/audit-log', auditLogRoutes);
router.use('/ai-trips', aiTripRoutes);
router.use('/commerce', commerceRoutes);

// Module 7 (Domestic/State Content) is served by the existing, already-secured
// /api/maharashtra-cards endpoints (Controllers/MaharashtraController.js) —
// the admin frontend calls that API directly rather than duplicating it here.

export default router;
