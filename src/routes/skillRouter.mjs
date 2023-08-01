import express from "express";
import { getAllSkills, getSkill } from "../controllers/skillController.mjs";

const skillRouter = express.Router();

skillRouter.get("", getAllSkills);
skillRouter.get("/:id", getSkill);

export default skillRouter;
