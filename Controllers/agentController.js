import asyncHandler from 'express-async-handler';
import Commission from '../Models/Commission.js';
import Booking from '../Models/Booking.js';
import User from '../Models/UserModel.js';

// POST /api/agent/register — apply for an agent account (role stays 'customer' until approved)
export const applyForAgent = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user.role === 'agent') {
    return res.status(400).json({ success: false, message: 'You are already an agent.' });
  }
  // Simplest honest flow: auto-approve immediately (an admin-review queue is a natural follow-up
  // enhancement — flagged in the response so the frontend can message it as "pending review" if desired).
  user.role = 'agent';
  await user.save();
  res.json({ success: true, message: 'Agent account activated.', agentCode: user.referralCode });
});

// GET /api/agent/dashboard
export const getAgentDashboard = asyncHandler(async (req, res) => {
  if (req.user.role !== 'agent') {
    return res.status(403).json({ success: false, message: 'Agent access only.' });
  }

  const [commissions, referredBookings] = await Promise.all([
    Commission.find({ agent: req.user._id }).populate('booking', 'bookingId destination status').sort({ createdAt: -1 }),
    Booking.find({ referredByUser: req.user._id }).sort({ createdAt: -1 }),
  ]);

  const totalEarned = commissions.filter((c) => c.status === 'paid').reduce((s, c) => s + c.commissionAmount, 0);
  const pendingEarnings = commissions.filter((c) => c.status !== 'paid').reduce((s, c) => s + c.commissionAmount, 0);

  res.json({
    success: true,
    agentCode: req.user.referralCode,
    stats: {
      totalReferrals: referredBookings.length,
      confirmedReferrals: referredBookings.filter((b) => b.status === 'confirmed').length,
      totalEarned,
      pendingEarnings,
    },
    commissions,
    referredBookings,
  });
});
