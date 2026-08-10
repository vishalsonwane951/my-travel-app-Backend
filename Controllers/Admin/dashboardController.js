import asyncHandler from 'express-async-handler';
import Booking from '../../Models/Booking.js';
import Inquiry from '../../Models/InquiryModel.js';
import Payment from '../../Models/Payment.js';
import Package from '../../Models/PackagesModel.js';
import User from '../../Models/UserModel.js';

// GET /api/admin/dashboard/kpis
export const getKpis = asyncHandler(async (req, res) => {
  const [totalBookings, confirmedBookings, totalCustomers, revenueAgg, pendingEnquiries] =
    await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'confirmed' }),
      User.countDocuments({ role: 'customer' }),
      Payment.aggregate([
        { $match: { status: 'success', type: { $ne: 'refund' } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Booking.countDocuments({ status: 'pending' }),
    ]);

  const totalRevenue = revenueAgg[0]?.total || 0;
  const conversionRate = totalBookings ? +((confirmedBookings / totalBookings) * 100).toFixed(1) : 0;

  res.json({
    success: true,
    kpis: {
      totalRevenue,
      totalBookings,
      confirmedBookings,
      pendingEnquiries,
      totalCustomers,
      conversionRate,
    },
  });
});

// GET /api/admin/dashboard/trend?months=6
export const getRevenueBookingTrend = asyncHandler(async (req, res) => {
  const months = Math.min(parseInt(req.query.months) || 6, 24);
  const since = new Date();
  since.setMonth(since.getMonth() - (months - 1));
  since.setDate(1);
  since.setHours(0, 0, 0, 0);

  const [bookingTrend, revenueTrend] = await Promise.all([
    Booking.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: { y: { $year: '$createdAt' }, m: { $month: '$createdAt' } },
          bookings: { $sum: 1 },
        },
      },
      { $sort: { '_id.y': 1, '_id.m': 1 } },
    ]),
    Payment.aggregate([
      { $match: { createdAt: { $gte: since }, status: 'success', type: { $ne: 'refund' } } },
      {
        $group: {
          _id: { y: { $year: '$createdAt' }, m: { $month: '$createdAt' } },
          revenue: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.y': 1, '_id.m': 1 } },
    ]),
  ]);

  // Merge into one array of { label, bookings, revenue } across the requested window
  const labels = [];
  const cursor = new Date(since);
  for (let i = 0; i < months; i++) {
    labels.push({ y: cursor.getFullYear(), m: cursor.getMonth() + 1 });
    cursor.setMonth(cursor.getMonth() + 1);
  }
  const monthName = (m) =>
    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m - 1];

  const merged = labels.map(({ y, m }) => {
    const b = bookingTrend.find((x) => x._id.y === y && x._id.m === m);
    const r = revenueTrend.find((x) => x._id.y === y && x._id.m === m);
    return {
      label: `${monthName(m)} ${y}`,
      bookings: b?.bookings || 0,
      revenue: r?.revenue || 0,
    };
  });

  res.json({ success: true, trend: merged });
});

// GET /api/admin/dashboard/top-destinations
export const getTopDestinations = asyncHandler(async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 5, 20);
  const top = await Booking.aggregate([
    { $group: { _id: '$destination', bookings: { $sum: 1 } } },
    { $sort: { bookings: -1 } },
    { $limit: limit },
  ]);
  res.json({ success: true, topDestinations: top.map((t) => ({ destination: t._id, bookings: t.bookings })) });
});

// GET /api/admin/dashboard/funnel
// enquiry -> contacted -> confirmed -> completed
export const getConversionFunnel = asyncHandler(async (req, res) => {
  const [enquiryCount, contactedCount, confirmedCount, completedCount, inquiryNew, inquiryContacted] =
    await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: { $in: ['responded', 'confirmed', 'closed'] } }),
      Booking.countDocuments({ status: 'confirmed' }),
      Booking.countDocuments({ status: 'closed' }),
      Inquiry.countDocuments({ status: 'new' }),
      Inquiry.countDocuments({ status: 'contacted' }),
    ]);

  res.json({
    success: true,
    funnel: [
      { stage: 'Enquiry', count: enquiryCount + inquiryNew + inquiryContacted },
      { stage: 'Contacted', count: contactedCount + inquiryContacted },
      { stage: 'Confirmed', count: confirmedCount },
      { stage: 'Completed', count: completedCount },
    ],
  });
});

// GET /api/admin/dashboard/overview — one call for the whole dashboard page
export const getOverview = asyncHandler(async (req, res) => {
  const [kpisRes, trendRes, topDestRes, funnelRes, activePackages] = await Promise.all([
    Booking.countDocuments(),
    Payment.aggregate([
      { $match: { status: 'success', type: { $ne: 'refund' } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Booking.aggregate([
      { $group: { _id: '$destination', bookings: { $sum: 1 } } },
      { $sort: { bookings: -1 } },
      { $limit: 5 },
    ]),
    Booking.countDocuments({ status: 'confirmed' }),
    Package.countDocuments({ active: true }),
  ]);

  res.json({
    success: true,
    overview: {
      totalBookings: kpisRes,
      totalRevenue: trendRes[0]?.total || 0,
      confirmedBookings: funnelRes,
      activePackages,
      topDestinations: topDestRes.map((t) => ({ destination: t._id, bookings: t.bookings })),
    },
  });
});
