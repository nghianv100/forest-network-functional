let app = require('express')();

let AccountController = require('./controllers/AccountController');

app.all('/', function(req, res) {
    res.status(200).send('OK');
});

app.use('/account', AccountController);

module.exports = app;