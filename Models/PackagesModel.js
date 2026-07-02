import mongoose from 'mongoose';

const daySchema = new mongoose.Schema({
  day: Number,
  title: String,
  description: String,
  meals: String,
}, { _id: false });

const inclExclSchema = new mongoose.Schema({
  inclusions: [String],
  exclusions: [String],
}, { _id: false });

// ─── Embedded Review Schema ──────────────────────────────────────────────────
const embeddedReviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    location: { type: String, trim: true, default: 'India' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, trim: true, maxlength: 200, default: 'My Experience' },
    text: { type: String, required: true, trim: true, minlength: 10, maxlength: 3000 },
    tripType: {
      type: String,
      enum: ['Solo', 'Couple', 'Family', 'Friends', 'Business'],
      default: 'Family',
    },
    helpful: { type: Number, default: 0 },
    helpfulVoters: { type: [String], default: [], select: false },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved',
    },
    photos: [{ type: String }], // Cloudinary URLs if any
  },
  { timestamps: true }
);

embeddedReviewSchema.virtual('date').get(function () {
  return this.createdAt?.toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
  });
});
embeddedReviewSchema.set('toJSON', { virtuals: true });

// ─── Embedded Q&A Answer Schema ──────────────────────────────────────────────
const embeddedAnswerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    authorName: { type: String, default: 'Traveller', trim: true },
    text: { type: String, required: true, trim: true, minlength: 5, maxlength: 2000 },
    isOfficial: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ─── Embedded Q&A Question Schema ────────────────────────────────────────────
const embeddedQASchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    author: { type: String, default: 'Anonymous', trim: true },
    contributions: { type: Number, default: 1 },
    question: { type: String, required: true, trim: true, minlength: 10, maxlength: 1000 },
    answer: { type: String, default: '' },   // convenience: first/best answer text
    answers: [embeddedAnswerSchema],
    status: {
      type: String,
      enum: ['unanswered', 'answered'],
      default: 'unanswered',
    },
  },
  { timestamps: true }
);

// Sync convenience fields after answers are pushed
embeddedQASchema.methods.syncAnswer = function () {
  if (this.answers && this.answers.length > 0) {
    // Prefer official answer, else most-recent
    const official = this.answers.find((a) => a.isOfficial);
    this.answer = (official || this.answers[this.answers.length - 1]).text;
    this.status = 'answered';
  }
};

// ─── Main Package Schema ─────────────────────────────────────────────────────
const packageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    locationurl: { type: String, default: '' },
    type: { type: String, trim: true, lowercase: true },
    destination: { type: String, trim: true },
    rating: { type: Number, default: 4.5, min: 1, max: 5 },
    price: { type: Number, default: 0 },
    strikePrice: { type: Number },

    durations: [{ type: String, trim: true }],
    groupSize: [{ type: String, trim: true }],

    description: { type: String, trim: true, maxlength: 3000 },
    images: { type: String, default: '' },
    imagePublicId: { type: String, default: '' },

    gallery: [
      {
        _id: false,
        img: { type: String },
        caption: { type: String },
        publicId: { type: String },
      },
    ],

    lat: { type: Number },
    long: { type: Number },

    itinerary: [daySchema],
    inclExcl: inclExclSchema,
    highlights: [String],
    tags: [String],
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },

    // ── Embedded Reviews & Q&A ─────────────────────────────────────────────
    reviews: [embeddedReviewSchema],
    qa: [embeddedQASchema],

    // ── Aggregate stats (updated on each review write) ─────────────────────
    reviewCount: { type: Number, default: 0 },
    avgRating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

packageSchema.index({ title: 'text', location: 'text', type: 1 });

export default mongoose.model('Package', packageSchema);