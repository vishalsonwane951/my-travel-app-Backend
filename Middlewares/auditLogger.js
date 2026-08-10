import AuditLog from '../Models/AuditLog.js';

// Fire-and-forget audit write. Never blocks or fails the actual request —
// audit logging is best-effort and must not take down a mutating admin action.
//
//   await recordAudit(req, { action: 'update', module: 'packages', targetId: pkg._id, before, after });
export async function recordAudit(req, { action, module, targetId, before, after }) {
  try {
    if (!req.user) return;
    await AuditLog.create({
      actor: req.user._id,
      actorName: req.user.name,
      actorRole: req.user.role || (req.user.isAdmin ? 'admin' : 'unknown'),
      action,
      module,
      targetId: targetId ? String(targetId) : undefined,
      before,
      after,
      ip: req.ip,
    });
  } catch (err) {
    console.error('[auditLogger] failed to record audit entry:', err.message);
  }
}

// Express middleware form: attaches req.audit(...) so any admin controller
// can log without importing recordAudit directly.
export function auditLogger(req, res, next) {
  req.audit = (details) => recordAudit(req, details);
  next();
}

export default auditLogger;
