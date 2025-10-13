import crypto from "crypto";
import bcrypt from "bcryptjs";
import redis from "../config/redis.config.js";
import { ApiError, ApiResponse } from "../utils/api.handeller.js";

const generateOtp = async (identifier, length = 6) => {
  if (!identifier) {
    throw new ApiError(400, "Identifier (email or phone) is required");
  }

  const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
  const hashedOtp = await bcrypt.hash(otp, 10);
  const redisKey = `loginOtp:${identifier}`;
  await redis.setEx(redisKey, 300, hashedOtp);

  return new ApiResponse(200, { otp, expiresIn: 180 }, "OTP generated successfully");
};

const verifyOtp = async (identifier, enteredOtp) => {
    if (!identifier || !enteredOtp) {
        throw new ApiError(400, "Identifier and OTP are required");
    }
    const redisKey = `loginOtp:${identifier}`;
    const storedHashedOtp = await redis.get(redisKey);

    if (!storedHashedOtp) {
        throw new ApiError(400, "OTP expired or not found");
    }
    const isMatch = await bcrypt.compare(enteredOtp, storedHashedOtp);
    if (!isMatch) {
        throw new ApiError(401, "Invalid OTP");
    }
    // ✅ OTP is valid — remove from Redis (to prevent reuse)
    await redis.del(redisKey);

    return new ApiResponse(200, null, "OTP verified successfully");
};

export { generateOtp, verifyOtp };