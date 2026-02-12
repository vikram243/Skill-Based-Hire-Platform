import { Router } from "express";
import { getAllSkillsName, createSkill, getPopularSkillsName } from "../controllers/skill.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { createSkillSchema } from "../validators/skill.validator.js";

const router = Router();


router.route("/getAllSkills").get(
    isAuthenticated,
    getAllSkillsName
);

router.route("/createSkill").post(
    isAuthenticated,
    validate(createSkillSchema),
    createSkill
);

router.route("/getSkills/popular").get(
    isAuthenticated,
    getPopularSkillsName
);

export default router;