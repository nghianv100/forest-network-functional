let app = require('express')();

let accountController = require('./controllers/AccountController');
let nameController = require('./controllers/NameController');
let unfollowController = require('./controllers/UnfollowController');

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    next();
})

app.get('/', function(req, res) {
    res.status(200).json({msg: 'OK. Server is ready to get requests'});
});

app.use('/account', accountController);
app.use('/unfollow', unfollowController);
app.use('/name', nameController);

module.exports = app;