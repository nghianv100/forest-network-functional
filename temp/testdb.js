let firebase = require('firebase')

let config = {
    apiKey: "AIzaSyD6g3cR-jZuoA4aCBSXDxAGado1m3Fl4xo",
    authDomain: "my-vm-225202.firebaseapp.com",
    databaseURL: "https://my-vm-225202.firebaseio.com",
    projectId: "my-vm-225202",
    storageBucket: "my-vm-225202.appspot.com",
    messagingSenderId: "61364532683"
}

let app = firebase.initializeApp(config)

let database = app.database()

database.ref('test').set({
    username: 'abc',
}).then(function() {
    app.delete();
})