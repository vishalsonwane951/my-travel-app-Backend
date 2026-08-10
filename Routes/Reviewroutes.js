// backend/routes/reviewRoutes.js
import { Router } from "express";
const router     = Router();
import { getReviews, createReview, markHelpful } from "../Controllers/Reviewcontroller.js";
import { optionalAuth, protect } from "../Middlewares/authMiddleware.js";
import { uploaders } from "../utils/cloudinary.js";
// optionalAuth  — attaches req.user if token present, but doesn't block
// requireAuth   — blocks with 401 if no valid token

// GET  /api/reviews/:packageId   — public, no auth required
router.get("/:packageId", getReviews);

// POST /api/reviews              — auth optional (guest reviews allowed), up to 4 photos
router.post("/", optionalAuth, uploaders.reviews.array("photos", 4), createReview);

// POST /api/reviews/:reviewId/helpful — auth optional (falls back to IP)
router.post("/:reviewId/helpful", optionalAuth, markHelpful);

export default router;// backend/routes/reviewRoutes.js
