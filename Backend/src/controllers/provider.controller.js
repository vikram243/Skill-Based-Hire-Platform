import Provider from "../models/provider.model.js";
import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import Review from "../models/review.model.js";
import mongoose from "mongoose";
import fs from "fs";
import { asyncHandler } from "../utils/async.handeller.js";
import { ApiError, ApiResponse } from "../utils/api.handeller.js";
import { uploadOnCloudinary } from "../config/cloudinary.config.js";
import { logActivity } from "../utils/activity.handeller.js";

export const becomeProvider = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  const existingProvider = await Provider.findOne({ user: userId });
  if (existingProvider) {
    if (req.files?.length) {
      await Promise.all(
        req.files.map((f) => fs.promises.unlink(f.path).catch(() => {})),
      );
    }
    throw new ApiError(400, "Provider profile already exists");
  }

  /* ---------- SAFE JSON PARSER ---------- */
  const parseIfString = (val) => {
    try {
      if (!val) return undefined;
      if (typeof val === "string") return JSON.parse(val);
      if (Array.isArray(val))
        return typeof val[0] === "string" ? JSON.parse(val[0]) : val[0];
      return val;
    } catch {
      return undefined;
    }
  };

  /* ---------- NORMALIZE SKILL ---------- */
  const normalizeSkillEntry = (skill) => {
    if (!skill) return null;

    const validId =
      skill.skillId && mongoose.Types.ObjectId.isValid(skill.skillId);

    return {
      skillId: validId ? skill.skillId : null,
      name: skill.name?.trim(),
    };
  };

  /* ---------- FILE UPLOAD ---------- */
  let uploadedDocs = [];

  if (req.files?.length) {
    uploadedDocs = await Promise.all(
      req.files.map(async (file) => {
        const result = await uploadOnCloudinary(file.path);

        await fs.promises.unlink(file.path).catch(() => {});

        if (!result) return null;

        return {
          url: result.secure_url,
          filename: result.original_filename,
          mimetype: file.mimetype,
        };
      }),
    );

    uploadedDocs = uploadedDocs.filter(Boolean);
  }

  /* ---------- BODY ---------- */
  const {
    businessName,
    professionalDescription,
    yearsExperience,
    contactPhone,
    selectedSkill,
    pricing,
    agreedToTOS,
    consentBackgroundCheck,
  } = req.body;

  /* ---------- PARSE ---------- */
  const skillParsed = parseIfString(selectedSkill);
  const pricingParsed = parseIfString(pricing);

  const skillObj = normalizeSkillEntry(skillParsed);
  if (!skillObj) throw new ApiError(400, "Skill is required");

  const pricingObj = {
    rateType: pricingParsed?.rateType || "hourly",
    serviceRate: Number(pricingParsed?.serviceRate || 0),
  };

  if (!pricingObj.serviceRate) throw new ApiError(400, "Service rate required");

  if (!user?.location?.lng || !user?.location?.lat)
    throw new ApiError(400, "User location missing");

  /* ---------- PAYLOAD ---------- */
  const providerPayload = {
    user: userId,

    businessName: businessName?.trim(),
    professionalDescription: professionalDescription?.trim(),
    yearsExperience: Number(yearsExperience) || 0,
    contactPhone,

    selectedSkill: skillObj,
    pricing: pricingObj,

    documents: uploadedDocs,

    agreedToTOS: agreedToTOS === true || agreedToTOS === "true",

    consentBackgroundCheck:
      consentBackgroundCheck === true || consentBackgroundCheck === "true",

    applicationStatus: "pending",

    location: {
      geo: {
        type: "Point",
        coordinates: [user.location.lng, user.location.lat],
      },
    },
  };

  /* ---------- CREATE ---------- */
  const provider = await Provider.create(providerPayload);

  await User.findByIdAndUpdate(
    userId,
    {
      providerProfile: provider._id,
      isAttampted: true,
    },
    { new: true },
  );

  await logActivity({
    action: "Provider Application Received",
    target: provider._id,
    targetModel: "Provider",
    description: `${user.fullName} submitted a provider application`,
  });

  /* ---------- RESPONSE ---------- */
  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        provider,
        "Provider application submitted successfully",
      ),
    );
});

