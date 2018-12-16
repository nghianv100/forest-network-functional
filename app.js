let app = require('express')();

let AccountController = require('./controllers/AccountController');

app.get('/', function(req, res) {
    res.status(200).json({msg: 'OK. Server is ready to get requests'});
});

app.use('/account', AccountController);

app.get('*', function(req, res) {
    res.status(404).json({msg: 'API Not found'});
})

module.exports = app;