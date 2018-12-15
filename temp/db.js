let mysql = require('mysql');

let config = {
    host     : 'localhost',
    user     : 'root',
    password : 'vannghia17',
    database : 'forest-network-db'
}

module.exports.addTransactionAccount = function(hash, account, sequence, address, height) {
    return new Promise(function (succ, fail) {
        let connection = mysql.createConnection(config)
        connection.connect()
        connection.query(`INSERT INTO tx_account (hash, account, sequence, address, block_height)
                            VALUES ('${hash}', '${account}', ${sequence}, '${address}', ${height})`
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

module.exports.addTransactionPayment = function(hash, account, sequence, address, amount, height) {
    return new Promise(function (succ, fail) {
        let connection = mysql.createConnection(config)

        connection.connect()

        connection.query(`INSERT INTO tx_payment (hash, account, sequence, address, amount, block_height)
                            VALUES ('${hash}', '${account}', ${sequence}, '${address}', ${amount}, ${height})`
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

module.exports.addTransactionPost = function(hash, account, sequence, content, height) {
    return new Promise(function (succ, fail) {
        let connection = mysql.createConnection(config)

        connection.connect()

        connection.query(`INSERT INTO tx_post (hash, account, sequence, content, block_height)
                            VALUES ('${hash}', '${account}', ${sequence}, ${content}, ${height})`
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

module.exports.addTransactionUpdate = function(hash, account, sequence, value, height) {
    return new Promise(function (succ, fail) {
        let connection = mysql.createConnection(config)

        connection.connect()

        connection.query(`INSERT INTO tx_update (hash, account, sequence, value, block_height)
                            VALUES ('${hash}', '${account}', ${sequence}, '${value}', ${height})`
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

module.exports.addTransactionInteract = function(hash, account, sequence, object, content, height) {
    return new Promise(function (succ, fail) {
        let connection = mysql.createConnection(config)

        connection.connect()

        connection.query(`INSERT INTO tx_interact (hash, account, sequence, object, content, block_height)
                            VALUES ('${hash}', '${account}', ${sequence}, '${object}', '${content}', ${height})`
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