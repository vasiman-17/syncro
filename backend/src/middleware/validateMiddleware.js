const ensureString = (value) => (typeof value === "string" ? value.trim() : "");

const validateAuth = (req, res, next) => {
  const { name, email, password } = req.body;
  const isSignup = req.path.includes("signup");

  if (!ensureString(email) || !ensureString(password) || (isSignup && !ensureString(name))) {
    res.status(400);
    return next(new Error("Invalid auth payload"));
  }
  next();
};

const validateProjectCreate = (req, res, next) => {
  const { title, description } = req.body;
  if (!ensureString(title) || !ensureString(description)) {
    res.status(400);
    return next(new Error("Project title and description are required"));
  }
  next();
};

const validateApplicationStatus = (req, res, next) => {
  const { status } = req.body;
  if (!["accepted", "rejected"].includes(status)) {
    res.status(400);
    return next(new Error("Status must be accepted or rejected"));
  }
  next();
};

module.exports = {
  validateAuth,
  validateProjectCreate,
  validateApplicationStatus,
};
