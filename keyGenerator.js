const EC = require('elliptic').ec;
const ec = new EC('secp256k1');               //Algorithm that bases bitcoin wallet you can use any algorithm you want....

const key = ec.genKeyPair();
const publicKey = key.getPublic('hex');
const privateKey = key.getPrivate('hex');

console.log();
console.log('Private Key: ', privateKey);

console.log();
console.log('Public Key: ', publicKey);

