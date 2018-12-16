let { encode, decode, verify, sign, hash } = require('../lib/tx');

let tx = {
    version: 1,
    sequence: 4,
    memo: Buffer.alloc(0),
    operation: 'create_account',
    params: {
        address: 'GCXER67PAE2R3LQFTOARJHOTRYMI4KE4UICTZHBSUL7KEV2SJDVTPBQ4',
    }
}

sign(tx, 'SDTCH4MUYJPHRHWMGGWXFO6PZFLQX74OKIEDAHTPGCCUD3ZJT2ZGA2H7');

let data = encode(tx).toString('hex');

console.log(data);