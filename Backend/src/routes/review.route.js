import { Router } from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware.js'
import { createReview, getProviderReviews } from '../controllers/review.controller.js'

const router = Router();

router.route("/create").post(
    isAuthenticated,
    createReview
)

router.route("/provider/:id").get(
    isAuthenticated,
    getProviderReviews
)

export default router;