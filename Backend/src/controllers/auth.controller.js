import { asyncHandler } from '../utils/async.handeller.js';
import { auth2client } from '../utils/googleConfig.js';
import User from '../models/user.model.js';
import { uploadOnCloudinary } from "../config/cloudinary.config.js";
import { ApiError, ApiResponse } from '../utils/api.handeller.js';

const googleLogin = asyncHandler(async (req, res) => {
  const { code } = req.query;

  if (!code) throw new ApiError(400, "Authorization code is required");

  const { tokens } = await auth2client.getToken(code);
  auth2client.setCredentials(tokens);

  const ticket = await auth2client.verifyIdToken({
    idToken: tokens.id_token,
    audience: process.env.GOOGLE_CLIENT_ID
  });

  const payload = ticket.getPayload();
  const { email, name, picture } = payload;

  if (!email) throw new ApiError(400, "Google did not return an email");

  let user = await User.findOne({ email });
  let avatarUrl = user?.avatar;

  if (!user || (user && user.avatar !== picture)) {
    const cloudinaryRes = await uploadOnCloudinary(picture);
    avatarUrl = cloudinaryRes?.secure_url || picture;
  }

  user = await User.findOneAndUpdate(
    { email },
    {
      fullName: name,
      avatar: avatarUrl
    },
    { new: true, upsert: true }
  );

  const token = user.generateJwtToken();

  return res.status(200).json(
    new ApiResponse(200, { user, token }, "success")
  );
});

export { googleLogin };
