const User = require("../models/User");
const Project = require("../models/Project");
const asyncHandler = require("../utils/asyncHandler");

const suggestTeammates = asyncHandler(async (req, res) => {
  const me = await User.findById(req.user._id).select("skills");
  const skills = me?.skills || [];
  if (!skills.length) {
    return res.status(200).json({ success: true, users: [] });
  }

  const users = await User.find({
    _id: { $ne: req.user._id },
    skills: { $in: skills },
  })
    .select("name email skills github role")
    .limit(20);

  return res.status(200).json({ success: true, users });
});

const suggestProjects = asyncHandler(async (req, res) => {
  const me = await User.findById(req.user._id).select("skills");
  const skills = me?.skills || [];
  const projects = await Project.find({
    status: "open",
    requiredSkills: { $in: skills },
  })
    .populate("owner", "name")
    .limit(20)
    .sort({ createdAt: -1 });

  return res.status(200).json({ success: true, projects });
});

module.exports = { suggestTeammates, suggestProjects };
