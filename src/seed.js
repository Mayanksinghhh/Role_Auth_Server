import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import bcrypt from "bcryptjs";

dotenv.config();

const users = [
  { name: "Admin", email: "admin@example.com", password: "admin123", role: "admin" },
  { name: "Ed", email: "editor@example.com", password: "editor123", role: "editor" },
  { name: "View", email: "viewer@example.com", password: "viewer123", role: "viewer" }
];

async function run() {
  await connectDB(process.env.MONGODB_URI);
  await User.deleteMany({});
  for (const u of users) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    await User.create({ name: u.name, email: u.email, passwordHash, role: u.role });
  }
  console.log("Seed complete");
  process.exit(0);
}
run();
