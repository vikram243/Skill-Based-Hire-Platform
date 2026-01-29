import { Router } from 'express';
import {
  sendOtpToUser,
  verifyOtpAndLogin,
  registerUser,
  logoutUser,
  refreshAccessToken
} from '../controllers/user.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { sendOtpSchema, verifyOtpSchema, registerSchema, refreshSchema } from '../validators/user.validator.js';

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

export default router;