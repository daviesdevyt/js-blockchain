
class BlockChain {    
    constructor (){
        var genesisBlock = genesisBlock()
        this.chain = {genesisBlock}
    }
    genesisBlock(){
        return Block([])
    }
    
}

class Block{
    constructor(transactions) {
        this.transactions = []
        for (tx of transactions){
            this.transactions.push(Transaction(tx))
        }
    }
    
}

class Transaction{
    constructor({sender, reciever, amt, senderPublicKey}){
        
    }
}