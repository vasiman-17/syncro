const express = require("express");
const { signup, login, googleAuth, me, updateProfile, uploadResume, getResume } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { validateAuth } = require("../middleware/validateMiddleware");
const { authRateLimit } = require("../middleware/rateLimitMiddleware");
const { uploadResume: uploadResumeMiddleware } = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/signup", authRateLimit, validateAuth, signup);
router.post("/login", authRateLimit, validateAuth, login);
router.post("/google", authRateLimit, googleAuth);
router.get("/me", protect, me);
router.put("/me", protect, updateProfile);
router.post("/me/resume", protect, uploadResumeMiddleware.single("resume"), uploadResume);
router.get("/resume/:id", getResume);

module.exports = router;
