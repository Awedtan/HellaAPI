import express from "express";
import db from "../db.mjs";

const archetypeRouter = express.Router();

archetypeRouter.get("", async (req, res) => {
    let collection = await db.collection("archetypes");
    let result = await collection.find().toArray();

    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});

archetypeRouter.get("/:id", async (req, res) => {
    let collection = await db.collection("archetypes");
    let result = await collection.findOne({ keys: req.params.id });

    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});

export default archetypeRouter;
