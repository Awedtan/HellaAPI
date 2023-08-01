import express from "express";
import { getAllRanges, getRange } from "../controllers/rangeController.mjs";

const rangeRouter = express.Router();

rangeRouter.get("", getAllRanges);
rangeRouter.get("/:id", getRange);

export default rangeRouter;
