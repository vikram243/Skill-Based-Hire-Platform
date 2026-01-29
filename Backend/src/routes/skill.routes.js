import { Router } from "express";
import { getAllSkillsName, createSkill, getSkillsByCategory, getPopularSkillsName } from "../controllers/skill.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { createSkillSchema, getSkillsByCategorySchema } from "../validators/skill.validator.js";

const router = Router();


router.route("/getAllSkills").get( 
    isAuthenticated,
    getAllSkillsName
);

router.route("/createSkill").post( 
    isAuthenticated,
    upload.single('icon'),
    validate(createSkillSchema),
    createSkill
);

router.route("/getSkills/category/:category").get(
    isAuthenticated,
    validate(getSkillsByCategorySchema),
    getSkillsByCategory
);

router.route("/getSkills/popular").get(
    isAuthenticated,
    getPopularSkillsName
);

export default router;