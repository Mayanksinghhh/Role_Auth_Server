import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

const uri=process.env.MONGODB_URI

export async function connectDB(uri) {
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, { dbName: "admin_role_dashboard" });
  console.log("MongoDB connected");
}
