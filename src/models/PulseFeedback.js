import mongoose from "mongoose";

const pulseFeedbackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    story: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Story",
      required: true,
    },
    pulse: {
      type: String,
      enum: ["soft", "intense", "heavy", "warm", "dark"],
      required: true,
    },
  },
  { timestamps: true }
);

// Compound unique index: one user can only submit one pulse per story
pulseFeedbackSchema.index({ user: 1, story: 1 }, { unique: true });

const PulseFeedback =
  mongoose.models.PulseFeedback || mongoose.model("PulseFeedback", pulseFeedbackSchema);

export default PulseFeedback;
