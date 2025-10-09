import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  action: { 
    type: String, 
    required: true 
},
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  target: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "targetModel",
  },
  targetModel: {
    type: String,
    enum: ["User", "Provider", "Order", "Review"],
  },
  description: { type: String, required: true },
}, { timestamps: true });

const activityLog = mongoose.model("ActivityLog", activitySchema);
export default activityLog;