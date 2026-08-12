import asyncHandler from 'express-async-handler';
import Booking from '../Models/Booking.js';
import { sendBookingEmails, sendStatusUpdateEmail } from '../utils/email.js'
import { applyCouponToAmount } from '../Services/CouponServices.js'

// POST /bookings/create  (auth)
export const createBooking = asyncHandler(async (req, res) => {
  const {
    packageName, destination, fullName, email, mobile,
    startDate, endDate, duration, adults, children, seniors,
    budget, Message, enquiryType, notes, packageId,
    alternateMobile, accommodationPreference, travelMode, paymentMethod,
  } = req.body;

  if (!fullName || !email || !mobile || !destination || !adults)
    return res.status(400).json({ success: false, message: 'fullName, email, mobile, destination and adults are required' });

  const emailOk  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk)  return res.status(400).json({ success: false, message: 'Invalid email format' });

  const mobileOk = /^[+]?[0-9\s-]{10,15}$/.test(mobile);
  if (!mobileOk) return res.status(400).json({ success: false, message: 'Invalid mobile number' });

  let calcEnd = endDate;
  if (!calcEnd && startDate && duration) {
    calcEnd = new Date(startDate);
    calcEnd.setDate(calcEnd.getDate() + parseInt(duration));
  }

  const booking = await Booking.create({
    user      : req.user?._id || null,
    createdBy : req.user?._id || null,
    packageName: packageName || 'Custom Package',
    packageId : packageId || `PKG-${Math.random().toString(36).substr(2,8).toUpperCase()}`,
    destination, fullName, email, mobile,
    alternateMobile, accommodationPreference, travelMode, paymentMethod,
    startDate  : startDate ? new Date(startDate) : null,
    endDate    : calcEnd   ? new Date(calcEnd) : null,
    duration   : duration  ? parseInt(duration) : 1,
    adults     : parseInt(adults),
    children   : children ? parseInt(children) : 0,
    seniors    : seniors  ? parseInt(seniors)  : 0,
    budget     : budget   ? parseInt(budget)   : 0,
    Message    : Message  || 'NA',
    enquiryType: enquiryType || 'Package Enquiry',
    notes      : notes || '',
    status     : 'pending',
  });

  try { await sendBookingEmails(booking); } catch (e) { console.error('[Email]', e.message); }

  res.status(201).json({
    success: true,
    message: 'Booking enquiry submitted successfully',
    booking: {
      _id: booking._id, bookingId: booking.bookingId,
      fullName: booking.fullName, email: booking.email,
      destination: booking.destination, packageName: booking.packageName,
      status: booking.status, startDate: booking.startDate,
      duration: booking.duration, enquiryType: booking.enquiryType,
      createdAt: booking.createdAt,
    },
  });
});

