import asyncHandler from 'express-async-handler';
import GiftCard from '../Models/GiftCard.js';
import Payment from '../Models/Payment.js';
import { createOrder, isRazorpayConfigured } from '../Services/razorpayService.js';

function generateCode() {
  return `GIFT-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
}

// POST /api/gift-cards/purchase
// Creates a pending gift card + a real Razorpay order for it. The card stays
// unusable (status: 'pending_payment') until Controllers/paymentController.js
// confirms the payment actually succeeded — mirroring exactly how a Booking
// stays 'pending' until payment clears.
export const purchaseGiftCard = asyncHandler(async (req, res) => {
  if (!isRazorpayConfigured()) {
    return res.status(503).json({
      success: false,
      message: 'Payment gateway is not configured yet. Set RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET in .env.',
    });
  }

  const { amount, recipientEmail, recipientName, message } = req.body;
  if (!amount || amount < 100) {
    return res.status(400).json({ success: false, message: 'Minimum gift card value is ₹100.' });
  }

  const giftCard = await GiftCard.create({
    code: generateCode(),
    initialValue: amount,
    balance: amount,
    purchasedBy: req.user?._id || null,
    recipientEmail, recipientName, message,
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    status: 'pending_payment',
    active: false,
  });

  const order = await createOrder({
    amountInRupees: amount,
    receipt: `gift_${giftCard.code}`,
    notes: { giftCardId: String(giftCard._id), purpose: 'gift_card_purchase' },
  });

  const payment = await Payment.create({
    giftCard: giftCard._id,
    user: req.user?._id || null,
    amount,
    type: 'gift_card_purchase',
    razorpayOrderId: order.id,
    status: 'created',
  });

  res.status(201).json({
    success: true,
    message: 'Gift card created — complete payment to activate it.',
    giftCard,
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
    paymentRecordId: payment._id,
  });
});

// POST /api/gift-cards/check — preview balance/validity before applying at checkout
export const checkGiftCard = asyncHandler(async (req, res) => {
  const { code } = req.body;
  const giftCard = await GiftCard.findOne({ code: code?.toUpperCase() });
  if (!giftCard || !giftCard.isRedeemable()) {
    return res.status(400).json({ success: false, message: 'Invalid, expired, or empty gift card.' });
  }
  res.json({ success: true, balance: giftCard.balance, code: giftCard.code });
});

// GET /api/gift-cards/mine — cards a customer purchased
export const getMyGiftCards = asyncHandler(async (req, res) => {
  const giftCards = await GiftCard.find({ purchasedBy: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, giftCards });
});

// Admin
export const listAllGiftCards = asyncHandler(async (req, res) => {
  const giftCards = await GiftCard.find().populate('purchasedBy', 'name email').sort({ createdAt: -1 });
  res.json({ success: true, giftCards });
});
