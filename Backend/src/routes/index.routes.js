import { Router } from 'express';
import userRoutes from './user.routes.js';
import authRoutes from './auth.routes.js';
import providerRoutes from './provider.routes.js'
import adminRoutes from './admin.routes.js'
import orderRoutes from './order.routes.js';
import skillRoutes from './skill.routes.js';

const router = Router();

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/provider', providerRoutes);
router.use('/admin', adminRoutes);
router.use('/orders', orderRoutes);
router.use('/skills', skillRoutes);

export default router;