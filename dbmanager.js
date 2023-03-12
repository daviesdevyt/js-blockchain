import { MongoClient } from "mongodb"

export const client = new MongoClient("mongodb://localhost:27017",
    { useNewUrlParser: true, useUnifiedTopology: true });

export var db = client.db("blockchain").collection("blockchain")

export async function getLastTx(){
    var lastTxList = db.find({}).sort({ _id: -1 }).limit(1)
    const lastTX = await lastTxList.toArray()
    return lastTX[0]
}

export async function addTx(tx){
    return await db.insertOne(tx)
}

export function closeDB(){
    client.close();
}

export async function getUserTransactions(address){
    const values = db.find({
        $or: [{sender: address}, {reciever: address}]
    })
    return await values.toArray()
}

export default {getLastTx, addTx, closeDB, getUserTransactions};