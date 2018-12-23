let { encode, decode, verify, sign, hash } = require('../lib/tx');
const vstruct = require('varstruct');
let base32 = require('base32.js');

const Followings = vstruct([
    { name: 'addresses', type: vstruct.VarArray(vstruct.UInt16BE, vstruct.Buffer(35)) },
]);

let buf = Buffer.from(process.argv[2], 'base64')

let transaction_decoded = decode(buf)

let value = transaction_decoded.params.value;

let value2 = Followings.decode(value);

let address1 = value2.addresses[0];

let xxx = base32.encode(address1);

console.log(xxx);