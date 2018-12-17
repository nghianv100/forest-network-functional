let { RpcClient } = require('tendermint');
let vstruct = require('varstruct');
let axios = require('axios');
let db = require('./firebasedb');
let { encode, decode, verify, sign, hash } = require('./lib/tx');

let client = RpcClient('https://komodo.forest.network:443');

const PlainTextContent = vstruct([
    { name: 'type', type: vstruct.UInt8 },
    { name: 'text', type: vstruct.VarString(vstruct.UInt16BE) },
]);

for (let i = 9550; i <= 9555; i++) {
    client.block({ height: i })
        .then((res) => {

            let num_txs = parseInt(res.block.header.num_txs);
            let txs = res.block.data.txs;
            let time = res.block.header.time;

            for (let j = 0; j < num_txs; j++) {

                let tx = txs[j];
                let buf = Buffer.from(tx, 'base64');
                let tx_decoded = decode(buf);
                let tx_hash = hash(tx_decoded);

                axios.get('https://zebra.forest.network/tx?hash=0x' + tx_hash)
                        .then(function(res_tx) {
                            if(res_tx.data.result.tx_result.code) {
                                // Error Transaction
                            } else {
                                switch (tx_decoded.operation) {
                                    case 'create_account':
                                        db.createAccountTransaction(tx_hash, tx_decoded, time, i);
                                        break;
                                    case 'payment':
                                        db.paymentTransaction(tx_hash, tx_decoded, time, i);
                                        break;
                                    case 'post':
                                        db.postTransaction(tx_hash, tx_decoded, PlainTextContent.decode(tx_decoded.params.content), time, i);
                                        break;
                                    case 'update_account':
                                        break;
                                    case 'interact':
                                        break;
                                    default:
                                        break;
                                }
                            }
                        })
            }
        })
        .catch((err) => {
            console.log(err);
        })
}