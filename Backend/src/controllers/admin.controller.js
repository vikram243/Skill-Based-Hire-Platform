import Provider from '../models/provider.model.js';
import { asyncHandler } from '../utils/async.handeller.js';
import { ApiError, ApiResponse } from '../utils/api.handeller.js';
import User from '../models/user.model.js';
import Order from '../models/order.model.js';
import { getSafeUser } from '../utils/userSafe.helper.js';

export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().sort({ createdAt: -1 });
    const safeUsers = users.map(getSafeUser)
    res.status(200).json(
        new ApiResponse(200, { users:safeUsers , count: users.length }, "All users fetched successfully")
    );
});


export const getAllProviders = asyncHandler(async (req, res) => {
    const { status } = req.query;
    const filter = status ? { applicationStatus: status } : {};
    const providers = await Provider.find(filter)
        .populate('user', "firstName lastName email");

    return res.status(200).json(
        new ApiResponse(200, providers, "All Pending Providers")
    )
})

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
        .populate("customer", "firstName lastName email")
        .populate("provider", "firstName lastName email")
        .populate("skill", "name")
        .sort({ createdAt: -1 });

    res.status(200).json(
        new ApiResponse(200, { orders, success: true, count: orders.length }, 'all orders fetched')
    )

});

export const deleteOrder = asyncHandler(async (req, res) => {
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
    ).populate("user", "firstName lastName email");

    if (!provider) throw new ApiError(404, "Provider Not Found")

    return res.status(200).json(
        new ApiResponse(200, provider, `Provider ${status} successfully`)
    )
})