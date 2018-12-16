let router = require('express').Router();
let bodyParser = require('body-parser');

let { RpcClient } = require('tendermint');
let client = RpcClient('https://komodo.forest.network:443');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/', function(req, res) {
    client.broadcastTxCommit({tx: '0x' + req.body.tx})
            .then(function(node_res) {
                console.log(node_res);
                res.send(node_res);
            })
            .catch(function(node_err) {

            })
});

module.exports = router;