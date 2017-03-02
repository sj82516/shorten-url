const express = require('express');
let router = express.Router();
let redisDAO = require('../redisDao');

router.route('/shorten-url/:shorten_id')
    .get(function (req, res) {
        let shortenId = req.params.shorten_id;
        redisDAO.retrieveShortenURL(shortenId).then(ans => {
            "use strict";
            if (ans == -1) {
                return res.json({error: 'URLNotFound'});
            }
            //頁面直接跳轉
            return res.redirect(ans);
        }).catch(error => {
            "use strict";
            console.error(error);
            return res.json({error});
        });
    })
    .delete(function (req, res) {
        let shortenId = req.params.shorten_id;
        redisDAO.deleteShortenURL(shortenId).then(ans => {
            "use strict";
            if (ans == -1) {
                return res.json({error: 'URLNotFound'});
            }
            return res.json({data: ans});
        }).catch(error => {
            "use strict";
            console.error(error);
            return res.json({error});
        });
    });

router.route('/shorten-url')
    .post(function (req, res) {
        let url = req.body.url;
        if(!url){
            return res.json({error: 'LackOfParam'})
        }
        redisDAO.createShortenURL(url).then(ans => {
            "use strict";
            return res.json({data: ans});
        }).catch(error => {
            "use strict";
            console.error(error);
            return res.json({error});
        })
    })
    .put(function (req, res, next) {
        let _id = req.body._id,
            url = req.body.url;
        if(!_id || !url){
            return res.json({error: 'LackOfParam'})
        }
        redisDAO.updateShortenURL(_id, url).then(ans => {
            "use strict";
            return res.json({data: ans});
        }).catch(error => {
            "use strict";
            console.error(err);
            return res.json({error});
        })
    });

router.get('/all-url-list', function(req, res) {
    redisDAO.retrieveShortenURLList().then(ans => {
        "use strict";
        console.log(ans);
        return res.json(ans);
    }).catch(error => {
        "use strict";
        console.error(error);
        return res.json({error});
    });
});

router.get('/page-rank/:range', function(req, res) {
    let range = req.params.range;
    redisDAO.retrieveShortenURLRank(range).then(ans => {
        "use strict";
        console.log(ans);
        return res.json(ans);
    }).catch(error => {
        "use strict";
        console.error(error);
        return res.json({error});
    });
});

module.exports = router;
