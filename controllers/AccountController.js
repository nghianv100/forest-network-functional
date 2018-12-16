let router = require('express').Router();
let db = require('../firebasedb');

router.get('/', function(req, res) {
    res.status(200).json({msg: 'Missing Public Key: /account/[public-key]'});
});

router.get('/:publicKey', function(req, res) {
    db.getAccountInfo(req.params.publicKey)
        .then(function(datasnapshot) {
            res.json(datasnapshot);
        });
});

module.exports = router;