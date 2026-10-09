import {Router} from 'express';
import { 
    becomeProvider, 
    getProviderProfile, 
    updateProviderProfile, 
    getProviderDashboard, 
    getProviderOrders, 
    updateProviderOrderStatus, 
    getProviderHistory, 
    getProviderAnalytics, 
    getProviderReviews,
    hireProviderId,
    uploadProviderAvatar,
    uploadPortfolioImages,
    deletePortfolioImage,
    toggleProviderAvailability,
    replyToReview,
    getPublicProviderDetails
} from '../controllers/provider.controller.js';
import { filterProviders } from '../controllers/filter.controller.js';

import { upload } from '../middlewares/upload.middleware.js';
import { isAuthenticated, optionalAuth } from '../middlewares/auth.middleware.js';
import { requireProviderMode } from '../middlewares/providerMode.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { becomeProviderSchema, updateProviderSchema, updateOrderStatusSchema, hireProviderByIdSchema } from '../validators/provider.validator.js';

const router = Router();

router.route('/onboardProvider').post(
    isAuthenticated,
    upload.array('documents',3),
    validate(becomeProviderSchema),
    becomeProvider
)

router.route('/dashboard').get(
    isAuthenticated,
    requireProviderMode,
    getProviderDashboard
)

// Support both /order and /orders
router.route('/order').get(
    isAuthenticated,
    requireProviderMode,
    getProviderOrders
)
router.route('/orders').get(
    isAuthenticated,
    requireProviderMode,
    getProviderOrders
)

router.route('/orders/:orderId/status').patch(
    isAuthenticated,
    requireProviderMode,
    validate(updateOrderStatusSchema),
    updateProviderOrderStatus
)

router.route('/history').get(
    isAuthenticated,
    requireProviderMode,
    getProviderHistory
)

router.route('/analytics').get(
    isAuthenticated,
    requireProviderMode,
    getProviderAnalytics
)

router.route('/reviews').get(
    isAuthenticated,
    requireProviderMode,
    getProviderReviews
)

router.route('/reviews/:reviewId/reply').post(
    isAuthenticated,
    requireProviderMode,
    replyToReview
)

router.route('/profile').get(
    isAuthenticated,
    requireProviderMode,
    getProviderProfile
)

router.route('/update-profile').patch(
    isAuthenticated,
    requireProviderMode,
    validate(updateProviderSchema),
    updateProviderProfile
)

router.route('/avatar').post(
    isAuthenticated,
    requireProviderMode,
    upload.single('avatar'),
    uploadProviderAvatar
)

router.route('/portfolio/upload').post(
    isAuthenticated,
    requireProviderMode,
    upload.array('images', 5),
    uploadPortfolioImages
)

router.route('/portfolio/delete').delete(
    isAuthenticated,
    requireProviderMode,
    deletePortfolioImage
)

router.route('/availability').patch(
    isAuthenticated,
    requireProviderMode,
    toggleProviderAvailability
)

router.route('/filter').get(
    optionalAuth,
    filterProviders
);

router.route('/:providerId/details').get(getPublicProviderDetails);
router.route('/:providerId/info').get(getPublicProviderDetails);
router.route('/:providerId')
    .get(getPublicProviderDetails)
    .post(
        isAuthenticated,
        validate(hireProviderByIdSchema),
        hireProviderId
    );

export default router;