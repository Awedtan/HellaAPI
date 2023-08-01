import express from "express";
import { getAllSkins, getSkins } from "../controllers/skinController.mjs";

const skinRouter = express.Router();

skinRouter.get("", getAllSkins);
skinRouter.get("/:id", getSkins);

export default skinRouter;
