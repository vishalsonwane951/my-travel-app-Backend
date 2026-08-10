import User from '../Models/UserModel.js';
import WalletTransaction from '../Models/WalletTransaction.js';

const TIER_THRESHOLDS = [
  { tier: 'platinum', minPoints: 5000 },
  { tier: 'gold', minPoints: 2000 },
  { tier: 'silver', minPoints: 500 },
  { tier: 'bronze', minPoints: 0 },
];

export function tierForPoints(points) {
  return TIER_THRESHOLDS.find((t) => points >= t.minPoints)?.tier || 'bronze';
}

// amount: positive to credit, negative to debit. Never lets balance go below 0.
export async function creditWallet(userId, amount, type, description, relatedBooking = null) {
  const user = await User.findById(userId);
  if (!user) return null;

  user.walletBalance = Math.max(0, +(user.walletBalance + amount).toFixed(2));
  await user.save();

  await WalletTransaction.create({
    user: userId,
    type,
    amount,
    balanceAfter: user.walletBalance,
    relatedBooking,
    description,
  });

  return user.walletBalance;
}

// Awards loyalty points (1 point per ₹100 spent, by convention) and keeps tier in sync.
export async function awardLoyaltyPoints(userId, bookingAmount, relatedBooking = null) {
  const user = await User.findById(userId);
  if (!user) return null;

  const points = Math.floor(bookingAmount / 100);
  if (points <= 0) return { pointsEarned: 0, tier: user.loyaltyTier };

  user.loyaltyPoints += points;
  user.loyaltyTier = tierForPoints(user.loyaltyPoints);
  await user.save();

  await WalletTransaction.create({
    user: userId,
    type: 'loyalty_earn',
    amount: 0, // points aren't wallet currency; tracked on the ledger for visibility only
    balanceAfter: user.walletBalance,
    relatedBooking,
    description: `Earned ${points} loyalty points`,
  });

  return { pointsEarned: points, tier: user.loyaltyTier, totalPoints: user.loyaltyPoints };
}
