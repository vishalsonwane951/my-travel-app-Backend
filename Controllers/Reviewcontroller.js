import Package from '../Models/ReviewModel.js';
import crypto  from 'crypto';

// ─── Helper: recalculate & persist aggregate stats ───────────────────────────
function recalcStats(pkg) {
  const approved = pkg.reviews.filter((r) => r.status === 'approved');
  pkg.reviewCount = approved.length;
  pkg.avgRating   = approved.length
    ? parseFloat(
        (approved.reduce((s, r) => s + r.rating, 0) / approved.length).toFixed(1)
      )
    : 0;
  pkg.rating = pkg.avgRating || pkg.rating; // keep top-level rating in sync
}

// ─── GET /api/reviews/:packageId ─────────────────────────────────────────────
export async function getReviews(req, res) {
  try {
    const { pkgId } = req.params;
    const { page = 1, limit = 100, sort = '-createdAt' } = req.query;

    // Pull only the reviews sub-array (lean for speed)
    const pkg = await Package.findById(pkgId)
      .select('reviews reviewCount avgRating')
      .lean();

    if (!pkg) {
      return res.status(404).json({ message: 'Package not found.' });
    }

    // Filter to approved only
    let reviews = (pkg.reviews || []).filter((r) => r.status === 'approved');

    // Sort
    const desc = sort.startsWith('-');
    const field = sort.replace(/^-/, '');
    reviews.sort((a, b) => {
      const av = a[field] ?? a.createdAt;
      const bv = b[field] ?? b.createdAt;
      return desc ? (bv > av ? 1 : -1) : (av > bv ? 1 : -1);
    });

    const total = reviews.length;
    const pages = Math.ceil(total / +limit);
    const paged = reviews.slice((+page - 1) * +limit, +page * +limit);

    return res.json({ reviews: paged, total, page: +page, pages });
  } catch (err) {
    console.error('getReviews:', err);
    return res.status(500).json({ message: 'Failed to fetch reviews.' });
  }
}

// ─── POST /api/reviews ────────────────────────────────────────────────────────
// Body: { packageId, rating, title, text, tripType, name, location, type? }
// Also accepts multipart/form-data with photos[] files (handled by multer upstream)
export async function createReview(req, res) {
  const {type, location, pkgId}= req.params

alert(pkgId)
  try {
    const {
      packageId:pkgId,
      rating,
      title,
      text,
      tripType: type,
      name: bodyName,
      location,
      type: reviewType, // "qa" submissions routed here are ignored
    } = req.body;

    // ── Basic validation ──────────────────────────────────────────────────
    if (!packageId) {
      return res.status(400).json({ message: 'packageId is required.' });
    }
    if (!rating || !text) {
      return res.status(400).json({ message: 'rating and text are required.' });
    }
    if (+rating < 1 || +rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }
    if (text.trim().length < 10) {
      return res.status(400).json({ message: 'Review text must be at least 10 characters.' });
    }

    // ── Find the package ──────────────────────────────────────────────────
    const pkg = await Package.findById(pkgId);
    if (!pkg) {
      return res.status(404).json({ message: 'Package not found.' });
    }

    // ── Resolve author name ───────────────────────────────────────────────
    const authorName =
      req.user?.fullName ||
      req.user?.name     ||
      (bodyName || '').trim() ||
      'Anonymous';

    // ── Handle uploaded photos (if multer added them) ─────────────────────
    const photos = [];
    if (req.files?.length) {
      req.files.forEach((f) => {
        // If using Cloudinary the secure_url is on f.path or f.secure_url
        photos.push(f.secure_url || f.path || '');
      });
    }

    // ── Build the embedded review object ──────────────────────────────────
    const newReview = {
      userId:   req.user?._id || null,
      name:     authorName,
      location: (location || '').trim() || req.user?.city || 'India',
      rating:   +rating,
      title:    (title || '').trim() || 'My Experience',
      text:     text.trim(),
      tripType: tripType || 'Family',
      status:   'approved', // change to 'pending' for manual moderation
      photos,
    };

    // ── Push review & recalculate stats ───────────────────────────────────
    pkg.reviews.push(newReview);
    recalcStats(pkg);
    await pkg.save();

    // Return the newly added review (last element after push)
    const saved = pkg.reviews[pkg.reviews.length - 1];

    return res.status(201).json({
      message: 'Review submitted.',
      review:  saved.toJSON ? saved.toJSON() : saved,
    });
  } catch (err) {
    console.error('createReview:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Failed to submit review.' });
  }
}

// ─── POST /api/reviews/:reviewId/helpful ─────────────────────────────────────
// reviewId here is the sub-document _id inside package.reviews
export async function markHelpful(req, res) {
  try {
    const { reviewId } = req.params;

    // Identify the voter by userId or a hash of their IP
    const voterId = req.user?._id?.toString()
      || crypto.createHash('sha256')
               .update(req.ip || 'unknown')
               .digest('hex')
               .slice(0, 16);

    // Find the package that contains this review
    const pkg = await Package.findOne(
      { 'reviews._id': reviewId },
      { 'reviews.$': 1 } // projection trick to get the matching review first
    );

    // We need the full reviews array to update it, so fetch again without projection
    const fullPkg = await Package.findOne({ 'reviews._id': reviewId });
    if (!fullPkg) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    const review = fullPkg.reviews.id(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    // Duplicate vote guard (helpfulVoters is select:false — load explicitly)
    const pkgWithVoters = await Package.findOne(
      { 'reviews._id': reviewId },
    ).select('+reviews.helpfulVoters');

    const reviewWithVoters = pkgWithVoters?.reviews?.id(reviewId);
    if (reviewWithVoters?.helpfulVoters?.includes(voterId)) {
      return res.status(409).json({ message: 'Already voted.' });
    }

    // Increment helpful & record voter
    await Package.updateOne(
      { 'reviews._id': reviewId },
      {
        $inc:  { 'reviews.$.helpful': 1 },
        $push: { 'reviews.$.helpfulVoters': voterId },
      }
    );

    return res.json({ message: 'Marked as helpful.', helpful: (review.helpful ?? 0) + 1 });
  } catch (err) {
    console.error('markHelpful:', err);
    return res.status(500).json({ message: 'Failed to mark as helpful.' });
  }
}