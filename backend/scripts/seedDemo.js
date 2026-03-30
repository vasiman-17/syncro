require("dotenv").config({ override: true });
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const connectDB = require("../src/config/db");
const User = require("../src/models/User");
const Project = require("../src/models/Project");
const Application = require("../src/models/Application");
const Notification = require("../src/models/Notification");
const Bookmark = require("../src/models/Bookmark");

const seed = async () => {
  await connectDB();

  await Promise.all([
    Application.deleteMany({}),
    Notification.deleteMany({}),
    Bookmark.deleteMany({}),
    Project.deleteMany({}),
    User.deleteMany({}),
  ]);

  const passwordHash = await bcrypt.hash("secret123", 10);

  const [owner, applicant, collaborator] = await User.create([
    {
      name: "Owner Demo",
      email: "owner@syncro.dev",
      password: passwordHash,
      bio: "I build and manage projects.",
      skills: ["Node", "MongoDB", "React"],
      github: "https://github.com/owner-demo",
      role: "owner",
    },
    {
      name: "Applicant Demo",
      email: "applicant@syncro.dev",
      password: passwordHash,
      bio: "I apply to projects and collaborate.",
      skills: ["React", "TypeScript", "UI"],
      github: "https://github.com/applicant-demo",
      role: "developer",
    },
    {
      name: "Collaborator Demo",
      email: "collab@syncro.dev",
      password: passwordHash,
      bio: "I like full-stack collaboration.",
      skills: ["Node", "Socket.io", "Redis"],
      github: "https://github.com/collab-demo",
      role: "developer",
    },
  ]);

  const [projectOne, projectTwo] = await Project.create([
    {
      owner: owner._id,
      title: "Syncro Team Chat",
      description: "Realtime project chat channels for teams.",
      requiredSkills: ["Node", "Socket.io", "React"],
      techStack: ["Express", "MongoDB", "Socket.io"],
      tags: ["chat", "collaboration"],
      difficulty: "intermediate",
      status: "open",
    },
    {
      owner: owner._id,
      title: "Syncro Match Engine",
      description: "Skill-based teammate recommendation service.",
      requiredSkills: ["Node", "MongoDB", "AI"],
      techStack: ["Express", "Mongoose"],
      tags: ["matching", "ai"],
      difficulty: "advanced",
      status: "open",
    },
  ]);

  const [appPending, appAccepted] = await Application.create([
    {
      project: projectOne._id,
      applicant: applicant._id,
      message: "I can build the frontend and API integration.",
      status: "pending",
    },
    {
      project: projectTwo._id,
      applicant: collaborator._id,
      message: "I can help with matching logic and backend.",
      status: "accepted",
    },
  ]);

  await Notification.create({
    user: collaborator._id,
    type: "application_status",
    title: "Application status updated",
    message: "Your application was accepted.",
    metadata: { applicationId: String(appAccepted._id), projectId: String(projectTwo._id) },
  });

  await Bookmark.create({
    user: applicant._id,
    project: projectTwo._id,
  });

  console.log("Demo seed complete.");
  console.log("Use these demo users (password: secret123):");
  console.log("- owner@syncro.dev");
  console.log("- applicant@syncro.dev");
  console.log("- collab@syncro.dev");
  console.log("Projects seeded:", projectOne.title, "and", projectTwo.title);
  console.log("Applications seeded:", appPending.status, "and", appAccepted.status);

  await mongoose.connection.close();
};

seed().catch(async (error) => {
  console.error("Seed failed:", error.message);
  try {
    await mongoose.connection.close();
  } catch {
    // Ignore close errors in failure path.
  }
  process.exit(1);
});
