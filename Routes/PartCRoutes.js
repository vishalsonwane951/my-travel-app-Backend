import express from 'express';
import { protect, optionalAuth } from '../Middlewares/authMiddleware.js';
import { listActiveAddOns } from '../Controllers/Admin/addOnController.js';
import { purchaseGiftCard, checkGiftCard, getMyGiftCards } from '../Controllers/giftCardController.js';
import { getMyLoyalty, getReferralSummary } from '../Controllers/loyaltyController.js';
import { applyForAgent, getAgentDashboard } from '../Controllers/agentController.js';
import { getRecommendations } from '../Controllers/recommendationController.js';

const router = express.Router();

// Add-ons (public catalog)
router.get('/addons', listActiveAddOns);

// Gift cards
router.post('/gift-cards/purchase', protect, purchaseGiftCard);
router.post('/gift-cards/check', checkGiftCard);
router.get('/gift-cards/mine', protect, getMyGiftCards);

// Loyalty & referral
router.get('/loyalty/me', protect, getMyLoyalty);
router.get('/loyalty/referral-summary', protect, getReferralSummary);

// Agent portal
router.post('/agent/register', protect, applyForAgent);
router.get('/agent/dashboard', protect, getAgentDashboard);

// Recommendations
router.get('/recommendations', optionalAuth, getRecommendations);

export default router;
