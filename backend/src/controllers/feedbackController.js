const Feedback = require("../models/Feedback");
const asyncHandler = require("../utils/asyncHandler");

const submitFeedback = asyncHandler(async (req, res) => {
  const { message } = req.body;
  console.log(`[FEEDBACK] Submission from ${req.user.email}: ${message}`);
  if (!message) {
    res.status(400);
    throw new Error("Message is required");
  }
  const feedback = await Feedback.create({
    user: req.user._id,
    message,
  });
  console.log(`[FEEDBACK] Saved: ${feedback._id}`);
  res.status(201).json({ success: true, feedback });
});

const getFeedback = asyncHandler(async (req, res) => {
  const adminEmail = "vaibhav.vasistha06@gmail.com";
  console.log(`[FEEDBACK] Fetch request from ${req.user.email}`);
  if (req.user.email !== adminEmail) {
    console.log(`[FEEDBACK] Access denied for ${req.user.email}`);
    res.status(403);
    throw new Error("Access Denied. Only the authorized creator can view feedback.");
  }
  const feedbacks = await Feedback.find().populate("user", "name email").sort({ createdAt: -1 });
  console.log(`[FEEDBACK] Found ${feedbacks.length} feedbacks`);
  res.status(200).json({ success: true, feedbacks });
});

const deleteFeedback = asyncHandler(async (req, res) => {
  const adminEmail = "vaibhav.vasistha06@gmail.com";
  if (req.user.email !== adminEmail) {
    res.status(403);
    throw new Error("Access Denied.");
  }

  const feedback = await Feedback.findById(req.params.id);
  if (!feedback) {
    res.status(404);
    throw new Error("Feedback not found.");
  }

  await feedback.deleteOne();
  res.status(200).json({ success: true, message: "Feedback removed." });
});

module.exports = { submitFeedback, getFeedback, deleteFeedback };
