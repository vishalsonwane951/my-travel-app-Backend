import Coupon from '../Models/Coupon.js';

// Validates a coupon code against a given amount and returns the discount to
// apply, or 0 if the code is missing/invalid/expired/below its minimum spend.
// Never trusts a client-supplied discount figure — always recomputed here
// from the coupon's own rules (isValidNow(), minBookingAmount, maxDiscount).
export async function applyCouponToAmount(couponCode, amount) {
  if (!couponCode) return { discount: 0, coupon: null, message: null };

  const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
  if (!coupon) return { discount: 0, coupon: null, message: 'Invalid coupon code.' };
  if (!coupon.isValidNow()) return { discount: 0, coupon: null, message: 'This coupon is no longer valid.' };
  if (amount < coupon.minBookingAmount) {
    return { discount: 0, coupon: null, message: `Minimum amount for this coupon is ₹${coupon.minBookingAmount}.` };
  }

  let discount = coupon.discountType === 'percent' ? (amount * coupon.discountValue) / 100 : coupon.discountValue;
  if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  discount = Math.min(discount, amount); // never discount more than the amount itself

  return { discount: +discount.toFixed(2), coupon, message: null };
}

// Call only once a booking/order built on this coupon has actually succeeded
// (e.g. on confirmed payment) — increments usedCount for real usage tracking.
export async function commitCouponUsage(couponCode) {
  if (!couponCode) return;
  await Coupon.findOneAndUpdate({ code: couponCode.toUpperCase() }, { $inc: { usedCount: 1 } });
}
