import { Router } from "express";
import { auth, requireRole } from "../middleware/auth.js";
import Post from "../models/Post.js";
import { logActivity } from "../utils/logger.js";

const router = Router();

// Read for everyone logged-in (viewer/editor/admin)
router.get("/posts", auth(), async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 }).lean();
  return res.json(posts);
});

// Create (editor/admin)
router.post("/posts", auth(), requireRole("editor", "admin"), async (req, res) => {
  const { title, body } = req.body;
  const post = await Post.create({ title, body, authorId: req.user._id });
  logActivity(req, "create_post", { postId: post._id });
  return res.status(201).json(post);
});

// Update (editor/admin)
router.patch("/posts/:id", auth(), requireRole("editor", "admin"), async (req, res) => {
  const { title, body } = req.body;
  const post = await Post.findByIdAndUpdate(req.params.id, { title, body }, { new: true });
  logActivity(req, "update_post", { postId: req.params.id });
  return res.json(post);
});

// Delete (editor/admin)
router.delete("/posts/:id", auth(), requireRole("editor", "admin"), async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  logActivity(req, "delete_post", { postId: req.params.id });
  return res.json({ deleted: true });
});

export default router;
