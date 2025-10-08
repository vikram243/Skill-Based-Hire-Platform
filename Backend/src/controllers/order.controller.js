import Order from "../models/order.model.js";
import { ApiError, ApiResponse } from "../utils/api.handeller.js";
import { asyncHandler } from "../utils/async.handeller.js";

// Create a new order
const createOrder = asyncHandler(async (req, res) => {
  const {
    provider,
    skill,
    description,
    address,
    schedule,
    urgency,
    pricing,
    contactPhone,
    notes,
  } = req.body;

  const customer = req.user?._id;

  if (!address || !schedule || !pricing || !provider || !customer) {
    throw new ApiError(400, "Missing required fields (skillName, address, schedule, pricing)");
  }

  const order = await Order.create({
    customer,
    provider,
    skill,
    description,
    address,
    schedule,
    urgency,
    pricing,
    contactPhone,
    notes,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, order, "Order created successfully"));
});

// Get all orders for logged-in customer or provider
const getOrders = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const role = req.query.role || "customer"; // 'customer' or 'provider'

  let filter = {};
  if (role === "customer") filter.customer = userId;
  if (role === "provider") filter.provider = userId;

  const orders = await Order.find(filter)
    .populate("customer", "name email")
    .populate("provider", "name email")
    .populate("skill", "name category");

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders fetched successfully"));
});

// Get orders by status
const getOrdersByStatus = asyncHandler(async (req, res) => {
  const { status } = req.params;
  const userId = req.user?._id;

  const orders = await Order.find({
    customer: userId,
    status,
  })
    .populate("provider", "name email")
    .populate("skill", "name category");

  if (!orders || orders.length === 0) {
    throw new ApiError(404, `No ${status} orders found`);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, orders, `${status} orders fetched successfully`));
});

// Update order status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["pending", "accepted", "ongoing", "completed", "cancelled", "rejected"].includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const order = await Order.findById(id);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  order.status = status;
  await order.save();

  return res
    .status(200)
    .json(new ApiResponse(200, order, `Order status updated to ${status}`));
});

// Get order stats for dashboard
const getOrderStats = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const completed = await Order.countDocuments({ customer: userId, status: "completed" });
  const pending = await Order.countDocuments({ customer: userId, status: "pending" });

  const spentAgg = await Order.aggregate([
    { $match: { customer: userId, status: { $in: ["completed", "ongoing", "pending"] } } },
    { $group: { _id: null, total: { $sum: "$pricing.total" } } },
  ]);

  const stats = {
    completed,
    pending,
    totalSpent: spentAgg[0]?.total || 0,
    // ratings could be handled separately if you store them in reviews collection
  };

  return res
    .status(200)
    .json(new ApiResponse(200, stats, "Order stats fetched successfully"));
});

export {
  createOrder,
  getOrders,
  getOrdersByStatus,
  updateOrderStatus,
  getOrderStats,
};
