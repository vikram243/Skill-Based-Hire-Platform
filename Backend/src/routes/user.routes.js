import { Router } from 'express';
import { loginUser, logoutUser, registerUser } from '../controllers/user.controller.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

router.route("/register").post(
    upload.single('avatar'),
    registerUser
)
router.route("/login").post(
    loginUser
)
router.route("/logout").get(
    logoutUser
)

export default router;