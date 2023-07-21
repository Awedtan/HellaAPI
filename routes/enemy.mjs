import express from "express";
import db from "../db.mjs";

const enemyRouter = express.Router();

enemyRouter.get("/:id", async (req, res) => {
    let collection = await db.collection("enemies");
    let result = await collection.findOne({ keys: req.params.id });

    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});

export default enemyRouter;
