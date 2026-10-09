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
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return val;
        }
      }
      if (Array.isArray(val))
        return typeof val[0] === "string" ? JSON.parse(val[0]) : val[0];
      return val;
    } catch {
      return undefined;
    }
  };

  /* ---------- NORMALIZE SKILL ---------- */
  const normalizeSkillId = (skill) => {
    if (!skill) return null;

    if (typeof skill === "string") {
      return mongoose.Types.ObjectId.isValid(skill) ? skill : null;
    }

    const candidates = [skill.skillId, skill._id, skill.id];
    const found = candidates.find((v) => typeof v === "string" && mongoose.Types.ObjectId.isValid(v));
    return found || null;
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

  const selectedSkillId = normalizeSkillId(skillParsed);
  if (!selectedSkillId) throw new ApiError(400, "Skill is required");

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

    selectedSkill: selectedSkillId,
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

  const provider = await Provider.findById(providerId)
    .populate("user", "avatar email location")
    .populate("selectedSkill", "name");

  if (!provider) throw new ApiError(404, "Provider not found");

  if (!provider.isOnline || !provider.isAvailable) {
    throw new ApiError(
      409,
      "The provider you are trying to reach is not available right now"
    );
  }

  const profile = {
    full_name: provider.businessName,
    email: provider.user.email,
    phone: provider.contactPhone,
    bio: provider.professionalDescription,
    years_experience: provider.yearsExperience,
    avatar: provider.user.avatar || null,
    location: provider.user.location || null,
    skill: {
      id: provider.selectedSkill?._id || null,
      name: provider.selectedSkill?.name || "",
    },
    price: {
      rate: provider.pricing.serviceRate,
      type: provider.pricing.rateType,
    },
    rating: provider.meta.avgRating,
    reviewCount: provider.meta.totalReviews,
    isOnline: provider.isOnline,
    isAvailable: provider.isAvailable,
  };

  const galleryImages = provider.documents.map((doc) => doc.url);

  return res.status(200).json(
    new ApiResponse(
      200,
      { profile, galleryImages },
      "Provider profile fetched"
    )
  );
});

export const getProviderProfile = asyncHandler(async (req, res) => {
  const providerId = req.user?.providerProfile;
  if (!providerId) throw new ApiError(403, "Provider profile not linked");

  const provider = await Provider.findById(providerId)
    .populate("user", "fullName email number avatar bio location")
    .populate("selectedSkill", "name");
  if (!provider) throw new ApiError(404, "Provider not found");

  const completedCount = await Order.countDocuments({ provider: providerId, status: "completed" });
  const completedEarnings = await Order.aggregate([
    { $match: { provider: providerId, status: "completed" } },
    { $group: { _id: null, total: { $sum: "$pricing.total" } } }
  ]);
  const clientsData = await Order.aggregate([
    { $match: { provider: providerId } },
    { $group: { _id: "$customer", count: { $sum: 1 } } }
  ]);
  const repeatClients = clientsData.filter(c => c.count > 1).length;

  const stats = {
    averageRating: provider.meta?.avgRating || 5.0,
    completedOrders: completedCount,
    totalEarnings: completedEarnings[0]?.total || 0,
    repeatClients,
  };

  const galleryImages = provider.portfolio?.length
    ? provider.portfolio
    : provider.documents.map((doc) => doc.url);

  const profile = {
    full_name: provider.user?.fullName || "",
    email: provider.user?.email || "",
    phone: provider.contactPhone || provider.user?.number || "",
    bio: provider.professionalDescription || provider.user?.bio || "",
    location: provider.user?.location?.address || provider.user?.location?.city || "San Francisco, CA",
    hourly_rate: provider.pricing?.serviceRate || 0,
    service_price: provider.pricing?.serviceRate || 0,
    service_name: provider.selectedSkill?.name || provider.businessName || "Web Development",
    service_description: provider.professionalDescription || "",
    years_experience: provider.yearsExperience || 0,
    avatar_url: provider.user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    website: provider.website || "",
    availability: provider.availability || "Mon–Fri, 9am–6pm PST",
    certifications: provider.certifications?.length
      ? provider.certifications
      : ["AWS Certified Developer", "Google Cloud Professional"],
    languages: provider.languages?.length ? provider.languages : ["English"],
    isAvailable: provider.isAvailable ?? true,
    urgentAvailable: provider.urgentAvailable ?? true,
    stats,
    galleryImages,
  };

  const skills = [
    {
      id: provider.selectedSkill?._id?.toString() || "",
      name: provider.selectedSkill?.name || provider.businessName || "Service",
      price: provider.pricing?.serviceRate || 0,
    },
  ];

  return res.status(200).json(
    new ApiResponse(
      200,
      { profile, skills, galleryImages, stats, certifications: profile.certifications },
      "Provider profile fetched",
    ),
  );
});

