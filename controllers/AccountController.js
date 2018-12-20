let router = require('express').Router();
let db = require('../firebasedb');

router.get('/', function(req, res) {
    res.status(200).json({msg: 'Missing Public Key: /account/[public-key]'});
});

router.get('/:publicKey', function(req, res) {
    db.getAccountInfo(req.params.publicKey)
        .then(function(datasnapshot) {
            let jsonRes = datasnapshot.toJSON();

            let result = {};
            let sequence = 0;
            let balance = 0;
            
            let info = {};
            let tx = {};

            info.created_by = jsonRes.created_by;
            info.created_at = jsonRes.created_at;

            if(jsonRes.update_name) {
                let block_newest_name = -1;
                for(let key in jsonRes.update_name) {
                    sequence++;
                    if(jsonRes.update_name[key].block > block_newest_name) {
                        block_newest_name = jsonRes.update_name[key].block;
                        info.name = jsonRes.update_name[key].name;
                    }
                }
            } else {
                info.name = null;
            }

            if(jsonRes.update_picture) {
                let block_newest_picture = -1;
                for(let key in jsonRes.update_picture) {
                    sequence++;
                    if(jsonRes.update_picture[key].block > block_newest_picture) {
                        block_newest_picture = jsonRes.update_picture[key].block;
                        info.picture = jsonRes.update_picture[key].picture_base64;
                    }
                }
            } else {
                info.picture = null;
            }

            tx.create = jsonRes.create;
            tx.send = jsonRes.send;
            tx.receive = jsonRes.receive;
            tx.post = jsonRes.post;

            for(let key in jsonRes.create) {
                sequence++;
            }
            
            for(let key in jsonRes.send) {
                sequence++;
                balance -= jsonRes.send[key].amount;
            }

            for(let key in jsonRes.receive) {
                balance += jsonRes.receive[key].amount;
            }

            for(let key in jsonRes.post) {
                sequence++;
            }

            info.sequence = sequence;

            result.info = info;
            result.tx = tx;

            result.info.public_key = req.params.publicKey;
            result.info.energy = 100; // Test
            result.info.balance = balance;

            res.json(result);
        });
});

module.exports = router;