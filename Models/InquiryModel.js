import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    packageId: String,
    packageTitle: String,
    destination: String,
    duration: String,
    price: Number,

    name: String,
    email: String,
    phone: String,
    travelDate: Date,
    travelers: Number,
    message: String,

    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Inquiry", inquirySchema);
