import crypto from "crypto";
import bcrypt from "bcryptjs";
import redis from "../config/redis.config.js";
import { asyncHandler } from "../utils/async.handeller.js";
import { ApiError, ApiResponse } from "../utils/api.handeller.js";

const generateOtp = asyncHandler(async (identifier, length = 6) => {
    if (!identifier) {
        throw new ApiError(400, "Identifier (email or phone) is required");
    }

    // Step 1: Generate numeric OTP
    const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString();

    // Step 2: Hash OTP with bcrypt
    const hashedOtp = await bcrypt.hash(otp, 10);

    // Step 3: Save hashed OTP to Redis with 3 min expiry
    const redisKey = `otp:${identifier}`;
    await redis.setEx(redisKey, 180, hashedOtp); // expires in 3 mins

    // Step 4: Return OTP (to send via email or SMS)
    return new ApiResponse(200, { otp, expiresIn: 180 }, "OTP generated successfully");
});

const verifyOtp = asyncHandler(async (identifier, enteredOtp) => {
    if (!identifier || !enteredOtp) {
        throw new ApiError(400, "Identifier and OTP are required");
    }

    const redisKey = `otp:${identifier}`;
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
});

export { generateOtp, verifyOtp };