import express from "express";
import { getAllOperators, getOperator } from "../controllers/operatorController.mjs";

const operatorRouter = express.Router();

operatorRouter.get("", getAllOperators);
operatorRouter.get("/:id", getOperator);

export default operatorRouter;
