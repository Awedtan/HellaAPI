import "./utils/loadEnv.mjs";

import cors from "cors";
import express from "express";
import "express-async-errors";

import archetypeRouter from "./routes/archetypeRouter.mjs";
import baseRouter from "./routes/baseRouter.mjs";
import ccRouter from "./routes/ccRouter.mjs";
import defineRouter from "./routes/defineRouter.mjs";
import enemyRouter from "./routes/enemyRouter.mjs";
import eventRouter from "./routes/eventRouter.mjs";
import itemRouter from "./routes/itemRouter.mjs";
import moduleRouter from "./routes/moduleRouter.mjs";
import operatorRouter from "./routes/operatorRouter.mjs";
import paradoxRouter from "./routes/paradoxRouter.mjs";
import rangeRouter from "./routes/rangeRouter.mjs";
import rogueRouter from "./routes/rogueRouter.mjs";
import skillRouter from "./routes/skillRouter.mjs";
import skinRouter from "./routes/skinRouter.mjs";
import stageRouter from "./routes/stageRouter.mjs";
import toughStageRouter from "./routes/toughStageRouter.mjs";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/archetype", archetypeRouter);
app.use("/base", baseRouter);
app.use("/cc", ccRouter);
app.use("/define", defineRouter);
app.use("/enemy", enemyRouter);
app.use("/event", eventRouter);
app.use("/item", itemRouter);
app.use("/module", moduleRouter);
app.use("/operator", operatorRouter);
app.use("/paradox", paradoxRouter);
app.use("/range", rangeRouter);
app.use("/rogue", rogueRouter);
app.use("/skill", skillRouter);
app.use("/skin", skinRouter);
app.use("/stage", stageRouter);
app.use("/toughstage", toughStageRouter);

app.use((err, _req, res, next) => {
    res.status(500).send("Uh oh! An unexpected error occured.");
    console.log(err);
})

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