export const updateProviderProfile = asyncHandler(async (req, res) => {
  const providerId = req.user?.providerProfile;
  if (!providerId) throw new ApiError(403, "Provider profile not linked");

  const {
    full_name,
    phone,
    location,
    bio,
    hourly_rate,
    service_price,
    service_name,
    service_description,
    years_experience,
    website,
    availability,
    certifications,
    languages,
    isAvailable,
    urgentAvailable,
    galleryImages,
  } = req.body;

  const provider = await Provider.findById(providerId);
  if (!provider) throw new ApiError(404, "Provider not found");

  const user = await User.findById(provider.user);
  if (!user) throw new ApiError(404, "User not found");

  if (full_name) user.fullName = full_name;
  if (phone) {
    user.number = phone;
    provider.contactPhone = phone;
  }
  if (location) {
    if (!user.location) user.location = {};
    user.location.address = location;
  }
  if (bio !== undefined) {
    user.bio = bio;
    provider.professionalDescription = bio;
  }
  if (years_experience !== undefined) {
    provider.yearsExperience = Number(years_experience);
  }

  const rate = service_price !== undefined ? service_price : hourly_rate;
  if (rate !== undefined && provider.pricing) {
    provider.pricing.serviceRate = Number(rate);
  }

  if (service_name) {
    provider.businessName = service_name;
  }
  if (service_description) {
    provider.professionalDescription = service_description;
  }
  if (website !== undefined) provider.website = website;
  if (availability !== undefined) provider.availability = availability;
  if (certifications !== undefined && Array.isArray(certifications)) {
    provider.certifications = certifications;
  }
  if (languages !== undefined && Array.isArray(languages)) {
    provider.languages = languages;
  }
  if (isAvailable !== undefined) provider.isAvailable = Boolean(isAvailable);
  if (urgentAvailable !== undefined) provider.urgentAvailable = Boolean(urgentAvailable);
  if (galleryImages !== undefined && Array.isArray(galleryImages)) {
    provider.portfolio = galleryImages;
  }

  await user.save();
  await provider.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        profile: {
          full_name: user.fullName,
          phone: provider.contactPhone,
          bio: provider.professionalDescription,
          location: user.location?.address || "",
          hourly_rate: provider.pricing?.serviceRate || 0,
          service_price: provider.pricing?.serviceRate || 0,
          service_name: provider.businessName,
          service_description: provider.professionalDescription,
          years_experience: provider.yearsExperience,
          website: provider.website,
          availability: provider.availability,
          certifications: provider.certifications,
          languages: provider.languages,
          isAvailable: provider.isAvailable,
          urgentAvailable: provider.urgentAvailable,
          galleryImages: provider.portfolio,
        },
      },
      "Provider profile updated successfully"
    )
  );
});

export const uploadProviderAvatar = asyncHandler(async (req, res) => {
  const providerId = req.user?.providerProfile;
  if (!providerId) throw new ApiError(403, "Provider profile not linked");
  if (!req.file) throw new ApiError(400, "Avatar file is required");

  const result = await uploadOnCloudinary(req.file.path);
  if (!result) throw new ApiError(500, "Failed to upload avatar image");

  const user = await User.findById(req.user._id);
  user.avatar = result.secure_url || result.originalUrl || result.url;
  await user.save();

  return res.status(200).json(
    new ApiResponse(200, { avatar_url: user.avatar }, "Avatar uploaded successfully")
  );
});

export const uploadPortfolioImages = asyncHandler(async (req, res) => {
  const providerId = req.user?.providerProfile;
  if (!providerId) throw new ApiError(403, "Provider profile not linked");
  if (!req.files || req.files.length === 0) throw new ApiError(400, "No image files provided");

  const provider = await Provider.findById(providerId);
  if (!provider) throw new ApiError(404, "Provider not found");

  const uploadResults = await Promise.all(
    req.files.map((file) => uploadOnCloudinary(file.path))
  );

  const urls = uploadResults
    .filter(Boolean)
    .map((r) => r.secure_url || r.originalUrl || r.url);

  if (!provider.portfolio) provider.portfolio = [];
  provider.portfolio.push(...urls);
  await provider.save();

  return res.status(200).json(
    new ApiResponse(200, { galleryImages: provider.portfolio }, "Portfolio images uploaded successfully")
  );
});

