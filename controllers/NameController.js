let router = require('express').Router();
let db = require('../firebasedb');

router.get('/', function (req, res) {
    res.status(200).json({ msg: 'Missing Public Key: /name/[public-key]' });
});

router.get('/:publicKey', function (req, res) {
    db.getAccountName(req.params.publicKey)
        .then(async function (datasnapshot) {
            let jsonRes = datasnapshot.toJSON();
            let result = {account: req.params.publicKey};

            if (jsonRes) {
                let block_newest_name = -1;
                for (key in jsonRes) {
                    if (jsonRes[key].block > block_newest_name) {
                        block_newest_name = jsonRes[key].block;
                        result.name = jsonRes[key].name;
                    }
                }
            }

            res.json(result);
        })
        .catch(function (err) {
            res.json({
                account: req.params.publicKey,
                name: null
            });
        });
});

module.exports = router;