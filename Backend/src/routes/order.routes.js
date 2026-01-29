import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import {
  createOrder,
  getOrders,
  getOrdersByStatus,
  updateOrderStatus,
  getOrderStats,
} from "../controllers/order.controller.js";
import { createOrderSchema, getOrderSchema } from "../validators/order.validator.js";

const router = Router();

router.route("/createOrder").post(
  isAuthenticated,
  validate(createOrderSchema),
  createOrder
);
router.route("/getAllOrders").get(
  isAuthenticated,
  validate(getOrderSchema),
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