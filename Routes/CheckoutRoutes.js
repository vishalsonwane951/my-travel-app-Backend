import express from 'express';
import { optionalAuth } from '../Middlewares/authMiddleware.js';
import { getQuote, createCheckoutBooking } from '../Controllers/checkoutController.js';

const router = express.Router();

router.post('/quote', getQuote);
router.post('/book', optionalAuth, createCheckoutBooking);

export default router;
