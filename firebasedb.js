let firebase = require('firebase');

let config = {
    apiKey: "AIzaSyD6g3cR-jZuoA4aCBSXDxAGado1m3Fl4xo",
    authDomain: "my-vm-225202.firebaseapp.com",
    databaseURL: "https://my-vm-225202.firebaseio.com",
    projectId: "my-vm-225202",
    storageBucket: "my-vm-225202.appspot.com",
    messagingSenderId: "61364532683"
}

let db = firebase.initializeApp(config).database();

let createAccountTransaction = function(tx_hash, tx_decoded, block) {
    let accountRef = db.ref('accounts');
    accountRef.child(tx_decoded.params.address).update({
        created_by: tx_decoded.account
    });
    accountRef.child(tx_decoded.account)
                .child('create')
                .child(tx_hash)
                .update({
                    address: tx_decoded.params.address,
                    block: block
                });
}

let paymentTransaction = function(tx_hash, tx_decoded, block) {
    let accountRef = db.ref('accounts');
    accountRef.child(tx_decoded.account)
                .child('send')
                .child(tx_hash)
                .update({
                    to: tx_decoded.params.address,
                    amount: tx_decoded.params.amount,
                    block: block
                });
    accountRef.child(tx_decoded.params.address)
                .child('receive')
                .child(tx_hash)
                .update({
                    from: tx_decoded.account,
                    amount: tx_decoded.params.amount,
                    block: block
                });
}

let getAccountInfo = function(publicKey) {
    let accountRef = db.ref('accounts');
    return accountRef.child(publicKey).once('value');
}

module.exports = {
    createAccountTransaction: createAccountTransaction,
    paymentTransaction: paymentTransaction,
    getAccountInfo: getAccountInfo
}