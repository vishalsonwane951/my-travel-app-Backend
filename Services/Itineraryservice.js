const GEMINI_KEY = process.env.GEMINI_API_KEY;
const MODEL = 'gemini-2.5-flash';

const PACE_STOPS = {
  relaxed: '2-3 stops per day',
  balanced: '3-4 stops per day',
  packed: '5 or more stops per day',
};

// The model must return JSON matching this exact shape — no invented places,
// no invented prices out of thin air (they must be grounded in the real
// price_level/rating data given for each candidate).
const ITINERARY_SCHEMA = {
  type: 'object',
  properties: {
    hotels: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          placeId: { type: 'string' },
          rating: { type: 'number' },
          pricePerNight: { type: 'number' },
          currency: { type: 'string' },
          reason: { type: 'string' },
        },
        required: ['name', 'placeId', 'pricePerNight', 'currency'],
      },
    },
    days: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          date: { type: 'string' },
          dayLabel: { type: 'string' },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                type: { type: 'string', enum: ['meal', 'activity'] },
                slot: { type: 'string' },
                time: { type: 'string' },
                durationMin: { type: 'integer' },
                name: { type: 'string' },
                placeId: { type: 'string' },
                notes: { type: 'string' },
                estCostPerPerson: { type: 'number' },
              },
              required: ['type', 'slot', 'time', 'name', 'placeId'],
            },
          },
        },
        required: ['date', 'dayLabel', 'items'],
      },
    },
    budgetBreakdown: {
      type: 'object',
      properties: {
        currency: { type: 'string' },
        stay: { type: 'number' },
        food: { type: 'number' },
        activities: { type: 'number' },
        transport: { type: 'number' },
        total: { type: 'number' },
        notes: { type: 'string' },
      },
      required: ['currency', 'stay', 'food', 'activities', 'transport', 'total'],
    },
    localTips: {
      type: 'object',
      properties: {
        currency: { type: 'string' },
        safety: { type: 'string' },
        connectivity: { type: 'string' },
      },
    },
  },
  required: ['days', 'hotels', 'budgetBreakdown'],
};

const BUDGET_TIER_HINT = {
  budget: 'roughly ₹1,500–3,000 per night for stay, cheap local eats',
  standard: 'roughly ₹3,000–7,000 per night for stay, mid-range dining',
  premium: 'roughly ₹7,000–15,000 per night for stay, upscale dining',
  luxury: 'roughly ₹15,000+ per night for stay, fine dining',
};

function formatPlaceList(places) {
  return places
    .map(p => `- ${p.name} | placeId: ${p.placeId} | rating: ${p.rating ?? 'n/a'} | price_level(0-4): ${p.priceLevel ?? 'n/a'}`)
    .join('\n');
}

function buildItineraryPrompt({ destination, area, checkin, nights, travelers, tripType, pace, diet, budget, attractions, restaurants, hotels }) {
  return `You are a travel planner. Using ONLY the candidate places listed below (do not invent new places),
build a day-by-day itinerary starting ${checkin} for ${nights} night(s).

TRIP:
- Destination: ${destination}${area ? ` (${area})` : ''}
- Travelers: ${travelers}
- Trip type: ${tripType}
- Pace: ${pace} (${PACE_STOPS[pace] || PACE_STOPS.balanced})
- Budget tier: ${budget} (${BUDGET_TIER_HINT[budget] || ''})
- Dietary preference: ${diet}

CANDIDATE HOTELS (real places, price_level is Google's 0-4 scale, not currency):
${formatPlaceList(hotels)}

CANDIDATE ATTRACTIONS:
${formatPlaceList(attractions)}

CANDIDATE RESTAURANTS:
${formatPlaceList(restaurants)}

RULES:
- Pick 2-3 hotels from the candidate list above that fit the budget tier. Estimate a realistic pricePerNight in INR for each, using its price_level, rating, and your knowledge of typical prices for this destination as evidence — do not use a fixed formula.
- Every day must include breakfast, lunch, and dinner slots, each referencing a placeId from the restaurant list above, with a realistic estCostPerPerson in INR for that specific place.
- Give each activity a realistic estCostPerPerson in INR (0 if free), based on the place's own price_level and typical costs for that kind of attraction.
- Space activities according to the pace given above.
- Do not schedule anything before 08:00 or after 22:00.
- Respect the dietary preference for all meal picks.
- Only use placeId values that appear in the candidate lists above.
- budgetBreakdown must be your own bottom-up estimate computed from the actual hotel, meals, and activities you chose for all ${nights} night(s) and ${travelers} traveler(s) — stay = chosen hotel price × nights, food/activities = sum of the estCostPerPerson figures you assigned × travelers, transport = your realistic estimate for local transport for this trip. total = stay + food + activities + transport. Do not use a fixed percentage split.
- Output must match the provided JSON schema exactly.`;
}

async function callAIModel(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4,
        responseMimeType: 'application/json',
        responseSchema: ITINERARY_SCHEMA,
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini returned an empty response');
  return JSON.parse(text); // responseSchema guarantees valid JSON here
}

export async function generateItinerary(params) {
  const prompt = buildItineraryPrompt(params);
  return callAIModel(prompt);
}

export { buildItineraryPrompt, ITINERARY_SCHEMA };