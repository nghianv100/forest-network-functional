let { RpcClient } = require('tendermint');
let db = require('./firebasedb');
let { encode, decode, verify, sign, hash } = require('./lib/tx');

let client = RpcClient('https://komodo.forest.network:443');

for (let i = 1; i <= 500; i++) {
    client.block({ height: i })
        .then((res) => {
            let num_txs = parseInt(res.block.header.num_txs);
            let txs = res.block.data.txs;

            for (let j = 0; j < num_txs; j++) {
                let tx = txs[j];
                let buf = Buffer.from(tx, 'base64');
                let tx_decoded = decode(buf);
                let tx_hash = hash(tx_decoded)

                switch (tx_decoded.operation) {
                    case 'create_account':
                        db.createAccountTransaction(tx_hash, tx_decoded, i);
                        break;
                    case 'payment':
                        db.paymentTransaction(tx_hash, tx_decoded, i);
                        break;
                    default:
                        break;
                }
            }
        })
        .catch((err) => {

        })
}