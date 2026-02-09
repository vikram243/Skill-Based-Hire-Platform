import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from "../config/config.js";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    minlength: 3,
    maxlength: 20,
    trim: true
  },
  lastName: {
    type: String,
    minlength: 3,
    maxlength: 20,
    trim: true
  },
  fullName: {
    type: String,
    minlength: 3,
    maxlength: 40,
    trim: true
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 50,
    lowercase: true,
    trim: true,
  },
  number: {
    type: String,
    trim: true,
    minlength: 9,
    maxlength: 15,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },

  isUser: { type: Boolean, default: false },
  isProvider: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  providerProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', default: null },

  avatar: {
    type: String,
    trim: true,
  },

  bio: {
    type: String,
    maxlength: 200,
    trim: true,
    default: ''
  },

  location: {
    source: {
      type: String,
      enum: ["gps", "search", "ip"],
      default: "ip"
    },
    pin: String,
    address: String,
    city: String,
    state: String,
    lat: Number,
    lon: Number
  },

  socketId: {
    type: String,
    default: null
  },

  isActive: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
}
);

userSchema.index({ email: 1 }, { unique: true, partialFilterExpression: { email: { $type: 'string' } } });
userSchema.index({ number: 1 }, { unique: true, partialFilterExpression: { number: { $type: 'string' } } });

userSchema.methods.generateAccessToken = function () {
  // DEPRECATED: call with sessionId param. Keep backward compat by allowing no args.
  const sessionId = arguments[0] || null;
  const payload = {
    id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    fullName: this.fullName,
    email: this.email,
    number: this.number
  };
  if (sessionId) payload.sessionId = sessionId;
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtTokenExpiry || '1d' });
}

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { id: this._id },
    config.jwtRefreshSecret,
    {
      expiresIn: config.jwtRefreshTokenExpiry || '7d'
    }
  )
}

const User = mongoose.model('User', userSchema);
export default User;