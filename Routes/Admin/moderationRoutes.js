import express from 'express';
import { protect } from '../../Middlewares/authMiddleware.js';
import { authorize } from '../../Middlewares/authorize.js';
import {
  listReviewsForModeration, moderateReview, deleteReview,
  listQaForModeration, answerQuestion, deleteQuestion,
} from '../../Controllers/Admin/moderationController.js';

const router = express.Router();
router.use(protect, authorize('superadmin', 'content', 'support'));

router.get('/reviews', listReviewsForModeration);
router.put('/reviews/:packageId/:reviewId/status', moderateReview);
router.delete('/reviews/:packageId/:reviewId', deleteReview);

router.get('/qa', listQaForModeration);
router.post('/qa/:packageId/:questionId/answer', answerQuestion);
router.delete('/qa/:packageId/:questionId', deleteQuestion);

export default router;
