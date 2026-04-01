const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, minlength: 6 },
    bio: { type: String, default: "" },
    skills: [{ type: String, trim: true }],
    github: { type: String, default: "", trim: true },
    linkedin: { type: String, default: "", trim: true },
    resumeUrl: { type: String, default: "", trim: true },
    resumeData: { type: Buffer, select: false },
    resumeContentType: { type: String, select: false },
    googleId: { type: String, default: "", trim: true },
    role: {
      type: String,
      enum: ["developer", "owner", "admin"],
      default: "developer",
    },
  },
  { timestamps: true }
);

userSchema.virtual("profileComplete").get(function () {
  return Boolean(
    this.name &&
    this.name.trim() &&
    this.github &&
    this.github.trim() &&
    this.linkedin &&
    this.linkedin.trim() &&
    this.resumeUrl &&
    this.resumeUrl.trim()
  );
});

userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("User", userSchema);
