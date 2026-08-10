const BUDGET_LABELS = {
  budget:   'Budget (₹10,000–₹25,000 total)',
  standard: 'Standard (₹25,000–₹60,000 total)',
  premium:  'Premium (₹60,000–₹1,20,000 total)',
  luxury:   'Luxury (₹1,20,000+ total)',
};

function calcNights(checkin, checkout) {
  if (!checkin || !checkout) return 3;
  return Math.max(1, Math.round((new Date(checkout) - new Date(checkin)) / 86400000));
}

export function buildPrompt({ destination, area, checkin, checkout, travelers, tripType, budget }) {
  const nights      = calcNights(checkin, checkout);
  const budgetLabel = BUDGET_LABELS[budget] || budget;
  const areaNote    = area ? ` specifically around ${area}` : '';

  const systemPrompt = `You are an expert Indian travel planner for DesiVDesi Tours & Travel.
You create detailed, practical, personalised itineraries for travellers in India and abroad.
You know local food spots, hidden gems, travel tips, and realistic cost estimates.
Always respond ONLY with valid JSON — no markdown, no explanation, no preamble.`;

  const userPrompt = `Create a complete travel itinerary for the following trip:

Destination: ${destination}${areaNote}
Check-in: ${checkin}
Check-out: ${checkout}
Duration: ${nights} night${nights !== 1 ? 's' : ''}
Travellers: ${travelers} person${travelers !== 1 ? 's' : ''}
Trip type: ${tripType}
Budget: ${budgetLabel}

Return ONLY a JSON object with EXACTLY this structure:
{
  "summary": "2–3 sentence overview of the trip",
  "destination": "${destination}",
  "area": "${area || ''}",
  "checkin": "${checkin}",
  "checkout": "${checkout}",
  "nights": ${nights},
  "travelers": ${travelers},
  "tripType": "${tripType}",
  "budget": "${budget}",
  "totalCostEstimate": "e.g. ₹45,000–₹55,000 for ${travelers} person${travelers !== 1 ? 's' : ''}",
  "days": [
    {
      "day": 1,
      "title": "Catchy title for the day",
      "activities": [
        { "time": "9:00 AM", "name": "Activity name", "description": "1–2 sentence description", "cost": "₹200 per person" }
      ],
      "food": [
        { "meal": "Breakfast", "place": "Restaurant name", "description": "What to order", "cost": "₹150 per person" }
      ],
      "stay": { "name": "Hotel or stay name", "type": "Hotel / Homestay / Resort", "cost": "₹2,500 per night" },
      "dayCostEstimate": "₹3,500–₹4,500 per person"
    }
  ],
  "tips": ["Tip 1", "Tip 2", "Tip 3"],
  "bestTimeToVisit": "e.g. October to March",
  "localTransport": "How to get around locally"
}

Generate exactly ${nights} day${nights !== 1 ? 's' : ''} in the days array.
All costs in Indian Rupees (₹). Make recommendations specific and realistic for the ${budgetLabel} budget.`;

  return { systemPrompt, userPrompt };
}