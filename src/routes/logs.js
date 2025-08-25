import { Router } from "express";
import { auth, requireRole } from "../middleware/auth.js";
import Log from "../models/Log.js";

const router = Router();

router.get("/", auth(), requireRole("admin"), async (req, res) => {
  const logs = await Log.find().sort({ createdAt: -1 }).limit(100).lean();
  return res.json(logs);
});

export default router;
