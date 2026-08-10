import asyncHandler from 'express-async-handler';
import Itinerary from '../../Models/AiModel.js';

// GET /api/admin/ai-trips
export const listItineraries = asyncHandler(async (req, res) => {
  const { destination, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (destination) filter.destination = new RegExp(destination, 'i');
  const [itineraries, total] = await Promise.all([
    Itinerary.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit))
      .select('destination area nights travelers tripType budget totalCostEstimate createdAt sessionId'),
    Itinerary.countDocuments(filter),
  ]);
  res.json({ success: true, itineraries, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// GET /api/admin/ai-trips/:id — full generated plan
export const getItinerary = asyncHandler(async (req, res) => {
  const itinerary = await Itinerary.findById(req.params.id);
  if (!itinerary) return res.status(404).json({ success: false, message: 'Itinerary not found.' });
  res.json({ success: true, itinerary });
});

// GET /api/admin/ai-trips/stats — usage overview for the console
export const getAiTripStats = asyncHandler(async (req, res) => {
  const [total, topDestinations, byTripType] = await Promise.all([
    Itinerary.countDocuments(),
    Itinerary.aggregate([
      { $group: { _id: '$destination', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    Itinerary.aggregate([
      { $group: { _id: '$tripType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
  ]);
  res.json({
    success: true,
    stats: {
      totalGenerated: total,
      topDestinations: topDestinations.map((d) => ({ destination: d._id || 'Unknown', count: d.count })),
      byTripType: byTripType.map((t) => ({ tripType: t._id || 'Unspecified', count: t.count })),
    },
  });
});

export const deleteItinerary = asyncHandler(async (req, res) => {
  await Itinerary.findByIdAndDelete(req.params.id);
  await req.audit?.({ action: 'delete', module: 'ai-trips', targetId: req.params.id });
  res.json({ success: true, message: 'Itinerary removed.' });
});
