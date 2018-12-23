let { encode, decode, verify, sign, hash } = require('../lib/tx');
const vstruct = require('varstruct');

let tx = {
    version: 1,
    sequence: 39,
    memo: Buffer.alloc(0),
    operation: 'post',
    params: {
        keys: []
    }
}

const PlainTextContent = vstruct([
    { name: 'type', type: vstruct.UInt8 },
    { name: 'text', type: vstruct.VarString(vstruct.UInt16BE) },
]);

let post_content = PlainTextContent.encode({
    type: 1,
    text: 'Nguyễn Văn Nghĩa, Test vào lúc 16:09 ngày 22-12-2018'
})

tx.params.content = post_content;

sign(tx, 'SDTCH4MUYJPHRHWMGGWXFO6PZFLQX74OKIEDAHTPGCCUD3ZJT2ZGA2H7');

let data = encode(tx).toString('hex');

console.log(data);
