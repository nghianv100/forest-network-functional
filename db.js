let mysql = require('mysql');

let config = {
    host     : 'localhost',
    user     : 'root',
    password : 'laluto123',
    database : 'forest-network-db'
}

module.exports.addTransactionAccount = function(hash, account, address, height) {
    return new Promise(function (succ, fail) {
        let connection = mysql.createConnection(config)

        connection.connect()

        connection.query(`INSERT INTO tx_account VALUES ('${hash}', '${account}', '${address}', ${height})`
        , function(error, result, fields) {
            if (error) {
                fail(error);
            } else {
                succ(result);
            }

            connection.end()
        })
    })
}

module.exports.addTransactionPayment = function(hash, account, address, amount, height) {
    return new Promise(function (succ, fail) {
        let connection = mysql.createConnection(config)

        connection.connect()

        connection.query(`INSERT INTO tx_payment VALUES ('${hash}', '${account}', '${address}', ${amount}, ${height})`
        , function(error, result, fields) {
            if (error) {
                console.log('Error on block', height)
                fail(error);
            } else {
                succ(result);
            }

            connection.end()
        })
    })
}