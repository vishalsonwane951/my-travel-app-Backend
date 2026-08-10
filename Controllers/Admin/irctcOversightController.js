import asyncHandler from 'express-async-handler';
import IrctcSearchLog from '../../Models/IrctcSearchLog.js';

// GET /api/admin/irctc/logs
export const listSearchLogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 30, success } = req.query;
  const filter = {};
  if (success !== undefined) filter.success = success === 'true';
  const [logs, total] = await Promise.all([
    IrctcSearchLog.find(filter).populate('user', 'name email').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)),
    IrctcSearchLog.countDocuments(filter),
  ]);
  res.json({ success: true, logs, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// GET /api/admin/irctc/stats
export const getSearchStats = asyncHandler(async (req, res) => {
  const [totalSearches, failedSearches, topRoutes] = await Promise.all([
    IrctcSearchLog.countDocuments(),
    IrctcSearchLog.countDocuments({ success: false }),
    IrctcSearchLog.aggregate([
      { $group: { _id: { from: '$fromStationCode', to: '$toStationCode' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
  ]);
  res.json({
    success: true,
    stats: {
      totalSearches,
      failedSearches,
      successRate: totalSearches ? +(((totalSearches - failedSearches) / totalSearches) * 100).toFixed(1) : 100,
      topRoutes: topRoutes.map((r) => ({ from: r._id.from, to: r._id.to, count: r.count })),
    },
  });
});
