const Application = require("../models/Application");
const Project = require("../models/Project");
const Notification = require("../models/Notification");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

const applyToProject = asyncHandler(async (req, res) => {
  const { id: projectId } = req.params;
  const { message } = req.body;

  // Check profile completeness
  const fullUser = await User.findById(req.user._id);
  if (!fullUser.profileComplete) {
    res.status(400);
    throw new Error("Complete your profile before applying. Required: Name, GitHub, LinkedIn, and Resume.");
  }

  const project = await Project.findById(projectId);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  if (String(project.owner) === String(req.user._id)) {
    res.status(400);
    throw new Error("Project owner cannot apply to own project");
  }
  if (project.status !== "open") {
    res.status(400);
    throw new Error("Project is closed for applications");
  }

  const existingApplication = await Application.findOne({
    project: projectId,
    applicant: req.user._id,
  });
  if (existingApplication) {
    res.status(409);
    throw new Error("You have already applied to this project");
  }

  const application = await Application.create({
    project: projectId,
    applicant: req.user._id,
    message: message || "",
  });

  // Notify project owner
  await Notification.create({
    user: project.owner,
    type: "new_application",
    title: "New application received",
    message: `${fullUser.name} applied to "${project.title}"`,
    metadata: { applicationId: String(application._id), projectId: String(project._id) },
  });

  res.status(201).json({ success: true, application });
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["accepted", "rejected"].includes(status)) {
    res.status(400);
    throw new Error("Status must be accepted or rejected");
  }

  const application = await Application.findById(id).populate("project");
  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }

  if (String(application.project.owner) !== String(req.user._id)) {
    res.status(403);
    throw new Error("Only project owner can update application status");
  }

  if (application.status !== "pending") {
    res.status(400);
    throw new Error("Only pending applications can be updated");
  }

  application.status = status;
  await application.save();

  await Notification.create({
    user: application.applicant,
    type: "application_status",
    title: "Application status updated",
    message: `Your application for "${application.project.title}" was ${status}.`,
    metadata: { applicationId: String(application._id), projectId: String(application.project._id) },
  });

  res.status(200).json({ success: true, application });
});

const getMyProjectApplications = asyncHandler(async (req, res) => {
  const myProjects = await Project.find({ owner: req.user._id }).select("_id");
  const projectIds = myProjects.map((project) => project._id);

  const applications = await Application.find({ project: { $in: projectIds } })
    .populate("project", "title requiredMembers")
    .populate("applicant", "name email skills github linkedin resumeUrl bio")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, applications });
});

const getAppliedByMe = asyncHandler(async (req, res) => {
  const applications = await Application.find({ applicant: req.user._id })
    .populate("project", "title description status")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, applications });
});

const withdrawApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);
  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }
  if (String(application.applicant) !== String(req.user._id)) {
    res.status(403);
    throw new Error("Only applicant can withdraw this application");
  }
  if (application.status !== "pending") {
    res.status(400);
    throw new Error("Only pending applications can be withdrawn");
  }
  await application.deleteOne();
  res.status(200).json({ success: true, message: "Application withdrawn" });
});

module.exports = {
  applyToProject,
  updateApplicationStatus,
  getMyProjectApplications,
  getAppliedByMe,
  withdrawApplication,
};
