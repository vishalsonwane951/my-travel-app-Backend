import asyncHandler from '../utils/asyncHandler.js';

const GKEY = () => process.env.GOOGLE_PLACES_API_KEY;

export const autocomplete = asyncHandler(async (req, res) => {
    console.log('Calling autocomplete with input:', input);

  const { input, type, sessiontoken, location, radius } = req.query;
  if (!input || input.trim().length < 2) return res.json({ predictions: [] });

  const body = {
    input: input.trim(),
    sessionToken: sessiontoken || undefined,
  };

  if (type === 'destination') {
    body.includedPrimaryTypes = ['locality', 'administrative_area_level_1', 'country'];
  }
  if (type === 'area' && location) {
    const [lat, lng] = location.split(',').map(Number);
    body.locationBias = {
      circle: {
        center: { latitude: lat, longitude: lng },
        radius: Number(radius) || 50000,
      },
    };
  }

  const resp = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GKEY(),
    },
    body: JSON.stringify(body),
  });

  const data = await resp.json();

  if (!resp.ok) {
    console.error('Places autocomplete (New) error:', data.error?.status, data.error?.message);
    return res.json({ predictions: [] });
  }

  const predictions = (data.suggestions || [])
    .map(s => s.placePrediction)
    .filter(Boolean)
    .map(p => ({
      placeId: p.placeId,
      name: p.structuredFormat?.mainText?.text || p.text?.text,
      description: p.text?.text,
      sub: p.structuredFormat?.secondaryText?.text || '',
    }));

  res.json({ predictions });
});

export const details = asyncHandler(async (req, res) => {
    console.log('Calling Google Places (New) with input:', input);

  const { placeId, sessiontoken } = req.query;
  if (!placeId) return res.status(400).json({ error: 'placeId required' });

  const resp = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
    method: 'GET',
    headers: {
      'X-Goog-Api-Key': GKEY(),
      'X-Goog-FieldMask': 'id,displayName,formattedAddress,location',
      ...(sessiontoken ? { 'X-Goog-Session-Token': sessiontoken } : {}),
    },
  });

  const data = await resp.json();
  if (!resp.ok) {
    console.error('Places details (New) error:', data.error?.status, data.error?.message);
    return res.json({ location: null });
  }

  const loc = data.location;
  res.json({
    name: data.displayName?.text,
    address: data.formattedAddress,
    location: loc ? `${loc.latitude},${loc.longitude}` : null,
  });
});