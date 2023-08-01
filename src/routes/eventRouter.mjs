import express from "express";
import { getAllEvents, getEvent } from "../controllers/eventController.mjs";

const eventRouter = express.Router();

eventRouter.get("", getAllEvents);
eventRouter.get("/:id", getEvent);

export default eventRouter;
