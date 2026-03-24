import Provider from '../models/provider.model.js';
import { asyncHandler } from '../utils/async.handeller.js';
import { ApiError } from '../utils/api.handeller.js';

export const requireProviderMode = asyncHandler(async (req, res, next) => {
  if (!req.user) throw new ApiError(401, 'Not authenticated');

  if (!req.user.isProvider) {
    throw new ApiError(403, 'User is not a provider');
  }

  if (!req.user.isProviderMode) {
    throw new ApiError(403, 'Provider mode is not enabled');
  }

  next();
});