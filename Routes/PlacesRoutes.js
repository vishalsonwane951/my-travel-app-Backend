// Routes/PlacesRoutes.js  —  uses OpenStreetMap Nominatim (free, no API key)
import express from 'express';

const router = express.Router();

// Popular Indian destinations with pre-seeded data for instant autocomplete
const POPULAR_DESTINATIONS = [
  // Goa
  { name: 'Goa', sub: 'Beach Paradise, India', placeId: 'goa_in' },
  { name: 'North Goa', sub: 'Calangute · Baga · Anjuna', placeId: 'north_goa_in' },
  { name: 'South Goa', sub: 'Palolem · Colva · Agonda', placeId: 'south_goa_in' },
  // Kerala
  { name: 'Kerala', sub: "God's Own Country, India", placeId: 'kerala_in' },
  { name: 'Alleppey (Alappuzha)', sub: 'Backwaters, Kerala', placeId: 'alleppey_in' },
  { name: 'Munnar', sub: 'Hill Station, Kerala', placeId: 'munnar_in' },
  { name: 'Kochi (Cochin)', sub: 'Heritage City, Kerala', placeId: 'kochi_in' },
  { name: 'Wayanad', sub: 'Wildlife & Hills, Kerala', placeId: 'wayanad_in' },
  // Rajasthan
  { name: 'Rajasthan', sub: 'Land of Kings, India', placeId: 'rajasthan_in' },
  { name: 'Jaipur', sub: 'Pink City, Rajasthan', placeId: 'jaipur_in' },
  { name: 'Udaipur', sub: 'City of Lakes, Rajasthan', placeId: 'udaipur_in' },
  { name: 'Jodhpur', sub: 'Blue City, Rajasthan', placeId: 'jodhpur_in' },
  { name: 'Jaisalmer', sub: 'Golden City, Rajasthan', placeId: 'jaisalmer_in' },
  { name: 'Pushkar', sub: 'Holy Town, Rajasthan', placeId: 'pushkar_in' },
  // Himachal
  { name: 'Manali', sub: 'Hill Station, Himachal Pradesh', placeId: 'manali_in' },
  { name: 'Shimla', sub: 'Queen of Hills, Himachal Pradesh', placeId: 'shimla_in' },
  { name: 'Dharamshala', sub: 'Little Lhasa, Himachal Pradesh', placeId: 'dharamshala_in' },
  { name: 'Kasol', sub: 'Mini Israel, Himachal Pradesh', placeId: 'kasol_in' },
  { name: 'Spiti Valley', sub: 'Cold Desert, Himachal Pradesh', placeId: 'spiti_in' },
  // Maharashtra
  { name: 'Mumbai', sub: 'City of Dreams, Maharashtra', placeId: 'mumbai_in' },
  { name: 'Pune', sub: 'Cultural Capital, Maharashtra', placeId: 'pune_in' },
  { name: 'Aurangabad', sub: 'Ajanta & Ellora Gateway, Maharashtra', placeId: 'aurangabad_in' },
  { name: 'Lonavala', sub: 'Hill Station, Maharashtra', placeId: 'lonavala_in' },
  { name: 'Mahabaleshwar', sub: 'Strawberry Country, Maharashtra', placeId: 'mahabaleshwar_in' },
  // Delhi & North
  { name: 'Delhi', sub: 'Capital City, India', placeId: 'delhi_in' },
  { name: 'Agra', sub: 'Taj Mahal City, Uttar Pradesh', placeId: 'agra_in' },
  { name: 'Varanasi', sub: 'City of Light, Uttar Pradesh', placeId: 'varanasi_in' },
  { name: 'Rishikesh', sub: 'Yoga Capital, Uttarakhand', placeId: 'rishikesh_in' },
  { name: 'Haridwar', sub: 'Gateway to God, Uttarakhand', placeId: 'haridwar_in' },
  { name: 'Mussoorie', sub: 'Queen of Hills, Uttarakhand', placeId: 'mussoorie_in' },
  { name: 'Nainital', sub: 'Lake District, Uttarakhand', placeId: 'nainital_in' },
  // South
  { name: 'Bangalore', sub: 'Garden City, Karnataka', placeId: 'bangalore_in' },
  { name: 'Mysore', sub: 'City of Palaces, Karnataka', placeId: 'mysore_in' },
  { name: 'Coorg', sub: 'Scotland of India, Karnataka', placeId: 'coorg_in' },
  { name: 'Chennai', sub: 'Gateway of South, Tamil Nadu', placeId: 'chennai_in' },
  { name: 'Ooty', sub: 'Queen of Nilgiris, Tamil Nadu', placeId: 'ooty_in' },
  { name: 'Hyderabad', sub: 'City of Pearls, Telangana', placeId: 'hyderabad_in' },
  // International
  { name: 'Bali, Indonesia', sub: 'Island of Gods', placeId: 'bali_id' },
  { name: 'Bangkok, Thailand', sub: 'City of Angels', placeId: 'bangkok_th' },
  { name: 'Dubai, UAE', sub: 'City of Gold', placeId: 'dubai_ae' },
  { name: 'Singapore', sub: 'Lion City', placeId: 'singapore_sg' },
  { name: 'Maldives', sub: 'Paradise Islands', placeId: 'maldives_mv' },
  { name: 'Paris, France', sub: 'City of Light', placeId: 'paris_fr' },
  { name: 'London, UK', sub: 'United Kingdom', placeId: 'london_uk' },
  { name: 'New York, USA', sub: 'The Big Apple', placeId: 'nyc_us' },
  { name: 'Malaysia', sub: 'Truly Asia', placeId: 'malaysia_my' },
  { name: 'Nepal', sub: 'Land of Himalayas', placeId: 'nepal_np' },
  { name: 'Sri Lanka', sub: 'Pearl of the Indian Ocean', placeId: 'srilanka_lk' },
  { name: 'Bhutan', sub: 'Land of Thunder Dragon', placeId: 'bhutan_bt' },
];

