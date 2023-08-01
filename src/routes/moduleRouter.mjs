import express from "express";
import { getAllModules, getModule } from "../controllers/moduleController.mjs";

const moduleRouter = express.Router();

moduleRouter.get("", getAllModules);
moduleRouter.get("/:id", getModule);

export default moduleRouter;
