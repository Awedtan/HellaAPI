import express from "express";
import db from "../db.mjs";

const enemyRouter = express.Router();

enemyRouter.get("", async (req, res) => {
    let collection = await db.collection("enemies");
    let result = await collection.find().toArray();

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
});

enemyRouter.get("/:id", async (req, res) => {
    let collection = await db.collection("enemies");
    let result = await collection.findOne({ keys: req.params.id });

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
});

export default enemyRouter;
