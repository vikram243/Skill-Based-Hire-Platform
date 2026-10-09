import Provider from '../models/provider.model.js';
import { asyncHandler } from '../utils/async.handeller.js';
import { ApiError } from '../utils/api.handeller.js';

export const requireProviderMode = asyncHandler(async (req, res, next) => {
  if (!req.user) throw new ApiError(401, 'Not authenticated');

  const isProviderUser = req.user.isProvider || Boolean(req.user.providerProfile);
  if (!isProviderUser) {
    throw new ApiError(403, 'User is not a registered provider');
  }

  if (!req.user.isProviderMode) {
    req.user.isProviderMode = true;
    req.user.isProvider = true;
    await req.user.save();
  }

  next();
});