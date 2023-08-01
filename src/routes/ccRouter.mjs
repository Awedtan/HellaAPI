import express from "express";
import { getAllCc, getCc } from "../controllers/ccController.mjs";

const ccRouter = express.Router();

ccRouter.get("", getAllCc);
ccRouter.get("/:id", getCc);

export default ccRouter;
