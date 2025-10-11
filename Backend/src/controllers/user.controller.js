import User from '../models/user.model.js';
import { asyncHandler } from '../utils/async.handeller.js';
import { ApiError, ApiResponse } from '../utils/api.handeller.js';
import { generateOtp, verifyOtp } from '../services/otp.service.js';
import { sendEmail } from '../services/email.service.js';
import { sendSms } from '../services/sms.service.js';
import config from '../config/config.js';

// 🔹 Step 1: Send OTP
const sendOtpToUser = asyncHandler(async (req, res) => {
  const { email, number } = req.body;
  const identifier = email || number;

  if (!identifier) throw new ApiError(400, "Email or phone number is required");

  const otpResponse = await generateOtp(identifier); // stores hashed OTP in Redis

  if (email) {
    await sendEmail(email, "Your OTP Code", `Your OTP is ${otpResponse.data.otp}`);
  } else {
    await sendSms(number, `Your OTP is ${otpResponse.data.otp}`);
  }

  return res.status(200).json(new ApiResponse(200, null, "OTP sent successfully"));
});

// 🔹 Step 2: Verify OTP and Login or Prompt Registration
const verifyOtpAndLogin = asyncHandler(async (req, res) => {
  const { email, number, otp } = req.body;
  const identifier = email || number;

  await verifyOtp(identifier, otp); // throws error if invalid

  const user = await User.findOne(email ? { email } : { number });

  if (user) {
    const token = user.generateJwtToken();
    res.cookie("token", token, {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json(new ApiResponse(200, { token, user }, "Login successful"));
  }

  return res.status(200).json(new ApiResponse(200, null, "User not found, show registration panel"));
});

// 🔹 Step 3: Register New User
const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, number } = req.body;

  if (!email && !number) throw new ApiError(400, "Email or phone number is required");

  const existingUser = await User.findOne({
    $or: [{ email }, { number }]
  });

  if (existingUser) throw new ApiError(409, "User already exists");

  const fullName = `${firstName} ${lastName}`;
  const user = await User.create({ firstName, lastName, fullName, email, number });

  const token = user.generateJwtToken();
  res.cookie("token", token, {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  return res.status(201).json(new ApiResponse(201, { token, user }, "User registered and logged in"));
});

// 🔹 Step 4: Logout (already done)
const logoutUser = (req, res) => {
  res.clearCookie("token", { httpOnly: true, secure: config.nodeEnv, sameSite: "strict" });
  return res.status(200).json(new ApiResponse(200, {}, "User logout successfully"));
};

export {
  sendOtpToUser,
  verifyOtpAndLogin,
  registerUser,
  logoutUser
};