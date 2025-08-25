import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { auth } from "../middleware/auth.js";
import { logActivity } from "../utils/logger.js";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "Missing fields" });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: "Email already in use" });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash, role });
    return res.status(201).json({ id: user._id, email: user.email, role: user.role });
  } catch (e) {
    return res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
    console.log("Cookies received:", req.cookies); // Add this line

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    // HttpOnly cookie
    res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
    logActivity({ user }, "login", { email });
    return res.json({ message: "Logged in", role: user.role, name: user.name, email: user.email ,token: token });
  } catch (e) {
    return res.status(500).json({ error: "Server error" });
  }
});

router.post("/logout", auth(), async (req, res) => {
  res.clearCookie("token");
  return res.json({ message: "Logged out" });
});

router.get("/me", auth(), async (req, res) => {
  return res.json({ id: req.user._id, email: req.user.email, name: req.user.name, role: req.user.role });
});

export default router;
