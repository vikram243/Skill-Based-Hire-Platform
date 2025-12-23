import Order from "../models/order.model.js";
import { ApiError, ApiResponse } from "../utils/api.handeller.js";
import { asyncHandler } from "../utils/async.handeller.js";

export const createOrder = asyncHandler(async (req, res) => {
  const {
    provider,
    skill,
    description,
    address,
    urgency,
    pricing,
    contactPhone,
  } = req.body;

  const customer = req.user?._id;

  if (!address || !pricing || !provider || !customer || !skill || !urgency || !contactPhone || !description) {
    throw new ApiError(400, "Missing required fields (skillName, address, schedule, pricing)");
  }

  const order = await Order.create({
    customer,
    provider,
    skill,
    description,
    address,
    urgency,
    pricing,
    contactPhone,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, order, "Order created successfully"));
});

export const getOrders = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const role = req.query.role || "customer";

  const matchStage = role === "provider"
    ? { provider: userId }
    : { customer: userId };

  const orders = await Order.aggregate([
    { $match: matchStage },
    {
      $lookup: {
        from: "users",
        localField: "customer",
        foreignField: "_id",
        as: "customer"
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "provider",
        foreignField: "_id",
        as: "provider"
      }
    },
    {
      $lookup: {
        from: "skills",
        localField: "skill",
        foreignField: "_id",
        as: "skill"
      }
    },
    { $unwind: "$customer" },
    { $unwind: "$provider" },
    { $unwind: "$skill" },
    {
      $project: {
        _id: 1,
        description: 1,
        address: 1,
        urgency: 1,
        pricing: 1,
        contactPhone: 1,
        status: 1,
        createdAt: 1,
        customer: { name: "$customer.fullName", email: "$customer.email" },
        provider: { name: "$provider.fullName", email: "$provider.email" },
        skill: { name: "$skill.name", category: "$skill.category" }
      }
    },
    { $sort: { createdAt: -1 } }
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders fetched successfully"));
});

export const getOrdersByStatus = asyncHandler(async (req, res) => {
  const { status } = req.params;
  const userId = req.user?._id;

  if (!status) {
    throw new ApiError(400, "Order status is required");
  }

  const orders = await Order.aggregate([
    {
      $match: {
        customer: userId,
        status
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "provider",
        foreignField: "_id",
        as: "provider"
      }
    },
    {
      $lookup: {
        from: "skills",
        localField: "skill",
        foreignField: "_id",
        as: "skill"
      }
    },
    { $unwind: "$provider" },
    { $unwind: "$skill" },
    {
      $project: {
        _id: 1,
        description: 1,
        address: 1,
        urgency: 1,
        pricing: 1,
        contactPhone: 1,
        status: 1,
        createdAt: 1,
        provider: {
          name: "$provider.fullName",
          email: "$provider.email"
        },
        skill: {
          name: "$skill.name",
          category: "$skill.category"
        }
      }
    },
    { $sort: { createdAt: -1 } }
  ]);

  if (!orders || orders.length === 0) {
    throw new ApiError(404, `No ${status} orders found`);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, orders, `${status} orders fetched successfully`));
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
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

export const getOrderStats = asyncHandler(async (req, res) => {
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

  return res.status(200).json(
    new ApiResponse(200, stats, "Order stats fetched successfully")
  );
});