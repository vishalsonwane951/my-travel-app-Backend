// backend/routes/reviewRoutes.js
import { Router } from "express";
const router     = Router();
import { getReviews, createReview, markHelpful } from "../Controllers/Reviewcontroller.js";
import { optionalAuth, protect } from "../Middlewares/authMiddleware.js";
// optionalAuth  — attaches req.user if token present, but doesn't block
// requireAuth   — blocks with 401 if no valid token

// GET  /api/reviews/:packageId   — public, no auth required
router.get("/:packageId", getReviews);

// POST /api/reviews              — auth optional (guest reviews allowed)
router.post("/", optionalAuth, createReview);

// POST /api/reviews/:reviewId/helpful — auth optional (falls back to IP)
router.post("/:reviewId/helpful", optionalAuth, markHelpful);

export default router;