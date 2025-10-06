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
    trim:true
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
    required:false
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
  providerStatus: { type: String, enum: ['none', 'draft', 'pending', 'approved', 'rejected'], default: 'none' },

  avatar: {
    type: String,
    trim: true,
  },

  socketId: {
    type: String,
    default: null
  },

  role:{
    type : String,
    enum: ['user','admin'],
    default:'user'
  }
},{
  timestamps:true,
  toJSON:{
    transform:function(doc,ret){
      delete ret.password
      return ret;
    }
  }
}
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateJwtToken = function () {
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
      expiresIn: config.jwtTokenExpiry
    }
  )
}

const User = mongoose.model('User', userSchema);
export default User;