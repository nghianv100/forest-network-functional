let { RpcClient } = require('tendermint');
let vstruct = require('varstruct');
let axios = require('axios');
let db = require('./firebasedb');
let { encode, decode, verify, sign, hash } = require('./lib/tx');

let client = RpcClient('https://dragonfly.forest.network:443');
let client2 = RpcClient('wss://dragonfly.forest.network:443');

const PlainTextContent = vstruct([
    { name: 'type', type: vstruct.UInt8 },
    { name: 'text', type: vstruct.VarString(vstruct.UInt16BE) },
]);

const Followings = vstruct([
    { name: 'addresses', type: vstruct.VarArray(vstruct.UInt16BE, vstruct.Buffer(35)) },
]);

client2.subscribe({query: "tm.event='Tx'"}, (event) => {
    console.log(event);
});

client.block().then(lastestBlock => {
    let height = lastestBlock.block_meta.header.height;

    for (let i = 11200; i <= height; i++) {
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

                    axios.get('https://dragonfly.forest.network/tx?hash=0x' + tx_hash)
                        .then(function (res_tx) {
                            if (res_tx === null || Object.keys(res_tx).length === 0) {
                                console.log('ERROR_NULL_TX');
                            } else if (res_tx.error) {
                                console.log('TX_ERROR', tx_hash);
                            } else if (res_tx.data.result.tx_result.code) {
                                console.log('TX_ERROR', tx_hash);
                            } else {
                                switch (tx_decoded.operation) {
                                    case 'create_account':
                                        try {
                                            db.createAccountTransaction(tx_hash, tx_decoded, time, i);
                                        } catch (err) {
                                            console.log('ERROR_CREATE_ACC_TX', i, tx_hash, err);
                                        }
                                        break;
                                    case 'payment':
                                        try {
                                            db.paymentTransaction(tx_hash, tx_decoded, time, i);
                                        } catch (err) {
                                            console.log('ERROR_PAYMENT_TX', i, tx_hash, err);
                                        }
                                        break;
                                    case 'post':
                                        try {
                                            let txtContent;
                                            try {
                                                txtContent = PlainTextContent.decode(tx_decoded.params.content);
                                            } catch (err_decode) {
                                                console.log('ERROR_POST_DECODE_TX', i, tx_hash, err_decode);
                                                txtContent = {
                                                    type: 1,
                                                    text: `<<ERROR_POST_FORMAT, Tx:${tx_hash}>>`
                                                }
                                            }
                                            db.postTransaction(tx_hash, tx_decoded, txtContent, time, i);
                                        } catch (err) {
                                            console.log('ERROR_POST_TX', i, tx_hash, err);
                                        }
                                        break;
                                    case 'update_account':
                                        try {
                                            if (tx_decoded.params.key === 'name') {
                                                db.updateNameTransaction(tx_hash, tx_decoded, tx_decoded.params.value.toString('utf-8'), time, i);
                                            } else if (tx_decoded.params.key === 'picture') {
                                                db.updatePictureTransaction(tx_hash, tx_decoded, tx_decoded.params.value.toString('base64'), time, i);
                                            } else if (tx_decoded.params.key === 'followings') {
                                                // Followings
                                            }
                                        } catch (err) {
                                            console.log('ERROR_UPDATE_ACCOUNT_TX', i, tx_hash, err);
                                        }
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
                console.log('FETCH_BLOCK_ERR', i, err.message);
            })
    }
})

