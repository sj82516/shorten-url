let redis = require('ioredis'),
    shortId = require('shortid'),
    client = new redis();

client.on("error", function (err) {
    console.log("Error " + err);
});

/*
 * Hash Table: shorten_url ： 儲放 _id -> url
 * Sorted Set: page_rank : 儲放 _id -> INT(page view)
 *
 * 調動記得用promise
 * ex. createShortenURL.then(ans => {
 * })
 */

//創建短連結
//成功返回uuid產生的亂數
//錯誤：重複返回-1
//redis 儲存格式 _id:url
exports.createShortenURL = function(url) {
    "use strict";
    let _id = shortId.generate();

    //避免碰撞，重新檢查
    return client.hexists('shorten_url',_id).then((ans) => {
        if(ans == 0) {
            return client.hset('shorten_url', _id, url);
        }
        //因為產生碰撞，遞迴
        callee();
    }).then(ans =>{
        // page_rank初始化
        return client.zadd('page_rank', 0, _id);
    }).then(ans =>{
        return _id;
    }).catch(err => {
        console.log('createShortenURL', err);
        throw err;
    });
};

// 回傳id對應的URL
// 不存在回傳 -1
exports.retrieveShortenURL = function(_id){
    "use strict";
    //同樣先檢查是否存在
    return client.hexists('shorten_url', _id).then(ans => {
        if(ans != 0){
            // 每次查詢都加一
            return client.zincrby('page_rank', 1, _id);
        }
        throw Error('IDNotExist');
    }).then(ans => {
        return client.hget('shorten_url',_id);
    }).then(ans => {
        return ans;
    }).catch(err => {
        console.log('retrieveShortenURL', err);
        throw err;
    })
};

//更新id對應的URL
//成功回傳1
//失敗回傳-1
exports.updateShortenURL = function(_id, url){
    "use strict";
    return client.hexists('shorten_url',_id).then(ans => {
        console.log(ans);
        if(ans){
            return client.hget('shorten_url',_id);
        }
        throw Error('IDNotExist');
    }).then(ans => {
        return client.hset('shorten_url',_id, url);
    }).then(ans => {
        return 1;
    }).catch(err => {
        console.log('retrieveShortenURL', err);
        throw err;
    })
}

//更新id對應的URL
//成功回傳1
//失敗回傳-1
exports.deleteShortenURL = function(_id){
    "use strict";
    return client.hexists('shorten_url',_id).then(ans => {
        if(ans){
            return client.hget('shorten_url',_id);
        }
        throw Error('IDNotExist');
    }).then(ans => {
        return client.hdel('shorten_url',_id);
    }).then(ans => {
        return client.zrem('page_rank', _id);
    }).catch(err => {
        console.log('retrieveShortenURL', err);
        throw err;
    })
};

// 回傳TOP X瀏覽量的縮網址
exports.retrieveShortenURLRank = function(range){
    "use strict";
    let shortenURLRankList = [];
    return client.zrevrange('page_rank', 0, range, 'WITHSCORES').then(ans => {
        //zrevrange會按照score大小排序，回傳先Key後Score
        console.log(ans);
        if(ans.length > 0 ){
            for(let i=0; i< ans.length; i++){
                let shortURLRank = {
                    _id: '',
                    pageView: 0,
                    url: ''
                };
                shortURLRank._id = ans[i];
                i++;
                shortURLRank.pageView = ans[i];
                shortenURLRankList.push(shortURLRank);
            }
        }
        // 用_id再查詢對應的URL
        return Promise.all(
            shortenURLRankList.map(shortURLRank => {
                return client.hget('shorten_url', shortURLRank._id);
            })
        )
    }).then(ans => {
        ans.map((url, i) => {
            shortenURLRankList[i].url = url;
        });
        return shortenURLRankList;
    })
};