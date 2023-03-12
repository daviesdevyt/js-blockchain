import crypto from "crypto"
import { Blockchain, Transaction, done } from "./blockchain.js"
import { db } from "./dbmanager.js"
import Hash from "./crypt.js"

class Wallet {
    constructor() {
      const keypair = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
      });
  
      this.privateKey = keypair.privateKey;
      this.publicKey = keypair.publicKey;
      this.address = Hash.generateAddress(this.publicKey)
    }
  
    async sendMoney(amount, address) {
      const transaction = new Transaction(this.publicKey, address, amount);
      const signature = this.signTx(transaction)
      await Blockchain.addTxToChain(transaction, signature)
    }

    signTx(transaction){
        const sign = crypto.createSign('SHA256');
        sign.update(transaction.toString()).end();
        return sign.sign(this.privateKey); 
    }
}

var user0 = new Wallet()
var user1 = new Wallet()
var user2 = new Wallet()
var genesis = new Transaction(user0.publicKey, user1.address, 200)
await Blockchain.addTxToChain(genesis, user0.signTx(genesis), true)
await user1.sendMoney(150, user2.address)
await user2.sendMoney(1000, user1.address) /// To return insufficient funds

console.log(await Blockchain.getBalance(user1.address))

// await db.deleteMany({}) to clear the database
done()