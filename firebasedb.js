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

let createAccountTransaction = function (tx_hash, tx_decoded, time, block) {
    let accountRef = db.ref('accounts');
    accountRef.child(tx_decoded.params.address).update({
        created_by: tx_decoded.account,
        created_at: time
    });
    accountRef.child(tx_decoded.account)
        .child('create')
        .child(tx_hash)
        .update({
            address: tx_decoded.params.address,
            time: time,
            block: block
        }, function () {
            console.log('SUCC_TX_CREATE_ACC', block);
        });
}

let paymentTransaction = function (tx_hash, tx_decoded, time, block) {
    let accountRef = db.ref('accounts');
    accountRef.child(tx_decoded.account)
        .child('send')
        .child(tx_hash)
        .update({
            to: tx_decoded.params.address,
            amount: tx_decoded.params.amount,
            time: time,
            block: block
        });
    accountRef.child(tx_decoded.params.address)
        .child('receive')
        .child(tx_hash)
        .update({
            from: tx_decoded.account,
            amount: tx_decoded.params.amount,
            time: time,
            block: block
        }, function () {
            console.log('SUCC_TX_PAYMENT', block);
        });
}

let postTransaction = function (tx_hash, tx_decoded, content, time, block) {
    let accountRef = db.ref('accounts');
    accountRef.child(tx_decoded.account)
        .child('post')
        .child(tx_hash)
        .update({
            content: content.text,
            time: time,
            block: block
        }, function () {
            console.log('SUCC_TX_POST', block);
        });
}

let updateNameTransaction = function (tx_hash, tx_decoded, name, time, block) {
    let accountRef = db.ref('accounts');
    accountRef.child(tx_decoded.account)
        .child('update_name')
        .child(tx_hash)
        .update({
            name: name,
            time: time,
            block: block
        }, function () {
            console.log('SUCC_TX_UPDATE_NAME', block);
        });
}

let updatePictureTransaction = function (tx_hash, tx_decoded, picture_base64, time, block) {
    let accountRef = db.ref('accounts');
    accountRef.child(tx_decoded.account)
        .child('update_picture')
        .child(tx_hash)
        .update({
            picture_base64: picture_base64,
            time: time,
            block: block
        }, function () {
            console.log('SUCC_TX_UPDATE_PICTURE', block);
        })
}

let updateFollowTransaction = async function (tx_hash, tx_decoded, arr, time, block) {
    let accountRef = db.ref('accounts');

    accountRef.child(tx_decoded.account)
        .child('follow')
        .child(tx_hash)
        .update({
            users: arr.join(),
            time: time,
            block: block
        }, function () {
            console.log('SUCC_TX_FOLLOW', block);
        });
}

let updateOtherTransaction = function(tx_hash, tx_decoded, block) {
    let accountRef = db.ref('accounts');
    accountRef.child(tx_decoded.account)
        .child('others')
        .child(tx_hash)
        .update({
            block: block
        }, function() {
            console.log('SUCC_TX_UNKNOWN', block)
        });
}

let updateInteractTransaction = function (tx_hash, tx_decoded, time, block) {
    let accountRef = db.ref('accounts');
    accountRef.child(tx_decoded.account)
        .child('interact')
        .child(tx_hash)
        .update({
            block: block,
            time: time
        }, function() {
            console.log('SUCC_TX_INTERACT', block);
        });
}

let getAccountInfo = function (publicKey) {
    let accountRef = db.ref('accounts');
    return accountRef.child(publicKey).once('value');
}

let getAccountFollow = function(publicKey) {
    let accountRef = db.ref('accounts');
    return accountRef.child(publicKey).child('follow').once('value');
}

let getAccountFollowed = function(publicKey) {
    let accountFollowedRef = db.ref('followed');
    return accountFollowedRef.child(publicKey).once('value');
}

let getAccountName = function(publicKey) {
    let accountRef = db.ref('accounts');
    return accountRef.child(publicKey).child('update_name').orderByChild('block').once('value');
}

let getAccountPosts = function(publicKey) {
    let accountRef = db.ref('accounts');
    return accountRef.child(publicKey).child('post').once('value');
}

let unfollow = function(nguoitheodoi, nguoiduoctheodoi) {
    return db.ref('followed').child(nguoiduoctheodoi).child(nguoitheodoi).remove();
}

module.exports = {
    createAccountTransaction: createAccountTransaction,
    paymentTransaction: paymentTransaction,
    getAccountInfo: getAccountInfo,
    getAccountFollowed,
    getAccountName,
    unfollow,
    postTransaction: postTransaction,
    updateNameTransaction: updateNameTransaction,
    updatePictureTransaction: updatePictureTransaction,
    updateFollowTransaction,
    updateOtherTransaction,
    updateInteractTransaction,
    getAccountFollow,
    getAccountPosts
}