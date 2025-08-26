import mongoose from "mongoose";

const favouriteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tourCard: { type: mongoose.Schema.Types.ObjectId, ref: "TourCard", required: true },
  status: { type: String, enum: ["like", "unlike"], default: "unlike" }
}, { timestamps: true });

const Favourite = mongoose.model("Favourite", favouriteSchema);
export default Favourite;
