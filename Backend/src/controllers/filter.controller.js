import Provider from "../models/provider.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/async.handeller.js";
import { ApiResponse } from "../utils/api.handeller.js";

export const filterProviders = asyncHandler(async (req, res) => {
  const {
    q,
    skill,
    category,
    priceRange,
    minRate,
    maxRate,
    minExp,
    maxExp,
    rating,
    sortBy = "relevance",
    page = 1,
    limit = 12,
    lat,
    lng
  } = req.query;

  const pageNum = Math.max(Number(page) || 1, 1);
  const limitNum = Math.max(Number(limit) || 12, 1);
  const skip = (pageNum - 1) * limitNum;

  const RADIUS_KM = 50;
  const RADIUS_METERS = RADIUS_KM * 1000;

  // Determine user coordinates if available
  let coordinates = null;
  if (lat && lng && !isNaN(Number(lat)) && !isNaN(Number(lng))) {
    coordinates = [Number(lng), Number(lat)];
  } else if (req.user?.id) {
    const user = await User.findById(req.user.id).select("location").lean();
    if (user?.location?.lat && user?.location?.lng) {
      coordinates = [user.location.lng, user.location.lat];
    }
  }

  // Base matching conditions
  const matchFilter = {
    isOnline: true,
    isAvailable: true,
  };

  // If user is logged in, exclude themselves from provider search
  if (req.user?.id && mongoose.Types.ObjectId.isValid(String(req.user.id))) {
    matchFilter.user = { $ne: new mongoose.Types.ObjectId(String(req.user.id)) };
  }

  // Skill filter
  const targetSkill = skill || category;
  if (targetSkill && mongoose.Types.ObjectId.isValid(String(targetSkill))) {
    matchFilter.selectedSkill = new mongoose.Types.ObjectId(String(targetSkill));
  }

  // Price filter
  if (priceRange && priceRange !== "all") {
    if (priceRange === "low") matchFilter["pricing.serviceRate"] = { $lt: 50 };
    else if (priceRange === "medium") matchFilter["pricing.serviceRate"] = { $gte: 50, $lt: 100 };
    else if (priceRange === "high") matchFilter["pricing.serviceRate"] = { $gte: 100 };
  } else if (minRate || maxRate) {
    matchFilter["pricing.serviceRate"] = {};
    if (minRate) matchFilter["pricing.serviceRate"].$gte = Number(minRate);
    if (maxRate) matchFilter["pricing.serviceRate"].$lte = Number(maxRate);
  }

  // Experience filter
  if (minExp || maxExp) {
    matchFilter.yearsExperience = {};
    if (minExp) matchFilter.yearsExperience.$gte = Number(minExp);
    if (maxExp) matchFilter.yearsExperience.$lte = Number(maxExp);
  }

  // Rating filter
  if (rating) {
    matchFilter["meta.avgRating"] = { $gte: Number(rating) };
  }

  const searchTerm = (q || "").toString().trim();
  const pipeline = [];

  // If coordinates are available, use $geoNear as the very first stage
  const hasGeo = Boolean(coordinates && coordinates.length === 2);
  if (hasGeo) {
    pipeline.push({
      $geoNear: {
        near: {
          type: "Point",
          coordinates: coordinates
        },
        distanceField: "distance",
        maxDistance: RADIUS_METERS,
        spherical: true,
        key: "location.geo",
        query: matchFilter
      }
    });
  } else {
    pipeline.push({
      $match: matchFilter
    });
  }

  // Lookup skill
  pipeline.push({
    $lookup: {
      from: "skills",
      localField: "selectedSkill",
      foreignField: "_id",
      as: "skill"
    }
  });
  pipeline.push({ $unwind: { path: "$skill", preserveNullAndEmptyArrays: true } });

  // Lookup user
  pipeline.push({
    $lookup: {
      from: "users",
      localField: "user",
      foreignField: "_id",
      as: "user"
    }
  });
  pipeline.push({ $unwind: "$user" });

  // Text search on businessName, description, or skill name
  if (searchTerm) {
    pipeline.push({
      $match: {
        $or: [
          { businessName: { $regex: searchTerm, $options: "i" } },
          { professionalDescription: { $regex: searchTerm, $options: "i" } },
          { "skill.name": { $regex: searchTerm, $options: "i" } }
        ]
      }
    });
  }

  // Sorting
  let sortStage = {};
  if (sortBy === "rating") {
    sortStage = { "meta.avgRating": -1, "meta.totalReviews": -1 };
  } else if (sortBy === "price-low") {
    sortStage = { "pricing.serviceRate": 1 };
  } else if (sortBy === "price-high") {
    sortStage = { "pricing.serviceRate": -1 };
  } else if (sortBy === "distance-far" && hasGeo) {
    sortStage = { distance: -1 };
  } else if ((sortBy === "nearest" || sortBy === "relevance") && hasGeo) {
    sortStage = { distance: 1 };
  } else {
    sortStage = { "verification.isVerified": -1, "meta.avgRating": -1, createdAt: -1 };
  }

  pipeline.push({ $sort: sortStage });

  // Facet pagination
  pipeline.push({
    $facet: {
      results: [{ $skip: skip }, { $limit: limitNum }],
      totalCount: [{ $count: "count" }]
    }
  });

  const agg = await Provider.aggregate(pipeline);
  const results = agg[0]?.results || [];
  const total = agg[0]?.totalCount?.[0]?.count || 0;

  const providers = results.map((p) => {
    const hasDist = typeof p.distance === 'number';
    const distanceKm = hasDist ? Number((p.distance / 1000).toFixed(1)) : null;
    const estimatedTimeMin = distanceKm ? Math.ceil((distanceKm / 25) * 60) : null;

    return {
      _id: p._id,
      name: p.businessName || `${p.user?.firstName || ''} ${p.user?.lastName || ''}`.trim() || "Professional Provider",
      avatar: p.user?.avatar || null,
      skills: {
        skillId: p.skill?._id || null,
        name: p.skill?.name || "Professional Service",
        category: p.skill?.category || "General",
        icon: p.skill?.icon || "⚡"
      },
      price: p.pricing?.serviceRate || 0,
      rateType: p.pricing?.rateType || "hourly",
      rating: p.meta?.avgRating || 5.0,
      reviewCount: p.meta?.totalReviews || 0,
      completedJobs: p.meta?.completedJobs || 0,
      bio: p.professionalDescription || "Verified local professional available for hire.",
      isVerified: p.verification?.isVerified || false,
      location: p.user?.location?.address || p.user?.location?.city || "Local Service Area",
      yearsExperience: p.yearsExperience || 1,
      portfolio: p.portfolio || [],
      availability: p.availability || "Mon–Fri, 9am–6pm",
      distanceKm,
      estimatedTimeMin,
      distanceText: distanceKm !== null ? `${distanceKm} km away` : "Available locally",
      estimatedTimeText: estimatedTimeMin !== null ? `~${estimatedTimeMin} mins` : null
    };
  });

  return res.status(200).json(
    new ApiResponse(200, {
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      radiusKm: RADIUS_KM,
      hasGeo,
      providers
    }, "Providers fetched successfully")
  );
});
