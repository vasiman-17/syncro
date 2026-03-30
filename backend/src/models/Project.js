const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    requiredSkills: [{ type: String, trim: true }],
    techStack: [{ type: String, trim: true }],
    tags: [{ type: String, trim: true }],
    deadline: { type: Date },
    difficulty: { type: String, enum: ["beginner", "intermediate", "advanced"], default: "beginner" },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
