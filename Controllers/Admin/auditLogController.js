import asyncHandler from 'express-async-handler';
import AuditLog from '../../Models/AuditLog.js';

// GET /api/admin/audit-log?module=&actor=&page=&limit=
export const listAuditLogs = asyncHandler(async (req, res) => {
  const { module, actor, action, page = 1, limit = 40 } = req.query;
  const filter = {};
  if (module) filter.module = module;
  if (actor) filter.actor = actor;
  if (action) filter.action = action;

  const [logs, total] = await Promise.all([
    AuditLog.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)),
    AuditLog.countDocuments(filter),
  ]);
  res.json({ success: true, logs, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// GET /api/admin/audit-log/modules — distinct module list for the filter dropdown
export const listAuditModules = asyncHandler(async (req, res) => {
  const modules = await AuditLog.distinct('module');
  res.json({ success: true, modules });
});
