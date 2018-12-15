let app = require('./app');
let port = process.env.PORT || 3000;

let server = app.listen(port, function() {
    console.log('Server is listening on port', port);
})