import { Router } from 'express';
import userRoutes from './user.routes.js';
import authRoutes from './auth.routes.js';
import providerRoutes from './provider.routes.js'
import adminRoutes from './admin.routes.js'
import orderRoutes from './order.routes.js';
import skillRoutes from './skill.routes.js';
import reviewRoutes from './review.route.js'
import mapRoutes from './maps.routes.js';

import chatRoutes from './chat.routes.js';
import notificationRoutes from './notification.routes.js';

const router = Router();

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/providers', providerRoutes);
router.use('/admin', adminRoutes);
router.use('/orders', orderRoutes);
router.use('/skills', skillRoutes);
router.use('/review', reviewRoutes);
router.use('/reviews', reviewRoutes);
router.use('/maps', mapRoutes);
router.use('/chat', chatRoutes);
router.use('/notifications', notificationRoutes);

export default router;