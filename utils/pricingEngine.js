// utils/pricingEngine.js
//
// Computes a real-time price quote for a package given how many seats remain
// and how close the requested travel date is. Deliberately simple and fully
// transparent (each factor is returned in the breakdown) rather than a black
// box — the previous frontend had a purely decorative fake countdown timer;
// this replaces "urgency" with numbers that are actually true.

const LOW_INVENTORY_THRESHOLD = 8; // seats
const LOW_INVENTORY_SURCHARGE = 0.05; // +5%
const LAST_MINUTE_DAYS = 5;
const LAST_MINUTE_SURCHARGE = 0.08; // +8%
const EARLY_BIRD_DAYS = 45;
const EARLY_BIRD_DISCOUNT = 0.06; // -6%
const GROUP_SIZE_THRESHOLD = 6;
const GROUP_DISCOUNT = 0.04; // -4% per traveler when booking 6+

export function computeDynamicPrice(pkg, { travelDate, travelers = 1 } = {}) {
  const basePrice = pkg.price || 0;
  const breakdown = [{ label: 'Base price', multiplier: 1 }];
  let multiplier = 1;

  // Inventory pressure
  if (typeof pkg.seatsLeft === 'number' && pkg.seatsLeft <= LOW_INVENTORY_THRESHOLD && pkg.seatsLeft > 0) {
    multiplier += LOW_INVENTORY_SURCHARGE;
    breakdown.push({ label: `Only ${pkg.seatsLeft} seats left`, multiplier: LOW_INVENTORY_SURCHARGE });
  }

  // Date proximity
  if (travelDate) {
    const days = Math.ceil((new Date(travelDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (days >= 0 && days <= LAST_MINUTE_DAYS) {
      multiplier += LAST_MINUTE_SURCHARGE;
      breakdown.push({ label: 'Last-minute booking', multiplier: LAST_MINUTE_SURCHARGE });
    } else if (days >= EARLY_BIRD_DAYS) {
      multiplier -= EARLY_BIRD_DISCOUNT;
      breakdown.push({ label: 'Early-bird discount', multiplier: -EARLY_BIRD_DISCOUNT });
    }
  }

  // Group size
  if (travelers >= GROUP_SIZE_THRESHOLD) {
    multiplier -= GROUP_DISCOUNT;
    breakdown.push({ label: `Group discount (${travelers} travelers)`, multiplier: -GROUP_DISCOUNT });
  }

  const perPersonPrice = +(basePrice * multiplier).toFixed(2);
  const totalPrice = +(perPersonPrice * travelers).toFixed(2);

  return { basePrice, perPersonPrice, totalPrice, travelers, breakdown, seatsLeft: pkg.seatsLeft };
}
