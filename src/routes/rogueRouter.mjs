import express from "express";
import { getAllRogues, getRogue } from "../controllers/rogueController.mjs";

const rogueRouter = express.Router();

rogueRouter.get("", getAllRogues);
rogueRouter.get("/:id", getRogue);

export default rogueRouter;
