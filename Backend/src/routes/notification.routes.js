import { Router } from "express";
import { createNotification } from "../controllers/notification.controller.js";
import { isAdmin, isAuthenticated } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { createNotificationSchema } from "../validators/notification.validator.js";

const router = Router();

router.route("/").post(
    isAuthenticated,
    isAdmin,
    validate(createNotificationSchema),
    createNotification
);

export default router;