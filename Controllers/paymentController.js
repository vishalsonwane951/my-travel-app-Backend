import asyncHandler from 'express-async-handler';
import Payment from '../Models/Payment.js';
import Invoice from '../Models/Invoice.js';
import Booking from '../Models/Booking.js';
import Package from '../Models/PackagesModel.js';
import Coupon from '../Models/Coupon.js';
import GiftCard from '../Models/GiftCard.js';
import Commission from '../Models/Commission.js';
import User from '../Models/UserModel.js';
import { awardLoyaltyPoints, creditWallet } from '../Services/walletService.js';
import { sendPlainEmail } from '../utils/email.js';
import {
  createOrder,
  verifyPaymentSignature,
  verifyWebhookSignature,
  isRazorpayConfigured,
} from '../Services/razorpayService.js';

// POST /api/payments/create-order
// Body: { bookingId, amount, type: 'full' | 'advance' | 'emi_installment', emiPlan? }
export const createPaymentOrder = asyncHandler(async (req, res) => {
  if (!isRazorpayConfigured()) {
    return res.status(503).json({
      success: false,
      message: 'Payment gateway is not configured yet. Set RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET in .env.',
    });
  }

  const { bookingId, amount, type = 'full', emiPlan } = req.body;
  if (!bookingId || !amount) {
    return res.status(400).json({ success: false, message: 'bookingId and amount are required.' });
  }

  const booking = await Booking.findById(bookingId);
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });

  const order = await createOrder({
    amountInRupees: amount,
    receipt: `bk_${booking.bookingId}_${Date.now()}`,
    notes: { bookingId: String(booking._id), type },
  });

  const payment = await Payment.create({
    booking: booking._id,
    user: req.user?._id || booking.user || null,
    amount,
    type,
    emiPlan: type === 'emi_installment' ? emiPlan : undefined,
    razorpayOrderId: order.id,
    status: 'created',
  });

  res.status(201).json({
    success: true,
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
    paymentRecordId: payment._id,
  });
});

// POST /api/payments/verify
// Body: { razorpayOrderId, razorpayPaymentId, razorpaySignature }
// Called by the frontend immediately after Razorpay Checkout succeeds. This is
// a fast-path confirmation; the webhook below is the source of truth and will
// reconcile anything this call might miss (e.g. the tab closing mid-flow).
export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return res.status(400).json({ success: false, message: 'Missing Razorpay verification fields.' });
  }

  const valid = verifyPaymentSignature({ razorpayOrderId, razorpayPaymentId, razorpaySignature });
  if (!valid) {
    await Payment.findOneAndUpdate({ razorpayOrderId }, { status: 'failed' });
    return res.status(400).json({ success: false, message: 'Payment signature verification failed.' });
  }

  const payment = await markPaymentSuccessful({ razorpayOrderId, razorpayPaymentId, razorpaySignature });
  if (!payment) return res.status(404).json({ success: false, message: 'Payment record not found for this order.' });

  res.json({ success: true, message: 'Payment verified.', payment });
});

// POST /api/payments/webhook  (mounted with express.raw() BEFORE express.json() in server.js)
export const razorpayWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const rawBody = req.body; // Buffer, thanks to express.raw()

  if (!verifyWebhookSignature(rawBody, signature)) {
    return res.status(400).json({ success: false, message: 'Invalid webhook signature.' });
  }

  const payload = JSON.parse(rawBody.toString('utf8'));
  const event = payload.event;
  const entity = payload.payload?.payment?.entity;

  if (event === 'payment.captured' && entity) {
    await markPaymentSuccessful({
      razorpayOrderId: entity.order_id,
      razorpayPaymentId: entity.id,
      method: entity.method,
    });
  } else if (event === 'payment.failed' && entity) {
    await Payment.findOneAndUpdate({ razorpayOrderId: entity.order_id }, { status: 'failed' });
  }

  res.json({ success: true });
});

