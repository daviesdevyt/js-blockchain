import chain from "./dbmanager.js";
import crypto from "crypto"


function sha256Hash(data) {
    return crypto.createHash('sha256').update(data).digest('hex')
}

export class Blockchain {
    static async addTxToChain(tx, signature) {
        if (!this.isValidTx(tx, signature)) return console.error("Transaction is invalid")
                
        var lastTx = await chain.getLastTx().toArray();
        if (!lastTx) {
            tx.height = 0
            tx.prevHash = sha256Hash("0")
        }
        else {
            tx.height = lastTx.height + 1
            tx.prevHash = lastTx.hash
        }
        tx.hash = sha256Hash(tx.toString())
    }

    static isValidTx(tx, signature) {
        try {
            const verify = crypto.createVerify('SHA256').update(tx.toString());
            const isValid = verify.verify(tx.sender, signature);
            return isValid;
        }
        catch {
            return false
        }
    }

}

export class Transaction {
    constructor(sender, reciever, amt, time=Date.now()) {
        this.sender = sender
        this.reciever = reciever
        this.amt = amt
        this.time = time
    }
    toString() {
        return JSON.stringify(this)
    }
}

// Debug purposes
export var done = () => chain.closeDB()