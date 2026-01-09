import { Router } from "express";
import { protect, admin } from "../Middlewares/authMiddleware.js";
import { sendMobileOtp,sendEmailOtp,verifyBookingOtp,updateBookingStatus,
createBooking,getUserBookings,deleteBooking,getAllBookings,
getUserConfirmedBookings
 } from "../Controllers/bookingController.js";

const router = Router();

// OTP Routes

router.post("/sendMobileOtp", sendMobileOtp);
router.post("/sendEmailOtp", sendEmailOtp);
router.post("/verify", verifyBookingOtp);


// Auth middleware to get req.user
// router.use(authMiddleware);

// Create new enquiry
router.post("/create",protect,createBooking);

// Get all bookings/enquiries of a user
router.get("/user/:userId", getUserBookings);
router.get("/",protect, admin, getAllBookings);

// Update status (admin only)
router.put("/update-status/:bookingId",protect,admin, updateBookingStatus);

// Delete booking (admin only)
router.delete("/delete/:bookingId",protect,admin, deleteBooking);


// router.get("/confirmed", protect, getConfirmedBookings);

// router.post("/booking", protect, createBooking);
// router.get("/getbookings", protect, getBookings);
// router.get("/my-favourites", protect, getMyFavourites)


router.get("/confirmed-user", protect, getUserConfirmedBookings);




export default router;  
