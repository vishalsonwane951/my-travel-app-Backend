import express from 'express';
import { validateCoupon, subscribeNewsletter, listActiveCouponsPublic } from '../Controllers/Admin/marketingController.js';
import { getPublishedPosts, getPublishedPostBySlug } from '../Controllers/Admin/blogController.js';
import { getPublicSettings } from '../Controllers/Admin/settingsController.js';

const router = express.Router();

// Marketing (public)
router.post('/coupons/validate', validateCoupon);
router.get('/coupons/active', listActiveCouponsPublic);
router.post('/newsletter/subscribe', subscribeNewsletter);

// Blog (public)
router.get('/blog', getPublishedPosts);
router.get('/blog/:slug', getPublishedPostBySlug);

// Settings (public)
router.get('/settings', getPublicSettings);

export default router;
