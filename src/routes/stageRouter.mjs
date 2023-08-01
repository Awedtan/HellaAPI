import express from "express";
import { getAllStages, getStage } from "../controllers/stageController.mjs";

const stageRouter = express.Router();

stageRouter.get("", getAllStages);
stageRouter.get("/:id", getStage);

export default stageRouter;
