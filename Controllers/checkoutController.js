import asyncHandler from 'express-async-handler';
import Package from '../Models/PackagesModel.js';
import Booking from '../Models/Booking.js';
import AddOn from '../Models/AddOn.js';
import GiftCard from '../Models/GiftCard.js';
import User from '../Models/UserModel.js';
import { computeDynamicPrice } from '../utils/pricingEngine.js';
import { applyCouponToAmount } from '../Services/CouponServices.js';

// POST /api/checkout/quote
// Body: { packageId, travelDate, travelers, addOnIds: [] }
// Real-time, transparent price quote — no fabricated countdowns.
export const getQuote = asyncHandler(async (req, res) => {
  const { packageId, travelDate, travelers = 1, addOnIds = [] } = req.body;
  
  const pkg = await Package.findById(packageId);
  if (!pkg) return res.status(404).json({ success: false, message: 'Package not found.' });

  const dynamicPrice = computeDynamicPrice(pkg, { travelDate, travelers: Number(travelers) });

  let addOns = [];
  let addOnsTotal = 0;
  if (addOnIds.length) {
    const found = await AddOn.find({ _id: { $in: addOnIds }, active: true });
    addOns = found.map((a) => {
      const qty = a.priceUnit === 'per_person' ? Number(travelers) : 1;
      const lineTotal = a.price * qty;
      addOnsTotal += lineTotal;
      return { addOnId: a._id, name: a.name, price: a.price, quantity: qty, lineTotal };
    });
  }

  res.json({
    success: true,
    quote: {
      ...dynamicPrice,
      addOns,
      addOnsTotal: +addOnsTotal.toFixed(2),
      grandTotal: +(dynamicPrice.totalPrice + addOnsTotal).toFixed(2),
    },
  });
});

// POST /api/checkout/book
// Creates a real Booking (same model the admin panel manages) enriched with
// Part C fields, ready to be paid via /api/payments/create-order.
export const createCheckoutBooking = asyncHandler(async (req, res) => {
  const {
    packageId, travelDate, travelers = 1, addOnIds = [],
    fullName, email, mobile,
    couponCode, giftCardCode, loyaltyPointsToRedeem = 0,
    bookingType = 'individual', companyName, groupSize, gstNumber,
    referralCode,
  } = req.body;

  if (!fullName || !email || !mobile) {
    return res.status(400).json({ success: false, message: 'fullName, email and mobile are required.' });
  }

  const pkg = await Package.findById(packageId);
  if (!pkg) return res.status(404).json({ success: false, message: 'Package not found.' });
  if (pkg.seatsLeft !== undefined && pkg.seatsLeft <= 0) {
    return res.status(400).json({ success: false, message: 'This package is sold out.' });
  }

  const dynamicPrice = computeDynamicPrice(pkg, { travelDate, travelers: Number(travelers) });

  // Add-ons
  let addOns = [];
  let addOnsTotal = 0;
  if (addOnIds.length) {
    const found = await AddOn.find({ _id: { $in: addOnIds }, active: true });
    addOns = found.map((a) => {
      const qty = a.priceUnit === 'per_person' ? Number(travelers) : 1;
      const lineTotal = a.price * qty;
      addOnsTotal += lineTotal;
      return { addOnId: a._id, name: a.name, price: a.price, quantity: qty };
    });
  }

  let runningTotal = dynamicPrice.totalPrice + addOnsTotal;

  // Coupon — shared logic with Controllers/bookingController.js's package-inquiry
  // flow, see Services/couponService.js. usedCount is only incremented on
  // successful payment (see paymentController.js), not here.
  const { discount: couponDiscount } = await applyCouponToAmount(couponCode, runningTotal);
  runningTotal -= couponDiscount;

  // Gift card
  let giftCardAmountApplied = 0;
  let giftCard = null;
  if (giftCardCode) {
    giftCard = await GiftCard.findOne({ code: giftCardCode.toUpperCase() });
    if (giftCard && giftCard.isRedeemable()) {
      giftCardAmountApplied = Math.min(giftCard.balance, runningTotal);
      runningTotal -= giftCardAmountApplied;
    }
  }

  // Loyalty points redemption (1 point = ₹1, capped at what's available and what's owed)
  let loyaltyDiscountApplied = 0;
  const user = req.user ? await User.findById(req.user._id) : null;
  if (user && loyaltyPointsToRedeem > 0) {
    const redeemable = Math.min(user.loyaltyPoints, loyaltyPointsToRedeem, runningTotal);
    if (redeemable > 0) {
      loyaltyDiscountApplied = redeemable;
      runningTotal -= loyaltyDiscountApplied;
    }
  }

  const finalAmount = Math.max(0, +runningTotal.toFixed(2));

  // Referral attribution
  let referredByUser = null;
  if (referralCode) {
    referredByUser = await User.findOne({ referralCode: referralCode.toUpperCase() });
  }

  const booking = await Booking.create({
    user: req.user?._id || null,
    packageName: pkg.title,
    packageId: String(pkg._id),
    destination: pkg.destination || pkg.location,
    fullName, email, mobile,
    startDate: travelDate,
    adults: travelers,
    quotedPrice: dynamicPrice.totalPrice,
    basePriceAtBooking: dynamicPrice.basePrice,
    dynamicPriceAtBooking: dynamicPrice.perPersonPrice,
    addOns,
    addOnsTotal: +addOnsTotal.toFixed(2),
    couponCode: couponCode || undefined,
    couponDiscount: +couponDiscount.toFixed(2),
    giftCardCode: giftCard ? giftCard.code : undefined,
    giftCardAmountApplied: +giftCardAmountApplied.toFixed(2),
    loyaltyPointsRedeemed: loyaltyDiscountApplied,
    loyaltyDiscountApplied: +loyaltyDiscountApplied.toFixed(2),
    bookingType,
    companyName: bookingType !== 'individual' ? companyName : undefined,
    groupSize: bookingType === 'group' ? groupSize : undefined,
    gstNumber,
    referredByCode: referralCode || undefined,
    referredByUser: referredByUser?._id || null,
    finalAmount,
    enquiryType: 'Online Checkout',
    status: 'pending', // becomes 'confirmed' once payment succeeds (Controllers/paymentController.js)
  });

  res.status(201).json({
    success: true,
    message: 'Booking created — proceed to payment.',
    booking,
    amountDue: finalAmount,
  });
});
