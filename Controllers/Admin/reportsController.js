import asyncHandler from 'express-async-handler';
import Booking from '../../Models/Booking.js';
import User from '../../Models/UserModel.js';
import Package from '../../Models/PackagesModel.js';
import Payment from '../../Models/Payment.js';

// GET /api/admin/reports/customer-growth?months=12
export const getCustomerGrowth = asyncHandler(async (req, res) => {
  const months = Math.min(parseInt(req.query.months) || 12, 24);
  const since = new Date();
  since.setMonth(since.getMonth() - (months - 1));
  since.setDate(1);

  const growth = await User.aggregate([
    { $match: { role: 'customer', createdAt: { $gte: since } } },
    { $group: { _id: { y: { $year: '$createdAt' }, m: { $month: '$createdAt' } }, newCustomers: { $sum: 1 } } },
    { $sort: { '_id.y': 1, '_id.m': 1 } },
  ]);

  res.json({ success: true, growth });
});

// GET /api/admin/reports/package-performance
export const getPackagePerformance = asyncHandler(async (req, res) => {
  const performance = await Booking.aggregate([
    { $match: { status: 'confirmed' } },
    { $group: { _id: '$packageName', bookings: { $sum: 1 }, revenue: { $sum: { $ifNull: ['$quotedPrice', '$budget'] } } } },
    { $sort: { bookings: -1 } },
    { $limit: 15 },
  ]);
  res.json({ success: true, performance });
});

// GET /api/admin/reports/repeat-customers
export const getRepeatCustomerRate = asyncHandler(async (req, res) => {
  const agg = await Booking.aggregate([
    { $match: { user: { $ne: null } } },
    { $group: { _id: '$user', count: { $sum: 1 } } },
  ]);
  const totalCustomersWithBookings = agg.length;
  const repeatCustomers = agg.filter((a) => a.count > 1).length;
  res.json({
    success: true,
    repeatCustomerRate: totalCustomersWithBookings
      ? +((repeatCustomers / totalCustomersWithBookings) * 100).toFixed(1)
      : 0,
    totalCustomersWithBookings,
    repeatCustomers,
  });
});

// GET /api/admin/reports/summary — one-call export-ready snapshot
export const getReportsSummary = asyncHandler(async (req, res) => {
  const [totalRevenue, totalBookings, totalCustomers, activePackages] = await Promise.all([
    Payment.aggregate([{ $match: { status: 'success', type: { $ne: 'refund' } } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    Booking.countDocuments(),
    User.countDocuments({ role: 'customer' }),
    Package.countDocuments({ active: true }),
  ]);
  res.json({
    success: true,
    summary: {
      totalRevenue: totalRevenue[0]?.total || 0,
      totalBookings,
      totalCustomers,
      activePackages,
    },
  });
});
