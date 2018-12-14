let { encode, decode, verify, sign, hash } = require('./lib/tx')
let { RpcClient } = require('tendermint')
let db = require('./db')

let client = RpcClient('https://zebra.forest.network:443')

for (let i = 1; i <= 2000; i++) {
    client.block({height: i})
        .then((res) => {
            let num_txs = parseInt(res.block.header.num_txs)
            let txs = res.block.data.txs

            for(let j = 0; j < num_txs; j++) {
                let transaction = txs[j]
                let buf = Buffer.from(transaction, 'base64')
                let transaction_decoded = decode(buf)
                let transaction_hash = hash(transaction_decoded)

                switch(transaction_decoded.operation) {
                    case 'create_account':
                        db.addTransactionAccount(transaction_hash, transaction_decoded.account, transaction_decoded.params.address, i)
                        break
                    case 'payment':
                        db.addTransactionPayment(transaction_hash, transaction_decoded.account, transaction_decoded.params.address, transaction_decoded.params.amount, i)
                        break
                    default:
                        break
                }
            }
        })
        .catch((err) => {
            console.log(err)
        })
}