let { encode, decode, verify, sign, hash } = require('../lib/tx');
let axios = require('axios');

let tx = {
    version: 1,
    sequence: 32,
    memo: Buffer.alloc(0),
    operation: 'payment',
    params: {
        address: 'GBWUF2JNJ7WGBREPBIFQIJFTQM3BLX65OD5CGDJWI3AH3JBGNFHTNM4O',
        amount: 10
    }
}

sign(tx, 'SDTCH4MUYJPHRHWMGGWXFO6PZFLQX74OKIEDAHTPGCCUD3ZJT2ZGA2H7');

let dataEncoded = encode(tx).toString('base64');

console.log(dataEncoded);

axios.post('https://komodo.forest.network/', {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "broadcast_tx_commit",
    "params": [dataEncoded]
})
    .then(res => console.log(res.data))
    .catch(err => console.log(err));
