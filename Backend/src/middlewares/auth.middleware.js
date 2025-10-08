import { asyncHandler } from "../utils/async.handeller.js";
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { ApiError } from "../utils/api.handeller.js";
import config from '../config/config.js'

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) throw new ApiError(401, "Not authenticated");
  const decoded = jwt.verify(token, config.jwtSecret);
  req.user = await User.findById(decoded.id).select("-password");
  if (!req.user) throw new ApiError(401, "User not found");
  next();
});

export const isAdmin = asyncHandler(async (req,res,next) => {
  if(!req.user || req.user.role !== 'admin'){
    throw new ApiError(403,"access denied : only admin can access");
  }
  next();
})