import Razorpay from 'razorpay';
import crypto from 'crypto';

let client = null;

// Lazily instantiate so the app doesn't crash on boot if keys aren't set yet —
// routes that need it will return a clear 503 instead of a stack trace.
function getClient() {
  if (client) return client;
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return null;
  }
  client = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  return client;
}

export function isRazorpayConfigured() {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

// amountInRupees -> Razorpay order (amount must be sent to Razorpay in paise)
export async function createOrder({ amountInRupees, receipt, notes }) {
  const rzp = getClient();
  if (!rzp) throw new Error('Razorpay is not configured (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET missing).');

  return rzp.orders.create({
    amount: Math.round(amountInRupees * 100),
    currency: 'INR',
    receipt,
    notes,
  });
}

// Verifies the signature returned by Razorpay Checkout after a successful payment
// (client-side confirmation — still followed up by webhook verification server-side).
export function verifyPaymentSignature({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
  if (!process.env.RAZORPAY_KEY_SECRET) return false;
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');
  return expected === razorpaySignature;
}

// Verifies the X-Razorpay-Signature header on incoming webhook payloads.
export function verifyWebhookSignature(rawBody, signatureHeader) {
  if (!process.env.RAZORPAY_WEBHOOK_SECRET) return false;
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex');
  return expected === signatureHeader;
}
