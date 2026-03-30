const mongoose = require("mongoose");
const dns = require("dns").promises;

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  const hostMatch = typeof mongoUri === "string" ? mongoUri.match(/@([^/?]+)/) : null;
  const host = hostMatch ? hostMatch[1] : "";
  const isSrv = typeof mongoUri === "string" && mongoUri.startsWith("mongodb+srv://");
  const hostCount = host ? host.split(",").length : 0;

  // #region agent log
  fetch("http://127.0.0.1:7486/ingest/3c48b637-b3e6-4fe0-9050-1e8d18742e61", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "c297a2" },
    body: JSON.stringify({
      sessionId: "c297a2",
      runId: "pre-fix",
      hypothesisId: "H1",
      location: "backend/src/config/db.js:11",
      message: "Mongo URI inspected",
      data: { hasMongoUri: Boolean(mongoUri), isSrv, hostCount },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  if (!mongoUri) {
    // #region agent log
    fetch("http://127.0.0.1:7486/ingest/3c48b637-b3e6-4fe0-9050-1e8d18742e61", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "c297a2" },
      body: JSON.stringify({
        sessionId: "c297a2",
        runId: "pre-fix",
        hypothesisId: "H2",
        location: "backend/src/config/db.js:28",
        message: "MONGO_URI missing",
        data: { hasMongoUri: false },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    throw new Error("MONGO_URI is missing in environment variables");
  }

  if (host) {
    try {
      await dns.lookup(host);
      // #region agent log
      fetch("http://127.0.0.1:7486/ingest/3c48b637-b3e6-4fe0-9050-1e8d18742e61", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "c297a2" },
        body: JSON.stringify({
          sessionId: "c297a2",
          runId: "pre-fix",
          hypothesisId: "H3",
          location: "backend/src/config/db.js:50",
          message: "DNS lookup success",
          data: { hostLength: host.length },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
    } catch (error) {
      // #region agent log
      fetch("http://127.0.0.1:7486/ingest/3c48b637-b3e6-4fe0-9050-1e8d18742e61", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "c297a2" },
        body: JSON.stringify({
          sessionId: "c297a2",
          runId: "pre-fix",
          hypothesisId: "H3",
          location: "backend/src/config/db.js:66",
          message: "DNS lookup failed",
          data: { code: error?.code || "unknown", hostLength: host.length },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      console.warn(`Mongo host DNS lookup failed for "${host}": ${error.code || "unknown"}`);
    }
  }

  try {
    // #region agent log
    fetch("http://127.0.0.1:7486/ingest/3c48b637-b3e6-4fe0-9050-1e8d18742e61", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "c297a2" },
      body: JSON.stringify({
        sessionId: "c297a2",
        runId: "pre-fix",
        hypothesisId: "H4",
        location: "backend/src/config/db.js:84",
        message: "Starting mongoose connect",
        data: { timeoutMs: 15000, isSrv, hostCount },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 15000 });
    // #region agent log
    fetch("http://127.0.0.1:7486/ingest/3c48b637-b3e6-4fe0-9050-1e8d18742e61", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "c297a2" },
      body: JSON.stringify({
        sessionId: "c297a2",
        runId: "pre-fix",
        hypothesisId: "H4",
        location: "backend/src/config/db.js:100",
        message: "mongoose connect success",
        data: { readyState: mongoose.connection.readyState },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    console.log("MongoDB connected");
  } catch (error) {
    // #region agent log
    fetch("http://127.0.0.1:7486/ingest/3c48b637-b3e6-4fe0-9050-1e8d18742e61", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "c297a2" },
      body: JSON.stringify({
        sessionId: "c297a2",
        runId: "pre-fix",
        hypothesisId: "H5",
        location: "backend/src/config/db.js:117",
        message: "mongoose connect failed",
        data: { errorName: error?.name || "unknown", errorCode: error?.code || "unknown" },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    const message = error?.message || "Unknown MongoDB connection error";
    throw new Error(`MongoDB connection failed: ${message}`);
  }
};

module.exports = connectDB;
