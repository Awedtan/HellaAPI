import express from "express";
import { getAllToughStages, getToughStage } from "../controllers/toughStageController.mjs";

const toughStageRouter = express.Router();

toughStageRouter.get("", getAllToughStages);
toughStageRouter.get("/:id", getToughStage);

export default toughStageRouter;