// POST /bookings/package-inquiry  (public – no auth)
//
// Pages/ItineraryPage.jsx sends a NESTED payload — { customer: {...},
// package: {...}, duration: {...}, pricing: {...}, ... } — not flat
// top-level fields. This previously read req.body.fullName /
// req.body.destination / req.body.packageName directly, which were always
// undefined, so every submission failed with "fullName, email, mobile,
// destination, packageName required" regardless of what the user entered.
export const createPackageInquiry = asyncHandler(async (req, res) => {
  const { customer = {}, package: pkgInfo = {}, duration = {}, pricing = {}, travelDate, notes, couponCode } = req.body;

  const fullName    = customer.fullName;
  const email       = customer.email;
  const mobile      = customer.mobile;
  const destination = customer.destination || pkgInfo.locationTitle || pkgInfo.location;
  const packageName = pkgInfo.title;

  if (!fullName || !email || !mobile || !destination || !packageName)
    return res.status(400).json({ success: false, message: 'fullName, email, mobile, destination, packageName required' });

  const emailOk  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk)  return res.status(400).json({ success: false, message: 'Invalid email format' });

  const mobileOk = /^[+]?[0-9\s-]{10,15}$/.test(mobile);
  if (!mobileOk) return res.status(400).json({ success: false, message: 'Invalid mobile number' });

  const adults = parseInt(customer.adults || pricing.adults || pricing.travelers) || 1;
  const quotedPrice = Number(pricing.totalPrice) || (Number(pricing.pricePerPerson) || 0) * adults;

  // Coupon — always recomputed server-side from the coupon's own rules,
  // never trusting a client-supplied discount figure.
  const { discount: couponDiscount, coupon, message: couponMessage } =
    await applyCouponToAmount(couponCode, quotedPrice);
  if (couponCode && !coupon) {
    return res.status(400).json({ success: false, message: couponMessage || 'Invalid coupon code.' });
  }
  const finalAmount = +(quotedPrice - couponDiscount).toFixed(2);

  const booking = await Booking.create({
    user: customer.userId || null,
    packageName,
    packageId: pkgInfo.packageId || `PKG-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
    destination, fullName, email, mobile,
    startDate: travelDate ? new Date(travelDate) : null,
    duration: duration.nights || duration.days || 1,
    adults,
    quotedPrice,
    couponCode: coupon ? coupon.code : undefined,
    couponDiscount,
    finalAmount,
    notes: notes || 'Package inquiry (no user account required)',
    Message: `Enquiry via ItineraryPage${duration.label ? ` — ${duration.label}` : ''}`,
    enquiryType: 'Package Enquiry',
    status: 'pending',
  });

  try { await sendBookingEmails(booking); } catch (e) { console.error('[Email]', e.message); }

  res.status(201).json({
    success: true, message: 'Package inquiry submitted successfully',
    bookingId: booking.bookingId, inquiryId: booking._id,
    couponApplied: coupon ? { code: coupon.code, discount: couponDiscount } : null,
    finalAmount,
  });
});

// GET /bookings/user/:userId  (auth)
export const getUserBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.params.userId }).sort({ createdAt: -1 });
  res.json({ success: true, count: bookings.length, bookings });
});

// GET /bookings/mine  (auth – current user)
export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, count: bookings.length, bookings });
});

// GET /bookings/confirmed-user  (auth)
export const getUserConfirmedBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id, status: 'confirmed' }).sort({ createdAt: -1 });
  res.json({ success: true, count: bookings.length, bookings });
});

// GET /bookings  (admin)
export const getAllBookings = asyncHandler(async (req, res) => {
  const { status, enquiryType, startDate, endDate, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status)      filter.status      = status;
  if (enquiryType) filter.enquiryType = enquiryType;
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate)   filter.createdAt.$lte = new Date(endDate);
  }
  const [bookings, total] = await Promise.all([
    Booking.find(filter).populate('user','name email').sort({ createdAt: -1 }).limit(+limit).skip((+page-1)*+limit),
    Booking.countDocuments(filter),
  ]);
  res.json({ success: true, total, page: +page, pages: Math.ceil(total/+limit), bookings });
});

// GET /bookings/confirmed  (admin)
export const getAllConfirmedBookings = asyncHandler(async (_req, res) => {
  const bookings = await Booking.find({ status: 'confirmed' })
    .lean()           // ← plain JS objects, no Mongoose overhead
    .strict(false);   // ← include docs with extra/unknown fields

  res.json({ success: true, count: bookings.length, bookings });
});

// GET /bookings/:id  (auth)
export const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('user','name email');
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
  const isOwner = booking.user?._id?.toString() === req.user._id.toString();
  if (!req.user.isAdmin && !isOwner)
    return res.status(403).json({ success: false, message: 'Not authorised' });
  res.json({ success: true, booking });
});

// PUT /bookings/update-status/:bookingId  (admin)
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status, notes, response } = req.body;
  const allowed = ['pending','confirmed','responded','closed','rejected'];
  if (!allowed.includes(status))
    return res.status(400).json({ success: false, message: `status must be: ${allowed.join(', ')}` });

  const booking = await Booking.findById(req.params.bookingId);
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

  booking.status   = status;
  if (response) booking.response = response;
  if (notes) booking.notes = booking.notes
    ? `${booking.notes}\n[${new Date().toLocaleString()}] → ${status}: ${notes}`
    : `[${new Date().toLocaleString()}] → ${status}: ${notes}`;

  const updated = await booking.save();
  try { await sendStatusUpdateEmail(updated); } catch (e) { console.error('[Email]', e.message); }
  res.json({ success: true, message: `Status updated to ${status}`, booking: updated });
});

// PUT /bookings/:id  (admin – full update)
export const updateBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
  res.json({ success: true, message: 'Booking updated', booking });
});

// DELETE /bookings/delete/:bookingId  (admin)
export const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findByIdAndDelete(req.params.bookingId || req.params.id);
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
  res.json({ success: true, message: 'Booking deleted successfully' });
});
