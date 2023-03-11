import { MongoClient } from "mongodb"


const client = new MongoClient("mongodb://localhost:27017",
    { useNewUrlParser: true, useUnifiedTopology: true });

var db = client.db("blockchain").collection("blockchain")

export function getLastTx(){
    return db.find({}).sort({ _id: -1 }).limit(1)
}

export async function addTx(tx){
    return await db.insertOne(tx)
}

export function closeDB(){
    client.close();
}

export default {getLastTx, addTx, client, closeDB};