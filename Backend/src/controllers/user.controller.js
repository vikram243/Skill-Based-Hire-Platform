import User from '../models/user.model.js';
import { asyncHandler } from '../utils/async.handeller.js';
import { ApiError, ApiResponse } from '../utils/api.handeller.js';
import { generateOtp, verifyOtp } from '../services/otp.service.js';
import { sendEmail } from '../services/email.service.js';
import { sendSms } from '../services/twilio.service.js';
import config from '../config/config.js';
import { getSafeUser } from '../utils/userSafe.helper.js';
import { setRefreshToken, getRefreshToken, deleteRefreshToken, setSessionId, getSessionId, deleteSessionId, setSessionMeta, getSessionMeta, deleteSessionMeta } from '../config/redis.config.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { uploadOnCloudinary } from '../config/cloudinary.config.js';


const sendOtpToUser = asyncHandler(async (req, res) => {
  const { email, number } = req.body;
  const identifier = email || number;

  if (!identifier) throw new ApiError(400, "Email or phone number is required");

  const otpResponse = await generateOtp(identifier);

  if (email) {
    await sendEmail({
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otpResponse.data.otp} to verify your identity on Skill-Hub. It expires in ${otpResponse.data.expiresIn / 60}min`
    });
  } else {
    await sendSms(`+91${number}`, `Your OTP is ${otpResponse.data.otp}`);
  }

  return res.status(200).json(new ApiResponse(200, null, "OTP sent successfully"));
});

const verifyOtpAndLogin = asyncHandler(async (req, res) => {
  const { email, number, otp } = req.body;
  const identifier = email || number;

  await verifyOtp(identifier, otp);

  const user = await User.findOne(email ? { email } : { number }).populate({
    path: "providerProfile",
    select: "applicationStatus submittedAt isAttampted"
  });

  if (user) {
    const sessionId = crypto.randomUUID();
    const accessToken = user.generateAccessToken(sessionId);
    const refreshToken = user.generateRefreshToken();

    // compute fingerprint from request
    const fingerprintRaw = `${req.ip || ''}|${req.headers['user-agent'] || ''}`;
    const fingerprint = crypto.createHash('sha256').update(fingerprintRaw).digest('hex');

    // store refresh token, session id and session meta keyed by user id
    await setRefreshToken(user._id.toString(), refreshToken);
    await setSessionId(user._id.toString(), sessionId);
    await setSessionMeta(user._id.toString(), { fingerprint });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    const userSafe = getSafeUser(user);
    return res.status(200).json(new ApiResponse(200, { user: userSafe, accessToken }, "user login successfully"));
  }

  return res.status(200).json(new ApiResponse(200, { exists: false }, "User does not exist"));
});

const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, number } = req.body || {};

  if (!firstName || !lastName || !email || !number) {
    throw new ApiError(400, "Required fields missing: firstName, lastName, email and number are required");
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { number }]
  });

  if (existingUser) {
    throw new ApiError(409, "User already exists with given email or phone number");
  }

  const fullName = `${firstName} ${lastName}`;
  const payload = { firstName, lastName, fullName, email, number };

  const user = await User.create(payload)

  const sessionId = crypto.randomUUID();
  const accessToken = user.generateAccessToken(sessionId);
  const refreshToken = user.generateRefreshToken();
  const fingerprintRaw = `${req.ip || ''}|${req.headers['user-agent'] || ''}`;
  const fingerprint = crypto.createHash('sha256').update(fingerprintRaw).digest('hex');
  await setRefreshToken(user._id.toString(), refreshToken);
  await setSessionId(user._id.toString(), sessionId);
  await setSessionMeta(user._id.toString(), { fingerprint });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  const userSafe = getSafeUser(user);

  return res
    .status(201)
    .json(new ApiResponse(201, { accessToken, user: userSafe }, "User registered and logged in"));
});

const logoutUser = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (refreshToken) {
    try {
      const payload = jwt.verify(refreshToken, config.jwtRefreshSecret || (config.jwtSecret + '_refresh'));
      if (payload?.id) {
        await deleteRefreshToken(payload.id.toString());
        try { await deleteSessionId(payload.id.toString()); } catch (e) { /* ignore */ }
        try { await deleteSessionMeta(payload.id.toString()); } catch (e) { /* ignore */ }
      }
    } catch (e) {
    }
  }
  res.clearCookie("refreshToken", { httpOnly: true, secure: config.nodeEnv === "production", sameSite: "strict" });
  return res.status(200).json(new ApiResponse(200, {}, "User logout successfully"));
};

const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) throw new ApiError(401, "Refresh token missing");

  let payload;
  try {
    payload = jwt.verify(refreshToken, config.jwtRefreshSecret || (config.jwtSecret + '_refresh'));
  } catch (e) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const stored = await getRefreshToken(payload.id.toString());
  if (!stored || stored !== refreshToken) throw new ApiError(401, "Refresh token not recognized");

  const user = await User.findById(payload.id);
  if (!user) throw new ApiError(404, "User not found");

  // use the stored sessionId so the refreshed access token matches current session
  const sessionId = await getSessionId(user._id.toString());
  // validate fingerprint on refresh
  try {
    const meta = await getSessionMeta(user._id.toString());
    if (meta?.fingerprint) {
      const fingerprintRaw = `${req.ip || ''}|${req.headers['user-agent'] || ''}`;
      const fingerprint = crypto.createHash('sha256').update(fingerprintRaw).digest('hex');
      if (fingerprint !== meta.fingerprint) {
        throw new ApiError(401, 'Session fingerprint mismatch');
      }
    }
  } catch (e) {
    if (e instanceof ApiError) throw e;
    // on redis/meta read error, continue (fail-open)
  }

  const accessToken = user.generateAccessToken(sessionId);
  return res.status(200).json(new ApiResponse(200, { accessToken }, "Access token refreshed"));
});

const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  const safeUser = getSafeUser(user);
  const updates = {};
  const responseData = {};

  const { firstName, lastName, bio, number } = req.body;

  const { location } = req.body;

  if (firstName) {
    updates.firstName = firstName;
    responseData.firstName = firstName;
  }

  if (lastName) {
    updates.lastName = lastName;
    responseData.lastName = lastName;
  }

  if (bio) {
    updates.bio = bio;
    responseData.bio = bio;
  }

  if (number) {
    if(number !== safeUser.number) {
      const existingUser = await User.findOne({ number });
      if (existingUser) {
        throw new ApiError(409, "Another user already exists with this phone number");
      }
    }
    updates.number = number;
    responseData.number = number;
  }

  if (firstName || lastName) {
    const finalFirstName = firstName ?? safeUser.firstName;
    const finalLastName = lastName ?? safeUser.lastName;

    updates.fullName = `${finalFirstName} ${finalLastName}`;
    responseData.fullName = updates.fullName;
  }

  if (req.file) {
    const uploadResult = await uploadOnCloudinary(req.file.path);
    if (!uploadResult?.secure_url) {
      throw new ApiError(500, "Avatar upload failed");
    }

    updates.avatar = uploadResult.secure_url;
    responseData.avatar = uploadResult.secure_url;
  }

  if (location) {
    if (typeof location === 'string') {
      updates['location.address'] = location;
      responseData.location = { address: location };
    } else if (typeof location === 'object') {
      const locObj = {};
      if (location.source) locObj.source = location.source === 'ip-api' ? 'ip' : location.source;
      if (location.pin) locObj.pin = location.pin;
      if (location.address) locObj.address = location.address;
      if (location.city) locObj.city = location.city;
      if (location.state) locObj.state = location.state;
      if (location.lat !== undefined) locObj.lat = Number(location.lat);
      if (location.lng !== undefined) locObj.lng = Number(location.lng);

      updates.location = locObj;
      responseData.location = locObj;
    }
  }

  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, "No valid fields provided");
  }

  await User.findByIdAndUpdate(userId, updates);

  return res.status(200).json(
    new ApiResponse(
      200,
      responseData,
      "Profile updated successfully"
    )
  );
});

export {
  sendOtpToUser,
  verifyOtpAndLogin,
  registerUser,
  logoutUser,
  refreshAccessToken,
  updateProfile
}