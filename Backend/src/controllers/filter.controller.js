import Provider from "../models/provider.model.js";
import User from "../models/user.model.js";
import { asyncHandler } from "../utils/async.handeller.js";
import { ApiResponse, ApiError } from "../utils/api.handeller.js";

export const filterProviders = asyncHandler(async (req, res) => {

  const {
    q,
    skill,
    priceRange,
    minRate,
    maxRate,
    minExp,
    maxExp,
    rating,
    sortBy = "nearest",
    page = 1,
    limit = 10
  } = req.query;

  const pageNum = Math.max(Number(page) || 1, 1);
  const limitNum = Math.max(Number(limit) || 10, 1);
  const skip = (pageNum - 1) * limitNum;

  const RADIUS_KM = 35;
  const RADIUS_METERS = RADIUS_KM * 1000;

  // ✅ Get logged-in user location
  const user = await User.findById(req?.user?.id).lean();

  if (!user?.location?.lat || !user?.location?.lon) {
    throw new ApiError(400, "User location not found");
  }

  const nearPoint = {
    type: "Point",
    coordinates: [user.location.lon, user.location.lat],
  };

  // ✅ STRICT BASE FILTER (All 4 conditions)
  const matchFilter = {
    applicationStatus: "approved",
    isOnline: true,
    isAvailable: true
  };

  // 🔎 Search filter
  if (q || skill) {
    const searchTerm = q || skill;
    matchFilter.$or = [
      { businessName: { $regex: searchTerm, $options: "i" } },
      { "selectedSkills.name": { $regex: searchTerm, $options: "i" } }
    ];
  }

  // 💰 Price filter
  if (priceRange && priceRange !== "all") {
    if (priceRange === "low")
      matchFilter["pricing.serviceRate"] = { $lt: 50 };
    else if (priceRange === "medium")
      matchFilter["pricing.serviceRate"] = { $gte: 50, $lt: 100 };
    else if (priceRange === "high")
      matchFilter["pricing.serviceRate"] = { $gte: 100 };
  } else if (minRate || maxRate) {
    matchFilter["pricing.serviceRate"] = {};
    if (minRate) matchFilter["pricing.serviceRate"].$gte = Number(minRate);
    if (maxRate) matchFilter["pricing.serviceRate"].$lte = Number(maxRate);
  }

  // 👨‍💼 Experience filter
  if (minExp || maxExp) {
    matchFilter.yearsExperience = {};
    if (minExp) matchFilter.yearsExperience.$gte = Number(minExp);
    if (maxExp) matchFilter.yearsExperience.$lte = Number(maxExp);
  }

  // ⭐ Rating filter
  if (rating) {
    matchFilter["meta.avgRating"] = { $gte: Number(rating) };
  }

  // ✅ GEO + FILTER PIPELINE
  const pipeline = [
    {
      $geoNear: {
        near: nearPoint,
        distanceField: "distance",
        maxDistance: RADIUS_METERS,
        spherical: true,
        query: matchFilter
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: "$user" },

    // ✅ Final mandatory check
    {
      $match: {
        "user.isProvider": true
      }
    }
  ];

  // 🔄 Sorting
  let sortStage = { distance: 1 };

  if (sortBy === "rating")
    sortStage = { "meta.avgRating": -1 };

  if (sortBy === "price-low")
    sortStage = { "pricing.0.serviceRate": 1 };

  if (sortBy === "price-high")
    sortStage = { "pricing.0.serviceRate": -1 };

  pipeline.push({ $sort: sortStage });

  // Pagination
  pipeline.push({
    $facet: {
      results: [{ $skip: skip }, { $limit: limitNum }],
      totalCount: [{ $count: "count" }]
    }
  });

  const agg = await Provider.aggregate(pipeline);

  const results = agg[0]?.results || [];
  const total = agg[0]?.totalCount?.[0]?.count || 0;

  // ✅ Final formatted response
  const providers = results.map((p) => {

    const distanceKm = Number((p.distance / 1000).toFixed(2));
    const estimatedTimeMin = Math.ceil((distanceKm / 40) * 60);

    return {
      _id: p._id,
      name: p.businessName || "Unknown",
      avatar: p.user?.avatar || null,
      skills: (p.selectedSkills || []).map(s => s.name),
      hourlyRate: p.pricing?.[0]?.serviceRate || 0,
      rating: p.meta?.avgRating || 0,
      reviewCount: p.meta?.totalReviews || 0,
      completedJobs: p.meta?.completedJobs || 0,
      bio: p.professionalDescription || "",
      isVerified: p.verification?.isVerified || false,
      location: p.user?.location?.address || "Address is now available",

      distanceKm,
      estimatedTimeMin,
      distanceText: `${distanceKm} km`,
      estimatedTimeText: `${estimatedTimeMin} mins`
    };
  });

  return res.status(200).json(
    new ApiResponse(200, {
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      radiusKm: RADIUS_KM,
      providers
    }, "Providers fetched successfully")
  );
});
