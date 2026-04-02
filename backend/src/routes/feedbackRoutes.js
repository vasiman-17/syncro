const express = require("express");
const { submitFeedback, getFeedback, deleteFeedback } = require("../controllers/feedbackController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, submitFeedback);
router.get("/", protect, getFeedback);
router.delete("/:id", protect, deleteFeedback);

module.exports = router;