export const hireProviderId = asyncHandler(async (req, res) => {
  const { providerId } = req.params;
  if (!providerId) throw new ApiError(403, "Provider id is required");

  const provider = await Provider.findById(providerId).populate(
    "user",
    "avatar email location",
  );
  if (!provider) throw new ApiError(404, "Provider not found");

  const profile = {
    full_name: provider.fullName,
    email: provider.user.email,
    phone: provider.contactPhone,
    bio: provider.professionalDescription,
    hourly_rate: provider.pricing?.serviceRate || 0,
    years_experience: provider.yearsExperience,
    avatar: provider.user.avatar || null,
    location: provider.user.location || null,
    skill: {
      id: provider.selectedSkill.skillId,
      name: provider.selectedSkill.name
    },
    price: {
      rate: provider.pricing.serviceRate,
      type: provider.pricing.rateType
    }
  };

  const galleryImages = provider.documents.map((doc) => doc.url);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { profile, skills, galleryImages },
        "Provider profile fetched",
      ),
    );
});

export const getProviderProfile = asyncHandler(async (req, res) => {
  const providerId = req.user?.providerProfile;
  if (!providerId) throw new ApiError(403, "Provider profile not linked");

  const provider = await Provider.findById(providerId).populate(
    "user",
    "fullName email number",
  );
  if (!provider) throw new ApiError(404, "Provider not found");

  const profile = {
    full_name: provider.user.fullName,
    email: provider.user.email,
    phone: provider.contactPhone,
    bio: provider.professionalDescription,
    hourly_rate: provider.pricing?.serviceRate || 0,
    years_experience: provider.yearsExperience,
    avatar_url: provider.user.avatar || null,
  };

  const skills = [
    {
      id:
        provider.selectedSkill.skillId?.toString() ||
        provider.selectedSkill.name,
      name: provider.selectedSkill.name,
      price: provider.pricing?.serviceRate || 0,
    },
  ];

  const galleryImages = provider.documents.map((doc) => doc.url);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { profile, skills, galleryImages },
        "Provider profile fetched",
      ),
    );
});

export const updateProviderProfile = asyncHandler(async (req, res) => {
  const providerId = req.user?.providerProfile;
  if (!providerId) throw new ApiError(403, "Provider profile not linked");

  const { full_name, phone, location, bio, hourly_rate, years_experience } =
    req.body;

  const provider = await Provider.findById(providerId);
  if (!provider) throw new ApiError(404, "Provider not found");

  const user = await User.findById(provider.user);
  if (!user) throw new ApiError(404, "User not found");

  user.fullName = full_name || user.fullName;
  user.number = phone || user.number;
  await user.save();

  provider.contactPhone = phone || provider.contactPhone;
  provider.professionalDescription = bio || provider.professionalDescription;
  provider.yearsExperience = years_experience || provider.yearsExperience;

  if (hourly_rate) {
    provider.pricing.serviceRate = hourly_rate;
  }

  await provider.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Provider profile updated successfully"));
});

export const getProviderDashboard = asyncHandler(async (req, res) => {
  const providerId = req.user?.providerProfile;

  if (!providerId) {
    throw new ApiError(403, "Provider profile not linked to user");
  }

  // Fetch stats
  const statsAgg = await Order.aggregate([
    { $match: { provider: providerId } },
    {
      $facet: {
        totalEarnings: [
          { $match: { status: { $in: ["completed"] } } },
          { $group: { _id: null, total: { $sum: "$pricing.total" } } },
        ],
        thisMonthEarnings: [
          {
            $match: {
              status: { $in: ["completed"] },
              createdAt: {
                $gte: new Date(
                  new Date().getFullYear(),
                  new Date().getMonth(),
                  1,
                ),
              },
            },
          },
          { $group: { _id: null, total: { $sum: "$pricing.total" } } },
        ],
        activeOrders: [
          { $match: { status: { $in: ["pending", "in_progress"] } } },
          { $count: "count" },
        ],
        completedOrders: [
          { $match: { status: "completed" } },
          { $count: "count" },
        ],
        pendingOrders: [{ $match: { status: "pending" } }, { $count: "count" }],
      },
    },
  ]);

  const stats = {
    totalEarnings: statsAgg[0]?.totalEarnings[0]?.total || 0,
    thisMonthEarnings: statsAgg[0]?.thisMonthEarnings[0]?.total || 0,
    activeOrders: statsAgg[0]?.activeOrders[0]?.count || 0,
    completedOrders: statsAgg[0]?.completedOrders[0]?.count || 0,
    pendingOrders: statsAgg[0]?.pendingOrders[0]?.count || 0,
    averageRating: 0, // You can plug in review aggregation later
  };

  // Fetch upcoming orders
  const upcomingOrders = await Order.aggregate([
    {
      $match: {
        provider: providerId,
        status: "pending",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "customer",
        foreignField: "_id",
        as: "customer",
      },
    },
    {
      $lookup: {
        from: "skills",
        localField: "skill",
        foreignField: "_id",
        as: "skill",
      },
    },
    { $unwind: "$customer" },
    { $unwind: "$skill" },
    {
      $project: {
        id: "$_id",
        customer_name: "$customer.fullName",
        skill_name: "$skill.name",
        status: 1,
        urgency: 1,
        price: "$pricing.total",
        created_at: "$createdAt",
        notes: "$description",
      },
    },
    { $sort: { urgency: 1, created_at: -1 } },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { stats, upcomingOrders },
        "Provider dashboard data fetched",
      ),
    );
});

