let { encode, decode, verify, sign, hash } = require('../lib/tx');
const vstruct = require('varstruct');
var fs = require('fs');

let { RpcClient } = require('tendermint');
let client = RpcClient('https://komodo.forest.network:443');

let tx = {
    version: 1,
    sequence: 31,
    memo: Buffer.alloc(0),
    operation: 'update_account',
    params: {
        key: 'picture',
    }
}

fs.readFile(__dirname + '/unnamed.jpg', (err, data) => {
    tx.params.value = data;
    sign(tx, 'SDTCH4MUYJPHRHWMGGWXFO6PZFLQX74OKIEDAHTPGCCUD3ZJT2ZGA2H7');

    let data2 = encode(tx).toString('hex');

    client.broadcastTxCommit({tx: '0x' + data2})
        .then(succ => console.log(succ))
        .catch(err => console.log(err));
});
