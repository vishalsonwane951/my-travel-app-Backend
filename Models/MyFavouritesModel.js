import mongoose from "mongoose";

const FavouriteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: "Package", required: true },
    title: { type: String, required: true },
    subtitle: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Favourite", FavouriteSchema);
