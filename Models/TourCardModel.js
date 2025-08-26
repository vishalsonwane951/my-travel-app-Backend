import mongoose from "mongoose";

const tourCardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  img: { type: String, required: true },
  category: { type: String, required: true },
  rating: { type: Number, default: 0 },
  status: { type: String, enum: ["like", "unlike"], default: "unlike" }
});

const TourCard = mongoose.model("TourCard", tourCardSchema);
export default TourCard;
