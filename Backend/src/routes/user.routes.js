import { Router } from 'express';
import {
  sendOtpToUser,
  verifyOtpAndLogin,
  registerUser,
  logoutUser
} from '../controllers/user.controller.js';

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
  logoutUser
);

export default router;