import express from "express";
import db from "../db.mjs";

const moduleRouter = express.Router();

moduleRouter.get("", async (req, res) => {
    let collection = await db.collection("modules");
    let result = await collection.find().toArray();

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
});

moduleRouter.get("/:id", async (req, res) => {
    let collection = await db.collection("modules");
    let result = await collection.findOne({ keys: req.params.id });

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
});

export default moduleRouter;
