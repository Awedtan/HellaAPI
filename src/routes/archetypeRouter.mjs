import express from "express";
import { getAllArchetypes, getArchetype } from "../controllers/archetypeController.mjs";

const archetypeRouter = express.Router();

archetypeRouter.get("", getAllArchetypes);
archetypeRouter.get("/:id", getArchetype);

export default archetypeRouter;
