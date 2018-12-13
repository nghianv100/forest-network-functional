// Doc thong tin tai khoan
const { encode, decode } = require('./lib/transaction/v1')
let axios = require('axios')
let account = 'GAPH3WMXXZRDQE36QQJWZFP5HSJ3A5MGXMTK3SBTYJEIHVJKCZHXGMQV' // public key of account

axios.get(`https://komodo.forest.network/tx_search?query="account='${account}'"`)
        .then(function(res) {
            let data = res.data
            let count = data.result.total_count
            let transactions = data.result.txs

            for(let i = 0; i < count; i++) {
                let transaction = transactions[i].tx
                let buf = Buffer.from(transaction, 'base64')
                let transaction_decoded = decode(buf)
                
                switch(transaction_decoded.operation) {
                    case 'create_account':
                        if(account === transaction_decoded.account) {
                            console.log('Tạo tài khoản: ' + transaction_decoded.params.address)
                        } else {
                            console.log('Được tạo bởi: ' + transaction_decoded.account)
                        }
                        break;
                    case 'payment':
                        if(account === transaction_decoded.account) {
                            // Chuyển tiền cho người khác
                            console.log('Đã chuyển cho ' + transaction_decoded.params.address + ' số tiền ' 
                                                            + transaction_decoded.params.amount)
                        } else {
                            // Được người khác chuyển t
                            console.log('Nhận số tiền ' + transaction_decoded.params.amount + ' bởi ' 
                                                            + transaction_decoded.account)
                        }
                        break;
                }
            }
        })
        .catch(function(err) {
            console.log(err)
        })

// var buf = Buffer.from(tx, 'base64')
// decode(buf)