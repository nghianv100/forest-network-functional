let app = require('express')();

let accountController = require('./controllers/AccountController');
let submitTxController = require('./controllers/SubmitTxController');

app.get('/', function(req, res) {
    res.status(200).json({msg: 'OK. Server is ready to get requests'});
});

app.use('/account', accountController);
app.use('/submit', submitTxController);

app.get('*', function(req, res) {
    res.status(404).json({msg: 'API Not found'});
})

module.exports = app;