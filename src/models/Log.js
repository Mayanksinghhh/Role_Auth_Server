import mongoose from "mongoose";
const logSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  email: String,
  action: String,
  route: String,
  method: String,
  meta: Object
}, { timestamps: true });
export default mongoose.model("Log", logSchema);
