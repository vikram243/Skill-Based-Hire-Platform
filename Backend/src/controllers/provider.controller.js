import { asyncHandler } from '../utils/async.handeller.js';
import Provider from '../models/provider.model.js';
import User from '../models/user.model.js';
import { ApiError, ApiResponse } from '../utils/api.handeller.js';
import { uploadOnCloudinary } from '../config/cloudinary.config.js';
import { logActivity } from '../utils/activity.handeller.js';

export const becomeProvider = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const exitingProvider = await Provider.findOne({ user: userId })
    if (exitingProvider) {
        throw new ApiError('400', "Provider Profile Already exists");
    }
    let uploadedDocs = [];
    if (req.files && req.files.length > 0) {
        uploadedDocs = await Promise.all(
            req.files.map(async (file) => {
                const result = await uploadOnCloudinary(file.path);
                return {
                    url: result.secure_url,
                    filename: result.original_filename,
                    mimetype: file.mimetype
                }
            })
        )
    }
    const provider = await Provider.create({
        ...req.body,
        user: userId,
        documents: uploadedDocs,
        applicationStatus: "pending"
    })

    const user = await User.findByIdAndUpdate(userId, {
        isProvider: true,
        providerProfile: provider._id,
        providerStatus: "pending"
    })

    await logActivity({
        action: "Provider Application received",
        target: provider._id,
        targetModel: "Provider",
        description: `${user.fullName} submitted a provider application`
    })

    res.status(200).json(
        new ApiResponse(200, provider, "Provider application submitted successfully")
    )
})