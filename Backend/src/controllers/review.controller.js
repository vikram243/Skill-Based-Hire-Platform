import Review from '../models/review.model.js';
import Provider from '../models/provider.model.js';
import Order from '../models/order.model.js';
import { ApiError, ApiResponse } from '../utils/api.handeller.js';
import { asyncHandler } from '../utils/async.handeller.js';

export const createReview = asyncHandler(async (req, res) => {
    const { provider, orderId, rating, comment } = req.body;
    const userId = req.user._id;
    const completedOrder = await Order.findOne({
        _id: orderId,
    })
    if (!completedOrder) throw new ApiError(400, "you can review only after completing an order")

    const exitingReview = await Review.findOne({ user: userId, order: orderId })
    if (exitingReview) throw new ApiError(400, "you already rate this order")

    const review = await Review.create({
        user: userId,
        provider,
        order: orderId,
        comment,
        rating
    })

    const stats = await Review.aggregate([
        { $match: { provider: review.provider, status: "approved" } },
        {
            $group: {
                _id: "$provider",
                avgRating: { $avg: '$rating' },
                totalReview: { $sum: 1 }
            }
        }
    ])
    const { avgRating = 0, totalReview = 0 } = stats[0] || {};

    await Provider.findByIdAndUpdate(provider, {
        "meta.avgRating": avgRating,
        "meta.totalReviews": totalReview,
    });

    res
        .status(201)
        .json(new ApiResponse(201, review, "Review submitted and pending approval"));
});

export const getProviderReviews = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const reviews = await Review.find({ provider: id, status: "approved", isHidden: false })
    .populate("user", "fullName email")
    .sort({ createdAt: -1 });

  res.status(200).json(
    new ApiResponse(200, reviews, "Provider reviews fetched successfully")
  );
});
