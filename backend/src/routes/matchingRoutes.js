const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { suggestTeammates, suggestProjects } = require("../controllers/matchingController");

const router = express.Router();

router.get("/teammates", protect, suggestTeammates);
router.get("/projects", protect, suggestProjects);

module.exports = router;
