import { Router } from "express";
import { getAllSkillsName, createSkill, getSkillsByCategory, getPopularSkillsName } from "../controllers/skill.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

// GET all skills
router.route("/getAllSkills").get( 
    isAuthenticated,
    getAllSkillsName
);
// CREATE a new skill
router.route("/createSkill").post( 
    isAuthenticated,
    upload.single('icon'),
    createSkill
);
// GET skills by category
router.route("/getSkills/category/:category").get(
    isAuthenticated,
    getSkillsByCategory
);
// GET skills by popularity (top N)
router.route("/getSkills/popular").get(
    isAuthenticated,
    getPopularSkillsName
);

export default router;