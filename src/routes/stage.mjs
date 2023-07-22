import express from "express";
import db from "../db.mjs";

const stageRouter = express.Router();

stageRouter.get("", async (req, res) => {
    let collection = await db.collection("stages");
    let result = await collection.find().toArray();

    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});

stageRouter.get("/:id", async (req, res) => {
    let collection = await db.collection("stages");
    let result = await collection.findOne({ keys: req.params.id });

    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});

export default stageRouter;
