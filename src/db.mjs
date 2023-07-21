import { MongoClient } from "mongodb";

const connectionString = process.env.ATLAS_URI || "";
const client = new MongoClient(connectionString);
console.log('start db')
let conn;
try {
    conn = await client.connect(err => {
        if (err) {
            console.error(err);
            return false;
        }
        console.log('connected db');
    });
} catch (e) {
    console.error(e);
}

const db = conn.db("arknights");

export default db;