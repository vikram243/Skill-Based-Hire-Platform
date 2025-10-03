import {Router} from 'express';
import { becomeProvider } from '../controllers/provider.controller.js';
import { upload } from '../middlewares/upload.middleware.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/onboardProvider').post(
    isAuthenticated,
    upload.array('documents',3),
    becomeProvider
)
export default router;