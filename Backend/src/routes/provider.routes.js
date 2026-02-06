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
} from '../controllers/provider.controller.js';

import { upload } from '../middlewares/upload.middleware.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { becomeProviderSchema, updateProviderSchema, updateOrderStatusSchema } from '../validators/provider.validator.js';

const router = Router();

router.route('/onboardProvider').post(
    isAuthenticated,
    upload.array('documents',3),
    validate(becomeProviderSchema),
    becomeProvider
)

router.route('/dashboard').get(
    isAuthenticated,
    getProviderDashboard
)

router.route('/order').get(
    isAuthenticated,
    getProviderOrders
)

router.route('/orders/:orderId/status').patch(
    isAuthenticated,
    validate(updateOrderStatusSchema),
    updateProviderOrderStatus
)

router.route('/history').get(
    isAuthenticated,
    getProviderHistory
)

router.route('/analytics').get(
    isAuthenticated,
    getProviderAnalytics
)

router.route('/reviews').get(
    isAuthenticated,
    getProviderReviews
)

router.route('/profile').get(
    isAuthenticated,
    getProviderProfile
)

router.route('/update-profile').patch(
    isAuthenticated,
    validate(updateProviderSchema),
    updateProviderProfile
)

export default router;