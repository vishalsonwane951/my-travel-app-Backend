import asyncHandler from 'express-async-handler';
import Coupon from '../../Models/Coupon.js';
import NewsletterSubscriber from '../../Models/NewsletterSubscriber.js';

// ── Coupons ───────────────────────────────────────────────────────────────

export const listCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.json({ success: true, coupons });
});

export const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create({ ...req.body, code: req.body.code?.toUpperCase() });
  await req.audit?.({ action: 'create', module: 'marketing', targetId: coupon._id, after: coupon.toObject() });
  res.status(201).json({ success: true, coupon });
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found.' });
  await req.audit?.({ action: 'update', module: 'marketing', targetId: coupon._id });
  res.json({ success: true, coupon });
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id);
  await req.audit?.({ action: 'delete', module: 'marketing', targetId: req.params.id });
  res.json({ success: true, message: 'Coupon deleted.' });
});

// Public — currently-valid coupons, for homepage/offers display. Only
// exposes fields that are safe to show to anyone (code, description,
// discount, validity window) — never usedCount or Mongo _id-adjacent
// internals.
export const listActiveCouponsPublic = asyncHandler(async (req, res) => {
  const now = new Date();
  const coupons = await Coupon.find({
    active: true,
    validFrom: { $lte: now },
    validTill: { $gte: now },
    $or: [{ usageLimit: 0 }, { $expr: { $lt: ['$usedCount', '$usageLimit'] } }],
  })
    .select('code description discountType discountValue maxDiscount minBookingAmount validTill')
    .sort({ validTill: 1 });

  res.json({ success: true, coupons });
});

// Public — validate a coupon code at checkout
export const validateCoupon = asyncHandler(async (req, res) => {
  const { code, bookingAmount = 0 } = req.body;
  const coupon = await Coupon.findOne({ code: code?.toUpperCase() });
  if (!coupon || !coupon.isValidNow()) {
    return res.status(400).json({ success: false, message: 'Invalid or expired coupon code.' });
  }
  if (bookingAmount < coupon.minBookingAmount) {
    return res.status(400).json({ success: false, message: `Minimum booking amount for this coupon is ₹${coupon.minBookingAmount}.` });
  }
  let discount = coupon.discountType === 'percent' ? (bookingAmount * coupon.discountValue) / 100 : coupon.discountValue;
  if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  res.json({ success: true, discount: +discount.toFixed(2), coupon: { code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue } });
});

// ── Newsletter ────────────────────────────────────────────────────────────

// Public — used by the frontend NewsletterSubscribe widget
export const subscribeNewsletter = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'A valid email is required.' });
  }
  const existing = await NewsletterSubscriber.findOne({ email: email.toLowerCase() });
  if (existing) {
    if (!existing.subscribed) { existing.subscribed = true; await existing.save(); }
    return res.json({ success: true, message: 'Subscribed successfully.' });
  }
  await NewsletterSubscriber.create({ email });
  res.status(201).json({ success: true, message: 'Subscribed successfully.' });
});

export const listSubscribers = asyncHandler(async (req, res) => {
  const subscribers = await NewsletterSubscriber.find({ subscribed: true }).sort({ createdAt: -1 });
  res.json({ success: true, subscribers, total: subscribers.length });
});

export const exportSubscribersCsv = asyncHandler(async (req, res) => {
  const subscribers = await NewsletterSubscriber.find({ subscribed: true }).sort({ createdAt: -1 });
  const csv = ['email,subscribedAt', ...subscribers.map((s) => `${s.email},${s.createdAt.toISOString()}`)].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="newsletter_subscribers.csv"');
  res.send(csv);
});
