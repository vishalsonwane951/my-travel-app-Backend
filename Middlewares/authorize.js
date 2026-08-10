// Middlewares/authorize.js
//
// Role-based access control for the Admin Panel. Use after `protect` so
// req.user is already populated.
//
//   router.get('/dashboard', protect, authorize('superadmin', 'operations'), ctrl.getDashboard)
//
// 'superadmin' always passes, regardless of which roles are listed, so a
// superadmin never gets locked out of a module.
export const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authorized, please log in.' });
  }

  if (req.user.active === false) {
    return res.status(403).json({ success: false, message: 'This staff account has been deactivated.' });
  }

  if (req.user.role === 'superadmin') return next();

  if (roles.length && !roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: `Access denied. This module requires one of these roles: ${roles.join(', ')}.`,
    });
  }

  next();
};

// Any authenticated staff member (any STAFF_ROLE) — used for shared admin-only
// resources that aren't gated to a specific department.
export const requireStaff = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authorized, please log in.' });
  }
  if (req.user.active === false) {
    return res.status(403).json({ success: false, message: 'This staff account has been deactivated.' });
  }
  const staffRoles = ['superadmin', 'operations', 'sales', 'finance', 'content', 'support'];
  if (!staffRoles.includes(req.user.role) && !req.user.isAdmin) {
    return res.status(403).json({ success: false, message: 'Admin access only.' });
  }
  next();
};

export default authorize;