// Shared reconciliation logic used by both the verify endpoint and the webhook.
async function markPaymentSuccessful({ razorpayOrderId, razorpayPaymentId, razorpaySignature, method }) {
  const payment = await Payment.findOne({ razorpayOrderId });
  if (!payment) return null;
  if (payment.status === 'success') return payment; // already reconciled, idempotent

  payment.status = 'success';
  payment.razorpayPaymentId = razorpayPaymentId;
  if (razorpaySignature) payment.razorpaySignature = razorpaySignature;
  if (method) payment.method = method;
  await payment.save();

  // Update the linked invoice, if any
  if (payment.invoice) {
    const invoice = await Invoice.findById(payment.invoice);
    if (invoice) {
      invoice.amountPaid += payment.amount;
      await invoice.save();
    }
  }

  // Auto-confirm the booking on successful payment
  const booking = payment.booking ? await Booking.findById(payment.booking) : null;
  if (booking && booking.status !== 'confirmed') {
    booking.status = 'confirmed';
    booking.timeline = booking.timeline || [];
    booking.timeline.push({ status: 'confirmed', note: `Auto-confirmed on payment (${payment.type})`, by: 'system', at: new Date() });
    await booking.save();

    // ── Part C settlement — runs exactly once, only for a real confirmed payment ──
    await settleBookingCommerce(booking).catch((err) => console.error('[settleBookingCommerce]', err.message));
  }

  // Activate the gift card on real payment success (it was created 'pending_payment' — see
  // Controllers/giftCardController.js — and stays unusable until this fires)
  if (payment.giftCard) {
    const giftCard = await GiftCard.findById(payment.giftCard);
    if (giftCard && giftCard.status === 'pending_payment') {
      giftCard.status = 'active';
      giftCard.active = true;
      await giftCard.save();

      if (giftCard.recipientEmail) {
        sendPlainEmail(
          giftCard.recipientEmail,
          "You've received a Desivdesi Gift Card!",
          `Hi ${giftCard.recipientName || 'there'},\n\n${giftCard.message ? giftCard.message + '\n\n' : ''}You've been sent a Desivdesi gift card worth ₹${giftCard.initialValue}.\n\nGift Card Code: ${giftCard.code}\nValid until: ${giftCard.expiresAt.toLocaleDateString('en-IN')}\n\nUse it at checkout on any Desivdesi package.`
        ).catch((err) => console.error('[GiftCard email]', err.message));
      }
    }
  }

  return payment;
}

// Applies the one-time side effects of a booking actually being paid for:
// decrement real seat inventory, burn the coupon use / gift card balance,
// award loyalty points to the booker, and reward whoever referred them
// (wallet credit for a customer referral, or a Commission record for an agent).
async function settleBookingCommerce(booking) {
  // Seat inventory (Part C: real urgency indicators)
  if (booking.packageId) {
    await Package.findByIdAndUpdate(booking.packageId, { $inc: { seatsLeft: -1 } });
  }

  // Coupon usage
  if (booking.couponCode) {
    await Coupon.findOneAndUpdate({ code: booking.couponCode }, { $inc: { usedCount: 1 } });
  }

  // Gift card balance
  if (booking.giftCardCode && booking.giftCardAmountApplied > 0) {
    const gc = await GiftCard.findOne({ code: booking.giftCardCode });
    if (gc) {
      gc.balance = Math.max(0, gc.balance - booking.giftCardAmountApplied);
      if (gc.balance === 0) { gc.active = false; gc.status = 'depleted'; }
      await gc.save();
    }
  }

  // Loyalty: redeem what was promised, then earn new points on the amount actually paid
  if (booking.user) {
    if (booking.loyaltyPointsRedeemed > 0) {
      await creditWallet(booking.user, 0, 'loyalty_redeem', `Redeemed ${booking.loyaltyPointsRedeemed} points on booking ${booking.bookingId}`, booking._id);
      await User.findByIdAndUpdate(booking.user, { $inc: { loyaltyPoints: -booking.loyaltyPointsRedeemed } });
    }
    await awardLoyaltyPoints(booking.user, booking.finalAmount || booking.quotedPrice || 0, booking._id);
  }

  // Referral reward: customer referrer gets a wallet credit; an agent referrer gets a Commission record
  if (booking.referredByUser) {
    const referrer = await User.findById(booking.referredByUser);
    if (referrer) {
      if (referrer.role === 'agent') {
        await Commission.create({
          agent: referrer._id,
          booking: booking._id,
          bookingAmount: booking.finalAmount || booking.quotedPrice || 0,
          commissionRate: referrer.agentCommissionRate || 10,
        });
      } else {
        const reward = Math.round((booking.finalAmount || 0) * 0.03); // 3% referral reward
        if (reward > 0) {
          await creditWallet(referrer._id, reward, 'referral_reward', `Referral reward for booking ${booking.bookingId}`, booking._id);
        }
      }
    }
  }
}

// GET /api/payments/booking/:bookingId — payment history for a booking (used by post-booking wallet in Part C too)
export const getBookingPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ booking: req.params.bookingId }).sort({ createdAt: -1 });
  res.json({ success: true, payments });
});
