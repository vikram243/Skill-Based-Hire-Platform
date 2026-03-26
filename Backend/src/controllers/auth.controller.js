import { asyncHandler } from "../utils/async.handeller.js";
import { auth2client } from "../utils/googleConfig.js";
import User from "../models/user.model.js";
import { uploadOnCloudinary } from "../config/cloudinary.config.js";
import { ApiError, ApiResponse } from "../utils/api.handeller.js";
import { getSafeUser } from "../utils/userSafe.helper.js";
import { logActivity } from "../utils/activity.handeller.js";
import {
  setRefreshToken,
  setSessionId,
  setSessionMeta,
  getRefreshToken,
} from "../config/redis.config.js";
import crypto from "crypto";
import config from "../config/config.js";
import { getAvatarUrl } from "../utils/cloudinaryUrl.js";

const googleLogin = asyncHandler(async (req, res) => {
  const { code } = req.query;

  if (!code) throw new ApiError(400, "Authorization code is required");

  const { tokens } = await auth2client.getToken(code);
  auth2client.setCredentials(tokens);

  const ticket = await auth2client.verifyIdToken({
    idToken: tokens.id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const { email, name, picture } = payload;

  if (!email) throw new ApiError(400, "Google did not return an email");

  let user = await User.findOne({ email }).populate({
    path: "providerProfile",
    select: "applicationStatus submittedAt isAttampted",
  });
  let avatar = user?.avatar;

  if (!user || (user && user.avatar !== picture)) {
    const cloudinaryRes = await uploadOnCloudinary(picture);
    avatar = cloudinaryRes?.public_id;
  }

  user = await User.findOneAndUpdate(
    { email },
    {
      fullName: name,
      avatar: avatar,
    },
    { new: true, upsert: true },
  );

  const userSafe = getSafeUser(user);

  await logActivity({
    action: "User Registered",
    target: user._id,
    targetModel: "User",
    description: `${user.fullName} has registered`,
  });

  // generate tokens + session id
  const sessionId = crypto.randomUUID();
  const accessToken = user.generateAccessToken(sessionId);
  const refreshToken = user.generateRefreshToken();

  // compute fingerprint and store refresh token, session id and meta
  const fingerprintRaw = req.headers["user-agent"] || "";
  const fingerprint = crypto
    .createHash("sha256")
    .update(fingerprintRaw)
    .digest("hex");
  await setRefreshToken(user._id.toString(), refreshToken);

  // ADD THIS - verify karo ki save hua
  const saved = await getRefreshToken(user._id.toString());
  console.log(
    "✅ Token saved check:",
    saved === refreshToken,
    "| saved:",
    saved?.slice(0, 20),
  );

  await setSessionId(user._id.toString(), sessionId);
  await setSessionMeta(user._id.toString(), { fingerprint });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    domain: ".myskillhub.in",
  });

  // Phir set karo
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none", // ← "lax" se "none" karo
    domain: ".myskillhub.in", // ← dot wala
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { user: userSafe, accessToken }, "success"));
});

const verifyAuth = asyncHandler(async (req, res) => {
  // fetch fresh user from DB (with providerProfile) instead of using token payload
  const user = await User.findById(req.user.id).populate({
    path: "providerProfile",
    select: "applicationStatus submittedAt isAttampted",
  });

  if (!user) throw new ApiError(404, "User not found");

  const userSafe = getSafeUser(user);
  res.set("Cache-Control", "no-store");
  return res
    .status(200)
    .json(new ApiResponse(200, { user: userSafe }, "verified"));
});

export { verifyAuth, googleLogin };
