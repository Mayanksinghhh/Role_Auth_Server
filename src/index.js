import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import contentRoutes from "./routes/content.js";
import logRoutes from "./routes/logs.js";

dotenv.config();
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser({httpOnly: true,
  sameSite: "lax"})); // Parse cookies
app.use(express.urlencoded({ extended:true}));
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  credentials: true
}));

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/content", contentRoutes);    //  routes 
app.use("/logs", logRoutes);

const start = async () => {
  await connectDB(process.env.MONGODB_URI);
  const port = process.env.PORT || 4000;
  app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
};
start();
