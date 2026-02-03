import { Router } from 'express';
import {
  sendOtpToUser,
  verifyOtpAndLogin,
  registerUser,
  logoutUser,
  refreshAccessToken,
  updateProfile
} from '../controllers/user.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { sendOtpSchema, verifyOtpSchema, registerSchema, refreshSchema, updateProfileSchema } from '../validators/user.validator.js';
import { upload } from '../middlewares/upload.middleware.js';
const router = Router();

router.route("/send-otp").post(
  validate(sendOtpSchema),
  sendOtpToUser
);

router.route("/verify-otp").post(
  validate(verifyOtpSchema),
  verifyOtpAndLogin
);

router.route("/register").post(
  validate(registerSchema),
  registerUser
);

router.route("/logout").get(
  isAuthenticated,
  logoutUser
);

router.route("/refresh").post(
  validate(refreshSchema),
  refreshAccessToken
);

router.route("/update-profile").put(
  isAuthenticated,
  validate(updateProfileSchema),
  upload.single("avatar"),
  updateProfile
);

export default router;