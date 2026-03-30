const express = require("express");
const {
  updateApplicationStatus,
  getMyProjectApplications,
  getAppliedByMe,
  withdrawApplication,
} = require("../controllers/applicationController");
const { protect } = require("../middleware/authMiddleware");
const { validateApplicationStatus } = require("../middleware/validateMiddleware");

const router = express.Router();

router.get("/mine", protect, getMyProjectApplications);
router.get("/applied-by-me", protect, getAppliedByMe);
router.patch("/:id/status", protect, validateApplicationStatus, updateApplicationStatus);
router.delete("/:id/withdraw", protect, withdrawApplication);

module.exports = router;
