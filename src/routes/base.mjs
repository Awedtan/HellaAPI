import express from "express";
import db from "../db.mjs";

const baseRouter = express.Router();

baseRouter.get("", async (req, res) => {
    let collection = await db.collection("baseskills");
    let result = await collection.find().toArray();

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
});

baseRouter.get("/:id", async (req, res) => {
    let collection = await db.collection("baseskills");
    let result = await collection.findOne({ keys: req.params.id });

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
});

export default baseRouter;
