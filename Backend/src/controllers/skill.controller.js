import Skill from "../models/skill.model.js";
import { ApiError, ApiResponse } from "../utils/api.handeller.js";
import { asyncHandler } from "../utils/async.handeller.js";
import { uploadOnCloudinary } from "../config/cloudinary.config.js";

// CREATE a new skill
const createSkill = asyncHandler(async (req, res) => {
    const { name, category, description } = req.body;

    if (!name) {
        throw new ApiError(400, "Skill name is required");
    }

    const existing = await Skill.findOne({ name });
    if (existing) {
        throw new ApiError(409, "Skill already exists");
    }

    const iconLocalPath = req.file?.path;

    const icon = await uploadOnCloudinary(iconLocalPath);

    const skill = await Skill.create({ 
        name,
        category,
        description,
        icon : icon.url
    });

    return res.status(201).json(
        new ApiResponse(201, skill, "Skill created successfully"
    ));
});

// GET all skills
const getAllSkillsName = asyncHandler(async (req, res) => {
    const skills = await Skill.aggregate([
        {
            $project: {
                name: 1,
                category: 1
            }
        },
        { $sort: { name: 1 } }
    ]);

    if (!skills || skills.length === 0) {
        throw new ApiError(404, "No skills found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, skills, "Skills fetched successfully"));
});

// GET skills by category
const getSkillsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;

  if (!category) {
    throw new ApiError(400, "Category is required");
  }

  const skills = await Skill.aggregate([
    { $match: { category } },
    {
      $project: {
        name: 1,
        category: 1,
        description: 1,
      }
    },
    { $sort: { name: 1 } }
  ]);

  if (!skills || skills.length === 0) {
    throw new ApiError(404, `No skills found in category: ${category}`);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, skills, "Skills by category fetched successfully"));
});

// GET skills by popularity (top N)
const getPopularSkillsName = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 8;

    const skills = await Skill.aggregate([
        { $sort: { popularity: -1 } },
        { $limit: limit },
        {
            $project: {
                name: 1,
                icon: 1,
                description: 1
            }
        }
    ]);

    if (!skills || skills.length === 0) {
        throw new ApiError(404, "No popular skills found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, skills, "Popular skills fetched successfully"));
});

export { createSkill, getAllSkillsName, getSkillsByCategory, getPopularSkillsName };