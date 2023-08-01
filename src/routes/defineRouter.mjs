import express from "express";
import { getAllDefinitions, getDefinition } from "../controllers/defineController.mjs";

const defineRouter = express.Router();

defineRouter.get("", getAllDefinitions);
defineRouter.get("/:id", getDefinition);

export default defineRouter;
