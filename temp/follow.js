let { encode, decode, verify, sign, hash } = require('../lib/tx');
const vstruct = require('varstruct');
let base32 = require('base32.js');

let { RpcClient } = require('tendermint');
let client = RpcClient('https://komodo.forest.network:443');

let tx = {
    version: 1,
    sequence: 44,
    memo: Buffer.alloc(0),
    operation: 'update_account',
    params: {
        key: 'followings',
    }
}

const Followings = vstruct([
        { name: 'addresses', type: vstruct.VarArray(vstruct.UInt16BE, vstruct.Buffer(35)) },
    ]);

    Followings.encode({
        addresses: [base32.decode('GDND6ZDDY5TGEJDDGWY7LUAXS2C6U37IJMQXMV74HNPWWJH7EFJAFNYZ'), base32.decode('GAO4J5RXQHUVVONBDQZSRTBC42E3EIK66WZA5ZSGKMFCS6UNYMZSIDBI')]
});

tx.params.value = users;

sign(tx, 'SDTCH4MUYJPHRHWMGGWXFO6PZFLQX74OKIEDAHTPGCCUD3ZJT2ZGA2H7');

let data = encode(tx).toString('hex');
