import express from "express";
import db from "../db.mjs";

const operatorRouter = express.Router();

operatorRouter.get("/:id", async (req, res) => {
    let collection = await db.collection("operators");
    let result = await collection.findOne({ keys: req.params.id });

    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});

export default operatorRouter;
