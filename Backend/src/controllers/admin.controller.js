import Provider from '../models/provider.model.js';
import { asyncHandler } from '../utils/async.handeller.js';
import { ApiError,ApiResponse } from '../utils/api.handeller.js';

export const getPendingProviders = asyncHandler(async (req,res) => {
    const providers = await Provider.find({ applicationStatus:"pending" })
    .populate('user',"firstName LastName email");

    return res.status(200).json(
        new ApiResponse(200,providers,"All Pending Providers")
    )
})

export const updateProviderStatus = asyncHandler(async (req,res) => {
    const { id } = req.params;
    const { status,reason } =  req.body;

    if(!["approved","rejected","draft"].includes(status)){
        throw new ApiError(401,"Invalid Status")
    };

    const provider = await Provider.findById(id)
    .populate("user","firstName LastName email");

    if(!provider) throw new ApiError(401,"Provider Not Found")
    provider.applicationStatus = status;
    await provider.save();

    return res.status(200).json(
        new ApiResponse(200,provider,`Provider ${status} successfully`)
    )
})