import mongoose from "mongoose";

const SkillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
    // Example: "Home Services", "Education", "Technology"
  },
  description: {
    type: String,
    trim: true
  },
  icon: {
    type: String, 
    default: null
    // store URL or icon name (for frontend display)
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Skill', SkillSchema);
