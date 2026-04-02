const bcrypt = require("bcryptjs");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const generateToken = require("../utils/generateToken");

const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID?.trim());

const userFields = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  bio: user.bio,
  skills: user.skills,
  github: user.github,
  linkedin: user.linkedin,
  resumeUrl: user.resumeUrl,
  role: user.role,
  profileComplete: user.profileComplete,
});

const signup = asyncHandler(async (req, res) => {
  const { name, email, password, bio, skills, github, linkedin, role } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email and password are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(409);
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    bio: bio || "",
    skills: Array.isArray(skills) ? skills : [],
    github: github || "",
    linkedin: linkedin || "",
    role: role || "developer",
  });

  res.status(201).json({
    success: true,
    token: generateToken(user._id),
    user: userFields(user),
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  if (!user.password) {
    res.status(401);
    throw new Error("This account uses Google sign-in. Please use Google to login.");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  res.status(200).json({
    success: true,
    token: generateToken(user._id),
    user: userFields(user),
  });
});

const googleAuth = asyncHandler(async (req, res) => {
  const { credential } = req.body;
  if (!credential) {
    res.status(400);
    throw new Error("Google credential is required");
  }

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID?.trim(),
    });
    payload = ticket.getPayload();
  } catch (err) {
    res.status(401);
    throw new Error("Invalid Google token");
  }

  const { sub: googleId, email, name, picture } = payload;

  let user = await User.findOne({ $or: [{ googleId }, { email }] });

  if (user) {
    let modified = false;
    if (!user.googleId) {
      user.googleId = googleId;
      modified = true;
    }
    if (picture && user.avatar !== picture) {
      user.avatar = picture;
      modified = true;
    }
    if (modified) await user.save();
  } else {
    user = await User.create({
      name,
      email,
      googleId,
      avatar: picture || "",
      bio: "",
      skills: [],
      github: "",
      linkedin: "",
      role: "developer",
    });
  }

  res.status(200).json({
    success: true,
    token: generateToken(user._id),
    user: userFields(user),
  });
});

const me = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: userFields(req.user) });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, bio, skills, github, linkedin, role } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.name = name?.trim() || user.name;
  user.bio = typeof bio === "string" ? bio : user.bio;
  user.skills = Array.isArray(skills) ? skills : user.skills;
  user.github = typeof github === "string" ? github : user.github;
  user.linkedin = typeof linkedin === "string" ? linkedin : user.linkedin;
  if (["developer", "owner", "admin"].includes(role)) {
    user.role = role;
  }

  const updated = await user.save();
  res.status(200).json({
    success: true,
    user: userFields(updated),
  });
});

const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.resumeData = req.file.buffer;
  user.resumeContentType = req.file.mimetype;
  user.resumeUrl = `/api/auth/resume/${user._id}`;
  
  const updated = await user.save();

  res.status(200).json({
    success: true,
    user: userFields(updated),
    resumeUrl: user.resumeUrl,
  });
});

const getResume = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("+resumeData +resumeContentType");
  if (!user || !user.resumeData) {
    return res.status(404).json({ success: false, message: "Resume not found" });
  }

  res.set("Content-Type", user.resumeContentType);
  res.send(user.resumeData);
});

module.exports = { signup, login, googleAuth, me, updateProfile, uploadResume, getResume };
