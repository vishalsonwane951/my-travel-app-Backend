import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    packageId: String,
    packageTitle: String,
    destination: String,
    duration: String,
    price: Number,

    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    name: String,
    email: String,
    phone: String,
    travelDate: Date,
    travelers: Number,
    message: String,

    // Traveler breakdown (previously dropped silently — not in the old schema)
    adults: { type: Number, default: 1 },
    children: { type: Number, default: 0 },
    seniors: { type: Number, default: 0 },
    childAges: [{ type: Number }],

    // Preferences / add-ons selected on the enquiry form
    roomPreference: { type: String, trim: true },
    mealPreference: { type: String, trim: true },
    pickup: { type: Boolean, default: false },
    guide: { type: Boolean, default: false },
    insurance: { type: Boolean, default: false },
    wheelchair: { type: Boolean, default: false },

    totalPrice: { type: Number },

    // Confirmation email tracking — see Controllers/InquiryController.js
    confirmationSent: { type: Boolean, default: false },

    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Inquiry", inquirySchema);
