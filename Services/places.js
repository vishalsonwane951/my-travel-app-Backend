const GOOGLE_KEY = process.env.GOOGLE_PLACES_API_KEY;

// Budget tier -> Google price_level (0-4) ceiling, used to bias restaurant picks
const BUDGET_PRICE_CEILING = {
  budget: 1,
  standard: 2,
  premium: 3,
  luxury: 4,
};

async function geocode(query) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${GOOGLE_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  const result = data.results?.[0];
  if (!result) return null;
  return {
    lat: result.geometry.location.lat,
    lng: result.geometry.location.lng,
    formattedAddress: result.formatted_address,
  };
}

// New Places API (Nearby/Text Search) — returns a trimmed candidate list
async function placesNearby({ lat, lng }, type, { diet, maxResults = 12 } = {}) {
  const body = {
    includedTypes: [type],
    maxResultCount: maxResults,
    locationRestriction: {
      circle: { center: { latitude: lat, longitude: lng }, radius: 15000 },
    },
  };

  const res = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_KEY,
      'X-Goog-FieldMask':
        'places.id,places.displayName,places.rating,places.priceLevel,places.location,places.primaryType,places.currentOpeningHours',
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  let places = (data.places || []).map(p => ({
    placeId: p.id,
    name: p.displayName?.text,
    rating: p.rating,
    priceLevel: p.priceLevel, // e.g. "PRICE_LEVEL_MODERATE"
    lat: p.location?.latitude,
    lng: p.location?.longitude,
    primaryType: p.primaryType,
    openNow: p.currentOpeningHours?.openNow,
  }));

  if (type === 'restaurant' && diet && diet !== 'Any') {
    // Cheap client-side filter; for stricter filtering, add diet as a text-query term instead.
    places = places.filter(p => !/steak|meat house/i.test(p.name || '')) ;
  }

  return places;
}

async function fetchCandidatePlaces(geo, { tripType, diet, budget }) {
  const [attractions, restaurants] = await Promise.all([
    placesNearby(geo, 'tourist_attraction', { maxResults: 15 }),
    placesNearby(geo, 'restaurant', { diet, maxResults: 15 }),
  ]);
  return { attractions, restaurants };
}

module.exports = { geocode, placesNearby, fetchCandidatePlaces, BUDGET_PRICE_CEILING };