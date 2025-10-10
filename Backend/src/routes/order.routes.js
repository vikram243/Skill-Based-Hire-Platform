import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  createOrder,
  getOrders,
  getOrdersByStatus,
  updateOrderStatus,
  getOrderStats,
} from "../controllers/order.controller.js";

const router = Router();

router.route("/createOrder").post(
  isAuthenticated,
  createOrder
);
router.route("/getAllOrders").get(
  isAuthenticated,
  getOrders
);
router.route("/status/:status").get(  
  isAuthenticated,
  getOrdersByStatus
);
router.route("/:id/update-status").patch(
  isAuthenticated,
  updateOrderStatus
);
router.route("/stats/me").get(
  isAuthenticated,
  getOrderStats
);

export default router;