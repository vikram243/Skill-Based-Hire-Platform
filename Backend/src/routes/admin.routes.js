import { Router } from 'express';
import { isAuthenticated, isAdmin } from '../middlewares/auth.middleware.js';
import {
  getAdminStats,
  getAllUsers,
  getAllProviders,
  updateProviderStatus,
  getAllOrders,
  deleteOrders,
  suspendUser,
  activateUser,
  getAllReviews,
  updateReviewStatus,
  toggleReviewVisibility,
  flagReview,
  getAllActivities,
  adminLogin,
  promoteToAdmin
} from '../controllers/admin.controller.js';

const router = Router();

// Public Admin Auth & Setup
router.post('/login', adminLogin);
router.post('/promote', promoteToAdmin);

// Admin Dashboard KPIs & Charts
router.get('/dashboard', isAuthenticated, isAdmin, getAdminStats);
router.get('/stats', isAuthenticated, isAdmin, getAdminStats);

// Users Management
router.get('/users', isAuthenticated, isAdmin, getAllUsers);
router.patch('/users/:id/suspend', isAuthenticated, isAdmin, suspendUser);
router.patch('/users/:id/activate', isAuthenticated, isAdmin, activateUser);

// Providers Management
router.get('/providers', isAuthenticated, isAdmin, getAllProviders);
router.get('/Providers', isAuthenticated, isAdmin, getAllProviders); // Legacy support
router.patch('/providers/:id/status', isAuthenticated, isAdmin, updateProviderStatus);
router.patch('/provider/:id/status', isAuthenticated, isAdmin, updateProviderStatus); // Legacy support

// Orders Management
router.get('/orders', isAuthenticated, isAdmin, getAllOrders);
router.delete('/orders/:orderId', isAuthenticated, isAdmin, deleteOrders);
router.delete('/orders/delete/:orderId', isAuthenticated, isAdmin, deleteOrders);
router.delete('/orders/delete', isAuthenticated, isAdmin, deleteOrders); // Legacy fallback

// Reviews Moderation
router.get('/reviews', isAuthenticated, isAdmin, getAllReviews);
router.patch('/reviews/:id/status', isAuthenticated, isAdmin, updateReviewStatus);
router.patch('/reviews/:id/hide', isAuthenticated, isAdmin, toggleReviewVisibility);
router.patch('/reviews/:id/flag', isAuthenticated, isAdmin, flagReview);

// Activities / Audit Logs
router.get('/activities', isAuthenticated, isAdmin, getAllActivities);

export default router;