let express = require('express')
let app = express()



module.exports = app




// let { encode, decode, verify, sign, hash } = require('./lib/tx')
// let { RpcClient } = require('tendermint')
// let db = require('./db')

// let client = RpcClient('https://komodo.forest.network:443')

// for (let i = 1; i <= 4000; i++) {
//     client.block({height: i})
//         .then((res) => {
//             let num_txs = parseInt(res.block.header.num_txs)
//             let txs = res.block.data.txs

//             for(let j = 0; j < num_txs; j++) {
//                 let transaction = txs[j]
//                 let buf = Buffer.from(transaction, 'base64')
//                 let transaction_decoded = decode(buf)
//                 let transaction_hash = hash(transaction_decoded)

//                 switch(transaction_decoded.operation) {
//                     case 'create_account':
//                         db.addTransactionAccount(transaction_hash, transaction_decoded.account, transaction_decoded.sequence, transaction_decoded.params.address, i)
//                             .then(result => console.log('OK', i))
//                             .catch(err => console.log('-----', err))
//                         break
//                     case 'payment':
//                         db.addTransactionPayment(transaction_hash, transaction_decoded.account, transaction_decoded.sequence, transaction_decoded.params.address, transaction_decoded.params.amount, i)
//                             .then(result => console.log('OK', i))
//                             .catch(err => console.log('-----', err))
//                         break
//                     // case 'post':
//                         // db.addTransactionPost(transaction_hash, transaction_decoded.account, transaction_decoded.sequence, transaction_decoded.params.content, i)
//                         //     .then(result => console.log('OK on block', i))
//                         //     .catch(err => console.log('-----', err))
//                         // console.log('POST on block', i, transaction_decoded.params.content.toString('utf8'))
//                         // break
//                     // case 'update_account':
//                         // db.addTransactionUpdate(transaction_hash, transaction_decoded.account, transaction_decoded.sequence, transaction_decoded.params.value, i)
//                         //     .then(result => console.log('OK on block', i))
//                         //     .catch(err => console.log('-----', err))
//                         // console.log('UPDATE on block', i, transaction_decoded.params.value.toString('utf8'))
//                         // break
//                     // case 'interact':
//                         // db.addTransactionInteract(transaction_hash, transaction_decoded.account, transaction_decoded.sequence, transaction_decoded.params.object, transaction_decoded.params.content, i)
//                         //     .then(result => console.log('OK on block', i))
//                         //     .catch(err => console.log('-----', err))
//                         // break
//                     default:
//                         break
//                 }
//             }
//         })
//         .catch((err) => {
            
//         })
// }

