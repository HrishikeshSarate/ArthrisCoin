const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');  

//Transaction data (Smart Contracts)
class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;                 
        this.toAddress = toAddress;
        this.amount = amount
    }

    //signing the hash of a transaction
    calculateHash(){
 return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

signTransaction(signingKey){
    if(signingKey.getPublic('hex') !== this.fromAddress){
        throw new Error('You cannot sign transactions for other wallets!');
    }

    const hashTx = this.calculateHash();
    const sig = signingKey.sign(hashTx, 'base64'); //Signing Hash
    this.signature = sig.toDER('hex');  //Storing Signature
}

isValid(){
    if(this.fromAddress === null) return true;                       //from address is null then it is valid
    
    if(!this.signature || this.signature.length === 0){                //If there is a signature
        throw new Error('No signature in this transaction');
    }

    const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');      //If there is a signature we're gonna extract the public key
    return publicKey.verify(this.calculateHash(), this.signature);
}


}

class Block{
    constructor(timstamp,transactions,previousHash = ''){
        
        this.timstamp = timstamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;                             //for proof of work
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timstamp + JSON.stringify(this.data) + this.nonce).toString();

    }

//Proof of Work
minedBlock(difficulty) {
    while(this.hash.substring(0,difficulty) !== Array(difficulty + 1).join("0")){
        this.hash = this.calculateHash();
        this.nonce++;
    }
    console.log("Block Mined : " + this.hash);
}

hasValidTransactions(){
    for(const tx of this.transactions){
        if(!tx.isValid()){
          return false;
        }
    }
    return true;
}



}








class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;                                 //difficulty/nonce of block    size of nonce increase as difficulty increased
        this.pendingTransactions = [];
        this.miningReward = 100;
    }
 createGenesisBlock() {
            return new Block(Date.parse("2022-01-01"), [],"0");
        }
getLatestBlock(){
   return this.chain[this.chain.length - 1];  //return last element
        }

//Get new Block
 minePendingTransactions(miningRewardAddress){     //if miner successfully mines a block he gets the reward for that block
    const rewardTx = new Transaction(null,miningRewardAddress, this.miningReward);
    this.pendingTransactions.push(rewardTx);
 
    let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);  //in real world bitcoin blockchain there are lots of pending transactions, so miners choose which transaction must execute. but in our case we don't need it.
     block.minedBlock(this.difficulty);

     console.log('Block Successfully Mined..!');
     this.chain.push(block);

     this.pendingTransactions = [];                                       //Reset Pending trandsactions
                                    //Reward coins get sent to the rewardAddress of miner  new Transaction(null, miningRewardAddress, this.miningReward) 

    }
  
    addTransaction(transaction){
       if(!transaction.fromAddress || !transaction.toAddress)  //transaction dose't have fromAddress or toAddtress
        {
            throw new Error('Transaction must include from and to address');
        }
        if(!transaction.isValid()) {
            throw new Error('Cannot add invalid transaction to chain');
        }

         this.pendingTransactions.push(transaction);
    }

    //*****************check balqance of wallet**************
   getBalanceOfAddress(address){
       let balance = 0;

       for(const block of this.chain){
           for(const trans of block.transactions){
               if(trans.fromAddress === address){
                   balance -= trans.amount;                       //Deducts amount
               }
               if(trans.toAddress === address){
                   balance += trans.amount;                       //Increases amount
               }
           }
       }
       return balance;
   }


// addBlock(newBlock){
//     newBlock.previousHash = this.getLatestBlock().hash;             //to get hash of previous block
//    newBlock.minedBlock(this.difficulty);                      //hash of new block
//     this.chain.push(newBlock);
// }

isChainValid(){                                                     //verrify integrity of blockchain
     for(let i = 1; i < this.chain.length; i++)
     {
         const currentBlock = this.chain[i];
         const previousBlock = this.chain[i-1];

         if(!currentBlock.hasValidTransactions()){
             return false;
         }
 
       if(currentBlock.hash !== currentBlock.calculateHash()) {
           return false;
       }

       if(currentBlock.previousHash !== previousBlock.calculateHash()) {
           return false;
       }

      }                                                                      
      return true;
    }


}

module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;