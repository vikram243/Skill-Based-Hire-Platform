import { Router } from 'express';
import {
  sendOtpToUser,
  verifyOtpAndLogin,
  registerUser,
  logoutUser,
  refreshAccessToken
} from '../controllers/user.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const router = Router();

router.route("/send-otp").post(
  sendOtpToUser
);

router.route("/verify-otp").post(
  verifyOtpAndLogin
);

router.route("/register").post(
  registerUser
);

router.route("/logout").get(
  isAuthenticated,
  logoutUser
);

router.route("/refresh").post(
  refreshAccessToken
);

export default router;