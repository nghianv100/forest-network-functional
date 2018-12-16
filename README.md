## Mô tả API

Host: http://35.243.137.115:3000/

### /account/<public_key> (GET)

Trả về:

````
{
    created_by: (Ai tạo ra tài khoản này)
    created_at: (Thời gian tạo)

    create: {
        (Các tài khoản đã được tạo bằng tài khoản này)
        hash_1: {
            address: (Tài khoản được tạo)
            time: (Thời gian)
            block: (Bỏ qua, không quan trọng)
        },
        hash_2: {...},
        hash_3: {...}
    }
    send: {
        (Các giao dịch chuyển tiền)
        hash_1: {
            to: (Chuyển cho ai)
            amount: (Chuyển bao nhiêu)
            time: (Thời gian)
            block: (Bỏ qua, không quan trọng)
        },
        hash_2: {...}
    }
    receive: {
        (Các giao dịch nhận tiền)
        hash_1: {
            from: (Nhận từ ai)
            amount: (Nhận bao nhiêu)
            time: (Thời gian)
            block: (Bỏ qua, không quan trọng)
        }
    }
}
````

Giả sử gán nguyên cái JSON ở trên vô biến `result`. Hàm tính Balance (số dư) và Sequence là (tính ở Client ngay khi nhận được JSON):

````js
// Balance
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
````

````js
// Sequence chưa làm
````