import "./loadEnv.mjs";
console.log(process.env.PORT);
import cors from "cors";
import express from "express";
import "express-async-errors";
import artRouter from "./routes/art.mjs";
import baseRouter from "./routes/base.mjs";
import ccRouter from "./routes/cc.mjs";
import defineRouter from "./routes/define.mjs";
import enemyRouter from "./routes/enemy.mjs";
import eventRouter from "./routes/event.mjs";
import itemRouter from "./routes/item.mjs";
import moduleRouter from "./routes/module.mjs";
import operatorRouter from "./routes/operator.mjs";
import paradoxRouter from "./routes/paradox.mjs";
import rangeRouter from "./routes/range.mjs";
import rogueRouter from "./routes/rogue.mjs";
import skillRouter from "./routes/skill.mjs";
import stageRouter from "./routes/stage.mjs";
import toughStageRouter from "./routes/toughstage.mjs";
console.log('a')
const PORT = process.env.PORT || 5050;
const app = express();
console.log('b')
app.use(cors());
app.use(express.json());
console.log('c')
app.use("/art", artRouter);
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
app.use("/stage", stageRouter);
app.use("/toughstage", toughStageRouter);
console.log('d')
app.use((err, _req, res, next) => {
    res.status(500).send("Uh oh! An unexpected error occured.")
})
console.log('e')
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
