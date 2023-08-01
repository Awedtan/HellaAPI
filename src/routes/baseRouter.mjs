import express from "express";
import { getAllBases, getBase } from "../controllers/baseController.mjs";

const baseRouter = express.Router();

baseRouter.get("", getAllBases);
baseRouter.get("/:id", getBase);

export default baseRouter;
