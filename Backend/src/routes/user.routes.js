import { Router } from 'express';
import {
  sendOtpToUser,
  verifyOtpAndLogin,
  registerUser,
  logoutUser
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

export default router;