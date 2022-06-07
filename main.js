const {Blockchain, Transaction} = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');  

const myKey = ec.keyFromPrivate('3fba6b53e4276ed301d8f6a30e55a558e77ff0ef06bf2d10a35cd5f094731035');
const myWalletAddress = myKey.getPublic('hex');

    let arthriscoin = new Blockchain();
    
    const tx1 = new Transaction(myWalletAddress,'public key goes here', 10);
    tx1.signTransaction(myKey);
    arthriscoin.addTransaction(tx1);

    // arthriscoin.createTransaction(new Transaction('address1', 'address2',100));
    // arthriscoin.createTransaction(new Transaction('address2', 'address1',50));

console.log('\n Starting the miner...');
arthriscoin.minePendingTransactions(myWalletAddress);

console.log("\n Balance of Hrishi is",arthriscoin.getBalanceOfAddress(myWalletAddress));

console.log('Is chain Valid ?', arthriscoin.isChainValid());

// console.log('\n Starting the miner again...');
// arthriscoin.minePendingTransactions('Hrishis - address');
// console.log("\n Balance of Hrishi is",arthriscoin.getBalanceOfAddress('Hrishis - address'));  //Your Balance will increase when second block is mined, till then your transaction will be pending

// console.log('\n Starting the miner again 3...');
// arthriscoin.minePendingTransactions('Hrishis - address');
// console.log("\n Balance of Hrishi is",arthriscoin.getBalanceOfAddress('Hrishis - address'));


//     console.log("Mining Block 1.......");          
//     arthriscoin.addBlock(new Block(1, "10/05/2022", {amount : 4}));

//     console.log("Mining Block 2......."); 
//     arthriscoin.addBlock(new Block(2, "12/05/2022", {amount : 50}));

//     console.log("Mining Block 3......."); 
//     arthriscoin.addBlock(new Block(3, "12/05/2022", {amount : 50}));

//     //console.log("Is blockchain valid ?" + arthriscoin.isChainValid());


// //Hacking /Tampering block will return blockchain validity false
// //Even if you add new hash and try to tamper it will show false , as the hash of other blocks changes.
// //    arthriscoin.chain[1].data = { amount: 100};
// //    console.log("Is blockchain valid ?" + arthriscoin.isChainValid());


     console.log(JSON.stringify(arthriscoin, null,  4));
