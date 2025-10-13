import User from '../models/user.model.js';
import { asyncHandler } from '../utils/async.handeller.js';
import { ApiError, ApiResponse } from '../utils/api.handeller.js';
import { generateOtp, verifyOtp } from '../services/otp.service.js';
import { sendEmail } from '../services/email.service.js';
import { sendSms } from '../services/twilio.service.js';
import config from '../config/config.js';
import {getSafeUser} from '../utils/userSafe.helper.js'

// 🔹 Step 1: Send OTP
const sendOtpToUser = asyncHandler(async (req, res) => {
  const { email, number } = req.body;
  const identifier = email || number;

  if (!identifier) throw new ApiError(400, "Email or phone number is required");

  const otpResponse = await generateOtp(identifier);

  if (email) {
    await sendEmail({
      to: email, 
      subject: "Your OTP Code", 
      text: `Your OTP is ${otpResponse.data.otp} to verify your identity on Skill-Hub. It expires in ${otpResponse.data.expiresIn/60}min`
    });
  } else {
    await sendSms(`+91${number}`, `Your OTP is ${otpResponse.data.otp}`);
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
        secure: config.nodeEnv,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
    const userSafe = getSafeUser(user);
    return res.status(200).json(new ApiResponse(200, { user:userSafe }, "user login successfully"));
  }
});

// 🔹 Step 3: Register New User
const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, number } = req.body || {};

  if (!firstName || !lastName || (!email && !number)) {
    throw new ApiError(400, "Required fields missing");
  }

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
const logoutUser = async (req, res) => {
  const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];
    if (token) {
      await blackListTokenModel.create({ token });
    }
  res.clearCookie("token", { httpOnly: true, secure: config.nodeEnv, sameSite: "strict" });
  return res.status(200).json(new ApiResponse(200, {}, "User logout successfully"));
};

export{
  sendOtpToUser,
  verifyOtpAndLogin,
  registerUser,
  logoutUser
}