export const deletePortfolioImage = asyncHandler(async (req, res) => {
  const providerId = req.user?.providerProfile;
  if (!providerId) throw new ApiError(403, "Provider profile not linked");

  const { imageUrl } = req.body;
  if (!imageUrl) throw new ApiError(400, "imageUrl is required");

  const provider = await Provider.findById(providerId);
  if (!provider) throw new ApiError(404, "Provider not found");

  provider.portfolio = (provider.portfolio || []).filter((url) => url !== imageUrl);
  await provider.save();

  return res.status(200).json(
    new ApiResponse(200, { galleryImages: provider.portfolio }, "Image removed from portfolio")
  );
});

export const toggleProviderAvailability = asyncHandler(async (req, res) => {
  const providerId = req.user?.providerProfile;
  if (!providerId) throw new ApiError(403, "Provider profile not linked");

  const { isAvailable, urgentAvailable } = req.body;
  const provider = await Provider.findById(providerId);
  if (!provider) throw new ApiError(404, "Provider not found");

  if (isAvailable !== undefined) provider.isAvailable = Boolean(isAvailable);
  if (urgentAvailable !== undefined) provider.urgentAvailable = Boolean(urgentAvailable);
  await provider.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      { isAvailable: provider.isAvailable, urgentAvailable: provider.urgentAvailable },
      "Availability updated successfully"
    )
  );
});

export const replyToReview = asyncHandler(async (req, res) => {
  const providerId = req.user?.providerProfile;
  if (!providerId) throw new ApiError(403, "Provider profile not linked");

  const { reviewId } = req.params;
  const { comment } = req.body;
  if (!comment || !comment.trim()) throw new ApiError(400, "Reply comment is required");

  const review = await Review.findOne({ _id: reviewId, provider: providerId });
  if (!review) throw new ApiError(404, "Review not found or not owned by you");

  review.reply = {
    comment: comment.trim(),
    repliedAt: new Date(),
  };
  await review.save();

  return res.status(200).json(
    new ApiResponse(200, review, "Reply added successfully")
  );
});

