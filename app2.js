let { encode, decode, verify, sign, hash } = require('./lib/tx')
let { RpcClient } = require('tendermint')
let mysql      = require('mysql');

let connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'vannghia17',
  database : 'forest-network-db'
});

connection.connect();
let client = RpcClient('https://zebra.forest.network:443')

for (let i = 1; i <= 100; i++) {
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
                        connection.query(`INSERT INTO transactions_create_account VALUES ('${transaction_hash}', '${transaction_decoded.account}', '${transaction_decoded.params.address}')`
                                            , function(error, result, fields) {
                                                // Handle here
                                                if(error) {
                                                    console.log(error)
                                                }

                                                if ( i === 100) {
                                                    console.log("Done")
                                                    connection.end();
                                                }
                                            })
                        break;
                    case 'payment':
                        connection.query(`INSERT INTO transactions_payment VALUES ('${transaction_hash}', '${transaction_decoded.account}', '${transaction_decoded.params.address}', '${transaction_decoded.params.amount}')`
                                            , function(error, result, fields) {
                                                // Handle here
                                                if(error) {
                                                    console.log(error)
                                                }

                                                if ( i === 100) {
                                                    console.log("Done")
                                                    connection.end();
                                                }
                                            })
                        break;
                }
            }
        })
        .catch((err) => {
            console.log(err)
        })
}

// connection.end();