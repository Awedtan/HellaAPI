import express from "express";
import { getAllParadoxes, getParadox } from "../controllers/paradoxController.mjs";

const paradoxRouter = express.Router();

paradoxRouter.get("", getAllParadoxes);
paradoxRouter.get("/:id", getParadox);

export default paradoxRouter;