export const getProviderOrders = asyncHandler(async (req, res) => {
  const providerId = req.user?.providerProfile;
  const status = req.query.status;

  if (!providerId) throw new ApiError(403, "Provider profile not linked");

  const matchStage = {
    provider: providerId,
    status: { $ne: "pending" },
  };

  if (status && status !== "all") {
    matchStage.status = status;
  }

  const orders = await Order.aggregate([
    { $match: matchStage },
    {
      $lookup: {
        from: "users",
        localField: "customer",
        foreignField: "_id",
        as: "customer",
      },
    },
    {
      $lookup: {
        from: "skills",
        localField: "skill",
        foreignField: "_id",
        as: "skill",
      },
    },
    { $unwind: "$customer" },
    { $unwind: "$skill" },
    {
      $project: {
        id: "$_id",
        customer_name: "$customer.fullName",
        customer_email: "$customer.email",
        customer_phone: "$contactPhone",
        skill_name: "$skill.name",
        status: 1,
        urgency: 1,
        price: "$pricing.total",
        created_at: "$createdAt",
        scheduled_date: "$schedule.preferredDate",
        notes: "$description",
      },
    },
    { $sort: { created_at: -1 } },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { orders, count: orders.length },
        "Provider orders fetched",
      ),
    );
});

export const updateProviderOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status, notes } = req.body;

  const validStatuses = ["pending", "in_progress", "completed", "cancelled"];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, "Order not found");

  order.status = status;
  if (notes) order.description = notes;

  await order.save();

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order status updated successfully"));
});

export const getProviderHistory = asyncHandler(async (req, res) => {
  const providerId = req.user?.providerProfile;
  const { status = "all", date = "all" } = req.query;

  if (!providerId) throw new ApiError(403, "Provider profile not linked");

  // Build match stage
  const matchStage = {
    provider: providerId,
    status: { $in: ["completed", "cancelled"] },
  };

  if (status !== "all") {
    matchStage.status = status;
  }

  if (date !== "all") {
    const now = new Date();
    let filterDate = new Date();

    switch (date) {
      case "week":
        filterDate.setDate(now.getDate() - 7);
        break;
      case "month":
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case "year":
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    matchStage.createdAt = { $gte: filterDate };
  }

  const orders = await Order.aggregate([
    { $match: matchStage },
    {
      $lookup: {
        from: "users",
        localField: "customer",
        foreignField: "_id",
        as: "customer",
      },
    },
    {
      $lookup: {
        from: "skills",
        localField: "skill",
        foreignField: "_id",
        as: "skill",
      },
    },
    {
      $lookup: {
        from: "reviews",
        let: { orderId: "$_id", providerId: "$provider" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$provider", "$$providerId"] },
                  { $eq: ["$order", "$$orderId"] },
                ],
              },
            },
          },
        ],
        as: "review",
      },
    },
    { $unwind: "$customer" },
    { $unwind: "$skill" },
    {
      $project: {
        id: "$_id",
        customer_name: "$customer.fullName",
        skill_name: "$skill.name",
        status: 1,
        price: "$pricing.total",
        created_at: "$createdAt",
        completed_at: "$updatedAt",
        rating: { $arrayElemAt: ["$review.rating", 0] },
        review: { $arrayElemAt: ["$review.comment", 0] },
      },
    },
    { $sort: { created_at: -1 } },
  ]);

  // Stats
  const completedOrders = orders.filter((o) => o.status === "completed");
  const cancelledOrders = orders.filter((o) => o.status === "cancelled");
  const totalEarnings = completedOrders.reduce((sum, o) => sum + o.price, 0);
  const ratings = completedOrders
    .map((o) => o.rating)
    .filter((r) => r !== undefined);
  const averageRating =
    ratings.length > 0
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : 0;

  const stats = {
    totalCompleted: completedOrders.length,
    totalCancelled: cancelledOrders.length,
    totalEarnings,
    averageRating: parseFloat(averageRating.toFixed(1)),
  };

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { stats, orders },
        "Provider history fetched successfully",
      ),
    );
});

