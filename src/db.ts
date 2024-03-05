import { Db, MongoClient } from "mongodb";
const { mongoUrl } = require('../config.json');

const client = new MongoClient(mongoUrl);

let db: Db;

export default async function getDb() {
    if (!db) {
        try {
            db = (await client.connect()).db("arknights");
        } catch (e) {
            console.error(e);
        }
    }
    return db;
}