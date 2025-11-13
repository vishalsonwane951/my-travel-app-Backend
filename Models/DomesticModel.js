import mongoose from "mongoose";

// ✅ Reusable fields for all collections
const baseCardFields = {
  title: { type: String, required: true },
  image: { type: String, default: "" },
};

// ✅ Animation
const MaharashtraAnimationSchema = new mongoose.Schema(baseCardFields, { timestamps: true });
const MaharashtraAnimation = mongoose.model("MaharashtraAnimation", MaharashtraAnimationSchema);

// ✅ Main cardData
const MaharashtraStatesSchema = new mongoose.Schema(baseCardFields, { timestamps: true });
const MaharashtraState = mongoose.model("MaharashtraState", MaharashtraStatesSchema);

// ✅ Secondary state data
const MaharashtraStates2Schema = new mongoose.Schema(baseCardFields, { timestamps: true });
const MaharashtraState2 = mongoose.model("MaharashtraState2", MaharashtraStates2Schema);

export { MaharashtraAnimation, MaharashtraState, MaharashtraState2 };
