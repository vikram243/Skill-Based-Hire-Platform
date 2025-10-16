import { Router } from "express";
import { getAllSkillsName, createSkill, getSkillsByCategory, getPopularSkillsName } from "../controllers/skill.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();


router.route("/getAllSkills").get( 
    isAuthenticated,
    getAllSkillsName
);

router.route("/createSkill").post( 
    isAuthenticated,
    upload.single('icon'),
    createSkill
);

router.route("/getSkills/category/:category").get(
    isAuthenticated,
    getSkillsByCategory
);

router.route("/getSkills/popular").get(
    isAuthenticated,
    getPopularSkillsName
);

export default router;