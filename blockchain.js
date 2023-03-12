import chain from "./dbmanager.js";
import Hash from "./crypt.js";
import crypto from "crypto"


export class Blockchain {
    static async addTxToChain(tx, signature, create=false) {
        if (!this.isValidTx(tx, signature)) return console.error("Transaction is invalid")

        // Hash twice and hash finally with the ripmd-160 algorithm to get the senders address
        tx.sender = Hash.generateAddress(tx.sender)
        
        if (!create){
            if (await this.getBalance(tx.sender) < tx.amt) return console.error("Insufficient balance")
        }

        var lastTx = await chain.getLastTx();
        if (!lastTx) {
            tx.height = 0
            tx.prevHash = Hash.sha256("0")
        }
        else {
            tx.height = lastTx.height + 1
            tx.prevHash = lastTx.hash
        }

        tx.hash = Hash.sha256(tx.toString())
        console.log(await chain.addTx(tx))
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
    static async getBalance(address) {
        var transactions = await chain.getUserTransactions(address)
        var balance = 0
        for (var tx of transactions) {
            if (tx.sender == address) {
                balance -= tx.amt
                continue
            }
            if (tx.reciever == address) balance += tx.amt
        }
        return balance
    }
}

export class Transaction {
    constructor(sender, reciever, amt, time = Date.now()) {
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