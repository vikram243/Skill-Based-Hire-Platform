import { Router } from "express";
import { getAllSkillsName, createSkill, getSkillsByCategory, getPopularSkillsName } from "../controllers/skill.controller.js";

const router = Router();

// GET all skills
router.route("/getskills").get( getAllSkillsName );
// CREATE a new skill
router.route("/createskill").post( createSkill );
// GET skills by category
router.route("/getskills/category/:category").get( getSkillsByCategory );
// GET skills by popularity (top N)
router.route("/getskills/popular").get( getPopularSkillsName );

export default router;