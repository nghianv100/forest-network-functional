let { encode, decode, verify, sign, hash } = require('../lib/tx');

let tx = {
    version: 1,
    sequence: 8,
    memo: Buffer.alloc(0),
    operation: 'payment',
    params: {
        address: 'GBWUF2JNJ7WGBREPBIFQIJFTQM3BLX65OD5CGDJWI3AH3JBGNFHTNM4O',
        amount: 200
    }
}

sign(tx, 'SDTCH4MUYJPHRHWMGGWXFO6PZFLQX74OKIEDAHTPGCCUD3ZJT2ZGA2H7');

let data = encode(tx).toString('hex');

console.log(data);