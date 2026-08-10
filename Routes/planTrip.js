import express from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import { generateItinerary } from '../services/itineraryService.js';
import { attachTravelTimes } from '../services/budgetService.js';
import { findAttractions, findRestaurants, findHotels } from '../services/placesSearchService.js';

const router = express.Router();

router.post('/plan-trip', asyncHandler(async (req, res) => {
  const { destination, area, checkin, checkout, travelers, tripType, pace, diet, budget } = req.body;

  const errors = [];
  if (!destination) errors.push('destination is required');
  if (!checkin) errors.push('checkin is required');
  if (!checkout) errors.push('checkout is required');
  if (!budget) errors.push('budget is required');
  if (errors.length) return res.status(400).json({ success: false, errors });

  const nights = Math.round((new Date(checkout) - new Date(checkin)) / 86400000);
  if (!(nights > 0)) {
    return res.status(400).json({ success: false, errors: ['checkout must be after checkin'] });
  }

  // Real candidate places from Google Places — hotels, attractions, restaurants
  const [attractions, restaurants, hotels] = await Promise.all([
    findAttractions(destination, area),
    findRestaurants(destination, area, diet),
    findHotels(destination, area, budget),
  ]);

  if (!attractions.length || !restaurants.length || !hotels.length) {
    return res.status(502).json({
      success: false,
      error: 'Could not find enough places for this destination. Try a different destination or area.',
    });
  }

  // AI (Gemini) picks hotels, builds the day-by-day plan, prices everything,
  // and computes the budget breakdown itself — grounded in the real
  // candidates above, not a fixed formula.
  let itinerary = await generateItinerary({
    destination, area, checkin, nights, travelers, tripType, pace, diet, budget,
    attractions, restaurants, hotels,
  });

  itinerary = await attachTravelTimes(itinerary);

  res.json({ success: true, itinerary });
}));

export default router;const express = require('express');
const router = express.Router();

const { validateTripInput } = require('../utils/validateTripInput');
const { geocode, fetchCandidatePlaces } = require('../services/places');
const { generateItinerary } = require('../services/aiItinerary');
const { attachTravelTimes, computeBudgetBreakdown } = require('../services/enrich');

function getNights(checkin, checkout) {
  return Math.round((new Date(checkout) - new Date(checkin)) / 86400000);
}

router.post('/plan-trip', async (req, res) => {
  const {
    destination, area, checkin, checkout,
    travelers, tripType, pace = 'balanced', diet = 'Any', budget,
  } = req.body || {};

  // 1. Validate
  const errors = validateTripInput(req.body);
  if (errors.length) {
    return res.status(400).json({ success: false, errors });
  }

  try {
    // 2. Geocode destination (falls back to the destination string if area is empty)
    const geo = await geocode(area || destination);
    if (!geo) {
      return res.status(400).json({ success: false, error: `Could not locate "${area || destination}"` });
    }

    // 3. Fetch real candidate places near the destination
    const { attractions, restaurants } = await fetchCandidatePlaces(geo, { tripType, diet, budget });
    if (!attractions.length && !restaurants.length) {
      return res.status(422).json({ success: false, error: 'No places found for this destination yet' });
    }

    // 4. Build prompt + call the AI model, grounded in the real place list
    const nights = getNights(checkin, checkout);
    const rawItinerary = await generateItinerary({
      destination, area, checkin, nights, travelers, tripType, pace, diet, budget,
      attractions, restaurants,
    });

    // 5. Enrich: travel times between consecutive stops + budget breakdown
    const enrichedDays = await attachTravelTimes(rawItinerary);
    const budgetBreakdown = computeBudgetBreakdown(budget, nights, travelers);

    const itinerary = {
      destination,
      area,
      checkin,
      checkout,
      travelers,
      tripType,
      pace,
      diet,
      budget: budgetBreakdown,
      days: enrichedDays.days,
      localTips: rawItinerary.localTips || null,
    };

    // 6. Return itinerary JSON
    return res.json({ success: true, itinerary });
  } catch (err) {
    console.error('[plan-trip] failed:', err);
    return res.status(500).json({ success: false, error: 'Failed to generate itinerary. Please try again.' });
  }
});

module.exports = router;