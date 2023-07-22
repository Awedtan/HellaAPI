import express from "express";
import db from "../db.mjs";

const operatorRouter = express.Router();

operatorRouter.get("", async (req, res) => {
    let collection = await db.collection("operators");
    let result = await collection.find().toArray();

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
});

operatorRouter.get("/:id", async (req, res) => {
    let collection = await db.collection("operators");
    let result = await collection.findOne({ keys: req.params.id });

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
});

export default operatorRouter;
