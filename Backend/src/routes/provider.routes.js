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
    getProviderReviews 
} from '../controllers/provider.controller.js';

import { upload } from '../middlewares/upload.middleware.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/onboardProvider').post(
    isAuthenticated,
    upload.array('documents',3),
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
    updateProviderProfile
)

export default router;