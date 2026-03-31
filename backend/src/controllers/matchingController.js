const User = require("../models/User");
const Project = require("../models/Project");
const asyncHandler = require("../utils/asyncHandler");

const suggestTeammates = asyncHandler(async (req, res) => {
  const me = await User.findById(req.user._id).select("skills");
  const skills = me?.skills || [];
  
  let users = await User.find({
    _id: { $ne: req.user._id },
    skills: { $in: skills },
  })
    .select("name email skills github role")
    .limit(20)
    .sort({ createdAt: -1 });

  // Fallback if no matching users (or no skills)
  if (users.length === 0) {
    users = await User.find({ _id: { $ne: req.user._id } })
      .select("name email skills github role")
      .limit(20)
      .sort({ createdAt: -1 });
  }

  return res.status(200).json({ success: true, users });
});

const suggestProjects = asyncHandler(async (req, res) => {
  const me = await User.findById(req.user._id).select("skills");
  const skills = me?.skills || [];
  
  let projects = await Project.find({
    status: "open",
    owner: { $ne: req.user._id },
    requiredSkills: { $in: skills },
  })
    .populate("owner", "name")
    .limit(20)
    .sort({ createdAt: -1 });

  // Fallback if no matching projects (or no skills)
  if (projects.length === 0) {
    projects = await Project.find({
      status: "open",
      owner: { $ne: req.user._id },
    })
      .populate("owner", "name")
      .limit(20)
      .sort({ createdAt: -1 });
  }

  return res.status(200).json({ success: true, projects });
});

module.exports = { suggestTeammates, suggestProjects };
