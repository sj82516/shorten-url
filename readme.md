### 利用Redis打造短網址網路應用
先前在TB Weekly看到[資料庫的好夥伴：Redis](http://blog.techbridge.cc/2016/06/18/redis-introduction/)，決定來實作文中提到的短網誌應用  
應用的功能就是基本的  
1. 短網址註冊/刪除與修改，使用Redis中Hash Table 存放 shortid <-> url  
2. top 10 短網址瀏覽，使用Redis中的ZSET(ordered set) 存放 shortid <-> page view  
![Imgur](http://i.imgur.com/zeUCQGb.jpg)
![Imgur](http://i.imgur.com/iCuH7NY.jpg)


[操作影片](https://vimeo.com/206407242)

心得：
1. Redis提供數個相當方便的資料型態，如SET/Hash Table/ List等等，但是稍嫌麻煩就是要查[他的資料型別與API](https://redis.io/topics/data-types-intro)，我找到一個簡中的[Redis 命令参考](http://redisdoc.com/index.html)  
也必須根據使用場景做不同的資料型態應用，可以參考我的[部落格筆記](http://logdown.com/account/posts/1493844/)。  
2. 我將NodeJS Redis Library從原本的redis改到ioredis，因為後者直接支援Promise。

https://github.com/luin/ioredis
https://mattdesl.svbtle.com/debugging-nodejs-in-chrome-devtools
