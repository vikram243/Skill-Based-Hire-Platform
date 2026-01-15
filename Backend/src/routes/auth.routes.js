import { Router } from 'express';
import { googleLogin, verifyAuth } from '../controllers/auth.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const router = Router();

router.route("/google").get(
   googleLogin
)

router.route("/verify").get(
   isAuthenticated,
   verifyAuth
)

export default router;