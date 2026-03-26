import { asyncHandler } from "../utils/async.handeller.js";
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { ApiError } from "../utils/api.handeller.js";
import config from '../config/config.js'

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers?.authorization || req.headers?.token;
  let token;
  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else {
    token = authHeader;
  }

  if (!token) throw new ApiError(401, "Not authenticated");

  const decoded = jwt.verify(token, config.jwtSecret);
  req.user = await User.findById(decoded.id).select("-password");
  if (!req.user) throw new ApiError(401, "User not found");

  // Session ID check only - NO fingerprint
  try {
    const { getSessionId } = await import('../config/redis.config.js');
    const storedSessionId = await getSessionId(decoded.id.toString());
    if (storedSessionId && decoded.sessionId !== storedSessionId) {
      throw new ApiError(401, 'Session invalidated');
    }
  } catch (e) {
    if (e instanceof ApiError) throw e;
    // Redis error - allow request
  }

  next();
});

export const isAdmin = asyncHandler(async (req, res, next) => {
  const isAdminUser = Boolean(req.user?.isAdmin) || req.user?.role === 'admin';
  if (!req.user || !isAdminUser) {
    throw new ApiError(403, "access denied : only admin can access");
  }
  next();
});