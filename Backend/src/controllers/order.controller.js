import Order from "../models/order.model.js";
import { ApiError, ApiResponse } from "../utils/api.handeller.js";
import { asyncHandler } from "../utils/async.handeller.js";

export const createOrder = asyncHandler(async (req, res) => {
  const {
    customer,
    provider,
    skill,
    description,
    address,
    urgency,
    pricing,
    contactPhone,
  } = req.body;

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
        from: "providers",
        localField: "provider",
        foreignField: "_id",
        as: "provider"
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "provider.user",
        foreignField: "_id",
        as: "providerUser"
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
    { $unwind: { path: "$provider", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$providerUser", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$skill", preserveNullAndEmptyArrays: true } },
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
        provider: {
          _id: "$provider._id",
          businessName: "$provider.businessName",
          professionalDescription: "$provider.professionalDescription",
          yearsExperience: "$provider.yearsExperience",
          user: {
            fullName: "$providerUser.fullName",
            avatar: "$providerUser.avatar",
            email: "$providerUser.email"
          }
        },
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

  const completed = await Order.countDocuments({ customer: userId, status: "completed" });
  const pending = await Order.countDocuments({ customer: userId, status: "pending" });

  if (!status) {
    throw new ApiError(400, "Order status is required");
  }

  const spentAgg = await Order.aggregate([
    { $match: { customer: userId, status: { $in: ["completed", "ongoing", "pending"] } } },
    { $group: { _id: null, total: { $sum: "$pricing.total" } } },
  ]);

  const orders = await Order.aggregate([
    {
      $match: {
        customer: userId,
        status
      }
    },
    {
      $lookup: {
        from: "providers",
        localField: "provider",
        foreignField: "_id",
        as: "provider"
      }
    },
    {
    $lookup: {
      from: "users",
      localField: "provider.user",
      foreignField: "_id",
      as: "providerUser"
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
    { $unwind: { path: "$provider", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$skill", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$providerUser", preserveNullAndEmptyArrays: true } },
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
          _id: "$provider._id",
          businessName: "$provider.businessName",
          professionalDescription: "$provider.professionalDescription",
          yearsExperience: "$provider.yearsExperience",
          user: {
            fullName: "$providerUser.fullName",
            avatar: "$providerUser.avatar",
            email: "$providerUser.email"
          }
        },
        skill: {
          name: "$skill.name",
          category: "$skill.category"
        }
      }
    },
    { $sort: { createdAt: -1 } }
  ]);

  const message = (orders && orders.length > 0)
    ? `${status} orders fetched successfully`
    : `No ${status} orders found`;

    const data = {
    orders : orders || [],
    completed,
    pending,
    totalSpent: spentAgg[0]?.total || 0
    }

  return res
    .status(200)
    .json(new ApiResponse(200, data, message));
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
  const cancelled = await Order.countDocuments({ customer: userId, status: "cancelled" });
  const totalOrders = await Order.countDocuments({ customer: userId });
  const activeOrders = totalOrders - (completed + cancelled);

   const recentOrders = await Order.aggregate([
  // 1️⃣ Match user orders
  {
    $match: {
      customer: userId
    }
  },

  // 2️⃣ Sort by latest
  {
    $sort: { createdAt: -1 }
  },

  // 3️⃣ Limit to recent 5
  {
    $limit: 5
  },

  // 4️⃣ Lookup skill
  {
    $lookup: {
      from: "skills",
      localField: "skill",
      foreignField: "_id",
      as: "skill"
    }
  },
  {
    $unwind: { path: "$skill", preserveNullAndEmptyArrays: true }
  },

  // 6️⃣ Final shape (clean response)
  {
    $project: {
      _id: 1,
      orderStatus: "$status",
      createdAt: 1,
      skill: {
        category: "$skill.category"
      }
    }
  }
]);
  const stats = {
    activeOrders,
    totalOrders,
    recentOrders
    // ratings could be handled separately if you store them in reviews collection
  };

  return res.status(200).json(
    new ApiResponse(200, stats, "Order stats fetched successfully")
  );
});