import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullname: {
    firstname: { type: String, minlength: 3, maxlength: 20, trim: true },
    lastname: { type: String, minlength: 3, maxlength: 20, trim: true },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 6,
    maxlength: 50,
    lowercase: true,
    trim: true,
  },
  number: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  password: {
    type: String,
    select: false,
    minlength: 6,
    maxlength: 200,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },

  isProvider: { type: Boolean, default: false },
  providerProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', default: null },
  providerStatus: { type: String, enum: ['none','draft','pending','approved','rejected'], default: 'none' },

  avatar: {
    type: String,
    trim: true,
  },

  socketId: {
    type: String,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);