import Notification from '../models/notification.model.js';
import { getIO } from '../config/socket.io.config.js';
import { asyncHandler } from '../utils/async.handeller.js';
import { ApiResponse, ApiError } from '../utils/api.handeller.js';

export const createNotification = asyncHandler(async (req, res) => {
    const { userId, message, title, type = "general", meta } = req.body;
    const targetUserId = userId || req.user?.id;

    if (!targetUserId) {
        throw new ApiError(400, "Target userId is required");
    }

    const notification = await Notification.create({
        user: targetUserId,
        message: title ? `${title}: ${message}` : message,
        type,
        meta
    });

    try {
        const io = getIO();
        const room = io.sockets.adapter.rooms.get(targetUserId.toString());
        if (room && room.size > 0) {
            io.to(targetUserId.toString()).emit("new-notification", notification);
        }
    } catch (err) {
        // Socket emit failure shouldn't fail HTTP request
    }

    return res.status(201).json(
        new ApiResponse(201, notification, "Notification sent successfully")
    );
});

export const getUserNotifications = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 15, 1);
    const skip = (page - 1) * limit;

    const [notifications, total, unreadCount] = await Promise.all([
        Notification.find({ user: userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Notification.countDocuments({ user: userId }),
        Notification.countDocuments({ user: userId, isRead: false })
    ]);

    return res.status(200).json(
        new ApiResponse(200, {
            notifications,
            total,
            unreadCount,
            page,
            pages: Math.ceil(total / limit)
        }, "Notifications fetched successfully")
    );
});

export const markNotificationAsRead = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;

    const notification = await Notification.findOneAndUpdate(
        { _id: id, user: userId },
        { isRead: true },
        { new: true }
    );

    if (!notification) {
        throw new ApiError(404, "Notification not found");
    }

    return res.status(200).json(
        new ApiResponse(200, notification, "Notification marked as read")
    );
});

export const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
    const userId = req.user?.id;

    await Notification.updateMany(
        { user: userId, isRead: false },
        { isRead: true }
    );

    return res.status(200).json(
        new ApiResponse(200, null, "All notifications marked as read")
    );
});

export const getUnreadNotificationsCount = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    const unreadCount = await Notification.countDocuments({ user: userId, isRead: false });

    return res.status(200).json(
        new ApiResponse(200, { unreadCount }, "Unread notification count retrieved")
    );
});

export const deleteNotification = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;

    const deleted = await Notification.findOneAndDelete({ _id: id, user: userId });
    if (!deleted) {
        throw new ApiError(404, "Notification not found");
    }

    return res.status(200).json(
        new ApiResponse(200, null, "Notification deleted successfully")
    );
});