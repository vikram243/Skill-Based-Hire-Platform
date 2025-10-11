import Provider from '../models/provider.model.js';
import { asyncHandler } from '../utils/async.handeller.js';
import { ApiError, ApiResponse } from '../utils/api.handeller.js';
import User from '../models/user.model.js';
import Order from '../models/order.model.js';
import Review from '../models/review.model.js';
import { getSafeUser } from '../utils/userSafe.helper.js';
import { logActivity } from '../utils/activity.handeller.js'

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.aggregate([
    {
      $project: {
        _id: 1,
        fullName: 1,
        email: 1,
        number: 1,
        isUser: 1,
        isProvider: 1,
        isAdmin: 1,
        providerStatus: 1,
        isActive: 1,
        createdAt: 1
      }
    },
    { $sort: { createdAt: -1 } }
  ]);

  res.status(200).json(
    new ApiResponse(200, { users, count: users.length }, "All users fetched successfully")
  );
});

export const getAllProviders = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const matchStage = status ? { applicationStatus: status } : {};

  const providers = await Provider.aggregate([
    { $match: matchStage },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: "$user" },
    {
      $project: {
        _id: 1,
        businessName: 1,
        professionalDescription: 1,
        yearsExperience: 1,
        contactPhone: 1,
        applicationStatus: 1,
        submittedAt: 1,
        meta: 1,
        user: {
          fullName: "$user.fullName",
          email: "$user.email"
        }
      }
    },
    { $sort: { submittedAt: -1 } }
  ]);

  return res.status(200).json(
    new ApiResponse(200, providers, "All providers fetched successfully")
  );
});

export const suspendUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
    );
    if (!user) throw new ApiError(404, "user not found");

    const userSafe = getSafeUser(user);

    res.status(200).json(
        new ApiResponse(200, userSafe, "user suspended successfully")
    );
});

export const getAllOrders = asyncHandler(async (req, res) => {
    const { status } = req.query;
    const query = status ? { status } : {};
    const orders = await Order.find(query)
        .populate("customer", "fullName email")
        .populate("provider", "fullName email")
        .populate("skill", "name")
        .sort({ createdAt: -1 });

    res.status(200).json(
        new ApiResponse(200, { orders, success: true, count: orders.length }, 'all orders fetched')
    )
});

export const deleteOrders = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) {
        throw new ApiError(404, "order not found")
    };

    res.status(200).json(
        new ApiResponse(200, null, "order delete successfully")
    )
})

export const updateProviderStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected", "draft"].includes(status)) {
        throw new ApiError(400, "Invalid Status")
    };

    const provider = await Provider.findByIdAndUpdate(
        id,
        { applicationStatus: status },
        { new: true }
    ).populate("user", "fullName email");

    if (!provider) throw new ApiError(404, "Provider Not Found")

    await logActivity({
        action: `Provider ${status}`,
        performedBy: req.user._id,
        target: provider._id,
        targetModel: "Provider",
        description: `Admin ${req.user.fullName} ${status} provider ${provider.user.fullName}`,
    })

    return res.status(200).json(
        new ApiResponse(200, provider, `Provider ${status} successfully`)
    )
})

export const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user"
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
    { $unwind: "$user" },
    { $unwind: "$provider" },
    {
      $project: {
        _id: 1,
        rating: 1,
        comment: 1,
        status: 1,
        isHidden: 1,
        isFlagged: 1,
        createdAt: 1,
        user: { fullName: "$user.fullName", email: "$user.email" },
        provider: { fullName: "$provider.fullName", email: "$provider.email" }
      }
    },
    { $sort: { createdAt: -1 } }
  ]);

  return res.status(200).json(
    new ApiResponse(200, { reviews, count: reviews.length }, "All reviews fetched successfully")
  );
});

export const updateReviewStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
        throw new ApiError(400, "invalid status")
    }

    const review = await Review.findByIdAndUpdate(id, { status }, { new: true });

    if (!review) throw new ApiError(404, "review not find");

    res.status(200).json(
        new ApiResponse(200, review, `review ${status} successfully`)
    )
})

export const toggleReviewVisibility = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const review = await Review.findById(id);

    if (!review) throw new ApiError(404, "review not found!")

    review.isHidden = !review.isHidden;

    res.status(200).json(
        new ApiResponse(200, review, `review ${review.isHidden ? "hidden" : "visible"} successfully`)
    )
})

export const flagReview = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const review = await Review.findByIdAndUpdate(id, { isFlagged: true }, { new: true })

    if (!review) throw new ApiError(404, "review not found!");

    res.status(200).json(
        new ApiResponse(200, review, "review flagged successfully")
    )
})

export const getAllActivities = asyncHandler(async (req, res) => {
  const activities = await ActivityLog.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "performedBy",
        foreignField: "_id",
        as: "performedBy"
      }
    },
    { $unwind: "$performedBy" },
    {
      $project: {
        _id: 1,
        action: 1,
        description: 1,
        createdAt: 1,
        performedBy: {
          fullName: {
            $concat: ["$performedBy.firstName", " ", "$performedBy.lastName"]
          },
          email: "$performedBy.email"
        },
        target: 1
      }
    },
    { $sort: { createdAt: -1 } },
    { $limit: 50 }
  ]);

  return res.status(200).json(
    new ApiResponse(200, { activities }, "Recent activities fetched successfully")
  );
});