import { Router } from "express";
import {
  createOrder,
  getOrders,
  getOrdersByStatus,
  updateOrderStatus,
  getOrderStats,
} from "../controllers/order.controller.js";

const router = Router();

router.route("/create").post(createOrder);
router.route("/get").get(getOrders);
router.route("/status/:status").get(getOrdersByStatus);
router.route("/:id/update-status").put(updateOrderStatus);
router.route("/stats/me").get(getOrderStats);

export default router;