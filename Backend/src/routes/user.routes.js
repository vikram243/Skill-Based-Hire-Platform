import { Router } from 'express';
import {
  sendOtpToUser,
  verifyOtpAndLogin,
  registerUser,
  logoutUser
} from '../controllers/user.controller.js';

const router = Router();

router.post("/send-otp", sendOtpToUser);
router.post("/verify-otp", verifyOtpAndLogin);
router.post("/register", registerUser);
router.post("/logout", logoutUser);

export default router;