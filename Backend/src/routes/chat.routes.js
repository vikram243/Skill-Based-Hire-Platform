import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  getConversations,
  getOrCreatePartnerConversation,
  getMessages,
  sendMessage,
} from "../controllers/chat.controller.js";

const router = Router();

router.route("/conversations").get(isAuthenticated, getConversations);
router.route("/partner/:partnerId").get(isAuthenticated, getOrCreatePartnerConversation);
router.route("/messages/:participantId").get(isAuthenticated, getMessages);
router.route("/send").post(isAuthenticated, sendMessage);

export default router;
