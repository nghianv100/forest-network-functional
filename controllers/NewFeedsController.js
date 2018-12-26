let router = require('express').Router();
let db = require('../firebasedb');

router.get('/', function (req, res) {
    res.status(200).json({ msg: 'Missing Public Key: /newfeeds/[public-key]' });
});

router.get('/:publicKey', async function(req, res) {
    let publicKey = req.params.publicKey;
    let datasnapshot = await db.getAccountFollow(publicKey);

    let dataJson = datasnapshot.toJSON();

    let block_newest_follow = -1;
    let followList = '';
    for(let key in dataJson) {
        if(dataJson[key].block > block_newest_follow) {
            block_newest_follow = dataJson[key].block;
            followList = dataJson[key].users;
        }
    }

    let followArr = (followList === '') ? [] : followList.split(',');
    let result = {
        avatars: {

        },
        names: {

        },
        posts: []
    };

    for(let i = 0; i < followArr.length; i++) {
        let snapshot = await db.getAccountInfo(followArr[i]);
        let snapshotJson = snapshot.toJSON();

        let block_newest_name = -1;
        let name = '';
        for (let key in snapshotJson.update_name) {
            if(snapshotJson.update_name[key].block > block_newest_name) {
                block_newest_name = snapshotJson.update_name[key].block;
                name = snapshotJson.update_name[key].name;
            }
        }

        let block_newest_picture = -1;
        let avatar = '';
        for (let key in snapshotJson.update_picture) {
            if(snapshotJson.update_picture[key].block > block_newest_picture) {
                block_newest_picture = snapshotJson.update_picture[key].block;
                avatar = snapshotJson.update_picture[key].picture_base64;
            }
        }

        result.avatars[followArr[i]] = avatar;
        result.names[followArr[i]] = name;

        for(let key in snapshotJson.post) {
            let temp = snapshotJson.post[key];
            temp.hash = key;
            temp.account = followArr[i];

            result.posts.push(temp);
        }
    }

    result.posts.sort(function(a, b) {
        return b.block - a.block;
    });

    res.json(result);
});

module.exports = router;