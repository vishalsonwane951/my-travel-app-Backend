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

export default router;