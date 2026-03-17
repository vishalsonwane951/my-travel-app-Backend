import express from 'express'
import * as ctrl from '../Controllers/bookingController.js';
import { protect, admin, optionalAuth } from '../Middlewares/authMiddleware.js';
import { createPackageInquiry, createBooking, getMyBookings, getUserConfirmedBookings, getUserBookings, 
    getBookingById, getAllBookings, getAllConfirmedBookings,updateBookingStatus,deleteBooking, updateBooking
 } from'../Controllers/bookingController.js';

const router = express.Router();
// Public
router.post('/package-inquiry', ctrl.createPackageInquiry);

// Authenticated
router.post('/create', protect, ctrl.createBooking);
router.get('/mine', protect, ctrl.getMyBookings);
router.get('/confirmed-user', protect, ctrl.getUserConfirmedBookings);
router.get('/user/:userId', protect, ctrl.getUserBookings);
router.get('/:id', protect, ctrl.getBookingById);

// Admin
router.get('/', protect, admin, ctrl.getAllBookings);
router.get('/confirmed', protect, admin, ctrl.getAllConfirmedBookings);
router.put('/update-status/:bookingId', protect, admin, ctrl.updateBookingStatus);
router.put('/:id', protect, admin, ctrl.updateBooking);
router.delete('/delete/:bookingId', protect, admin, ctrl.deleteBooking);
router.delete('/:id', protect, admin, ctrl.deleteBooking);

export default router;
