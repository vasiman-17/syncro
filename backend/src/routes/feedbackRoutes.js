const express = require("express");
const { submitFeedback, getFeedback } = require("../controllers/feedbackController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, submitFeedback);
router.get("/", protect, getFeedback);

module.exports = router;
