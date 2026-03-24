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

  // enforce single-device session: check sessionId in token against redis
  try {
    const { getSessionId, getSessionMeta } = await import('../config/redis.config.js');
    const storedSessionId = await getSessionId(decoded.id.toString());
    // if a sessionId is stored for this user and it doesn't match token's sessionId, invalidate
    if (storedSessionId && decoded.sessionId !== storedSessionId) {
      throw new ApiError(401, 'Session invalidated: logged in from another device');
    }

    // validate fingerprint meta if present
    try {
      const meta = await getSessionMeta(decoded.id.toString());
      if (meta?.fingerprint) {
        const fingerprintRaw = `${req.ip || ''}|${req.headers['user-agent'] || ''}`;
        const fingerprint = (await import('crypto')).createHash('sha256').update(fingerprintRaw).digest('hex');
        if (fingerprint !== meta.fingerprint) {
          throw new ApiError(401, 'Session fingerprint mismatch');
        }
      }
    } catch (e) {
      if (e instanceof ApiError) throw e;
      // ignore meta read errors
    }
  } catch (e) {
    // if redis check fails, allow request to proceed (avoid locking out due to redis errors)
    if (e instanceof ApiError) throw e;
  }

  next();
});

export const isAdmin = asyncHandler(async (req,res,next) => {
  const isAdminUser = Boolean(req.user?.isAdmin) || req.user?.role === 'admin';
  if(!req.user || !isAdminUser){
    throw new ApiError(403,"access denied : only admin can access");
  }
  next();
})