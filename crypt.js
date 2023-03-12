import crypto from "crypto"

class Hash{
    static hash(alg) {
        return crypto.createHash(alg)
    }
    static sha256(data) {
        return this.hash("sha256").update(data).digest('hex')
    }
    static ripemd160(data) {
        return this.hash('ripemd160').update(data).digest('hex')
    }
    static generateAddress(publicKey){
        return this.ripemd160(this.sha256(this.sha256(JSON.stringify(publicKey))))
    }
}

export default Hash