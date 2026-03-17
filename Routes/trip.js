// Routes/trip.js  —  zero external API dependency
import express from 'express';
import { generateItinerary } from '../utils/tripEngine.js';

const router = express.Router();

function validateTripInput({ destination, checkin, checkout, travelers, tripType, budget }) {
  const errors = [];
  if (!destination || destination.trim().length < 2)
    errors.push('Destination is required (min 2 characters)');
  if (!checkin)
    errors.push('Check-in date is required');
  if (!checkout)
    errors.push('Check-out date is required');
  if (checkin && checkout && new Date(checkout) <= new Date(checkin))
    errors.push('Check-out must be after check-in');
  if (!travelers || travelers < 1 || travelers > 50)
    errors.push('Travelers must be between 1 and 50');
  if (!tripType)
    errors.push('Trip type is required');
  if (!budget || !['budget', 'standard', 'premium', 'luxury'].includes(budget))
    errors.push('Budget must be one of: budget, standard, premium, luxury');
  return errors;
}

router.post('/plan-trip', (req, res) => {
  try {
    const errors = validateTripInput(req.body);
    if (errors.length) {
      return res.status(400).json({ success: false, errors });
    }

    const {
      destination,
      area = '',
      checkin,
      checkout,
      travelers,
      tripType,
      budget,
    } = req.body;

    const itinerary = generateItinerary({
      destination: destination.trim(),
      area:        area.trim(),
      checkin,
      checkout,
      travelers:   parseInt(travelers),
      tripType,
      budget,
    });

    return res.json({ success: true, itinerary });

  } catch (err) {
    console.error('Trip planning error:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Something went wrong generating your itinerary. Please try again.',
    });
  }
});

export default router;