// Services/xeniHotelService.js
//
// Server-side replacement for the RapidAPI calls that used to live directly
// in FrontEnd/src/Services/stayService.js. Moving this here means:
//   1. RAPIDAPI_KEY is never shipped to the browser.
//   2. The 3 endpoints Controllers/hotelSearchController.js designates as
//      cacheable can be checked against MongoDB before ever reaching Xeni.

const RAPIDAPI_HOST = 'xenis-wholesale-rate-hotel-booking.p.rapidapi.com';
const BASE_URL = `https://${RAPIDAPI_HOST}`;

export const XENI_PATHS = {
  AUTOCOMPLETE: '/api/hotels/api/v2/autocomplete',
  PROPERTIES: '/api/hotels/api/v2/properties',
  AVAILABILITY: '/api/hotels/api/v2/properties/availability',
  PROPERTY_DETAILS: '/api/hotels/api/v2/property',
  PRICE_CONFIRMATION: '/api/hotels/api/v2/properties/price',
  BOOKINGS: '/api/hotels/api/v2/bookings',
};

function isConfigured() {
  return Boolean(process.env.RAPIDAPI_KEY);
}

async function xeniGet(path, params = {}) {
  if (!isConfigured()) {
    throw new Error('RAPIDAPI_KEY is not set — hotel search is not configured.');
  }
  const url = new URL(`${BASE_URL}${path}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'x-rapidapi-host': RAPIDAPI_HOST,
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Xeni request failed [${path}] with status ${response.status}`);
  }
  return response.json();
}

async function xeniPost(path, { params = {}, body = {} } = {}) {
  if (!isConfigured()) {
    throw new Error('RAPIDAPI_KEY is not set — hotel search is not configured.');
  }
  const url = new URL(`${BASE_URL}${path}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'x-rapidapi-host': RAPIDAPI_HOST,
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Xeni request failed [${path}] with status ${response.status}`);
  }
  return response.json();
}

// ── Cacheable endpoints ──────────────────────────────────────────────────
export const fetchAutocomplete = (query) => xeniGet(XENI_PATHS.AUTOCOMPLETE, { key: query });

export const fetchProperties = ({ placeId, checkIn, checkOut, adults, children, childrenAges, countryOfResidence, page, limit }) =>
  xeniPost(XENI_PATHS.PROPERTIES, {
    params: { page, limit },
    body: {
      place_id: placeId,
      checkin_date: checkIn,
      checkout_date: checkOut,
      occupancy: [{ adults, children, childrenAges }],
      country_of_residence: countryOfResidence,
    },
  });

export const fetchPropertyDetails = (propertyId) => xeniGet(`${XENI_PATHS.PROPERTY_DETAILS}/${propertyId}`);

// ── Non-cached / transactional endpoints ─────────────────────────────────
export const fetchAvailability = ({ placeId, propertyId, checkIn, checkOut, adults, children, childrenAges, countryOfResidence }) =>
  xeniPost(XENI_PATHS.AVAILABILITY, {
    body: {
      place_id: placeId,
      property_id: propertyId,
      checkin_date: checkIn,
      checkout_date: checkOut,
      occupancy: [{ adults, children, childrenAges }],
      country_of_residence: countryOfResidence,
    },
  });

export const fetchPriceConfirmation = (availabilityToken) =>
  xeniPost(XENI_PATHS.PRICE_CONFIRMATION, { body: { availability_token: availabilityToken } });

export const submitBooking = ({ pricingToken, email, phone, rooms }) =>
  xeniPost(XENI_PATHS.BOOKINGS, {
    body: {
      pricing_token: pricingToken,
      email,
      phone: { country_code: phone?.countryCode, number: phone?.number },
      rooms: (rooms || []).map((r) => ({ title: r.title, first_name: r.firstName, last_name: r.lastName })),
    },
  });

export const fetchBookingDetail = (bookingId) => xeniGet(`${XENI_PATHS.BOOKINGS}/${bookingId}`);

export { isConfigured as isXeniConfigured };
