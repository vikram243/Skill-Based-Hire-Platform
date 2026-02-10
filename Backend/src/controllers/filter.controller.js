import Provider from "../models/provider.model.js";
import { asyncHandler } from "../utils/async.handeller.js"
import { ApiResponse } from "../utils/api.handeller.js"

export const filterProviders = asyncHandler(async (req, res) => {
    const {
        skill,
        q,
        priceRange,
        minRate,
        maxRate,
        minExp,
        maxExp,
        rating,
        sortBy = 'relevance',
        locationFilter,
        lat,
        lng,
        radius,
        page = 1,
        limit = 10
    } = req.query;

    const pageNum = Math.max(Number(page) || 1, 1);
    const limitNum = Math.max(Number(limit) || 10, 1);
    const skip = (pageNum - 1) * limitNum;

    const filter = {};

    // Handle search: combine skill search and text search with $or
    if (q || skill) {
        const searchTerms = q || skill;
        filter.$or = [
            // Match skill name (case-insensitive)
            { "selectedSkills.name": { $regex: searchTerms, $options: "i" } },
            // Match business name (case-insensitive)
            { "businessName": { $regex: searchTerms, $options: "i" } },
            // Match professional description (case-insensitive)
        ];
    }

    // Price range from frontend: low, medium, high, or explicit min/max
    if (priceRange && priceRange !== 'all') {
        if (priceRange === 'low') {
            filter["pricing.serviceRate"] = { $lt: 50 };
        } else if (priceRange === 'medium') {
            filter["pricing.serviceRate"] = { $gte: 50, $lt: 100 };
        } else if (priceRange === 'high') {
            filter["pricing.serviceRate"] = { $gte: 100 };
        }
    } else if (minRate || maxRate) {
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

    // If latitude/longitude are provided, use aggregation with $geoNear to compute distance
    if (lat && lng) {
        const nearPoint = { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] };
        const maxDistance = radius ? Number(radius) * 1000 : undefined;

        const geoNearStage = {
            $geoNear: {
                near: nearPoint,
                distanceField: "distance",
                spherical: true,
            }
        };
        if (maxDistance) geoNearStage.$geoNear.maxDistance = maxDistance;

        // Determine sort stage
        let sortStage = {};
        if (locationFilter === 'close-to-far') sortStage = { distance: 1 };
        else if (locationFilter === 'far-to-close') sortStage = { distance: -1 };

        if (sortBy === 'price-low') sortStage = { "pricing.serviceRate": 1 };
        else if (sortBy === 'price-high') sortStage = { "pricing.serviceRate": -1 };
        else if (sortBy === 'rating') sortStage = { "meta.avgRating": -1 };
        else if (!Object.keys(sortStage).length) sortStage = { "meta.avgRating": -1 };

        const pipeline = [geoNearStage, { $match: filter }];

        if (Object.keys(sortStage).length) pipeline.push({ $sort: sortStage });

        pipeline.push({
            $facet: {
                results: [ { $skip: skip }, { $limit: limitNum } ],
                totalCount: [ { $count: "count" } ]
            }
        });

        const agg = await Provider.aggregate(pipeline);
        const results = (agg[0] && agg[0].results) || [];
        const total = (agg[0] && agg[0].totalCount && agg[0].totalCount[0] && agg[0].totalCount[0].count) || 0;

        return res.status(200).json(
            new ApiResponse(200, {
                total,
                page: pageNum,
                pages: Math.ceil(total / limitNum),
                providers: results,
            }, "filter success")
        );
    }

    // No geo filter: simple find
    let query = Provider.find(filter);

    if (sortBy === 'price-low') query = query.sort({ "pricing.serviceRate": 1 });
    else if (sortBy === 'price-high') query = query.sort({ "pricing.serviceRate": -1 });
    else if (sortBy === 'rating') query = query.sort({ "meta.avgRating": -1 });
    else query = query.sort({ "meta.avgRating": -1 });

    const total = await Provider.countDocuments(filter);
    const providers = await query.skip(skip).limit(limitNum);

    return res.status(200).json(
        new ApiResponse(200, {
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
            providers,
        }, "filter success")
    );
});