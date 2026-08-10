import asyncHandler from 'express-async-handler';
import Booking from '../Models/Booking.js';
import Package from '../Models/PackagesModel.js';

// GET /api/recommendations  (auth optional — falls back to popular packages for guests)
export const getRecommendations = asyncHandler(async (req, res) => {
  let recommended = [];

  if (req.user) {
    const pastBookings = await Booking.find({ user: req.user._id }).select('destination packageName');
    const destinations = [...new Set(pastBookings.map((b) => b.destination).filter(Boolean))];

    if (destinations.length) {
      // Similar packages: same destination-region the user has booked before, excluding exact repeats
      const bookedNames = new Set(pastBookings.map((b) => b.packageName));
      recommended = await Package.find({
        active: true,
        destination: { $in: destinations },
        title: { $nin: [...bookedNames] },
      }).sort({ avgRating: -1 }).limit(8);
    }
  }

  if (recommended.length < 8) {
    // Fill the rest with genuinely popular packages (by review count / rating), not random
    const exclude = recommended.map((p) => p._id);
    const popular = await Package.find({ active: true, _id: { $nin: exclude } })
      .sort({ reviewCount: -1, avgRating: -1 })
      .limit(8 - recommended.length);
    recommended = [...recommended, ...popular];
  }

  res.json({ success: true, recommendations: recommended });
});
