const GOOGLE_KEY = process.env.GOOGLE_PLACES_API_KEY;

const FIELD_MASK = 'places.id,places.displayName,places.formattedAddress,places.rating,places.priceLevel';

// Places API (New) returns priceLevel as an enum string, not 0-4 — normalize
// it to a 0-4 number so the rest of the app (and the AI prompt) stays simple.
const PRICE_LEVEL_MAP = {
  PRICE_LEVEL_FREE: 0,
  PRICE_LEVEL_INEXPENSIVE: 1,
  PRICE_LEVEL_MODERATE: 2,
  PRICE_LEVEL_EXPENSIVE: 3,
  PRICE_LEVEL_VERY_EXPENSIVE: 4,
};

async function textSearch(query) {
  const resp = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_KEY,
      'X-Goog-FieldMask': FIELD_MASK,
    },
    body: JSON.stringify({ textQuery: query }),
  });

  const data = await resp.json();
  if (!resp.ok) {
    console.error('Places text search (New) error:', data.error?.status, data.error?.message);
    return [];
  }

  return (data.places || []).map(p => ({
    name: p.displayName?.text,
    placeId: p.id,
    rating: p.rating ?? null,
    priceLevel: PRICE_LEVEL_MAP[p.priceLevel] ?? null,
    address: p.formattedAddress,
  }));
}

export async function findAttractions(destination, area) {
  const q = `top attractions in ${area ? `${area}, ` : ''}${destination}`;
  return textSearch(q);
}

export async function findRestaurants(destination, area, diet) {
  const dietTerm = diet && diet !== 'Any' ? `${diet} ` : '';
  const q = `${dietTerm}restaurants in ${area ? `${area}, ` : ''}${destination}`;
  return textSearch(q);
}

const BUDGET_HOTEL_TERM = {
  budget: 'budget',
  standard: 'mid-range',
  premium: 'premium',
  luxury: 'luxury',
};

export async function findHotels(destination, area, budgetTier) {
  const tier = BUDGET_HOTEL_TERM[budgetTier] || '';
  const q = `${tier} hotels in ${area ? `${area}, ` : ''}${destination}`;
  return textSearch(q);
}