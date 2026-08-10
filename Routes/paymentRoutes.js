import express from 'express';
import { protect } from '../Middlewares/authMiddleware.js';
import { createPaymentOrder, verifyPayment, getBookingPayments } from '../Controllers/paymentController.js';

const router = express.Router();

router.post('/create-order', protect, createPaymentOrder);
router.post('/verify', protect, verifyPayment);
router.get('/booking/:bookingId', protect, getBookingPayments);

export default router;
