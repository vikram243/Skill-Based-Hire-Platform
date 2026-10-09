import Provider from '../models/provider.model.js';
import { asyncHandler } from '../utils/async.handeller.js';
import { ApiError, ApiResponse } from '../utils/api.handeller.js';
import User from '../models/user.model.js';
import Order from '../models/order.model.js';
import Review from '../models/review.model.js';
import activityLog from '../models/activity.model.js';
import { getSafeUser } from '../utils/userSafe.helper.js';
import { logActivity } from '../utils/activity.handeller.js';
import crypto from 'crypto';
import config from '../config/config.js';
import { setSessionId, setRefreshToken } from '../config/redis.config.js';

// ── GET ADMIN STATS & OVERVIEW ──
export const getAdminStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    activeUsers,
    totalProviders,
    pendingProviders,
    approvedProviders,
    rejectedProviders,
    orderStats,
    revenueAgg,
    recentOrders,
    recentActivities
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActive: true }),
    Provider.countDocuments(),
    Provider.countDocuments({ applicationStatus: 'pending' }),
    Provider.countDocuments({ applicationStatus: 'approved' }),
    Provider.countDocuments({ applicationStatus: 'rejected' }),
    Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        }
      }
    ]),
    Order.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$pricing.total' }
        }
      }
    ]),
    Order.find()
      .populate('customer', 'fullName email')
      .populate('skill', 'name')
      .sort({ createdAt: -1 })
      .limit(6)
      .lean(),
    activityLog.find()
      .populate('performedBy', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(8)
      .lean()
  ]);

  const ordersCountMap = {};
  let totalOrdersCount = 0;
  orderStats.forEach((o) => {
    ordersCountMap[o._id] = o.count;
    totalOrdersCount += o.count;
  });

  const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

  // Monthly revenue trend (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);

  const monthlyTrendAgg = await Order.aggregate([
    {
      $match: {
        status: 'completed',
        createdAt: { $gte: sixMonthsAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        revenue: { $sum: '$pricing.total' },
        orders: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyTrends = monthlyTrendAgg.map((m) => ({
    name: `${monthNames[m._id.month - 1]} ${m._id.year}`,
    revenue: m.revenue,
    orders: m.orders
  }));

  const data = {
    overview: {
      totalUsers,
      activeUsers,
      suspendedUsers: Math.max(0, totalUsers - activeUsers),
      totalProviders,
      pendingProviders,
      approvedProviders,
      rejectedProviders,
      totalOrders: totalOrdersCount,
      pendingOrders: ordersCountMap['pending'] || 0,
      inProgressOrders: (ordersCountMap['in_progress'] || 0) + (ordersCountMap['ongoing'] || 0) + (ordersCountMap['accepted'] || 0),
      completedOrders: ordersCountMap['completed'] || 0,
      cancelledOrders: ordersCountMap['cancelled'] || 0,
      totalRevenue
    },
    monthlyTrends,
    recentOrders,
    recentActivities
  };

  return res.status(200).json(
    new ApiResponse(200, data, 'Admin dashboard stats fetched successfully')
  );
});

// ── GET ALL USERS ──
export const getAllUsers = asyncHandler(async (req, res) => {
  const { search, role, status } = req.query;

  const query = {};

  if (search) {
    const regex = new RegExp(search.trim(), 'i');
    query.$or = [{ fullName: regex }, { email: regex }, { number: regex }];
  }

  if (role) {
    if (role === 'admin') query.isAdmin = true;
    else if (role === 'provider') query.isProvider = true;
    else if (role === 'user') {
      query.isProvider = { $ne: true };
      query.isAdmin = { $ne: true };
    }
  }

  if (status) {
    if (status === 'active') query.isActive = true;
    else if (status === 'suspended') query.isActive = false;
  }

  const users = await User.find(query)
    .select('-googleId')
    .populate({
      path: 'providerProfile',
      select: 'businessName applicationStatus selectedSkill'
    })
    .sort({ createdAt: -1 })
    .lean();

  const formattedUsers = users.map((u) => ({
    _id: u._id,
    fullName: u.fullName || `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'User',
    email: u.email,
    number: u.number,
    isUser: u.isUser,
    isProvider: Boolean(u.isProvider),
    isAdmin: Boolean(u.isAdmin || u.role === 'admin'),
    isActive: u.isActive !== false,
    providerStatus: u.providerProfile?.applicationStatus || null,
    businessName: u.providerProfile?.businessName || null,
    createdAt: u.createdAt
  }));

  return res.status(200).json(
    new ApiResponse(200, { users: formattedUsers, count: formattedUsers.length }, 'All users fetched successfully')
  );
});

// ── GET ALL PROVIDERS ──
export const getAllProviders = asyncHandler(async (req, res) => {
  const { status, search } = req.query;

  const matchStage = {};
  if (status && status !== 'all') {
    matchStage.applicationStatus = status;
  }

  const pipeline = [
    { $match: matchStage },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'skills',
        localField: 'selectedSkill',
        foreignField: '_id',
        as: 'skill'
      }
    },
    { $unwind: { path: '$skill', preserveNullAndEmptyArrays: true } }
  ];

  if (search) {
    const sRegex = new RegExp(search.trim(), 'i');
    pipeline.push({
      $match: {
        $or: [
          { businessName: sRegex },
          { 'user.fullName': sRegex },
          { 'user.email': sRegex },
          { contactPhone: sRegex },
          { 'skill.name': sRegex }
        ]
      }
    });
  }

  pipeline.push(
    {
      $project: {
        _id: 1,
        businessName: 1,
        professionalDescription: 1,
        yearsExperience: 1,
        contactPhone: 1,
        pricing: 1,
        documents: 1,
        applicationStatus: 1,
        submittedAt: 1,
        createdAt: 1,
        location: 1,
        meta: 1,
        skillName: '$skill.name',
        user: {
          _id: '$user._id',
          fullName: '$user.fullName',
          email: '$user.email',
          avatar: '$user.avatar'
        }
      }
    },
    { $sort: { submittedAt: -1, createdAt: -1 } }
  );

  const providers = await Provider.aggregate(pipeline);

  return res.status(200).json(
    new ApiResponse(200, { providers, count: providers.length }, 'All providers fetched successfully')
  );
});

// ── SUSPEND / DEACTIVATE USER ──
export const suspendUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );
  if (!user) throw new ApiError(404, 'User not found');

  await logActivity({
    action: 'User Suspended',
    performedBy: req.user?._id || null,
    target: user._id,
    targetModel: 'User',
    description: `Admin suspended user ${user.fullName || user.email}`
  });

  const userSafe = getSafeUser(user);

  return res.status(200).json(
    new ApiResponse(200, userSafe, 'User suspended successfully')
  );
});

// ── ACTIVATE / REACTIVATE USER ──
export const activateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(
    id,
    { isActive: true },
    { new: true }
  );
  if (!user) throw new ApiError(404, 'User not found');

  await logActivity({
    action: 'User Activated',
    performedBy: req.user?._id || null,
    target: user._id,
    targetModel: 'User',
    description: `Admin reactivated user ${user.fullName || user.email}`
  });

  const userSafe = getSafeUser(user);

  return res.status(200).json(
    new ApiResponse(200, userSafe, 'User activated successfully')
  );
});

// ── GET ALL ORDERS ──
export const getAllOrders = asyncHandler(async (req, res) => {
  const { status, search } = req.query;
  const query = {};

  if (status && status !== 'all') {
    query.status = status;
  }

  const orders = await Order.find(query)
    .populate('customer', 'fullName email number')
    .populate({
      path: 'provider',
      populate: { path: 'user', select: 'fullName email number' }
    })
    .populate('skill', 'name')
    .sort({ createdAt: -1 })
    .lean();

  let formatted = orders.map((o) => ({
    _id: o._id,
    customer_name: o.customer?.fullName || 'Anonymous Customer',
    customer_email: o.customer?.email || '',
    customer_phone: o.contactPhone || o.customer?.number || '',
    provider_name: o.provider?.businessName || o.provider?.user?.fullName || 'Unassigned',
    provider_phone: o.provider?.contactPhone || '',
    skill_name: o.skill?.name || 'General Service',
    status: o.status,
    urgency: o.urgency,
    price: o.pricing?.total || 0,
    address: o.address?.full || '',
    notes: o.description || '',
    created_at: o.createdAt
  }));

  if (search) {
    const q = search.toLowerCase();
    formatted = formatted.filter(
      (o) =>
        o.customer_name.toLowerCase().includes(q) ||
        o.provider_name.toLowerCase().includes(q) ||
        o.skill_name.toLowerCase().includes(q) ||
        o._id.toString().includes(q)
    );
  }

  return res.status(200).json(
    new ApiResponse(200, { orders: formatted, count: formatted.length }, 'All orders fetched successfully')
  );
});

// ── DELETE / CANCEL ORDER ──
export const deleteOrders = asyncHandler(async (req, res) => {
  const orderId = req.params.orderId || req.params.id;
  if (!orderId) throw new ApiError(400, 'Order ID is required');

  const order = await Order.findByIdAndDelete(orderId);
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  await logActivity({
    action: 'Order Deleted',
    performedBy: req.user?._id || null,
    target: orderId,
    targetModel: 'Order',
    description: `Admin deleted order #${orderId}`
  });

  return res.status(200).json(
    new ApiResponse(200, null, 'Order deleted successfully')
  );
});

// ── UPDATE PROVIDER STATUS (APPROVE / REJECT) ──
export const updateProviderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const normalizedStatus = status === 'draft' ? 'pending' : status;

  if (!['approved', 'rejected', 'pending'].includes(normalizedStatus)) {
    throw new ApiError(400, 'Invalid Status. Expected approved, rejected, or pending');
  }

  const provider = await Provider.findByIdAndUpdate(
    id,
    { applicationStatus: normalizedStatus },
    { new: true }
  ).populate('user', 'fullName email');

  if (!provider) throw new ApiError(404, 'Provider not found');

  await logActivity({
    action: `Provider ${normalizedStatus}`,
    performedBy: req.user?._id || null,
    target: provider._id,
    targetModel: 'Provider',
    description: `Admin ${req.user?.fullName || 'Admin'} ${normalizedStatus} provider ${provider.businessName || provider.user?.fullName}`
  });

  // Keep user role flags in sync
  try {
    const user = await User.findById(provider.user?._id || provider.user);
    if (user) {
      if (normalizedStatus === 'approved') {
        user.isProvider = true;
      } else {
        user.isProvider = false;
        user.isProviderMode = false;
      }
      await user.save();
    }
  } catch (e) {
    // Ignore sync errors
  }

  return res.status(200).json(
    new ApiResponse(200, provider, `Provider ${normalizedStatus} successfully`)
  );
});

// ── GET ALL REVIEWS ──
export const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $lookup: {
        from: 'providers',
        localField: 'provider',
        foreignField: '_id',
        as: 'providerDoc'
      }
    },
    { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
    { $unwind: { path: '$providerDoc', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'users',
        localField: 'providerDoc.user',
        foreignField: '_id',
        as: 'providerUser'
      }
    },
    { $unwind: { path: '$providerUser', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        rating: 1,
        comment: 1,
        status: { $ifNull: ['$status', 'approved'] },
        isHidden: { $ifNull: ['$isHidden', false] },
        isFlagged: { $ifNull: ['$isFlagged', false] },
        createdAt: 1,
        user: {
          fullName: { $ifNull: ['$user.fullName', 'Anonymous User'] },
          email: '$user.email'
        },
        provider: {
          businessName: { $ifNull: ['$providerDoc.businessName', '$providerUser.fullName'] },
          fullName: { $ifNull: ['$providerUser.fullName', 'Provider'] },
          email: '$providerUser.email'
        }
      }
    },
    { $sort: { createdAt: -1 } }
  ]);

  return res.status(200).json(
    new ApiResponse(200, { reviews, count: reviews.length }, 'All reviews fetched successfully')
  );
});

