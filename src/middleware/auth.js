import jwt from "jsonwebtoken";
import User from "../models/User.js";

export function auth(required = true) {
  return async (req, res, next) => {
    try {
      const token = req.cookies?.token || (req.headers.authorization?.split(" ")[1]);
      if (!token) {
        if (!required) return next();
        return res.status(401).json({ error: "Unauthorized" });
      }
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(payload.id).lean();
      if (!user) return res.status(401).json({ error: "Unauthorized" });
      req.user = user;
      next();
    } catch (e) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  };
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: insufficient role" });
    }
    next();
  };
}
