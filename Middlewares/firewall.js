import { env } from "../Config/env.js";

export function firewall(req, res, next) {
  // On some hosts, req.ip returns in formats like ::ffff:127.0.0.1
  const ip = (req.ip || req.connection?.remoteAddress || "").replace("::ffff:", "");
  if (!env.ALLOWED_IPS.includes(ip)) {
    return res.status(403).json({ type: "error", message: "IP is not whitelisted" });
  }
  next();
}

// errorHandler

export function errorHandler(err, req, res, next) {
  console.error("[ERROR]", err);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({
    type: "error",
    message: err.message || "Internal Server Error"
  });
}
