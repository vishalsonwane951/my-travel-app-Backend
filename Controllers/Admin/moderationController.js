import asyncHandler from 'express-async-handler';
import Package from '../../Models/PackagesModel.js';

// GET /api/admin/moderation/reviews?status=pending
export const listReviewsForModeration = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const packages = await Package.find(
    status ? { 'reviews.status': status } : { 'reviews.0': { $exists: true } },
    { title: 1, reviews: 1 }
  );

  const flattened = [];
  for (const pkg of packages) {
    for (const rev of pkg.reviews) {
      if (status && rev.status !== status) continue;
      flattened.push({
        packageId: pkg._id,
        packageTitle: pkg.title,
        reviewId: rev._id,
        name: rev.name,
        rating: rev.rating,
        title: rev.title,
        text: rev.text,
        status: rev.status,
        createdAt: rev.createdAt,
      });
    }
  }
  flattened.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ success: true, reviews: flattened });
});

// PUT /api/admin/moderation/reviews/:packageId/:reviewId/status  { status: 'approved' | 'rejected' }
export const moderateReview = asyncHandler(async (req, res) => {
  const { packageId, reviewId } = req.params;
  const { status } = req.body;
  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ success: false, message: 'status must be approved, rejected or pending.' });
  }

  const pkg = await Package.findOneAndUpdate(
    { _id: packageId, 'reviews._id': reviewId },
    { $set: { 'reviews.$.status': status } },
    { new: true }
  );
  if (!pkg) return res.status(404).json({ success: false, message: 'Review not found.' });

  await req.audit?.({ action: 'moderate', module: 'reviews', targetId: reviewId, after: { status } });
  res.json({ success: true, message: `Review ${status}.` });
});

// DELETE /api/admin/moderation/reviews/:packageId/:reviewId
export const deleteReview = asyncHandler(async (req, res) => {
  const { packageId, reviewId } = req.params;
  const pkg = await Package.findById(packageId);
  if (!pkg) return res.status(404).json({ success: false, message: 'Package not found.' });

  pkg.reviews = pkg.reviews.filter((r) => String(r._id) !== reviewId);
  pkg.reviewCount = pkg.reviews.length;
  pkg.avgRating = pkg.reviews.length
    ? +(pkg.reviews.reduce((s, r) => s + r.rating, 0) / pkg.reviews.length).toFixed(1)
    : 0;
  await pkg.save();

  await req.audit?.({ action: 'delete', module: 'reviews', targetId: reviewId });
  res.json({ success: true, message: 'Review deleted.' });
});

// GET /api/admin/moderation/qa?status=unanswered
export const listQaForModeration = asyncHandler(async (req, res) => {
  const packages = await Package.find({ 'qa.0': { $exists: true } }, { title: 1, qa: 1 });
  const flattened = [];
  for (const pkg of packages) {
    for (const q of pkg.qa) {
      flattened.push({
        packageId: pkg._id,
        packageTitle: pkg.title,
        questionId: q._id,
        question: q.question,
        askedBy: q.author,
        answers: q.answers,
        createdAt: q.createdAt,
      });
    }
  }
  if (req.query.status === 'unanswered') {
    return res.json({ success: true, questions: flattened.filter((q) => !q.answers?.length) });
  }
  flattened.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ success: true, questions: flattened });
});

// POST /api/admin/moderation/qa/:packageId/:questionId/answer  { text }
export const answerQuestion = asyncHandler(async (req, res) => {
  const { packageId, questionId } = req.params;
  const { text } = req.body;
  if (!text) return res.status(400).json({ success: false, message: 'text is required.' });

  const pkg = await Package.findById(packageId);
  if (!pkg) return res.status(404).json({ success: false, message: 'Package not found.' });
  const question = pkg.qa.id(questionId);
  if (!question) return res.status(404).json({ success: false, message: 'Question not found.' });

  question.answers.push({ text, authorName: req.user?.name || 'Desivdesi Team', isOfficial: true, userId: req.user?._id });
  question.syncAnswer();
  await pkg.save();

  await req.audit?.({ action: 'answer', module: 'qa', targetId: questionId });
  res.json({ success: true, message: 'Answer posted.' });
});

// DELETE /api/admin/moderation/qa/:packageId/:questionId
export const deleteQuestion = asyncHandler(async (req, res) => {
  const { packageId, questionId } = req.params;
  const pkg = await Package.findById(packageId);
  if (!pkg) return res.status(404).json({ success: false, message: 'Package not found.' });
  pkg.qa = pkg.qa.filter((q) => String(q._id) !== questionId);
  await pkg.save();
  await req.audit?.({ action: 'delete', module: 'qa', targetId: questionId });
  res.json({ success: true, message: 'Question removed.' });
});
