import Log from "../models/Log.js";
export function logActivity(req, action, meta = {}) {
  const payload = {
    userId: req.user?._id,
    email: req.user?.email,
    action,
    route: req.originalUrl,
    method: req.method,
    meta
  };
  Log.create(payload).catch((e) => 
    console.error("Failed to log activity:", e)
  );
}
