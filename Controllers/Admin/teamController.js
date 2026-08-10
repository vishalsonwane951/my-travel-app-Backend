import asyncHandler from 'express-async-handler';
import User from '../../Models/UserModel.js';

const STAFF_ROLES = ['superadmin', 'operations', 'sales', 'finance', 'content', 'support'];

// GET /api/admin/team
export const listStaff = asyncHandler(async (req, res) => {
  const staff = await User.find({ role: { $in: STAFF_ROLES } }).sort({ createdAt: -1 });
  res.json({ success: true, staff });
});

// POST /api/admin/team  — create a staff account
export const createStaff = asyncHandler(async (req, res) => {
  const { name, email, password, role, permissions } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ success: false, message: 'name, email, password and role are required.' });
  }
  if (!STAFF_ROLES.includes(role)) {
    return res.status(400).json({ success: false, message: `role must be one of: ${STAFF_ROLES.join(', ')}` });
  }
  if (await User.findOne({ email: email.toLowerCase() })) {
    return res.status(409).json({ success: false, message: 'Email already registered.' });
  }

  const staff = await User.create({ name, email, password, role, permissions: permissions || [] });
  await req.audit?.({ action: 'create', module: 'team', targetId: staff._id, after: { name, email, role } });

  res.status(201).json({ success: true, message: 'Staff account created.', staff });
});

// PUT /api/admin/team/:id  — update role/permissions/active state
export const updateStaff = asyncHandler(async (req, res) => {
  const staff = await User.findById(req.params.id);
  if (!staff || !STAFF_ROLES.includes(staff.role)) {
    return res.status(404).json({ success: false, message: 'Staff account not found.' });
  }

  const before = { role: staff.role, permissions: staff.permissions, active: staff.active };
  const { name, role, permissions, active } = req.body;

  if (name !== undefined) staff.name = name;
  if (role !== undefined) {
    if (!STAFF_ROLES.includes(role)) {
      return res.status(400).json({ success: false, message: `role must be one of: ${STAFF_ROLES.join(', ')}` });
    }
    staff.role = role;
  }
  if (permissions !== undefined) staff.permissions = permissions;
  if (active !== undefined) staff.active = active;

  await staff.save();
  await req.audit?.({
    action: 'update',
    module: 'team',
    targetId: staff._id,
    before,
    after: { role: staff.role, permissions: staff.permissions, active: staff.active },
  });

  res.json({ success: true, message: 'Staff account updated.', staff });
});

// DELETE /api/admin/team/:id — remove staff access (demote back to customer rather than hard-delete the user)
export const removeStaff = asyncHandler(async (req, res) => {
  const staff = await User.findById(req.params.id);
  if (!staff || !STAFF_ROLES.includes(staff.role)) {
    return res.status(404).json({ success: false, message: 'Staff account not found.' });
  }
  staff.role = 'customer';
  staff.permissions = [];
  staff.active = true;
  await staff.save();

  await req.audit?.({ action: 'delete', module: 'team', targetId: staff._id });
  res.json({ success: true, message: 'Staff access removed.' });
});

// PUT /api/admin/team/:id/session — force-disable a session (deactivate immediately)
export const revokeSession = asyncHandler(async (req, res) => {
  const staff = await User.findById(req.params.id);
  if (!staff || !STAFF_ROLES.includes(staff.role)) {
    return res.status(404).json({ success: false, message: 'Staff account not found.' });
  }
  staff.active = false;
  await staff.save();
  await req.audit?.({ action: 'session_revoke', module: 'team', targetId: staff._id });
  res.json({ success: true, message: 'Session access revoked — this account can no longer log in.' });
});

export const ROLES = STAFF_ROLES;
