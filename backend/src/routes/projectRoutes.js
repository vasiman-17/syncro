const express = require("express");
const {
  createProject,
  getProjects,
  getMyProjects,
  updateMyProjectStatus,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const { protect } = require("../middleware/authMiddleware");
const { applyToProject } = require("../controllers/applicationController");
const { validateProjectCreate } = require("../middleware/validateMiddleware");

const router = express.Router();

router.get("/", getProjects);
router.get("/mine", protect, getMyProjects);
router.get("/:id", getProjectById);
router.post("/", protect, validateProjectCreate, createProject);
router.put("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);
router.patch("/:id/status", protect, updateMyProjectStatus);
router.post("/:id/apply", protect, applyToProject);

module.exports = router;
