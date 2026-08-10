import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../../Models/UserModel.js';

const STAFF_ROLES = ['superadmin', 'operations', 'sales', 'finance', 'content', 'support'];

const signAdminToken = (user) =>
  jwt.sign(
    { id: user._id, isAdmin: true, role: user.role, permissions: user.permissions },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );

// POST /api/admin/auth/login
export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !user.password) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }
  if (!STAFF_ROLES.includes(user.role)) {
    return res.status(403).json({ success: false, message: 'This account does not have admin access.' });
  }
  if (user.active === false) {
    return res.status(403).json({ success: false, message: 'This staff account has been deactivated.' });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  const token = signAdminToken(user);
  res.json({
    success: true,
    message: 'Login successful',
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
    },
  });
});

// GET /api/admin/auth/me
export const getAdminMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      permissions: req.user.permissions,
    },
  });
});
