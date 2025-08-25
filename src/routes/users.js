import { Router } from "express";
import User from "../models/User.js";
import { auth, requireRole } from "../middleware/auth.js";
import { logActivity } from "../utils/logger.js";

const router = Router();

router.get("/", auth(), requireRole("admin"), async (req, res) => {
  const users = await User.find().select("-passwordHash").lean();
  return res.json(users);
});

router.patch("/:id/role", auth(), requireRole("admin"), async (req, res) => {
  const { role } = req.body;
  if (!["admin", "editor", "viewer"].includes(role)) return res.status(400).json({ error: "Invalid role" });
  const updated = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-passwordHash");
  logActivity(req, "update_role", { targetUser: req.params.id, role });
  return res.json(updated);
});

router.delete("/:id", auth(), requireRole("admin"), async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  logActivity(req, "delete_user", { targetUser: req.params.id });
  return res.json({ deleted: true });
});

export default router;
