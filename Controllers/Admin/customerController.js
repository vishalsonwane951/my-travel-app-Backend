import asyncHandler from 'express-async-handler';
import User from '../../Models/UserModel.js';
import Booking from '../../Models/Booking.js';

// GET /api/admin/customers
export const listCustomers = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 20 } = req.query;
  const filter = { role: 'customer' };
  if (search) {
    const re = new RegExp(search, 'i');
    filter.$or = [{ name: re }, { email: re }, { mobile: re }];
  }
  const [customers, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)),
    User.countDocuments(filter),
  ]);
  res.json({ success: true, customers, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// GET /api/admin/customers/:id — profile + booking history
export const getCustomerProfile = asyncHandler(async (req, res) => {
  const customer = await User.findById(req.params.id);
  if (!customer || customer.role !== 'customer') {
    return res.status(404).json({ success: false, message: 'Customer not found.' });
  }
  const bookings = await Booking.find({ $or: [{ user: customer._id }, { email: customer.email }] }).sort({ createdAt: -1 });
  const totalSpent = bookings
    .filter((b) => b.status === 'confirmed')
    .reduce((sum, b) => sum + (b.quotedPrice || b.budget || 0), 0);

  res.json({ success: true, customer, bookings, stats: { totalBookings: bookings.length, totalSpent } });
});

// PUT /api/admin/customers/:id/block  — disable a customer account (reuses the 'active' field)
export const toggleCustomerBlock = asyncHandler(async (req, res) => {
  const customer = await User.findById(req.params.id);
  if (!customer || customer.role !== 'customer') {
    return res.status(404).json({ success: false, message: 'Customer not found.' });
  }
  customer.active = customer.active === false ? true : false;
  await customer.save();
  await req.audit?.({ action: customer.active ? 'unblock' : 'block', module: 'customers', targetId: customer._id });
  res.json({ success: true, message: customer.active ? 'Customer unblocked.' : 'Customer blocked.', customer });
});
