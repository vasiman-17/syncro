const buckets = new Map();

const authRateLimit = (req, res, next) => {
  const key = `${req.ip}:${req.path}`;
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 20;
  const current = buckets.get(key);

  if (!current || now > current.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return next();
  }

  if (current.count >= maxRequests) {
    res.status(429);
    return next(new Error("Too many auth attempts, try again later"));
  }

  current.count += 1;
  buckets.set(key, current);
  return next();
};

module.exports = { authRateLimit };