// ── UPDATE REVIEW STATUS ──
export const updateReviewStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['approved', 'rejected', 'pending'].includes(status)) {
    throw new ApiError(400, 'Invalid review status');
  }

  const review = await Review.findByIdAndUpdate(id, { status }, { new: true });
  if (!review) throw new ApiError(404, 'Review not found');

  return res.status(200).json(
    new ApiResponse(200, review, `Review marked as ${status} successfully`)
  );
});

// ── TOGGLE REVIEW VISIBILITY (HIDE / SHOW) ──
export const toggleReviewVisibility = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const review = await Review.findById(id);
  if (!review) throw new ApiError(404, 'Review not found');

  review.isHidden = !review.isHidden;
  await review.save();

  return res.status(200).json(
    new ApiResponse(200, review, `Review ${review.isHidden ? 'hidden' : 'visible'} successfully`)
  );
});

// ── FLAG REVIEW ──
export const flagReview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const review = await Review.findById(id);
  if (!review) throw new ApiError(404, 'Review not found');

  review.isFlagged = !review.isFlagged;
  await review.save();

  return res.status(200).json(
    new ApiResponse(200, review, `Review ${review.isFlagged ? 'flagged' : 'unflagged'} successfully`)
  );
});

// ── GET ALL ACTIVITIES (AUDIT LOG) ──
export const getAllActivities = asyncHandler(async (req, res) => {
  const activities = await activityLog.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'performedBy',
        foreignField: '_id',
        as: 'performedBy'
      }
    },
    { $unwind: { path: '$performedBy', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        action: 1,
        description: 1,
        targetModel: 1,
        target: 1,
        createdAt: 1,
        performedBy: {
          fullName: { $ifNull: ['$performedBy.fullName', 'System'] },
          email: '$performedBy.email'
        }
      }
    },
    { $sort: { createdAt: -1 } },
    { $limit: 100 }
  ]);

  return res.status(200).json(
    new ApiResponse(200, { activities }, 'Recent activities fetched successfully')
  );
});

