const GEMINI_KEY = process.env.GEMINI_API_KEY;
const MODEL = 'gemini-2.5-flash';

const PACE_STOPS = {
  relaxed: '2-3 stops per day',
  balanced: '3-4 stops per day',
  packed: '5 or more stops per day',
};

// The model must return JSON matching this exact shape — no invented places.
const ITINERARY_SCHEMA = {
  type: 'object',
  properties: {
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
    localTips: {
      type: 'object',
      properties: {
        currency: { type: 'string' },
        safety: { type: 'string' },
        connectivity: { type: 'string' },
      },
    },
  },
  required: ['days'],
};

function formatPlaceList(places) {
  return places
    .map(p => `- ${p.name} | placeId: ${p.placeId} | rating: ${p.rating ?? 'n/a'} | price: ${p.priceLevel ?? 'n/a'}`)
    .join('\n');
}

function buildItineraryPrompt({ destination, area, checkin, nights, travelers, tripType, pace, diet, budget, attractions, restaurants }) {
  return `You are a travel planner. Using ONLY the candidate places listed below (do not invent new places),
build a day-by-day itinerary starting ${checkin} for ${nights} night(s).

TRIP:
- Destination: ${destination}${area ? ` (${area})` : ''}
- Travelers: ${travelers}
- Trip type: ${tripType}
- Pace: ${pace} (${PACE_STOPS[pace] || PACE_STOPS.balanced})
- Budget tier: ${budget}
- Dietary preference: ${diet}

CANDIDATE ATTRACTIONS:
${formatPlaceList(attractions)}

CANDIDATE RESTAURANTS:
${formatPlaceList(restaurants)}

RULES:
- Every day must include breakfast, lunch, and dinner slots, each referencing a placeId from the restaurant list above.
- Space activities according to the pace given above.
- Do not schedule anything before 08:00 or after 22:00.
- Respect the dietary preference for all meal picks.
- Only use placeId values that appear in the candidate lists above.
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

async function generateItinerary(params) {
  const prompt = buildItineraryPrompt(params);
  return callAIModel(prompt);
}

module.exports = { generateItinerary, buildItineraryPrompt, ITINERARY_SCHEMA };