let axios = require('axios')

axios.get('http://35.243.137.115:3000/account/GAO4J5RXQHUVVONBDQZSRTBC42E3EIK66WZA5ZSGKMFCS6UNYMZSIDBI')
    .then(function(res) {
        let result = res.data;
        console.log(result);
    })