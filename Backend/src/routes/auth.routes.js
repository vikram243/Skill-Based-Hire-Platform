import { Router } from 'express';
import { googleLogin } from '../controllers/auth.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const router = Router();

router.route("/google").get(
   googleLogin
)

router.get("/verify", isAuthenticated, (req, res) => {
  res.json({ success: true });
});

export default router;