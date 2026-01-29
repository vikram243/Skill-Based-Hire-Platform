import { Router } from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware.js'
import { validate } from '../middlewares/validation.middleware.js'
import { createReview, getProviderReviews } from '../controllers/review.controller.js'
import { createReviewSchema, getProviderReviewsSchema } from '../validators/review.validator.js'

const router = Router();

router.route("/create").post(
    isAuthenticated,
    validate(createReviewSchema),
    createReview
)

router.route("/provider/:id").get(
    isAuthenticated,
    validate(getProviderReviewsSchema),
    getProviderReviews
)

export default router;