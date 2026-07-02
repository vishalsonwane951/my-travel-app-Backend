// backend/routes/qaRoutes.js
import { Router } from "express";
const router = Router();
import { getQA, createQuestion, submitAnswer } from "../Controllers/Q&Acontroller.js";
import { optionalAuth, protect } from "../Middlewares/authMiddleware.js";

// GET  /api/qa/:packageId                  — public
router.get("/:packageId", getQA);

// POST /api/qa                             — auth optional
router.post("/", optionalAuth, createQuestion);

// POST /api/qa/:questionId/answer          — must be logged in to answer
router.post("/:questionId/answer", protect, submitAnswer);

export default router;