export const getProviderAnalytics = asyncHandler(async (req, res) => {
  const providerId = req.user?.providerProfile;
  if (!providerId) throw new ApiError(403, "Provider profile not linked");

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const orders = await Order.aggregate([
    { $match: { provider: providerId, status: { $in: ["completed"] } } },
    {
      $project: {
        price: "$pricing.total",
        skill: 1,
        createdAt: 1,
        month: { $month: "$createdAt" },
        year: { $year: "$createdAt" },
      },
    },
  ]);

  const totalEarnings = orders.reduce((sum, o) => sum + o.price, 0);
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalEarnings / totalOrders : 0;

  const thisMonthEarnings = orders
    .filter((o) => o.month === currentMonth + 1 && o.year === currentYear)
    .reduce((sum, o) => sum + o.price, 0);

  const lastMonthEarnings = orders
    .filter((o) => o.month === currentMonth && o.year === currentYear)
    .reduce((sum, o) => sum + o.price, 0);

  const monthlyDataMap = new Map();
  orders.forEach((o) => {
    const key = `${o.year}-${o.month}`;
    if (!monthlyDataMap.has(key)) {
      monthlyDataMap.set(key, { earnings: 0, orders: 0 });
    }
    const entry = monthlyDataMap.get(key);
    entry.earnings += o.price;
    entry.orders += 1;
  });

  const monthlyData = Array.from(monthlyDataMap.entries())
    .map(([key, value]) => {
      const [year, month] = key.split("-");
      const monthName = new Date(year, month - 1).toLocaleString("default", {
        month: "long",
      });
      return {
        month: `${monthName} ${year}`,
        earnings: value.earnings,
        orders: value.orders,
      };
    })
    .sort((a, b) => new Date(a.month) - new Date(b.month));

  const topServicesAgg = await Order.aggregate([
    { $match: { provider: providerId, status: "completed" } },
    {
      $group: {
        _id: "$skill",
        count: { $sum: 1 },
        revenue: { $sum: "$pricing.total" },
      },
    },
    {
      $lookup: {
        from: "skills",
        localField: "_id",
        foreignField: "_id",
        as: "skill",
      },
    },
    { $unwind: "$skill" },
    {
      $project: {
        name: "$skill.name",
        count: 1,
        revenue: 1,
      },
    },
    { $sort: { revenue: -1 } },
    { $limit: 10 },
  ]);

  const analytics = {
    totalEarnings,
    thisMonthEarnings,
    lastMonthEarnings,
    totalOrders,
    completedOrders: totalOrders,
    averageOrderValue: parseFloat(averageOrderValue.toFixed(2)),
    monthlyData,
    topServices: topServicesAgg,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, analytics, "Provider analytics fetched"));
});

export const getProviderReviews = asyncHandler(async (req, res) => {
  const providerId = req.user?.providerProfile;
  const ratingFilter = parseInt(req.query.rating) || null;

  if (!providerId) throw new ApiError(403, "Provider profile not linked");

  const matchStage = { provider: providerId };
  if (ratingFilter && ratingFilter >= 1 && ratingFilter <= 5) {
    matchStage.rating = ratingFilter;
  }

  const reviews = await Review.aggregate([
    { $match: matchStage },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "customer",
      },
    },
    {
      $lookup: {
        from: "skills",
        localField: "skill",
        foreignField: "_id",
        as: "skill",
      },
    },
    { $unwind: "$customer" },
    { $unwind: "$skill" },
    {
      $project: {
        id: "$_id",
        customer_name: "$customer.fullName",
        skill_name: "$skill.name",
        rating: 1,
        comment: 1,
        created_at: "$createdAt",
      },
    },
    { $sort: { created_at: -1 } },
  ]);

  // Stats calculation
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

  const ratingCounts = {
    fiveStars: reviews.filter((r) => r.rating === 5).length,
    fourStars: reviews.filter((r) => r.rating === 4).length,
    threeStars: reviews.filter((r) => r.rating === 3).length,
    twoStars: reviews.filter((r) => r.rating === 2).length,
    oneStars: reviews.filter((r) => r.rating === 1).length,
  };

  const stats = {
    averageRating: parseFloat(averageRating.toFixed(1)),
    totalReviews,
    ...ratingCounts,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { reviews, stats },
        "Provider reviews fetched successfully",
      ),
    );
});
