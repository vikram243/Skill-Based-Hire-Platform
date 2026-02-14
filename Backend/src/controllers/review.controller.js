import Review from "../models/review.model.js";
import Provider from "../models/provider.model.js";
import Order from "../models/order.model.js";
import { ApiError, ApiResponse } from "../utils/api.handeller.js";
import { asyncHandler } from "../utils/async.handeller.js";

export const createReview = asyncHandler(async (req, res) => {
  const { provider, order, rating, comment } = req.body;
  const userId = req.user._id;
  const exitingReview = await Review.findOne({ user: userId, order });
  if (exitingReview) throw new ApiError(400, "you already rate this order");

  const completedOrder = await Order.findOne({
    _id: order,
    status: "completed",
  });

  if (!completedOrder)
    throw new ApiError(400, "you can review only after completing an order");

  const review = await Review.create({
    user: userId,
    provider,
    order,
    comment,
    rating,
  });

  const stats = await Review.aggregate([
    { $match: { provider: review.provider } },
    {
      $group: {
        _id: "$provider",
        avgRating: { $avg: "$rating" },
        totalReview: { $sum: 1 },
      },
    },
  ]);
  const { avgRating, totalReview } = stats[0] || {};

  await Provider.findByIdAndUpdate(provider, {
    meta: {
      avgRating: avgRating,
      totalReviews: totalReview,
    },
  });

  res
    .status(201)
    .json(
      new ApiResponse(201, review, "Review submitted and pending approval"),
    );
});

export const getProviderReviews = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const reviews = await Review.find({
    provider: id,
    status: "approved",
  })
    .populate("user", "fullName email")
    .sort({ createdAt: -1 });

  res
    .status(200)
    .json(
      new ApiResponse(200, reviews, "Provider reviews fetched successfully"),
    );
});

export const getReviewByOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const reviews = await Review.findOne({
    order: orderId,
  });

  if (!reviews) {
    return res
      .status(200)
      .json(new ApiResponse(200, null, "No review found"));
  }

  const rating = {
    rating: reviews?.rating,
    comment: reviews?.comment,
  };

  res
    .status(200)
    .json(new ApiResponse(200, rating, "Order's reviews fetched successfully"));
});