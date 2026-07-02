// backend/models/QA.js
import { Schema, model } from "mongoose";

const answerSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    authorName: {
      type: String,
      trim: true,
      default: "Anonymous",
    },
    text: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 2000,
    },
    isOfficial: {
      type: Boolean,
      default: false, // set true when answered by the tour operator / admin
    },
  },
  { timestamps: true }
);

const qaSchema = new Schema(
  {
    packageId: {
      type: Schema.Types.ObjectId,
      ref: "Package",
      required: true,
      index: true,
    },
    // Who asked
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    author: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    contributions: {
      type: Number,
      default: 1,
    },
    // The question
    question: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 1000,
    },
    // Answers array — supports multiple community answers
    answers: {
      type: [answerSchema],
      default: [],
    },
    // Convenience: the first/official answer exposed to the frontend
    // as a plain string (mirrors the legacy `answer` field in SAMPLE_QA)
    answer: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["open", "answered", "closed"],
      default: "open",
    },
  },
  { timestamps: true }
);

// Keep top-level `answer` in sync with the first official answer
qaSchema.methods.syncAnswer = function () {
  const official = this.answers.find((a) => a.isOfficial);
  const first    = this.answers[0];
  this.answer  = official?.text ?? first?.text ?? null;
  this.status  = this.answers.length > 0 ? "answered" : "open";
};

// Virtual: formatted date
qaSchema.virtual("date").get(function () {
  return this.createdAt.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
});

qaSchema.set("toJSON", { virtuals: true });

export default model("QA", qaSchema);