let { RpcClient } = require('tendermint');

let client = RpcClient('https://dragonfly.forest.network:443');

client.block().then(lastest => {
    console.log(lastest.block_meta.header.height);
})
