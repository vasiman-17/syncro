const bcrypt = require("bcryptjs");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const generateToken = require("../utils/generateToken");

const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID?.trim());

const userFields = (user) => ({
  id: user._id,
  name: user.name,
  username: user.username,
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
  const { name, email, password, bio, skills, github, linkedin, role, username } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email and password are required");
  }

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    res.status(409);
    throw new Error("Email already exists");
  }

  const adminEmail = "vaibhav.vasistha06@gmail.com";
  const userRole = (email === adminEmail && ["admin", "owner"].includes(role)) ? role : "developer";

  // Username validation/generation
  let finalUsername = username?.trim().toLowerCase();
  if (finalUsername) {
    const existing = await User.findOne({ username: finalUsername });
    if (existing) {
      res.status(400);
      throw new Error("Username already taken");
    }
  } else {
    const base = email.split("@")[0].replace(/[^a-z0-9_]/g, "_").toLowerCase();
    finalUsername = base;
    let count = 0;
    while (await User.findOne({ username: finalUsername })) {
      count++;
      finalUsername = `${base}${count}`;
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    username: finalUsername,
    email,
    password: hashedPassword,
    bio: bio || "",
    skills: Array.isArray(skills) ? skills : [],
    github: github || "",
    linkedin: linkedin || "",
    role: userRole,
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
  const adminEmail = "vaibhav.vasistha06@gmail.com";

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
    // Also enforce role if somehow changed
    if (user.email !== adminEmail && user.role !== "developer") {
      user.role = "developer";
      modified = true;
    }
    // Assign generic username if missing
    if (!user.username) {
      const base = email.split("@")[0].replace(/[^a-z0-9_]/g, "_").toLowerCase();
      let finalUsername = base;
      let count = 0;
      while (await User.findOne({ username: finalUsername })) {
        count++;
        finalUsername = `${base}${count}`;
      }
      user.username = finalUsername;
      modified = true;
    }
    if (modified) await user.save();
  } else {
    const base = email.split("@")[0].replace(/[^a-z0-9_]/g, "_").toLowerCase();
    let finalUsername = base;
    let count = 0;
    while (await User.findOne({ username: finalUsername })) {
      count++;
      finalUsername = `${base}${count}`;
    }

    user = await User.create({
      name,
      username: finalUsername,
      email,
      googleId,
      avatar: picture || "",
      bio: "",
      skills: [],
      github: "",
      linkedin: "",
      role: email === adminEmail ? "admin" : "developer",
    });
  }

  res.status(200).json({
    success: true,
    token: generateToken(user._id),
    user: userFields(user),
  });
});

const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Handle users missing a username (migration on the fly)
  if (!user.username) {
    const base = user.email.split("@")[0].replace(/[^a-z0-9_]/g, "_").toLowerCase();
    let finalUsername = base;
    let count = 0;
    while (await User.findOne({ username: finalUsername })) {
      count++;
      finalUsername = `${base}${count}`;
    }
    user.username = finalUsername;
    await user.save();
  }

  res.status(200).json({ success: true, user: userFields(user) });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, bio, skills, github, linkedin, role, username } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const adminEmail = "vaibhav.vasistha06@gmail.com";

  // Username update validation
  if (username && username.trim().toLowerCase() !== user.username) {
    const freshHandle = username.trim().toLowerCase();
    if (!/^[a-z0-9_]+$/.test(freshHandle)) {
      res.status(400);
      throw new Error("Username can only contain letters, numbers and underscores.");
    }
    const taken = await User.findOne({ username: freshHandle });
    if (taken) {
      res.status(400);
      throw new Error("This username is already taken. Try another one!");
    }
    user.username = freshHandle;
  }

  user.name = name?.trim() || user.name;
  user.bio = typeof bio === "string" ? bio : user.bio;
  user.skills = Array.isArray(skills) ? skills : user.skills;
  user.github = typeof github === "string" ? github : user.github;
  user.linkedin = typeof linkedin === "string" ? linkedin : user.linkedin;

  // Only the creator can change roles
  if (user.email === adminEmail && ["developer", "owner", "admin"].includes(role)) {
    user.role = role;
  } else if (user.email !== adminEmail && user.role !== "developer") {
    // Force demotion to developer if somehow role is high for non-admin
    user.role = "developer";
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
