import User from '../models/user.model.js';
import { asyncHandler } from '../utils/async.handeller.js';
import { ApiError, ApiResponse } from '../utils/api.handeller.js';
import { generateOtp, verifyOtp } from '../services/otp.service.js';
import { sendEmail } from '../services/email.service.js';
import { sendSms } from '../services/twilio.service.js';
import config from '../config/config.js';
import { getSafeUser } from '../utils/userSafe.helper.js';
import { setRefreshToken, getRefreshToken, deleteRefreshToken } from '../config/redis.config.js';
import jwt from 'jsonwebtoken';


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

  const user = await User.findOne(email ? { email } : { number });

  if (user) {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    await setRefreshToken(user._id.toString(), refreshToken);

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

  if (!firstName || !lastName || (!email && !number)) {
    throw new ApiError(400, "Required fields missing");
  }

  const orConditions = [];
  if (email) orConditions.push({ email });
  if (number) orConditions.push({ number });

  const existingUser = await User.findOne({
    $or: orConditions
  });

  if (existingUser) {
    throw new ApiError(409, "User already exists with given email or phone number");
  }

  const fullName = `${firstName} ${lastName}`;
  const payload = { firstName, lastName, fullName };

  if (email) payload.email = email;
  if (number) payload.number = number;

  const user = await User.create(payload);

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  await setRefreshToken(user._id.toString(), refreshToken);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { accessToken, user }, "User registered and logged in"));
});



const logoutUser = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (refreshToken) {
    try {
      const payload = jwt.verify(refreshToken, config.jwtRefreshSecret || (config.jwtSecret + '_refresh'));
      if (payload?.id) {
        await deleteRefreshToken(payload.id.toString());
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

  const accessToken = user.generateAccessToken();
  return res.status(200).json(new ApiResponse(200, { accessToken }, "Access token refreshed"));
});

export {
  sendOtpToUser,
  verifyOtpAndLogin,
  registerUser,
  logoutUser,
  refreshAccessToken
}