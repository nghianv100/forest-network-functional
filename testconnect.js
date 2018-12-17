let { RpcClient } = require('tendermint');
let { encode, decode, verify, sign, hash } = require('./lib/tx');

let client = RpcClient('wss://komodo.forest.network:443');

client.subscribe({query: "tm.event='Tx'"}, (event) => {
    console.log(event);
});