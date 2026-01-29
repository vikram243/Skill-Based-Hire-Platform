import { Router } from 'express';
import { isAuthenticated,isAdmin } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { 
    getAllUsers,
    getAllProviders,
    updateProviderStatus,
    getAllOrders,
    deleteOrders,
    suspendUser,
    getAllReviews,
    updateReviewStatus,
    toggleReviewVisibility,
    flagReview,
    getAllActivities
} from '../controllers/admin.controller.js';
import { approveProviderSchema, rejectProviderSchema, getUsersSchema, getProvidersSchema } from '../validators/admin.validator.js';

const router = Router();

router.route("/users").get(
    isAuthenticated,
    isAdmin,
    validate(getUsersSchema),
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
    getAllOrders
)

router.route("/orders/delete").delete(
    isAuthenticated,
    isAdmin,
    deleteOrders
)

router.route("/Providers").get(
    isAuthenticated,
    isAdmin,
    validate(getProvidersSchema),
    getAllProviders
)

router.route("/provider/:id/status").patch(
    isAuthenticated,
    isAdmin,
    validate(approveProviderSchema),
    updateProviderStatus
)

router.route("/reviews").get(
    isAuthenticated,
    isAdmin,
    getAllReviews
)

router.route("/reviews/:id/status").patch(
    isAuthenticated,
    isAdmin,
    updateReviewStatus
)

router.route("/reviews/:id/hide").patch(
    isAuthenticated,
    isAdmin,
    toggleReviewVisibility
)

router.route("/reviews/:id/flag").patch(
    isAuthenticated,
    isAdmin,
    flagReview
)

router.route("/activities").get(
    isAuthenticated,
    isAdmin,
    getAllActivities
)

export default router;