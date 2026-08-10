import asyncHandler from 'express-async-handler';
import HotelApiCache from '../Models/HotelApiCache.js';
import { buildCacheKey, normalizeSearchTerm } from '../utils/hotelCacheKey.js';
import {
  fetchAutocomplete, fetchProperties, fetchPropertyDetails,
  fetchAvailability, fetchPriceConfirmation, submitBooking, fetchBookingDetail,
  isXeniConfigured,
} from '../Services/xeniHotelService.js';

function notConfigured(res) {
  return res.status(503).json({
    success: false,
    message: 'Hotel search is not configured yet. Set RAPIDAPI_KEY in the backend .env.',
  });
}

// Shared cache-or-fetch helper used by all 3 cacheable endpoints below.
// Looks up {type, cacheKey} first; on a miss, calls fetcher(), stores the
// raw response (30-day TTL — Models/HotelApiCache.js), and returns it.
async function cacheOrFetch({ type, cacheKey, params, fetcher }) {
  const cached = await HotelApiCache.findOne({ type, cacheKey });
  if (cached) {
    return { data: cached.response, fromCache: true };
  }

  const data = await fetcher();

  // Upsert rather than plain create — protects against a rare race where two
  // requests for the same uncached search land at almost the same time.
  await HotelApiCache.findOneAndUpdate(
    { type, cacheKey },
    { type, cacheKey, params, response: data },
    { upsert: true, setDefaultsOnInsert: true }
  );

  return { data, fromCache: false };
}

// GET /api/hotels/autocomplete?query=pune
export const autocomplete = asyncHandler(async (req, res) => {
  if (!isXeniConfigured()) return notConfigured(res);
  const { query } = req.query;
  if (!query) return res.status(400).json({ success: false, message: 'query is required.' });

  const normalized = normalizeSearchTerm(query);
  const cacheKey = buildCacheKey({ query: normalized });

  const { data, fromCache } = await cacheOrFetch({
    type: 'autocomplete',
    cacheKey,
    params: { query: normalized },
    fetcher: () => fetchAutocomplete(normalized),
  });

  res.json({ ...data, _cache: fromCache ? 'hit' : 'miss' });
});

// POST /api/hotels/search
// Body: { placeId, checkIn, checkOut, adults, children, childrenAges, countryOfResidence, page, limit }
export const searchProperties = asyncHandler(async (req, res) => {
  if (!isXeniConfigured()) return notConfigured(res);
  const {
    placeId, checkIn, checkOut, adults = 2, children = 0, childrenAges = [],
    countryOfResidence = 'IN', page = 1, limit = 20,
  } = req.body;

  if (!placeId || !checkIn || !checkOut) {
    return res.status(400).json({ success: false, message: 'placeId, checkIn and checkOut are required.' });
  }

  // Cache key covers the FULL search criteria, not just page/limit — a Pune
  // search for December must never return cached June results.
  const searchParams = { placeId, checkIn, checkOut, adults, children, childrenAges, countryOfResidence, page, limit };
  const cacheKey = buildCacheKey(searchParams);

  const { data, fromCache } = await cacheOrFetch({
    type: 'properties',
    cacheKey,
    params: searchParams,
    fetcher: () => fetchProperties(searchParams),
  });

  res.json({ ...data, _cache: fromCache ? 'hit' : 'miss' });
});

// GET /api/hotels/property/:propertyId
export const propertyDetails = asyncHandler(async (req, res) => {
  if (!isXeniConfigured()) return notConfigured(res);
  const { propertyId } = req.params;
  if (!propertyId) return res.status(400).json({ success: false, message: 'propertyId is required.' });

  const cacheKey = buildCacheKey({ propertyId });

  const { data, fromCache } = await cacheOrFetch({
    type: 'propertyDetails',
    cacheKey,
    params: { propertyId },
    fetcher: () => fetchPropertyDetails(propertyId),
  });

  res.json({ ...data, _cache: fromCache ? 'hit' : 'miss' });
});

// ── Transactional endpoints — plain proxy, never cached ──────────────────

// POST /api/hotels/availability
export const checkAvailability = asyncHandler(async (req, res) => {
  if (!isXeniConfigured()) return notConfigured(res);
  const data = await fetchAvailability(req.body);
  res.json(data);
});

// POST /api/hotels/price-confirmation
export const priceConfirmation = asyncHandler(async (req, res) => {
  if (!isXeniConfigured()) return notConfigured(res);
  const { availabilityToken } = req.body;
  if (!availabilityToken) return res.status(400).json({ success: false, message: 'availabilityToken is required.' });
  const data = await fetchPriceConfirmation(availabilityToken);
  res.json(data);
});

// POST /api/hotels/bookings
export const createHotelBooking = asyncHandler(async (req, res) => {
  if (!isXeniConfigured()) return notConfigured(res);
  const data = await submitBooking(req.body);
  res.json(data);
});

// GET /api/hotels/bookings/:bookingId
export const bookingDetail = asyncHandler(async (req, res) => {
  if (!isXeniConfigured()) return notConfigured(res);
  const data = await fetchBookingDetail(req.params.bookingId);
  res.json(data);
});
