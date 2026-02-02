import mongoose from "mongoose";

const SkillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
  },
  category: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
  },
  description: {
    type: String,
    trim: true,
    minlength: 3,
    maxlength: 100,
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

const Skill = mongoose.model('Skill', SkillSchema);
export default Skill;