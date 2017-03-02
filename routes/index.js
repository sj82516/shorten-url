var express = require('express');
var router = express.Router();
let redisDoa = require('../redisDao');

/* GET home page. */
router.get('/', function (req, res) {
    redisDoa.retrieveShortenURLRank(9).then(pageRankList => {
        "use strict";
        return res.render('index', {title: 'shorten-url', pageRankList});
    }).catch(error => {
        return res.render('error', {error});
    });
});

router.get('/admin', function (req, res) {
    // 輸入 -1 會回傳整個陣列
    redisDoa.retrieveShortenURLRank(-1).then(urlList => {
        "use strict";
        return res.render('admin', {title: 'sdshorten-url-admin', urlList});
    }).catch(error => {
        return res.render('error', {error});
    });
});

module.exports = router;
