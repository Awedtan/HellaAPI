import { MongoClient } from "mongodb";

const connectionString = process.env.ATLAS_URI || "";
const client = new MongoClient(connectionString);
console.log('db')

let db;
try {
    db = (await client.connect()).db("arknights");
} catch (e) {
    console.error(e);
}

export default db;