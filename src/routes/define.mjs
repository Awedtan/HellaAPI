import express from "express";
import db from "../db.mjs";
import getProjection from "../getProjection.mjs";

const defineRouter = express.Router();

defineRouter.get("", async (req, res) => {
    let collection = await db.collection("definitions");
    let result = await collection.find().project(getProjection(req)).toArray();

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
});

defineRouter.get("/:id", async (req, res) => {
    let collection = await db.collection("definitions");
    let result = await collection.findOne({ keys: req.params.id }, { projection: getProjection(req) });

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
});

export default defineRouter;
