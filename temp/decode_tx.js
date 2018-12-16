let { encode, decode, verify, sign, hash } = require('../lib/tx')

let buf = Buffer.from(process.argv[2], 'base64')

let transaction_decoded = decode(buf)

console.log(transaction_decoded)