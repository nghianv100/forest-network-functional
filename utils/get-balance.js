let getBalance = function(json) {
    let balance = 0;

    if(json.receive) {
        for(x in json.receive) {
            balance += x.amount;
        }
    }
    if(json.send) {
        for(y in json.send) {
            balance -= y.amount
        }
    }

    return balance
}

module.exports = getBalance;