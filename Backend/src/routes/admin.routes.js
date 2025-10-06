import { Router } from 'express';
import { isAuthenticated,isAdmin } from '../middlewares/auth.middleware.js';
import { getPendingProviders,updateProviderStatus } from '../controllers/admin.controller.js';

const router = Router();

router.route("/Providers").get(
    isAuthenticated,
    isAdmin,
    getPendingProviders
)

router.route("/provider/:id/status").patch(
    isAuthenticated,
    isAdmin,
    updateProviderStatus
)

export default router;