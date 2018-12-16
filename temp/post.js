let { encode, decode, verify, sign, hash } = require('../lib/tx');

let tx = {
    version: 1,
    sequence: 8,
    memo: Buffer.alloc(0),
    operation: 'post',
    params: {
        content: {
            type: 1,
            text: 'Việt Nam Vô Địch!'
        },
        keys: []
    }
}

sign(tx, 'SDTCH4MUYJPHRHWMGGWXFO6PZFLQX74OKIEDAHTPGCCUD3ZJT2ZGA2H7');

let data = encode(tx).toString('hex');

console.log(data);