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
  fullName:{
    type:String,
    minlength: 3,
    maxlength: 20,
    trim:true
  },
  email: {
    type: String,
    required: false,
    unique: true,
    minlength: 6,
    maxlength: 50,
    lowercase: true,
    trim: true,
  },
  number: {
    type: Number,
    unique: true,
    trim: true,
    required:false,
    minlength: 9,
    maxlength: 15,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },

  isUser: {type: Boolean, default: false},
  isProvider: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  providerProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', default: null },
  providerStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },

  avatar: {
    type: String,
    trim: true,
  },

  socketId: {
    type: String,
    default: null
  },

  isActive:{
    type:Boolean,
    default:false
  }
},{
  timestamps:true,
}
);

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      firstName: this.firstName,
      lastName: this.lastName,
      fullName: this.fullName,
      email: this.email,
      number: this.number
    },
    config.jwtSecret,
    {
      expiresIn: config.jwtTokenExpiry || '1d'
    }
  )
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