let db = require('./firebasedb');
let app = require('./app');

let server = require('http').createServer(app);
let { RpcClient } = require('tendermint');
let axios = require('axios');
let vstruct = require('varstruct');
let base32 = require('base32.js');
let { encode, decode, verify, sign, hash } = require('./lib/tx');

const port = process.env.PORT || 3000;

const PlainTextContent = vstruct([
    { name: 'type', type: vstruct.UInt8 },
    { name: 'text', type: vstruct.VarString(vstruct.UInt16BE) },
]);

const Followings = vstruct([
    { name: 'addresses', type: vstruct.VarArray(vstruct.UInt16BE, vstruct.Buffer(35)) },
]);

let client = RpcClient('https://dragonfly.forest.network:443');
let client_ws = RpcClient('wss://dragonfly.forest.network:443');

function handleTransaction(res, i) {
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
                                    try {
                                        let valueContent = Followings.decode(tx_decoded.params.value);
                                        let userArr = valueContent.addresses;

                                        for (let i = 0; i < userArr.length; i++) {
                                            userArr[i] = base32.encode(userArr[i]);
                                        }

                                        db.updateFollowTransaction(tx_hash, tx_decoded, userArr, time, i);
                                    } catch (err_decode) {
                                        console.log('ERROR_FOLLOW_DECODE_TX', i, tx_hash, err_decode);
                                        db.updateFollowTransaction(tx_hash, tx_decoded, [], time, i);
                                    }
                                }
                            } catch (err) {
                                console.log('ERROR_UPDATE_ACCOUNT_TX', i, tx_hash, err);
                            }
                            break;
                        case 'interact':
                            try {
                                db.updateInteractTransaction(tx_hash, tx_decoded, time, i);
                            } catch (err) {
                                console.log('ERROR_INTERACT_TX', i, tx_hash, err);
                            }
                            break;
                        default:
                            break;
                    }
                }
            })
    }
}

client_ws.subscribe({ query: "tm.event='Tx'" }, (event) => {
    // { TxResult:
    //     { height: '12169',
    //       index: 0,
    //       tx:
    //        'ATAefdmXvmI4E36EE2yV/TyTsHWGuyatyDPCSIPVKhZPczIVAAAAAAAAAA8AAgArMG1C6S1P7GDEjwoLBCSzgzYV391w+iMNNkbAfaQmaU82s44AAAAAAAAACrPCF6Fv2OXfzOWeWhMSvJFLu2DsbBVs8P+86c9utsI1YUmzOC0ZVpU6zVM+635h7bDYaP/X+yR/1BJfwmziUQU=',
    //       result: { tags: [Array] } 
    //     } 
    // }
    console.log('WS_NEW_TX_AT_BLOCK', event.TxResult.height);
    let newBlockHeight = parseInt(event.TxResult.height);
    client.block({ height: newBlockHeight })
        .then(res => {
            handleTransaction(res, newBlockHeight);
        })
        .catch((err) => {
            console.log('FETCH_EVENT_ERR', newBlockHeight, err.message);
        })
})

client.block().then(async (lastestBlock) => {
    let height = parseInt(lastestBlock.block_meta.header.height);

    for (let i = 23000; i <= height; i++) {
        try {
            let res = await client.block({ height: i });
            handleTransaction(res, i);
        } catch (err) {
            console.log('FETCH_BLOCK_ERR', i, err.message);
        }
    }
})

server.listen(port, function () {
    console.log('Server is running on port', port);
})