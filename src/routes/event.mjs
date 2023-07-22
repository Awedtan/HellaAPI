import express from "express";
import db from "../db.mjs";

const eventRouter = express.Router();

eventRouter.get("", async (req, res) => {
    let collection = await db.collection("events");
    let result = await collection.find().toArray();

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
});

eventRouter.get("/:id", async (req, res) => {
    let collection = await db.collection("events");
    let result = await collection.findOne({ keys: req.params.id });

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
});

export default eventRouter;
