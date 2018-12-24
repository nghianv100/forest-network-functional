let app = require('express')();

let accountController = require('./controllers/AccountController');
let nameController = require('./controllers/NameController');
let submitTxController = require('./controllers/SubmitTxController');

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
})

app.get('/', function(req, res) {
    res.status(200).json({msg: 'OK. Server is ready to get requests'});
});

app.use('/account', accountController);
app.use('/submit', submitTxController);
app.use('/name', nameController);

module.exports = app;