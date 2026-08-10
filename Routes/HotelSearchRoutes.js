import express from 'express';
import {
  autocomplete, searchProperties, propertyDetails,
  checkAvailability, priceConfirmation, createHotelBooking, bookingDetail,
} from '../Controllers/hotelSearchController.js';

const router = express.Router();

// Cached (DB-first, 30-day TTL, falls back to Xeni on a miss)
router.get('/autocomplete', autocomplete);
router.post('/search', searchProperties);
router.get('/property/:propertyId', propertyDetails);

// Not cached — transactional/time-sensitive
router.post('/availability', checkAvailability);
router.post('/price-confirmation', priceConfirmation);
router.post('/bookings', createHotelBooking);
router.get('/bookings/:bookingId', bookingDetail);

export default router;
