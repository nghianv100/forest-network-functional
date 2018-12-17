let { encode, decode, verify, sign, hash } = require('../lib/tx');
const vstruct = require('varstruct');

let buf = Buffer.from(process.argv[2], 'base64')

let transaction_decoded = decode(buf);

const PlainTextContent = vstruct([
    { name: 'type', type: vstruct.UInt8 },
    { name: 'text', type: vstruct.VarString(vstruct.UInt16BE) },
]);

let post_data = PlainTextContent.decode(transaction_decoded.params.content);

console.log(post_data)