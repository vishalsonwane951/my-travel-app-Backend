const express = require('express');
const router  = express.Router();
const { callGemini, parseJSON } = require('../services/geminiService');

const SYSTEM_PROMPT = `You are a travel destination search engine. Always respond with valid JSON only — no markdown, no preamble, no trailing text.`;

// ── GET /api/places/search?q= ─────────────────────────────────────────────────
router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim().length < 2) return res.json({ results: [] });

  try {
    const prompt = `List up to 6 real travel destinations matching "${q}".
Focus on Indian destinations first, then international.

Respond ONLY with this JSON:
{
  "results": [
    {
      "name": "City or Region name",
      "sub": "State, Country",
      "placeId": "unique-slug like goa-india or bali-indonesia"
    }
  ]
}`;

    const raw  = await callGemini(prompt, SYSTEM_PROMPT);
    const data = parseJSON(raw);
    res.json({ results: data.results || [] });
  } catch (err) {
    console.error('Places search error:', err.message);
    res.json({ results: [] });
  }
});

// ── GET /api/places/areas?q=&placeId= ────────────────────────────────────────
router.get('/areas', async (req, res) => {
  const { q, placeId } = req.query;
  if (!q || q.trim().length < 2) return res.json({ results: [] });

  const destination = placeId
    ? placeId.replace(/-/g, ' ')
    : 'the destination';

  try {
    const prompt = `List up to 6 specific areas, neighbourhoods, beaches, or zones in ${destination} matching "${q}".

Respond ONLY with this JSON:
{
  "results": [
    {
      "name": "Area or neighbourhood name",
      "sub": "Brief description e.g. 'Beach area' or 'Old town'"
    }
  ]
}`;

    const raw  = await callGemini(prompt, SYSTEM_PROMPT);
    const data = parseJSON(raw);
    res.json({ results: data.results || [] });
  } catch (err) {
    console.error('Areas search error:', err.message);
    res.json({ results: [] });
  }
});

// ── GET /api/places/details/:placeId ─────────────────────────────────────────
router.get('/details/:placeId', async (req, res) => {
  const { placeId } = req.params;
  if (!placeId) return res.json({ success: false });

  try {
    const destination = placeId.replace(/-/g, ' ');
    const prompt = `Give the approximate latitude and longitude for: ${destination}.

Respond ONLY with this JSON:
{
  "name": "Full place name",
  "location": { "lat": 0.0, "lng": 0.0 }
}`;

    const raw  = await callGemini(prompt, SYSTEM_PROMPT);
    const data = parseJSON(raw);
    res.json({ success: true, ...data });
  } catch (err) {
    console.error('Place details error:', err.message);
    res.json({ success: false });
  }
});

module.exports = router;