import { Router } from 'express';
import { isAuthenticated,isAdmin } from '../middlewares/auth.middleware.js';
import { getAllUsers,getAllProviders,updateProviderStatus,getAllOrder,deleteOrders,suspendUser } from '../controllers/admin.controller.js';

const router = Router();

router.route("/users").get(
    isAuthenticated,
    isAdmin,
    getAllUsers
)

router.route("/users/:id/suspend").patch(
    isAuthenticated,
    isAdmin,
    suspendUser
)

router.route("/orders").get(
    isAuthenticated,
    isAdmin,
    getAllOrder
)

router.route("/orders/delete").delete(
    isAuthenticated,
    isAdmin,
    deleteOrders
)
router.route("/Providers").get(
    isAuthenticated,
    isAdmin,
    getAllProviders
)

router.route("/provider/:id/status").patch(
    isAuthenticated,
    isAdmin,
    updateProviderStatus
)

export default router;