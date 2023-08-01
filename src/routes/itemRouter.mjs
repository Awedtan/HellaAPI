import express from "express";
import { getAllItems, getItem } from "../controllers/itemController.mjs";

const itemRouter = express.Router();

itemRouter.get("", getAllItems);
itemRouter.get("/:id", getItem);

export default itemRouter;