// Area data for known destinations
const AREA_DATA = {
  goa_in:        ['Calangute', 'Baga', 'Anjuna', 'Vagator', 'Palolem', 'Colva', 'Candolim', 'Arambol', 'Panaji'],
  north_goa_in:  ['Calangute Beach', 'Baga Beach', 'Anjuna Beach', 'Vagator Beach', 'Candolim', 'Sinquerim'],
  south_goa_in:  ['Palolem Beach', 'Colva Beach', 'Agonda Beach', 'Benaulim', 'Cavelossim'],
  kerala_in:     ['Alleppey', 'Munnar', 'Kochi', 'Wayanad', 'Kovalam', 'Varkala', 'Thekkady'],
  jaipur_in:     ['Old City (Pink City)', 'Civil Lines', 'Mansarovar', 'Malviya Nagar', 'C-Scheme', 'Vaishali Nagar'],
  udaipur_in:    ['Old City', 'Lake Pichola Area', 'Fateh Sagar', 'Hiran Magri', 'Sukhadia Circle'],
  manali_in:     ['Old Manali', 'Mall Road', 'Solang Valley', 'Vashisht', 'Naggar'],
  shimla_in:     ['Mall Road', 'The Ridge', 'Jakhu', 'Kufri', 'Mashobra', 'Chail'],
  mumbai_in:     ['Colaba', 'Bandra', 'Juhu', 'Andheri', 'Lower Parel', 'Marine Drive', 'Worli'],
  delhi_in:      ['Connaught Place', 'Old Delhi', 'Hauz Khas', 'Karol Bagh', 'Lajpat Nagar', 'Dwarka', 'Noida'],
  bali_id:       ['Seminyak', 'Ubud', 'Kuta', 'Nusa Dua', 'Canggu', 'Uluwatu', 'Sanur'],
  bangkok_th:    ['Sukhumvit', 'Silom', 'Khao San Road', 'Chatuchak', 'Siam', 'Ari'],
  dubai_ae:      ['Downtown Dubai', 'Dubai Marina', 'Deira', 'JBR Beach', 'Palm Jumeirah', 'Business Bay'],
};

// ── Destination search ────────────────────────────────────────
router.get('/search', (req, res) => {
  try {
    const q = (req.query.q || '').toLowerCase().trim();
    if (!q || q.length < 2) {
      return res.json({ results: [] });
    }

    const results = POPULAR_DESTINATIONS
      .filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.sub.toLowerCase().includes(q)
      )
      .slice(0, 8);

    return res.json({ results });
  } catch (err) {
    console.error('Places search error:', err.message);
    return res.status(500).json({ results: [] });
  }
});

// ── Area search within a destination ─────────────────────────
router.get('/areas', (req, res) => {
  try {
    const q       = (req.query.q || '').toLowerCase().trim();
    const placeId = req.query.placeId || '';

    // Get areas for this place
    const areas = AREA_DATA[placeId] || [];

    // Also check parent destination
    if (!areas.length) {
      const parentKey = Object.keys(AREA_DATA).find(k =>
        placeId.includes(k.split('_')[0])
      );
      if (parentKey) areas.push(...(AREA_DATA[parentKey] || []));
    }

    const filtered = q
      ? areas.filter(a => a.toLowerCase().includes(q))
      : areas;

    return res.json({
      results: filtered.slice(0, 6).map(a => ({ name: a, sub: null }))
    });
  } catch (err) {
    console.error('Areas search error:', err.message);
    return res.status(500).json({ results: [] });
  }
});

// ── Place details (lat/lng for area bias) ─────────────────────
router.get('/details/:placeId', (req, res) => {
  // Return dummy coords — area search above doesn't need real coords
  // since we use placeId-based lookup, not geographic bias
  return res.json({ success: true, location: null });
});

export default router;