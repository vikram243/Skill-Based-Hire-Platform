import { Router } from 'express';
import userRoutes from './user.routes.js';
import authRoutes from './auth.routes.js';
import providerRoutes from './provider.routes.js'
import adminRoutes from './admin.routes.js'
// import orderRoutes from './order.routes.js';
// import skillRoutes from './skill.routes.js';
// import paymentRoutes from './payment.routes.js';
// import chatRoutes from './chat.routes.js';

const router = Router();

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/provider', providerRoutes);
router.use('/admin', adminRoutes);
// router.use('/orders', orderRoutes);
// router.use('/skills', skillRoutes);
// router.use('/payments', paymentRoutes);
// router.use('/chats', chatRoutes);
router.use("/", (req, res) => {
  res.send(`<h1>Home</h1><a href="/auth/google">Login With Google</a>`);
});
export default router;