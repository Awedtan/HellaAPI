import express from "express";
import db from "../db.mjs";

const rangeRouter = express.Router();

rangeRouter.get("", async (req, res) => {
    let collection = await db.collection("ranges");
    let result = await collection.find().toArray();

    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});

rangeRouter.get("/:id", async (req, res) => {
    let collection = await db.collection("ranges");
    let result = await collection.findOne({ keys: req.params.id });

    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});

export default rangeRouter;