export const getProviderDashboard = asyncHandler(async (req, res) => {
  const providerId = req.user?.providerProfile;

  if (!providerId) {
    throw new ApiError(403, "Provider profile not linked to user");
  }

  const providerDoc = await Provider.findById(providerId)
    .populate("user", "fullName email avatar")
    .populate("selectedSkill", "name");

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
          { $match: { status: { $in: ["in_progress", "accepted", "ongoing"] } } },
          { $count: "count" },
        ],
        completedOrders: [
          { $match: { status: "completed" } },
          { $count: "count" },
        ],
        pendingOrders: [{ $match: { status: "pending" } }, { $count: "count" }],
        clients: [
          { $group: { _id: "$customer", count: { $sum: 1 } } }
        ]
      },
    },
  ]);

  const clientsData = statsAgg[0]?.clients || [];
  const totalClients = clientsData.length;
  const repeatClients = clientsData.filter(c => c.count > 1).length;

  const stats = {
    totalEarnings: statsAgg[0]?.totalEarnings[0]?.total || 0,
    thisMonthEarnings: statsAgg[0]?.thisMonthEarnings[0]?.total || 0,
    activeOrders: statsAgg[0]?.activeOrders[0]?.count || 0,
    completedOrders: statsAgg[0]?.completedOrders[0]?.count || 0,
    pendingOrders: statsAgg[0]?.pendingOrders[0]?.count || 0,
    averageRating: providerDoc?.meta?.avgRating || 5.0,
    responseRate: 98,
    onTimeDelivery: 96,
    totalClients,
    repeatClients,
  };

  // Fetch upcoming orders (pending requests)
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
    { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$skill", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        id: "$_id",
        customer_name: { $ifNull: ["$customer.fullName", "Customer"] },
        customer_email: "$customer.email",
        skill_name: { $ifNull: ["$skill.name", providerDoc?.selectedSkill?.name || "Service"] },
        status: 1,
        urgency: 1,
        price: "$pricing.total",
        created_at: "$createdAt",
        notes: "$description",
      },
    },
    { $sort: { urgency: 1, created_at: -1 } },
  ]);

  // Fetch currently active orders (in_progress, accepted, ongoing)
  const activeOrders = await Order.aggregate([
    {
      $match: {
        provider: providerId,
        status: { $in: ["in_progress", "accepted", "ongoing"] },
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
    { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$skill", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        id: "$_id",
        customer_name: { $ifNull: ["$customer.fullName", "Customer"] },
        customer_email: "$customer.email",
        skill_name: { $ifNull: ["$skill.name", providerDoc?.selectedSkill?.name || "Service"] },
        status: 1,
        urgency: 1,
        price: "$pricing.total",
        created_at: "$createdAt",
        notes: "$description",
        progress: { $literal: 65 }
      },
    },
    { $sort: { created_at: -1 } },
  ]);

  const providerInfo = {
    name: providerDoc?.user?.fullName || "Provider",
    businessName: providerDoc?.businessName || "Provider",
    skillName: providerDoc?.selectedSkill?.name || "Professional",
    avatar: providerDoc?.user?.avatar || null,
    rating: providerDoc?.meta?.avgRating || 5.0,
    hourlyRate: providerDoc?.pricing?.serviceRate || 0
  };

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { stats, upcomingOrders, activeOrders, providerInfo },
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
    { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$skill", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        id: "$_id",
        customer_name: { $ifNull: ["$customer.fullName", "Customer"] },
        customer_email: "$customer.email",
        customer_phone: "$contactPhone",
        skill_name: { $ifNull: ["$skill.name", "Service"] },
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

  const validStatuses = ["pending", "in_progress", "completed", "cancelled", "accepted", "ongoing", "rejected"];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, "Order not found");

  order.status = status;
  if (notes) order.description = notes;

  await order.save();

  // If completed or cancelled, sync provider metadata metrics
  if (order.provider) {
    if (status === 'completed') {
      await Provider.findByIdAndUpdate(order.provider, {
        $inc: { 'meta.completedJobs': 1 }
      });
    } else if (status === 'cancelled' || status === 'rejected') {
      await Provider.findByIdAndUpdate(order.provider, {
        $inc: { 'meta.cancelledJobs': 1 }
      });
    }
  }

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
    { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$skill", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        id: "$_id",
        customer_name: { $ifNull: ["$customer.fullName", "Customer"] },
        skill_name: { $ifNull: ["$skill.name", "Service"] },
        status: 1,
        urgency: 1,
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
  const totalEarnings = completedOrders.reduce((sum, o) => sum + (o.price || 0), 0);
  const ratings = completedOrders
    .map((o) => o.rating)
    .filter((r) => r !== undefined && r !== null);
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

  const allProviderOrders = await Order.find({ provider: providerId }).lean();
  const completedOrdersList = allProviderOrders.filter((o) => o.status === "completed");

  const normalOrdersCount = allProviderOrders.filter((o) => o.urgency !== "emergency").length;
  const urgentOrdersCount = allProviderOrders.filter((o) => o.urgency === "emergency").length;

  const totalEarnings = completedOrdersList.reduce((sum, o) => sum + (o.pricing?.total || 0), 0);
  const totalOrders = completedOrdersList.length;
  const averageOrderValue = totalOrders > 0 ? totalEarnings / totalOrders : 0;

  const thisMonthEarnings = completedOrdersList
    .filter((o) => {
      const d = new Date(o.createdAt);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, o) => sum + (o.pricing?.total || 0), 0);

  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const lastMonthEarnings = completedOrdersList
    .filter((o) => {
      const d = new Date(o.createdAt);
      return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
    })
    .reduce((sum, o) => sum + (o.pricing?.total || 0), 0);

  // Month-by-month aggregation (last 6 months)
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyDataMap = new Map();

  // Seed last 6 months
  for (let i = 5; i >= 0; i--) {
    const d = new Date(currentYear, currentMonth - i, 1);
    const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    monthlyDataMap.set(key, { month: key, earnings: 0, orders: 0 });
  }

  completedOrdersList.forEach((o) => {
    const d = new Date(o.createdAt);
    const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    if (monthlyDataMap.has(key)) {
      const entry = monthlyDataMap.get(key);
      entry.earnings += (o.pricing?.total || 0);
      entry.orders += 1;
    }
  });

  const monthlyData = Array.from(monthlyDataMap.values());

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
    { $unwind: { path: "$skill", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        name: { $ifNull: ["$skill.name", "Standard Service"] },
        count: 1,
        revenue: 1,
      },
    },
    { $sort: { revenue: -1 } },
    { $limit: 10 },
  ]);

  // Generate real day-by-day weekly data for last 7 days
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeklyData = [];
  for (let i = 6; i >= 0; i--) {
    const target = new Date();
    target.setDate(now.getDate() - i);
    const dayStr = daysOfWeek[target.getDay()];
    const dayOrders = completedOrdersList.filter((o) => {
      const od = new Date(o.createdAt);
      return od.toDateString() === target.toDateString();
    });
    weeklyData.push({
      day: dayStr,
      date: target.toLocaleDateString(),
      earnings: dayOrders.reduce((sum, o) => sum + (o.pricing?.total || 0), 0),
      orders: dayOrders.length,
    });
  }

  const analytics = {
    totalEarnings,
    thisMonthEarnings,
    lastMonthEarnings,
    totalOrders,
    completedOrders: totalOrders,
    averageOrderValue: parseFloat(averageOrderValue.toFixed(2)),
    normalOrdersCount,
    urgentOrdersCount,
    monthlyData,
    weeklyData,
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
        from: "orders",
        localField: "order",
        foreignField: "_id",
        as: "orderData",
      },
    },
    { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$orderData", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        id: "$_id",
        customer_name: { $ifNull: ["$customer.fullName", "Anonymous Client"] },
        customer_avatar: "$customer.avatar",
        rating: 1,
        comment: 1,
        created_at: "$createdAt",
        helpful: { $ifNull: ["$helpful", 0] },
        reply: 1,
        order_type: { $ifNull: ["$orderData.urgency", "normal"] },
        skill_name: { $ifNull: ["$orderData.description", "Service"] },
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

export const getPublicProviderDetails = asyncHandler(async (req, res) => {
  const { providerId } = req.params;

  if (!providerId || !mongoose.Types.ObjectId.isValid(providerId)) {
    throw new ApiError(400, "Valid provider ID is required");
  }

  const provider = await Provider.findById(providerId)
    .populate("user", "fullName email avatar location")
    .populate("selectedSkill", "name");

  if (!provider) {
    throw new ApiError(404, "Provider not found");
  }

  const completedCount = await Order.countDocuments({
    provider: provider._id,
    status: "completed",
  });

  const portfolio = provider.portfolio?.length
    ? provider.portfolio
    : (provider.documents || []).map((doc) => doc.url);

  const formatted = {
    id: provider._id.toString(),
    _id: provider._id.toString(),
    userId: provider.user?._id?.toString() || provider.user?.toString() || null,
    name: provider.businessName || provider.user?.fullName || "Service Provider",
    businessName: provider.businessName,
    avatar: provider.user?.avatar || null,
    email: provider.user?.email || null,
    phone: provider.contactPhone || null,
    bio: provider.professionalDescription || "",
    yearsExperience: provider.yearsExperience || 0,
    skills: {
      skillId: provider.selectedSkill?._id || null,
      name: provider.selectedSkill?.name || "Professional",
    },
    pricing: {
      serviceRate: provider.pricing?.serviceRate || 0,
      rateType: provider.pricing?.rateType || "hourly",
    },
    price: provider.pricing?.serviceRate || 0,
    rateType: provider.pricing?.rateType || "hourly",
    hourlyRate: provider.pricing?.serviceRate || 0,
    rating: provider.meta?.avgRating || 0,
    reviewCount: provider.meta?.totalReviews || 0,
    completedJobs: completedCount || provider.meta?.completedJobs || 0,
    isVerified: provider.verification?.isVerified || false,
    isOnline: provider.isOnline,
    isAvailable: provider.isAvailable,
    urgentAvailable: provider.urgentAvailable,
    location: provider.user?.location?.address || "Service Location",
    portfolio: portfolio,
    galleryImages: portfolio,
    certifications: provider.certifications || [],
    languages: provider.languages?.length ? provider.languages : ["English"],
    availability: provider.availability || "Mon–Fri, 9am–6pm",
    website: provider.website || "",
  };

  return res.status(200).json(
    new ApiResponse(200, formatted, "Provider details fetched successfully")
  );
});
