import Provider from "../models/provider.model.js";
import { asyncHandler } from "../utils/async.handeller.js";
import { ApiResponse } from "../utils/api.handeller.js";

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
    sortBy = "relevance",
    locationFilter,
    lat,
    lng,
    radius,
    page = 1,
    limit = 10,
  } = req.query;

  const pageNum = Math.max(Number(page) || 1, 1);
  const limitNum = Math.max(Number(limit) || 10, 1);
  const skip = (pageNum - 1) * limitNum;

  const filter = {
    applicationStatus: "approved",
  };

  // Exclude own provider card
  if (req.user?.isProvider && req.user?.providerProfile) {
    filter._id = { $ne: req.user.providerProfile };
  }

  // Search
  if (q || skill) {
    const searchTerm = q || skill;
    filter.$or = [
      { "selectedSkills.name": { $regex: searchTerm, $options: "i" } },
      { businessName: { $regex: searchTerm, $options: "i" } },
    ];
  }

  // Price filter
  if (priceRange && priceRange !== "all") {
    if (priceRange === "low") {
      filter["pricing.serviceRate"] = { $lt: 50 };
    } else if (priceRange === "medium") {
      filter["pricing.serviceRate"] = { $gte: 50, $lt: 100 };
    } else if (priceRange === "high") {
      filter["pricing.serviceRate"] = { $gte: 100 };
    }
  } else if (minRate || maxRate) {
    filter["pricing.serviceRate"] = {};
    if (minRate) filter["pricing.serviceRate"].$gte = Number(minRate);
    if (maxRate) filter["pricing.serviceRate"].$lte = Number(maxRate);
  }

  // Experience filter
  if (minExp || maxExp) {
    filter.yearsExperience = {};
    if (minExp) filter.yearsExperience.$gte = Number(minExp);
    if (maxExp) filter.yearsExperience.$lte = Number(maxExp);
  }

  // Rating filter
  if (rating) {
    filter["meta.avgRating"] = { $gte: Number(rating) };
  }

  /* ======================================================
      GEO SEARCH CASE
  ====================================================== */

  if (lat && lng) {
    const nearPoint = {
      type: "Point",
      coordinates: [parseFloat(lng), parseFloat(lat)],
    };

    const maxDistance = radius ? Number(radius) * 1000 : undefined;

    const pipeline = [
      {
        $geoNear: {
          near: nearPoint,
          distanceField: "distance",
          spherical: true,
          ...(maxDistance && { maxDistance }),
        },
      },
      { $match: filter },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },

      // Only required fields
      {
        $project: {
          _id: 1,
          businessName: 1,
          selectedSkills: 1,
          pricing: 1,
          meta: 1,
          professionalDescription: 1,
          verification: 1,
          isOnline: 1,
          distance: 1,
          "user.avatar": 1,
          "user.location.address": 1,
        },
      },
    ];

    // Sorting
    let sortStage = { "meta.avgRating": -1 };

    if (locationFilter === "close-to-far") sortStage = { distance: 1 };
    if (locationFilter === "far-to-close") sortStage = { distance: -1 };
    if (sortBy === "price-low") sortStage = { "pricing.0.serviceRate": 1 };
    if (sortBy === "price-high") sortStage = { "pricing.0.serviceRate": -1 };
    if (sortBy === "rating") sortStage = { "meta.avgRating": -1 };

    pipeline.push({ $sort: sortStage });

    pipeline.push({
      $facet: {
        results: [{ $skip: skip }, { $limit: limitNum }],
        totalCount: [{ $count: "count" }],
      },
    });

    const agg = await Provider.aggregate(pipeline);

    const results = agg[0]?.results || [];
    const total = agg[0]?.totalCount?.[0]?.count || 0;

    const providers = results.map((p) => ({
      _id: p._id,
      name: p.businessName || "Unknown",
      avatar: p.user?.avatar || null,
      skills: (p.selectedSkills || []).map((s) => s.name),
      hourlyRate: p.pricing?.[0]?.serviceRate || 0,
      rating: p.meta?.avgRating || 0,
      reviewCount: p.meta?.totalReviews || 0,
      completedJobs: p.meta?.completedJobs || 0,
      bio: p.professionalDescription || "",
      isVerified: p.verification?.isVerified || false,
      availability: p.isOnline ? "available" : "offline",
      distance:
        p.distance != null
          ? p.distance >= 1000
            ? `${(p.distance / 1000).toFixed(1)} km`
            : `${Math.round(p.distance)} m`
          : undefined,
      location: p.user?.location?.address || null,
    }));

    return res.status(200).json(
      new ApiResponse(200, {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        providers,
      }, "filter success")
    );
  }

  /* ======================================================
      NON-GEO CASE
  ====================================================== */

  let query = Provider.find(filter)
    .select(
      "businessName selectedSkills pricing meta professionalDescription verification isOnline"
    )
    .populate({
      path: "user",
      select: "avatar location.address",
    })
    .lean();

  // Sorting
  if (sortBy === "price-low")
    query = query.sort({ "pricing.0.serviceRate": 1 });
  else if (sortBy === "price-high")
    query = query.sort({ "pricing.0.serviceRate": -1 });
  else query = query.sort({ "meta.avgRating": -1 });

  const total = await Provider.countDocuments(filter);
  const rawProviders = await query.skip(skip).limit(limitNum);

  const providers = rawProviders.map((p) => ({
    _id: p._id,
    name: p.businessName || "Unknown",
    avatar: p.user?.avatar || null,
    skills: (p.selectedSkills || []).map((s) => s.name),
    hourlyRate: p.pricing?.[0]?.serviceRate || 0,
    rating: p.meta?.avgRating || 0,
    reviewCount: p.meta?.totalReviews || 0,
    completedJobs: p.meta?.completedJobs || 0,
    bio: p.professionalDescription || "",
    isVerified: p.verification?.isVerified || false,
    availability: p.isOnline ? "available" : "offline",
    location: p.user?.location?.address || null,
  }));

  return res.status(200).json(
    new ApiResponse(200, {
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      providers,
    }, "filter success")
  );
});