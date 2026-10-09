import { Router } from "express";
import {
    createNotification,
    getUserNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getUnreadNotificationsCount,
    deleteNotification
} from "../controllers/notification.controller.js";
import { isAdmin, isAuthenticated } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { createNotificationSchema } from "../validators/notification.validator.js";

const router = Router();

// User notification routes
router.get("/", isAuthenticated, getUserNotifications);
router.get("/unread-count", isAuthenticated, getUnreadNotificationsCount);
router.patch("/read-all", isAuthenticated, markAllNotificationsAsRead);
router.patch("/:id/read", isAuthenticated, markNotificationAsRead);
router.delete("/:id", isAuthenticated, deleteNotification);

// Admin trigger notification
router.post(
    "/",
    isAuthenticated,
    isAdmin,
    validate(createNotificationSchema),
    createNotification
);

export default router;