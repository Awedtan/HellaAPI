import express from "express";
import { getAllEnemies, getEnemy } from "../controllers/enemyController.mjs";

const enemyRouter = express.Router();

enemyRouter.get("", getAllEnemies);
enemyRouter.get("/:id", getEnemy);

export default enemyRouter;
