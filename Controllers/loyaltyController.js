import asyncHandler from 'express-async-handler';
import User from '../Models/UserModel.js';
import WalletTransaction from '../Models/WalletTransaction.js';
import Booking from '../Models/Booking.js';

const TIER_BENEFITS = {
  bronze: { minPoints: 0, perks: ['Standard support'] },
  silver: { minPoints: 500, perks: ['Standard support', 'Priority email response'] },
  gold: { minPoints: 2000, perks: ['Priority support', '1 free add-on per trip', 'Early access to deals'] },
  platinum: { minPoints: 5000, perks: ['Dedicated concierge', 'Free upgrades where available', 'Early access to deals'] },
};

// GET /api/loyalty/me
export const getMyLoyalty = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const transactions = await WalletTransaction.find({ user: user._id }).sort({ createdAt: -1 }).limit(30);
  const referredCount = await User.countDocuments({ referredBy: user._id });

  res.json({
    success: true,
    loyalty: {
      points: user.loyaltyPoints,
      tier: user.loyaltyTier,
      walletBalance: user.walletBalance,
      referralCode: user.referralCode,
      referredCount,
      benefits: TIER_BENEFITS[user.loyaltyTier],
      nextTier: Object.entries(TIER_BENEFITS).find(([, v]) => v.minPoints > user.loyaltyPoints)?.[0] || null,
    },
    transactions,
  });
});

// GET /api/loyalty/referral-summary — shows what referring has earned this user
export const getReferralSummary = asyncHandler(async (req, res) => {
  const referredUsers = await User.find({ referredBy: req.user._id }).select('name email createdAt');
  const rewards = await WalletTransaction.find({ user: req.user._id, type: 'referral_reward' });
  const totalEarned = rewards.reduce((s, r) => s + r.amount, 0);
  res.json({ success: true, referredUsers, totalEarned, rewardCount: rewards.length });
});
