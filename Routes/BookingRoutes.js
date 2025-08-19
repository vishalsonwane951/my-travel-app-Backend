import { Router } from "express";
import { protect } from "../Middlewares/authMiddleware.js";
import { createBooking,sendMobileOtp,sendEmailOtp,verifyBookingOtp,getBookings } from "../Controllers/bookingController.js";

const router = Router();

// OTP Routes

router.post("/sendMobileOtp", sendMobileOtp);
router.post("/sendEmailOtp", sendEmailOtp);
router.post("/verify", verifyBookingOtp);



router.post("/booking", protect, createBooking);
router.get("/my-bookings", protect, getBookings);
// router.get("/my-favourites", protect, getMyFavourites)




export default router;  