// ── ADMIN LOGIN (DIRECT AUTHENTICATION FOR ADMIN PORTAL) ──
export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password, adminSecret } = req.body || {};

  if (!email) {
    throw new ApiError(400, 'Admin email is required');
  }

  // Master key verification or existing admin check
  const systemAdminSecret = process.env.ADMIN_SECRET || 'SkillHubAdmin2026';
  const isSecretMatch = (adminSecret && adminSecret === systemAdminSecret) || (password && password === systemAdminSecret);

  let user = await User.findOne({ email: email.toLowerCase().trim() });

  if (isSecretMatch) {
    // If master key is provided, create or upgrade this user to admin
    if (!user) {
      user = await User.create({
        email: email.toLowerCase().trim(),
        fullName: 'System Administrator',
        firstName: 'System',
        lastName: 'Admin',
        number: '+919999999999',
        isAdmin: true,
        isActive: true
      });
    } else {
      user.isAdmin = true;
      user.isActive = true;
      await user.save();
    }
  } else {
    // Must be existing user with isAdmin = true
    if (!user) {
      throw new ApiError(401, 'Admin user not found. Invalid credentials.');
    }
    if (!user.isAdmin) {
      throw new ApiError(403, 'Access denied: User does not have administrator privileges.');
    }
  }

  const sessionId = crypto.randomUUID();
  const accessToken = user.generateAccessToken(sessionId);
  const refreshToken = user.generateRefreshToken();

  await setSessionId(user._id.toString(), sessionId);
  await setRefreshToken(user._id.toString(), refreshToken);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    domain: '.myskillhub.in',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  await logActivity({
    action: 'Admin Login',
    performedBy: user._id,
    target: user._id,
    targetModel: 'User',
    description: `Admin ${user.fullName} logged into the Admin Panel`
  });

  const userSafe = getSafeUser(user);
  userSafe.isAdmin = true;

  return res.status(200).json(
    new ApiResponse(200, { user: userSafe, accessToken }, 'Admin login successful')
  );
});

// ── PROMOTE USER TO ADMIN (HELPFUL DEV / CLI ENDPOINT) ──
export const promoteToAdmin = asyncHandler(async (req, res) => {
  const { email, secretKey } = req.body;
  const systemAdminSecret = process.env.ADMIN_SECRET || 'SkillHubAdmin2026';

  if (secretKey !== systemAdminSecret) {
    throw new ApiError(403, 'Invalid secret key');
  }

  const user = await User.findOneAndUpdate(
    { email: email.toLowerCase().trim() },
    { isAdmin: true, isActive: true },
    { new: true }
  );

  if (!user) throw new ApiError(404, 'User with this email not found');

  return res.status(200).json(
    new ApiResponse(200, { email: user.email, isAdmin: user.isAdmin }, `${user.email} promoted to admin successfully`)
  );
});