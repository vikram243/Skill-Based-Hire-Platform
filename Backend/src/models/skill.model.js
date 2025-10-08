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
  },
  popularity: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Skill', SkillSchema);