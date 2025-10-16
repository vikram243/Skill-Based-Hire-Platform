import { Router } from "express";
import { createNotification } from "../controllers/notification.controller.js";
import { isAdmin, isAuthenticated } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(
    isAuthenticated,
    isAdmin,
    createNotification
);

export default router;