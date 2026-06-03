const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    mood: {
      type: String,
      required: [true, "Mood is required"],
      trim: true,
      enum: [
        "Happy",
        "Sad",
        "Excited",
        "Angry",
        "Anxious",
        "Calm",
        "Tired",
        "Neutral",
      ],
    },

    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
      minlength: [10, "Content must be at least 10 characters"],
      maxlength: [5000, "Content cannot exceed 5000 characters"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Journal = mongoose.model("Journal", journalSchema);

module.exports = Journal;
