let { encode, decode, verify, sign, hash } = require('../lib/tx')
let axios = require('axios')
let public = 'GAO4J5RXQHUVVONBDQZSRTBC42E3EIK66WZA5ZSGKMFCS6UNYMZSIDBI'

// axios.get(`https://komodo.forest.network/tx_search?query="account='${public}'"`)
//     .then(function(res) {
//         let data = res.data
//         let num_txs = data.result.total_count

//         for(let i = 0; i < num_txs; i++) {
//             console.log(data.result.txs[i])
//             let transaction = data.result.txs[i].tx
//             let buf = Buffer.from(transaction, 'base64')
//             let transaction_decoded = decode(buf)
//             console.log(transaction_decoded)
//         }
//     })
//     .catch(function(err) {
//         console.log(err)
//     })
let tx = "ATA8i2kusx/LGR5eAZ/7L2FhJIL8wtK3QdYou1L0XkGbXSLfAAAAAAAAAAEAAQAjMB3E9jeB6Vq5oRwzKMwi5omyIV71sg7mRlMKKXqNwzMkDCjZtz7CjPZuCL8TmGDO2fjIH8UcLxNYBM2KkRb/l89C7vMg3wITL2dmGwQXihie7bgL20r1i5yu+6PO//p89GUJ"
let buf = Buffer.from(tx, 'base64')
let transaction_decoded = decode(buf)

console.log(transaction_decoded)