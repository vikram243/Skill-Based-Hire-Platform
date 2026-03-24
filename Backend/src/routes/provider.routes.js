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
    hireProviderId
} from '../controllers/provider.controller.js';
import { filterProviders } from '../controllers/filter.controller.js';

import { upload } from '../middlewares/upload.middleware.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
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

router.route('/:providerId').post(
    isAuthenticated,
    validate(hireProviderByIdSchema),
    hireProviderId
)

router.route('/dashboard').get(
    isAuthenticated,
    requireProviderMode,
    getProviderDashboard
)

router.route('/order').get(
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

router.route('/filter').get(
    isAuthenticated,
    filterProviders
);

export default router;