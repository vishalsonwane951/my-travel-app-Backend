const GOOGLE_KEY = process.env.GOOGLE_PLACES_API_KEY;

const BUDGET_TOTALS = {
  budget: 25000,
  standard: 60000,
  premium: 120000,
  luxury: 180000,
};

// Split percentages by category — tune later against real trip data
const BUDGET_SPLIT = { stay: 0.4, food: 0.2, activities: 0.25, transport: 0.15 };

async function travelTimeMinutes(placeIdA, placeIdB) {
  if (!placeIdA || !placeIdB) return null;
  const url = 'https://routes.googleapis.com/directions/v2:computeRoutes';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_KEY,
      'X-Goog-FieldMask': 'routes.duration',
    },
    body: JSON.stringify({
      origin: { placeId: placeIdA },
      destination: { placeId: placeIdB },
      travelMode: 'DRIVE',
    }),
  });
  const data = await res.json();
  const durationStr = data.routes?.[0]?.duration; // e.g. "540s"
  if (!durationStr) return null;
  return Math.round(parseInt(durationStr, 10) / 60);
}

async function attachTravelTimes(itinerary) {
  for (const day of itinerary.days || []) {
    for (let i = 1; i < day.items.length; i++) {
      const prev = day.items[i - 1];
      const curr = day.items[i];
      try {
        curr.travelFromPrevMin = await travelTimeMinutes(prev.placeId, curr.placeId);
      } catch {
        curr.travelFromPrevMin = null; // non-fatal — timing degrades gracefully
      }
    }
  }
  return itinerary;
}

function computeBudgetBreakdown(budgetTier, nights, travelers) {
  const base = BUDGET_TOTALS[budgetTier] || BUDGET_TOTALS.standard;
  const total = Math.round(base * (nights / 3) * Math.max(1, travelers / 2));
  const breakdown = {};
  for (const [key, pct] of Object.entries(BUDGET_SPLIT)) {
    breakdown[key] = Math.round(total * pct);
  }
  return { tier: budgetTier, total, currency: 'INR', breakdown };
}

module.exports = { attachTravelTimes, computeBudgetBreakdown };