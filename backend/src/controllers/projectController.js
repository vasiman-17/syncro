const Project = require("../models/Project");
const asyncHandler = require("../utils/asyncHandler");

const createProject = asyncHandler(async (req, res) => {
  const { title, description, requiredSkills, techStack, tags, deadline, difficulty } = req.body;
  if (!title || !description) {
    res.status(400);
    throw new Error("Title and description are required");
  }

  const project = await Project.create({
    owner: req.user._id,
    title,
    description,
    requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [],
    techStack: Array.isArray(techStack) ? techStack : [],
    tags: Array.isArray(tags) ? tags : [],
    deadline: deadline || null,
    difficulty: difficulty || "beginner",
  });

  res.status(201).json({ success: true, project });
});

const getProjects = asyncHandler(async (req, res) => {
  const { search = "", skill = "", tech = "" } = req.query;
  const query = { status: "open" };
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }
  if (skill) {
    query.requiredSkills = { $in: [skill] };
  }
  if (tech) {
    query.techStack = { $in: [tech] };
  }

  const projects = await Project.find(query)
    .populate("owner", "name email skills")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, projects });
});

const getMyProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ owner: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, projects });
});

const updateMyProjectStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["open", "closed"].includes(status)) {
    res.status(400);
    throw new Error("Status must be open or closed");
  }

  const project = await Project.findById(id);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  if (String(project.owner) !== String(req.user._id)) {
    res.status(403);
    throw new Error("Only owner can update project status");
  }

  project.status = status;
  await project.save();
  res.status(200).json({ success: true, project });
});

const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id).populate("owner", "name email skills github");
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }
  res.status(200).json({ success: true, project });
});

const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }
  if (String(project.owner) !== String(req.user._id)) {
    res.status(403);
    throw new Error("Only owner can update project");
  }

  const { title, description, requiredSkills, techStack, tags, deadline, difficulty } = req.body;
  project.title = title?.trim() || project.title;
  project.description = description?.trim() || project.description;
  project.requiredSkills = Array.isArray(requiredSkills) ? requiredSkills : project.requiredSkills;
  project.techStack = Array.isArray(techStack) ? techStack : project.techStack;
  project.tags = Array.isArray(tags) ? tags : project.tags;
  project.deadline = deadline || project.deadline;
  project.difficulty = ["beginner", "intermediate", "advanced"].includes(difficulty)
    ? difficulty
    : project.difficulty;

  await project.save();
  res.status(200).json({ success: true, project });
});

const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }
  if (String(project.owner) !== String(req.user._id)) {
    res.status(403);
    throw new Error("Only owner can delete project");
  }
  await project.deleteOne();
  res.status(200).json({ success: true, message: "Project deleted" });
});

module.exports = {
  createProject,
  getProjects,
  getMyProjects,
  updateMyProjectStatus,
  getProjectById,
  updateProject,
  deleteProject,
};
