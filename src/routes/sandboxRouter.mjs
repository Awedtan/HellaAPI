import express from "express";
import { getAllSandboxes, getSandbox } from "../controllers/sandboxController.mjs";

const sandboxRouter = express.Router();

sandboxRouter.get("", getAllSandboxes);
sandboxRouter.get("/:id", getSandbox);

export default sandboxRouter;
