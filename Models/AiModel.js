import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema({
  time: String, name: String, description: String, cost: String,
}, { _id: false });

const FoodSchema = new mongoose.Schema({
  meal: String, place: String, description: String, cost: String,
}, { _id: false });

const StaySchema = new mongoose.Schema({
  name: String, type: String, cost: String,
}, { _id: false });

const DaySchema = new mongoose.Schema({
  day: Number, title: String,
  activities:      [ActivitySchema],
  food:            [FoodSchema],
  stay:            StaySchema,
  dayCostEstimate: String,
}, { _id: false });

const ItinerarySchema = new mongoose.Schema({
  destination:       { type: String, required: true },
  area:              String,
  checkin:           String,
  checkout:          String,
  nights:            Number,
  travelers:         Number,
  tripType:          String,
  budget:            String,
  summary:           String,
  totalCostEstimate: String,
  days:              [DaySchema],
  tips:              [String],
  bestTimeToVisit:   String,
  localTransport:    String,
  createdAt:         { type: Date, default: Date.now },
  sessionId:         String,
});

export default mongoose.model('Itinerary', ItinerarySchema);