import Provider from "../models/provider.model.js";
import asyncHandler from "../utils/async.handeller.js"
import { ApiResponse } from "../utils/api.handeller.js"

export const filterProviders = asyncHandler(async (req, res) => {
    const {
        skill,
        minRate,
        maxRate,
        minExp,
        maxExp,
        rating,
        lat,
        lng,
        radius = 10,
        q,
        page = 1,
        limit = 10
    } = req.query;

    const filter = {};

    if (skill) {
        filter["selectedSkills.name"] = { $regex: skill, $options: "i" };
    }

    if (minRate || maxRate) {
        filter["pricing.serviceRate"] = {};
        if (minRate) filter["pricing.serviceRate"].$gte = Number(minRate);
        if (maxRate) filter["pricing.serviceRate"].$lte = Number(maxRate);
    }

    if (minExp || maxExp) {
        filter.yearsExperience = {};
        if (minExp) filter.yearsExperience.$gte = Number(minExp);
        if (maxExp) filter.yearsExperience.$lte = Number(maxExp);
    }

    if (rating) {
        filter["meta.avgRating"] = { $gte: Number(rating) };
    }

    if (q) {
        filter.$text = { $search: q };
    }

    if (lat && lng) {
        filter["serviceArea.geo"] = {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [parseFloat(lng), parseFloat(lat)],
                },
                $maxDistance: parseFloat(radius) * 1000,
            },
        };

        const skip = (page - 1) * limit;

        const providers = await Provider.find(filter)
            .skip(skip)
            .limit(Number(limit))
            .sort({ "meta.avgRating": -1 });

        const total = await Provider.countDocuments(filter);

        res.status(200).json(
            new ApiResponse(200, {
                total,
                page,
                pages: Math.ceil(total / limit),
                providers,
            }, "filter success")
        );
    }
});