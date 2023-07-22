import express from "express";
import db from "../db.mjs";

const skinRouter = express.Router();

skinRouter.get("", async (req, res) => {
    let collection = await db.collection("skins");
    let result = await collection.find().toArray();

    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});


skinRouter.get("/:id", async (req, res) => {
    let collection = await db.collection("skins");
    let result = await collection.findOne({ keys: req.params.id });

    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});

export default skinRouter;
