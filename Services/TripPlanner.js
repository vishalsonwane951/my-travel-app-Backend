const { callGemini, parseJSON } = require("./geminiService");

const SYSTEM_PROMPT = `You are an expert travel planner AI. Always respond with valid JSON only — no markdown, no preamble.
Be specific, practical, and personalized. Include real place names, realistic prices in USD, and actionable advice.`;

async function generateItinerary({ destination, days, travelers, budget, interests }) {
  const prompt = `Create a detailed ${days}-day itinerary for ${destination}.
Travelers: ${travelers} person(s). Budget: ${budget} USD total. Interests: ${interests.join(", ")}.

Respond ONLY with this JSON structure:
{
  "destination": "string",
  "totalDays": number,
  "theme": "string (one sentence describing the trip vibe)",
  "days": [
    {
      "day": number,
      "title": "string",
      "morning": { "activity": "string", "location": "string", "duration": "string", "tip": "string" },
      "afternoon": { "activity": "string", "location": "string", "duration": "string", "tip": "string" },
      "evening": { "activity": "string", "location": "string", "duration": "string", "tip": "string" },
      "meals": { "breakfast": "string", "lunch": "string", "dinner": "string" }
    }
  ]
}`;

  const raw = await callGemini(prompt, SYSTEM_PROMPT);
  return parseJSON(raw);
}

async function getHotelAndFlightSuggestions({ destination, checkIn, checkOut, travelers, budget }) {
  const prompt = `Suggest hotels and flight tips for a trip to ${destination}.
Check-in: ${checkIn}, Check-out: ${checkOut}. Travelers: ${travelers}. Hotel budget: ${budget} USD/night.

Respond ONLY with this JSON:
{
  "hotels": [
    {
      "name": "string",
      "type": "string (luxury|mid-range|budget)",
      "pricePerNight": number,
      "rating": number,
      "neighborhood": "string",
      "highlights": ["string"],
      "bookingTip": "string"
    }
  ],
  "flightTips": {
    "bestTimeToBook": "string",
    "cheapestMonths": ["string"],
    "recommendedAirlines": ["string"],
    "averagePrice": number,
    "layoverTips": "string"
  }
}`;

  const raw = await callGemini(prompt, SYSTEM_PROMPT);
  return parseJSON(raw);
}

async function estimateBudget({ destination, days, travelers, style }) {
  const prompt = `Estimate a realistic travel budget for ${travelers} person(s) visiting ${destination} for ${days} days with a ${style} travel style.

Respond ONLY with this JSON:
{
  "style": "${style}",
  "currency": "USD",
  "perPersonPerDay": {
    "accommodation": number,
    "food": number,
    "transport": number,
    "activities": number,
    "miscellaneous": number
  },
  "totalPerPerson": number,
  "grandTotal": number,
  "savingTips": ["string"],
  "splurgeWorthy": ["string"]
}`;

  const raw = await callGemini(prompt, SYSTEM_PROMPT);
  return parseJSON(raw);
}

async function getLocalTips({ destination, interests }) {
  const prompt = `Give insider local tips for ${destination} for a traveler interested in: ${interests.join(", ")}.

Respond ONLY with this JSON:
{
  "destination": "string",
  "mustTry": [{ "name": "string", "type": "food|experience|place", "description": "string", "localSecret": "string" }],
  "avoid": ["string"],
  "bestNeighborhoods": [{ "name": "string", "vibe": "string", "bestFor": "string" }],
  "culturalTips": ["string"],
  "safety": ["string"],
  "transportation": { "bestOption": "string", "apps": ["string"], "tips": ["string"] },
  "phrases": [{ "phrase": "string", "meaning": "string" }]
}`;

  const raw = await callGemini(prompt, SYSTEM_PROMPT);
  return parseJSON(raw);
}

async function planFullTrip(params) {
  const { destination, days, travelers, totalBudget, interests, style, checkIn, checkOut } = params;
  const hotelBudget = Math.round((totalBudget * 0.35) / days);

  const [itinerary, hotelsAndFlights, budget, localTips] = await Promise.all([
    generateItinerary({ destination, days, travelers, budget: totalBudget, interests }),
    getHotelAndFlightSuggestions({ destination, checkIn, checkOut, travelers, budget: hotelBudget }),
    estimateBudget({ destination, days, travelers, style }),
    getLocalTips({ destination, interests }),
  ]);

  return { itinerary, hotelsAndFlights, budget, localTips };
}

module.exports = {
  generateItinerary,
  getHotelAndFlightSuggestions,
  estimateBudget,
  getLocalTips,
  planFullTrip,
};