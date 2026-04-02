const Feedback = require("../models/Feedback");
const asyncHandler = require("../utils/asyncHandler");

const submitFeedback = asyncHandler(async (req, res) => {
  const { message } = req.body;
  if (!message) {
    res.status(400);
    throw new Error("Message is required");
  }
  const feedback = await Feedback.create({
    user: req.user._id,
    message,
  });
  res.status(201).json({ success: true, feedback });
});

const getFeedback = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin" && req.user.role !== "owner") {
    res.status(403);
    throw new Error("Only admins or owners can view feedback");
  }
  const feedbacks = await Feedback.find().populate("user", "name email").sort({ createdAt: -1 });
  res.status(200).json({ success: true, feedbacks });
});

module.exports = { submitFeedback, getFeedback };
