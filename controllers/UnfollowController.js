let router = require('express').Router();
let bodyParser = require('body-parser');
let db = require('../firebasedb');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/', function(req, res) {
    let nguoitheodoi = req.body.nguoitheodoi;
    let nguoiduoctheodoi = req.body.nguoiduoctheodoi;

    db.unfollow(nguoitheodoi, nguoiduoctheodoi).then(function() {
        res.json({result: 'unfollow_ok'});
    }).catch(function(err) {
        res.json({result: 'unfollow_err'});
    });
});

module.exports = router;