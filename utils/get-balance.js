let axios = require('axios');

axios.get('http://35.243.137.115:3000/account/GAO4J5RXQHUVVONBDQZSRTBC42E3EIK66WZA5ZSGKMFCS6UNYMZSIDBI')
    .then(function(res) {
        console.log(getBalance(res.data));
    })

let getBalance = function(json) {
    let balance = 0;

    if(json.receive) {
        for(let key in json.receive) {
            balance += json.receive[key].amount;
        }
    }
    if(json.send) {
        for(let key in json.send) {
            balance -= json.send[key].amount;
        }
    }

    return balance
}

module.exports = getBalance;