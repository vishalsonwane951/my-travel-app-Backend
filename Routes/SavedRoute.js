import express   from 'express';
import Itinerary from '../Models/AiModel.js';

const router = express.Router();

// POST /api/saved — save an itinerary
router.post('/', async (req, res) => {
  try {
    const { itinerary, sessionId } = req.body;
    if (!itinerary?.destination)
      return res.status(400).json({ success: false, error: 'Itinerary data is required' });

    const doc = await Itinerary.create({ ...itinerary, sessionId: sessionId || 'anonymous' });
    res.json({ success: true, id: doc._id });
  } catch (err) {
    console.error('Save error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to save itinerary' });
  }
});

// GET /api/saved?sessionId=xxx — list saved itineraries for a session
router.get('/', async (req, res) => {
  try {
    const { sessionId } = req.query;
    if (!sessionId) return res.json({ success: true, itineraries: [] });

    const itineraries = await Itinerary
      .find({ sessionId })
      .sort({ createdAt: -1 })
      .select('destination area checkin checkout nights travelers tripType budget totalCostEstimate createdAt')
      .limit(20);

    res.json({ success: true, itineraries });
  } catch (err) {
    console.error('List error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to fetch itineraries' });
  }
});

// GET /api/saved/:id — get one full itinerary
router.get('/:id', async (req, res) => {
  try {
    const doc = await Itinerary.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, itinerary: doc });
  } catch (err) {
    console.error('Get error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to fetch itinerary' });
  }
});

// DELETE /api/saved/:id — delete one itinerary
router.delete('/:id', async (req, res) => {
  try {
    await Itinerary.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('Delete error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to delete' });
  }
});

export default router;